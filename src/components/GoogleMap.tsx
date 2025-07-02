
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Map, Navigation, Route, Settings } from 'lucide-react';
import { toast } from 'sonner';

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
  const [apiKey, setApiKey] = useState('');
  const [showApiInput, setShowApiInput] = useState(true);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService | null>(null);
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null);

  useEffect(() => {
    const savedApiKey = localStorage.getItem('google_maps_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
      setShowApiInput(false);
      loadGoogleMaps(savedApiKey);
    }
  }, []);

  const loadGoogleMaps = (key: string) => {
    if (window.google) {
      initializeMap();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = initializeMap;
    script.onerror = () => {
      toast.error('Google Maps API 로드에 실패했습니다. API 키를 확인해주세요.');
    };
    document.head.appendChild(script);
  };

  const initializeMap = () => {
    if (!mapRef.current) return;

    const mapInstance = new google.maps.Map(mapRef.current, {
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

    const directionsServiceInstance = new google.maps.DirectionsService();
    const directionsRendererInstance = new google.maps.DirectionsRenderer({
      draggable: true,
      suppressMarkers: false
    });

    directionsRendererInstance.setMap(mapInstance);

    setMap(mapInstance);
    setDirectionsService(directionsServiceInstance);
    setDirectionsRenderer(directionsRendererInstance);

    toast.success('지도가 성공적으로 로드되었습니다!');
  };

  const saveApiKey = () => {
    if (!apiKey.trim()) {
      toast.error('Google Maps API 키를 입력해주세요.');
      return;
    }

    localStorage.setItem('google_maps_api_key', apiKey);
    setShowApiInput(false);
    loadGoogleMaps(apiKey);
    toast.success('API 키가 저장되었습니다.');
  };

  const addMarkersToMap = () => {
    if (!map || locations.length === 0) return;

    // 기존 마커들 제거
    markers.forEach(marker => marker.setMap(null));
    
    const newMarkers = locations.map((location, index) => {
      const marker = new google.maps.Marker({
        position: { lat: location.lat, lng: location.lng },
        map: map,
        title: location.name,
        label: (index + 1).toString()
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div>
            <h3 style="margin: 0 0 8px 0; font-weight: bold;">${location.name}</h3>
            <p style="margin: 0; color: #666;">${location.address}</p>
          </div>
        `
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });

      return marker;
    });

    setMarkers(newMarkers);

    // 지도 중심을 첫 번째 위치로 이동
    if (locations.length > 0) {
      map.setCenter({ lat: locations[0].lat, lng: locations[0].lng });
    }
  };

  const calculateRoute = () => {
    if (!directionsService || !directionsRenderer || locations.length < 2) {
      toast.error('경로 계산을 위해서는 최소 2개의 장소가 필요합니다.');
      return;
    }

    const waypoints = locations.slice(1, -1).map(location => ({
      location: { lat: location.lat, lng: location.lng },
      stopover: true
    }));

    const request = {
      origin: { lat: locations[0].lat, lng: locations[0].lng },
      destination: { lat: locations[locations.length - 1].lat, lng: locations[locations.length - 1].lng },
      waypoints: waypoints,
      travelMode: google.maps.TravelMode.WALKING,
      optimizeWaypoints: true
    };

    directionsService.route(request, (result, status) => {
      if (status === 'OK' && result) {
        directionsRenderer.setDirections(result);
        
        // 최적화된 순서로 위치 재정렬
        if (result.routes[0].waypoint_order && onLocationsChange) {
          const optimizedOrder = result.routes[0].waypoint_order;
          const newOrder = [locations[0]]; // 시작점
          
          optimizedOrder.forEach(index => {
            newOrder.push(locations[index + 1]);
          });
          
          newOrder.push(locations[locations.length - 1]); // 끝점
          onLocationsChange(newOrder);
        }
        
        toast.success('최적 경로가 계산되었습니다!');
      } else {
        toast.error('경로 계산에 실패했습니다.');
      }
    });
  };

  useEffect(() => {
    if (map && locations.length > 0) {
      addMarkersToMap();
    }
  }, [map, locations]);

  if (showApiInput) {
    return (
      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5 text-orange-500" />
            <span>Google Maps API 설정</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-3">
              지도 기능을 사용하려면 Google Maps API 키가 필요합니다.
              <br />
              <a 
                href="https://developers.google.com/maps/get-started" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                여기서 API 키를 발급받으세요
              </a>
            </p>
            <Input
              placeholder="Google Maps API 키를 입력하세요"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              type="password"
            />
          </div>
          <Button onClick={saveApiKey} className="w-full">
            API 키 저장하고 지도 로드하기
          </Button>
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
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowApiInput(true)}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div 
          ref={mapRef}
          className="w-full h-96 rounded-lg border border-gray-200"
        />
        <div className="flex space-x-2 mt-4">
          <Button 
            onClick={calculateRoute}
            className="flex-1 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
            disabled={locations.length < 2}
          >
            <Route className="h-4 w-4 mr-2" />
            경로 최적화
          </Button>
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => window.open(`https://www.google.com/maps/dir/${locations.map(l => `${l.lat},${l.lng}`).join('/')}`)}
            disabled={locations.length === 0}
          >
            <Navigation className="h-4 w-4 mr-2" />
            구글맵에서 열기
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default GoogleMap;
