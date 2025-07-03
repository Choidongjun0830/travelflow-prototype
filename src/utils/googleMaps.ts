// Google Maps API 로드 및 지오코딩 유틸리티

// Google Maps API 타입 정의
declare global {
  interface Window {
    google: {
      maps: {
        Geocoder: new () => {
          geocode: (
            request: { address: string },
            callback: (
              results: Array<{
                geometry: {
                  location: {
                    lat: () => number;
                    lng: () => number;
                  };
                };
              }> | null,
              status: string
            ) => void
          ) => void;
        };
        Map: new (element: HTMLElement, options: any) => any;
        Marker: new (options: any) => any;
        InfoWindow: new (options?: any) => any;
        DirectionsService: new () => any;
        DirectionsRenderer: new () => any;
        LatLng: new (lat: number, lng: number) => any;
      };
    };
  }
}

export interface LatLng {
  lat: number;
  lng: number;
}

export interface Location {
  name: string;
  lat: number;
  lng: number;
  address: string;
}

// Google Maps API 로드 상태 관리
let isGoogleMapsLoaded = false;
let isLoading = false;
const loadPromises: Promise<void>[] = [];

// Google Maps JavaScript API 로드
export const loadGoogleMapsAPI = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // 이미 로드되었다면 즉시 resolve
    if (isGoogleMapsLoaded && window.google?.maps) {
      resolve();
      return;
    }

    // 이미 로딩 중이라면 기존 프로미스에 합류
    if (isLoading) {
      loadPromises.push(new Promise(resolve => {
        const checkLoaded = () => {
          if (isGoogleMapsLoaded) {
            resolve();
          } else {
            setTimeout(checkLoaded, 100);
          }
        };
        checkLoaded();
      }));
      return;
    }

    // API 키 확인
    const apiKey = localStorage.getItem('google_maps_api_key');
    if (!apiKey) {
      reject(new Error('Google Maps API 키가 설정되지 않았습니다.'));
      return;
    }

    isLoading = true;

    // 스크립트 태그 생성 및 로드
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      isGoogleMapsLoaded = true;
      isLoading = false;
      resolve();
    };

    script.onerror = () => {
      isLoading = false;
      reject(new Error('Google Maps API 로드에 실패했습니다.'));
    };

    document.head.appendChild(script);
  });
};

// 주소를 좌표로 변환 (지오코딩)
export const geocodeAddress = async (address: string): Promise<LatLng | null> => {
  console.log(`🔍 지오코딩 시작: "${address}"`);
  
  try {
    await loadGoogleMapsAPI();
    
    return new Promise((resolve) => {
      const geocoder = new window.google.maps.Geocoder();
      
      geocoder.geocode({ address }, (results, status) => {
        console.log(`📍 지오코딩 응답 - 주소: "${address}", 상태: ${status}`);
        
        if (status === 'OK' && results && results[0]) {
          const location = results[0].geometry.location;
          const coords = {
            lat: location.lat(),
            lng: location.lng()
          };
          console.log(`✅ 지오코딩 성공: "${address}" → ${coords.lat}, ${coords.lng}`);
          resolve(coords);
        } else {
          console.warn(`❌ 지오코딩 실패: "${address}" - 상태: ${status}`);
          resolve(null);
        }
      });
    });
  } catch (error) {
    console.error(`💥 지오코딩 에러: "${address}"`, error);
    return null;
  }
};

// 여러 주소를 한번에 지오코딩
export const geocodeMultipleAddresses = async (
  addresses: Array<{ name: string; address: string }>
): Promise<Location[]> => {
  console.log(`🚀 배치 지오코딩 시작: ${addresses.length}개 주소`);
  console.log('📋 주소 목록:', addresses);
  
  const results: Location[] = [];
  
  for (const addr of addresses) {
    console.log(`🔄 처리 중: ${results.length + 1}/${addresses.length} - "${addr.address}"`);
    
    const coords = await geocodeAddress(addr.address);
    if (coords) {
      const location = {
        name: addr.name,
        lat: coords.lat,
        lng: coords.lng,
        address: addr.address
      };
      results.push(location);
      console.log(`✅ 성공 추가: "${addr.name}" - ${coords.lat}, ${coords.lng}`);
    } else {
      // 지오코딩 실패 시 서울 기준 가짜 좌표 사용
      const fakeLocation = {
        name: addr.name,
        lat: 37.5665 + (results.length * 0.01),
        lng: 126.9780 + (results.length * 0.01),
        address: addr.address
      };
      results.push(fakeLocation);
      console.log(`🎭 폴백 좌표 사용: "${addr.name}" - ${fakeLocation.lat}, ${fakeLocation.lng}`);
    }
    
    // API 제한을 피하기 위해 요청 간격 조절
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log(`🎉 배치 지오코딩 완료: ${results.length}개 결과`);
  console.log('📊 최종 결과:', results);
  
  return results;
};

// Google Maps API 로드 상태 확인
export const isGoogleMapsAPILoaded = (): boolean => {
  return isGoogleMapsLoaded && !!window.google?.maps;
};

// Google Maps API 키 유효성 확인
export const hasValidGoogleMapsKey = (): boolean => {
  const apiKey = localStorage.getItem('google_maps_api_key');
  return !!(apiKey && apiKey.trim());
};

// 두 좌표 간의 거리 계산 (km)
export const calculateDistance = (point1: LatLng, point2: LatLng): number => {
  const R = 6371; // 지구 반지름 (km)
  const dLat = (point2.lat - point1.lat) * Math.PI / 180;
  const dLon = (point2.lng - point1.lng) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// 경로 최적화 (간단한 최근접 이웃 알고리즘)
export const optimizeRoute = (locations: Location[]): Location[] => {
  if (locations.length <= 2) return locations;
  
  const optimized: Location[] = [locations[0]]; // 시작점
  const remaining = [...locations.slice(1)];
  
  while (remaining.length > 0) {
    const current = optimized[optimized.length - 1];
    let nearestIndex = 0;
    let nearestDistance = calculateDistance(current, remaining[0]);
    
    for (let i = 1; i < remaining.length; i++) {
      const distance = calculateDistance(current, remaining[i]);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = i;
      }
    }
    
    optimized.push(remaining[nearestIndex]);
    remaining.splice(nearestIndex, 1);
  }
  
  return optimized;
}; 