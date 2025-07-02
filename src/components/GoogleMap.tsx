
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Map, Navigation, Route } from 'lucide-react';
import { toast } from 'sonner';

// Extend the Window interface to include google
declare global {
  interface Window {
    google: typeof google;
  }
}

interface Location {
  name: string;
  lat: number;
  lng: number;
  address: string;
}

interface GoogleMapProps {
  locations?: Location[];
  onLocationsChange?: (locations: Location[]) => void;
}

const GoogleMap = ({ locations = [], onLocationsChange }: GoogleMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService | null>(null);
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null);

  useEffect(() => {
    const apiKey = localStorage.getItem('google_maps_api_key');
    if (apiKey && !isInitialized) {
      console.log('Google Maps API 키 발견, 지도 로드 시작');
      loadGoogleMaps(apiKey);
    }
  }, [isInitialized]);

  const loadGoogleMaps = (key: string) => {
    if (window.google && window.google.maps) {
      console.log('Google Maps API 이미 로드됨, 지도 초기화');
      initializeMap();
      return;
    }

    console.log('Google Maps API 스크립트 로드 시작');
    setIsLoading(true);
    
    // 기존 스크립트 제거
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places,geometry`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      console.log('Google Maps API 스크립트 로드 완료');
      setIsLoading(false);
      initializeMap();
    };
    
    script.onerror = (error) => {
      console.error('Google Maps API 로드 실패:', error);
      setIsLoading(false);
      toast.error('Google Maps API 로드에 실패했습니다. API 키를 확인해주세요.');
    };
    
    document.head.appendChild(script);
  };

  const initializeMap = () => {
    if (!mapRef.current || !window.google) {
      console.error('맵 참조 또는 Google API 없음');
      return;
    }

    try {
      console.log('지도 초기화 시작');
      const mapInstance = new window.google.maps.Map(mapRef.current, {
        center: { lat: 37.5665, lng: 126.9780 }, // 서울 중심
        zoom: 12,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'on' }]
          }
        ]
      });

      const directionsServiceInstance = new window.google.maps.DirectionsService();
      const directionsRendererInstance = new window.google.maps.DirectionsRenderer({
        draggable: true,
        suppressMarkers: false,
        polylineOptions: {
          strokeColor: '#4285F4',
          strokeWeight: 4
        }
      });

      directionsRendererInstance.setMap(mapInstance);

      setMap(mapInstance);
      setDirectionsService(directionsServiceInstance);
      setDirectionsRenderer(directionsRendererInstance);
      setIsInitialized(true);

      console.log('Google Maps 초기화 완료');
      toast.success('지도가 성공적으로 로드되었습니다!');
    } catch (error) {
      console.error('지도 초기화 오류:', error);
      toast.error('지도 초기화에 실패했습니다.');
    }
  };

  const addMarkersToMap = () => {
    if (!map || !window.google || locations.length === 0) {
      console.log('마커 추가 조건 불충족:', { 
        map: !!map, 
        google: !!window.google, 
        locations: locations.length 
      });
      return;
    }

    console.log('마커 추가 시작:', locations);

    // 기존 마커들 제거
    markers.forEach(marker => marker.setMap(null));
    
    const newMarkers = locations.map((location, index) => {
      const marker = new window.google.maps.Marker({
        position: { lat: location.lat, lng: location.lng },
        map: map,
        title: location.name,
        label: {
          text: (index + 1).toString(),
          color: 'white',
          fontWeight: 'bold'
        },
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 20,
          fillColor: index === 0 ? '#4285F4' : index === locations.length - 1 ? '#EA4335' : '#FBBC04',
          fillOpacity: 1,
          strokeColor: 'white',
          strokeWeight: 2
        }
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 8px;">
            <h3 style="margin: 0 0 8px 0; font-weight: bold; color: #333;">${location.name}</h3>
            <p style="margin: 0; color: #666; font-size: 14px;">${location.address}</p>
          </div>
        `
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });

      console.log(`마커 ${index + 1} 추가됨:`, location.name);
      return marker;
    });

    setMarkers(newMarkers);

    // 지도 범위를 모든 마커가 보이도록 조정
    if (locations.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      locations.forEach(location => {
        bounds.extend({ lat: location.lat, lng: location.lng });
      });
      map.fitBounds(bounds);
      
      // 단일 위치인 경우 줌 레벨 조정
      if (locations.length === 1) {
        setTimeout(() => map.setZoom(15), 100);
      }
    }

    toast.success(`${locations.length}개의 장소가 지도에 표시되었습니다.`);
  };

  const calculateRoute = () => {
    if (!directionsService || !directionsRenderer || !window.google || locations.length < 2) {
      toast.error('경로 계산을 위해서는 최소 2개의 장소가 필요합니다.');
      return;
    }

    console.log('경로 계산 시작:', locations.length, '개 장소');

    const waypoints = locations.slice(1, -1).map(location => ({
      location: { lat: location.lat, lng: location.lng },
      stopover: true
    }));

    const request: google.maps.DirectionsRequest = {
      origin: { lat: locations[0].lat, lng: locations[0].lng },
      destination: { lat: locations[locations.length - 1].lat, lng: locations[locations.length - 1].lng },
      waypoints: waypoints,
      travelMode: window.google.maps.TravelMode.WALKING,
      optimizeWaypoints: true
    };

    directionsService.route(request, (result, status) => {
      console.log('경로 계산 결과:', status);
      
      if (status === 'OK' && result) {
        directionsRenderer.setDirections(result);
        
        // 최적화된 순서로 위치 재정렬
        if (result.routes[0].waypoint_order && onLocationsChange) {
          const optimizedOrder = result.routes[0].waypoint_order;
          const newOrder = [locations[0]]; // 시작점
          
          optimizedOrder.forEach(index => {
            newOrder.push(locations[index + 1]);
          });
          
          if (locations.length > 1) {
            newOrder.push(locations[locations.length - 1]); // 끝점
          }
          
          onLocationsChange(newOrder);
        }
        
        // 경로 정보 계산
        const route = result.routes[0];
        const totalDistance = route.legs.reduce((sum, leg) => sum + (leg.distance?.value || 0), 0);
        const totalDuration = route.legs.reduce((sum, leg) => sum + (leg.duration?.value || 0), 0);
        
        console.log('총 거리:', totalDistance, 'm, 총 시간:', totalDuration, '초');
        toast.success(`최적 경로가 계산되었습니다! (총 ${(totalDistance/1000).toFixed(1)}km, ${Math.round(totalDuration/60)}분)`);
      } else {
        console.error('경로 계산 실패:', status);
        toast.error('경로 계산에 실패했습니다. 장소가 너무 멀거나 경로를 찾을 수 없습니다.');
      }
    });
  };

  useEffect(() => {
    if (map && locations.length > 0) {
      console.log('위치 변경 감지, 마커 업데이트:', locations);
      setTimeout(() => addMarkersToMap(), 100); // 약간의 지연을 두어 안정성 향상
    }
  }, [map, locations]);

  const apiKey = localStorage.getItem('google_maps_api_key');
  
  if (!apiKey) {
    return (
      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Map className="h-5 w-5 text-orange-500" />
            <span>지도 설정 필요</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-gray-600 mb-4">
            지도 기능을 사용하려면 Google Maps API 키가 필요합니다.
          </p>
          <p className="text-sm text-gray-500">
            홈페이지에서 API 키를 설정해주세요.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Map className="h-5 w-5 text-orange-500" />
            <span>여행 경로 지도</span>
          </div>
          {locations.length > 0 && (
            <div className="text-sm text-gray-600">
              {locations.length}개 장소
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="w-full h-96 rounded-lg border border-gray-200 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent mx-auto mb-4"></div>
              <p className="text-gray-700 font-medium">Google Maps를 로드하는 중...</p>
              <p className="text-gray-500 text-sm mt-2">잠시만 기다려주세요</p>
            </div>
          </div>
        ) : !isInitialized ? (
          <div className="w-full h-96 rounded-lg border border-gray-200 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <Map className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">지도를 초기화하는 중...</p>
            </div>
          </div>
        ) : (
          <div 
            ref={mapRef}
            className="w-full h-96 rounded-lg border border-gray-200"
            style={{ minHeight: '400px' }}
          />
        )}
        
        <div className="flex space-x-2 mt-4">
          <Button 
            onClick={calculateRoute}
            className="flex-1 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
            disabled={locations.length < 2 || isLoading || !isInitialized}
          >
            <Route className="h-4 w-4 mr-2" />
            경로 최적화
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
