import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Map, Navigation, Route, MapPin, Key, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { 
  loadGoogleMapsAPI, 
  hasValidGoogleMapsKey, 
  isGoogleMapsAPILoaded,
  optimizeRoute,
  calculateDistance,
  type Location
} from '@/utils/googleMaps';

interface GoogleMapProps {
  locations?: Location[];
  onLocationsChange?: (locations: Location[]) => void;
}

const GoogleMap = ({ locations = [], onLocationsChange }: GoogleMapProps) => {
  const [showRoute, setShowRoute] = useState(false);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const directionsRendererRef = useRef<any>(null);
  const prevLocationsRef = useRef<Location[]>([]);

  const hasApiKey = hasValidGoogleMapsKey();

  // locations 배열이 실제로 변경되었는지 깊은 비교
  const locationsChanged = useMemo(() => {
    const prev = prevLocationsRef.current;
    if (prev.length !== locations.length) return true;
    
    for (let i = 0; i < locations.length; i++) {
      if (
        prev[i]?.lat !== locations[i]?.lat ||
        prev[i]?.lng !== locations[i]?.lng ||
        prev[i]?.name !== locations[i]?.name ||
        prev[i]?.address !== locations[i]?.address
      ) {
        return true;
      }
    }
    return false;
  }, [locations]);

  // Google Maps 초기화
  const initializeMap = async () => {
    if (!hasApiKey || !mapRef.current) return;

    try {
      await loadGoogleMapsAPI();
      
      // 지도 생성
      const map = new window.google.maps.Map(mapRef.current, {
        zoom: 13,
        center: { lat: 37.5665, lng: 126.9780 }, // 서울 기본 위치
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
      });

      mapInstanceRef.current = map;
      
      // DirectionsRenderer 초기화
      directionsRendererRef.current = new window.google.maps.DirectionsRenderer({
        suppressMarkers: false,
        draggable: true
      });
      directionsRendererRef.current.setMap(map);

      setIsMapLoaded(true);
      setMapError(null);
      
      // 기존 위치들이 있다면 마커 추가
      if (locations.length > 0) {
        updateMarkersOnMap(locations, map);
      }

    } catch (error) {
      console.error('Google Maps 초기화 실패:', error);
      setMapError(error instanceof Error ? error.message : '지도 로드에 실패했습니다.');
      setIsMapLoaded(false);
    }
  };

  // 마커들을 효율적으로 업데이트 (기존 마커 재사용)
  const updateMarkersOnMap = (locs: Location[], map: any) => {
    console.log('🎯 updateMarkersOnMap 호출됨:', locs.length, '개 위치');
    
    // 위치가 없으면 모든 마커 제거
    if (locs.length === 0) {
      console.log('🗑️ 모든 마커 제거');
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];
      return;
    }

    // 기존 마커보다 새 위치가 적으면 초과 마커 제거
    if (markersRef.current.length > locs.length) {
      const excessMarkers = markersRef.current.splice(locs.length);
      excessMarkers.forEach(marker => marker.setMap(null));
      console.log('✂️ 초과 마커 제거:', excessMarkers.length, '개');
    }

    // 각 위치에 대해 마커 업데이트 또는 생성
    locs.forEach((location, index) => {
      if (markersRef.current[index]) {
        // 기존 마커 업데이트
        const marker = markersRef.current[index];
        marker.setPosition({ lat: location.lat, lng: location.lng });
        marker.setTitle(location.name);
        marker.setLabel((index + 1).toString());
        
        // 색상 업데이트
        marker.setIcon({
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: index === 0 ? '#4285F4' : index === locs.length - 1 ? '#EA4335' : '#FBBC04',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
        });
        
        console.log(`🔄 마커 ${index + 1} 업데이트:`, location.name);
      } else {
        // 새 마커 생성
        console.log(`📌 마커 ${index + 1} 새로 생성:`, location.name);
        
        const marker = new window.google.maps.Marker({
          position: { lat: location.lat, lng: location.lng },
          map: map,
          title: location.name,
          label: (index + 1).toString(),
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: index === 0 ? '#4285F4' : index === locs.length - 1 ? '#EA4335' : '#FBBC04',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2,
          }
        });

        // InfoWindow 추가
        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 8px;">
              <h3 style="margin: 0 0 4px 0; font-size: 14px; font-weight: bold;">${location.name}</h3>
              <p style="margin: 0; font-size: 12px; color: #666;">${location.address}</p>
            </div>
          `
        });

        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });

        markersRef.current[index] = marker;
      }
    });

    console.log('✅ 마커 업데이트 완료:', markersRef.current.length, '개');

    // 지도 범위 조정
    if (locs.length > 1) {
      const bounds = new window.google.maps.LatLngBounds();
      locs.forEach(location => {
        bounds.extend({ lat: location.lat, lng: location.lng });
      });
      map.fitBounds(bounds);
      console.log('🔍 지도 범위를 마커에 맞춰 조정');
    } else if (locs.length === 1) {
      map.setCenter({ lat: locs[0].lat, lng: locs[0].lng });
      map.setZoom(15);
      console.log('🎯 단일 마커 중심으로 지도 이동');
    }
  };

  // 경로 계산 및 표시
  const calculateAndShowRoute = async () => {
    if (!mapInstanceRef.current || locations.length < 2) {
      toast.error('경로 계산을 위해서는 최소 2개의 장소가 필요합니다.');
      return;
    }

    try {
      const directionsService = new window.google.maps.DirectionsService();
      
      // 경로 최적화
      const optimizedLocations = optimizeRoute(locations);
      
      const waypoints = optimizedLocations.slice(1, -1).map(location => ({
        location: { lat: location.lat, lng: location.lng },
        stopover: true
      }));

      const request = {
        origin: { lat: optimizedLocations[0].lat, lng: optimizedLocations[0].lng },
        destination: { 
          lat: optimizedLocations[optimizedLocations.length - 1].lat, 
          lng: optimizedLocations[optimizedLocations.length - 1].lng 
        },
        waypoints: waypoints,
        travelMode: window.google.maps.TravelMode.DRIVING,
        optimizeWaypoints: true
      };

      directionsService.route(request, (result: any, status: string) => {
        if (status === 'OK') {
          directionsRendererRef.current.setDirections(result);
          setShowRoute(true);
          
          // 거리와 시간 계산
          const route = result.routes[0];
          const totalDistance = route.legs.reduce((sum: number, leg: any) => sum + leg.distance.value, 0) / 1000;
          const totalTime = route.legs.reduce((sum: number, leg: any) => sum + leg.duration.value, 0) / 60;
          
          toast.success(`최적 경로가 계산되었습니다! (총 ${totalDistance.toFixed(1)}km, ${Math.round(totalTime)}분)`);
        } else {
          console.error('경로 계산 실패:', status);
          toast.error('경로 계산에 실패했습니다.');
        }
      });
    } catch (error) {
      console.error('경로 계산 에러:', error);
      toast.error('경로 계산 중 오류가 발생했습니다.');
    }
  };

  // 가짜 지도 컴포넌트 (API 키가 없을 때)
  const FakeMapImage = () => {
    const calculateRoute = () => {
      if (locations.length < 2) {
        toast.error('경로 계산을 위해서는 최소 2개의 장소가 필요합니다.');
        return;
      }

      setShowRoute(true);
      toast.success(`최적 경로가 계산되었습니다! (총 ${Math.floor(Math.random() * 20 + 5)}km, ${Math.floor(Math.random() * 60 + 30)}분)`);
    };

    return (
      <div className="w-full h-96 rounded-lg border border-gray-200 bg-gradient-to-br from-blue-100 via-green-50 to-blue-50 relative overflow-hidden">
        {/* 가짜 지도 배경 */}
        <div className="absolute inset-0">
          {/* 도로 패턴 */}
          <div className="absolute top-20 left-0 w-full h-1 bg-gray-300"></div>
          <div className="absolute top-40 left-0 w-full h-1 bg-gray-300"></div>
          <div className="absolute top-60 left-0 w-full h-1 bg-gray-300"></div>
          <div className="absolute top-0 left-20 w-1 h-full bg-gray-300"></div>
          <div className="absolute top-0 left-40 w-1 h-full bg-gray-300"></div>
          <div className="absolute top-0 left-60 w-1 h-full bg-gray-300"></div>
          
          {/* 공원 영역 */}
          <div className="absolute top-10 right-10 w-24 h-20 bg-green-200 rounded-lg opacity-60"></div>
          <div className="absolute bottom-20 left-10 w-20 h-16 bg-green-200 rounded-lg opacity-60"></div>
          
          {/* 건물 영역 */}
          <div className="absolute top-32 left-32 w-12 h-8 bg-gray-400 opacity-40"></div>
          <div className="absolute top-48 right-32 w-16 h-12 bg-gray-400 opacity-40"></div>
          <div className="absolute bottom-32 left-24 w-14 h-10 bg-gray-400 opacity-40"></div>
        </div>

        {/* 마커들 */}
        {locations.map((location, index) => {
          const x = 50 + (index * 60) % 250;
          const y = 80 + (index * 40) % 200;
          
          return (
            <div
              key={index}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
              style={{ left: `${x}px`, top: `${y}px` }}
            >
              <div className="relative">
                <MapPin 
                  className={`h-8 w-8 ${
                    index === 0 
                      ? 'text-blue-500' 
                      : index === locations.length - 1 
                      ? 'text-red-500' 
                      : 'text-yellow-500'
                  } drop-shadow-lg`}
                  fill="currentColor"
                />
                <div className="absolute top-1 left-1/2 transform -translate-x-1/2 text-white text-xs font-bold">
                  {index + 1}
                </div>
                
                {/* 장소 이름 툴팁 */}
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                  {location.name}
                </div>
              </div>
            </div>
          );
        })}

        {/* 경로 선 (가짜) */}
        {showRoute && locations.length > 1 && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <path
              d={`M 50,80 Q 110,120 170,120 Q 230,160 290,200`}
              stroke="#4285F4"
              strokeWidth="3"
              fill="none"
              strokeDasharray="5,5"
              className="animate-pulse"
            />
          </svg>
        )}

        {/* 지도 컨트롤 (가짜) */}
        <div className="absolute top-4 right-4 bg-white rounded shadow-md p-2">
          <div className="flex flex-col space-y-1">
            <button className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded text-sm font-bold">+</button>
            <button className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded text-sm font-bold">-</button>
          </div>
        </div>

        {/* 지도 로고 */}
        <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 px-2 py-1 rounded text-xs text-gray-600">
          TravelFlow Map (Demo)
        </div>

        {/* API 키 필요 알림 */}
        <div className="absolute top-4 left-4 bg-yellow-100 border border-yellow-300 rounded-lg p-3 max-w-xs">
          <div className="flex items-center space-x-2 text-yellow-800">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm font-semibold">데모 지도</span>
          </div>
          <p className="text-xs text-yellow-700 mt-1">
            실제 지도를 보려면 Google Maps API 키를 설정하세요.
          </p>
        </div>
      </div>
    );
  };

  // 컴포넌트 마운트 시 지도 초기화
  useEffect(() => {
    if (hasApiKey && !isMapLoaded) {
      initializeMap();
    }
  }, [hasApiKey]);

  // 위치가 실제로 변경되었을 때만 마커 업데이트
  useEffect(() => {
    if (!locationsChanged) {
      console.log('🔄 locations 내용이 동일함, 마커 업데이트 생략');
      return;
    }
    
    console.log('🔄 GoogleMap locations 실제 변경됨:', locations.length, '개');
    prevLocationsRef.current = [...locations]; // 이전 locations 저장
    
    if (isMapLoaded && mapInstanceRef.current) {
      console.log('🗺️ 지도가 로드됨, 마커 업데이트 시작');
      updateMarkersOnMap(locations, mapInstanceRef.current);
    } else {
      console.log('⏳ 지도가 아직 로드되지 않음, 대기 중...');
    }
  }, [locationsChanged, isMapLoaded]);

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Map className="h-5 w-5 text-orange-500" />
            <span>여행 경로 지도</span>
            {!hasApiKey && (
              <div className="flex items-center space-x-1 text-yellow-600">
                <Key className="h-4 w-4" />
                <span className="text-sm">(데모)</span>
              </div>
            )}
          </div>
          {locations.length > 0 && (
            <div className="text-sm text-gray-600">
              {locations.length}개 장소
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* 지도 영역 */}
        {hasApiKey && !mapError ? (
          <div 
            ref={mapRef} 
            className="w-full h-96 rounded-lg border border-gray-200"
            style={{ minHeight: '384px' }}
          />
        ) : (
          <FakeMapImage />
        )}

        {/* 에러 메시지 */}
        {mapError && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2 text-red-800">
              <AlertTriangle className="h-4 w-4" />
              <span className="font-semibold">지도 로드 실패</span>
            </div>
            <p className="text-sm text-red-700 mt-1">{mapError}</p>
          </div>
        )}
        
        <div className="flex space-x-2 mt-4">
          <Button 
            onClick={hasApiKey ? calculateAndShowRoute : () => {
              if (locations.length < 2) {
                toast.error('경로 계산을 위해서는 최소 2개의 장소가 필요합니다.');
                return;
              }
              setShowRoute(true);
              toast.success(`최적 경로가 계산되었습니다! (총 ${Math.floor(Math.random() * 20 + 5)}km, ${Math.floor(Math.random() * 60 + 30)}분)`);
            }}
            className="flex-1 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
            disabled={locations.length < 2}
          >
            <Route className="h-4 w-4 mr-2" />
            {hasApiKey ? '경로 최적화' : '경로 최적화 (데모)'}
          </Button>
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => {
              if (locations.length > 0) {
                const coords = locations.map(l => `${l.lat},${l.lng}`).join('/');
                window.open(`https://www.google.com/maps/dir/${coords}`, '_blank');
              }
            }}
            disabled={locations.length === 0}
          >
            <Navigation className="h-4 w-4 mr-2" />
            구글맵에서 열기
          </Button>
        </div>

        {locations.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">방문 장소 목록</h4>
            <div className="space-y-1 text-sm text-blue-700">
              {locations.map((location, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <span className="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </span>
                  <span>{location.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GoogleMap;
