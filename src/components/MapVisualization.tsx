
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Map, Navigation, Route } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MapVisualization = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [routeOptimized, setRouteOptimized] = useState(false);

  useEffect(() => {
    // 여기서 실제로는 지도 API (Google Maps, Mapbox 등)를 초기화합니다
    console.log('지도 초기화');
  }, []);

  const optimizeRoute = () => {
    setRouteOptimized(true);
    // 실제로는 경로 최적화 알고리즘을 실행합니다
    setTimeout(() => {
      setRouteOptimized(false);
    }, 2000);
  };

  return (
    <Card className="w-full shadow-lg border-0 bg-white/90 backdrop-blur-sm">
      <CardHeader className="pb-6">
        <CardTitle className="flex items-center space-x-2 text-2xl">
          <Map className="h-6 w-6 text-orange-500" />
          <span>경로 시각화</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div 
          ref={mapRef}
          className="w-full h-96 bg-gradient-to-br from-blue-100 to-orange-100 rounded-lg flex items-center justify-center mb-6 relative overflow-hidden"
        >
          {/* 임시 지도 플레이스홀더 */}
          <div className="text-center">
            <Map className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">지도 API 연동 후 여행 경로가 표시됩니다</p>
            <p className="text-sm text-gray-400 mt-2">목적지별 최적 경로와 소요시간을 확인하세요</p>
          </div>
          
          {/* 애니메이션 효과를 위한 데코레이션 */}
          <div className="absolute top-4 left-4 w-3 h-3 bg-blue-500 rounded-full animate-ping"></div>
          <div className="absolute bottom-8 right-8 w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-4 h-4 bg-green-500 rounded-full animate-bounce"></div>
        </div>

        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          <Button 
            onClick={optimizeRoute}
            disabled={routeOptimized}
            className="flex-1 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white"
          >
            {routeOptimized ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>최적화 중...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Route className="h-4 w-4" />
                <span>경로 최적화</span>
              </div>
            )}
          </Button>
          
          <Button variant="outline" className="flex-1">
            <Navigation className="h-4 w-4 mr-2" />
            길찾기 시작
          </Button>
        </div>

        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">경로 정보</h4>
          <div className="space-y-1 text-sm text-blue-700">
            <p>• 총 거리: 계산 중...</p>
            <p>• 예상 소요시간: 계산 중...</p>
            <p>• 교통비 예상: 계산 중...</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MapVisualization;
