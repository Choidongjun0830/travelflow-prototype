
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Map, Navigation, Route, MapPin } from 'lucide-react';
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
  const [showRoute, setShowRoute] = useState(false);

  const calculateRoute = () => {
    if (locations.length < 2) {
      toast.error('경로 계산을 위해서는 최소 2개의 장소가 필요합니다.');
      return;
    }

    setShowRoute(true);
    toast.success(`최적 경로가 계산되었습니다! (총 ${Math.floor(Math.random() * 20 + 5)}km, ${Math.floor(Math.random() * 60 + 30)}분)`);
  };

  const FakeMapImage = () => {
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
          const x = 50 + (index * 60) % 250; // 가로 위치 계산
          const y = 80 + (index * 40) % 200; // 세로 위치 계산
          
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
      </div>
    );
  };

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
        <FakeMapImage />
        
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
