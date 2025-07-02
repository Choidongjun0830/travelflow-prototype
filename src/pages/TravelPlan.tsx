import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import TravelPlanForm from '../components/TravelPlanForm';
import EditableTravelPlan from '../components/EditableTravelPlan';
import GoogleMap from '../components/GoogleMap';
import AIPlanChat from '../components/AIPlanChat';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Share2 } from 'lucide-react';
import { toast } from 'sonner';

interface Activity {
  id: string;
  time: string;
  activity: string;
  location: string;
  description: string;
  duration?: number;
}

interface TravelPlan {
  id: string;
  title: string;
  day: number;
  activities: Activity[];
}

interface Location {
  name: string;
  lat: number;
  lng: number;
  address: string;
}

const TravelPlan = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState<TravelPlan[]>([]);
  const [mapLocations, setMapLocations] = useState<Location[]>([]);
  const [showForm, setShowForm] = useState(true);

  useEffect(() => {
    // 로컬 스토리지에서 저장된 일정 불러오기
    const savedPlans = localStorage.getItem('travel_plans');
    if (savedPlans) {
      try {
        const parsedPlans = JSON.parse(savedPlans);
        setPlans(parsedPlans);
        setShowForm(false);
        // 저장된 일정이 있으면 자동으로 지도에 표시
        console.log('저장된 일정 발견, 지도 표시 시작');
        extractLocationsFromPlans(parsedPlans);
      } catch (error) {
        console.error('저장된 일정을 불러오는데 실패했습니다:', error);
      }
    }
  }, []);

  const extractLocationsFromPlans = async (travelPlans: TravelPlan[]) => {
    const allActivities = travelPlans.flatMap(plan => plan.activities);
    const uniqueLocations = Array.from(
      new Set(allActivities.map(activity => activity.location))
    ).filter(location => location && location.trim() !== '').map(location => {
      const activity = allActivities.find(a => a.location === location);
      return {
        name: activity?.activity || location,
        address: location
      };
    });

    if (uniqueLocations.length === 0) {
      console.log('추출할 위치가 없습니다.');
      return;
    }

    console.log('위치 추출:', uniqueLocations.length, '개 장소');
    // 가짜 지도에 위치 표시 (실제 지오코딩 없이)
    const fakeLocations: Location[] = uniqueLocations.map((location, index) => ({
      name: location.name,
      lat: 37.5665 + (index * 0.01), // 서울 기준 가짜 좌표
      lng: 126.9780 + (index * 0.01),
      address: location.address
    }));
    
    setMapLocations(fakeLocations);
    toast.success(`${fakeLocations.length}개 장소가 지도에 표시됩니다.`);
  };

  const handlePlanGenerated = (generatedPlans: any[]) => {
    const formattedPlans: TravelPlan[] = generatedPlans.map((plan, index) => ({
      id: `plan-${index}`,
      title: plan.title,
      day: plan.day,
      activities: plan.activities.map((activity: any, actIndex: number) => ({
        id: `activity-${index}-${actIndex}`,
        time: activity.time,
        activity: activity.activity,
        location: activity.location,
        description: activity.description,
        duration: 60 // 기본 1시간
      }))
    }));

    setPlans(formattedPlans);
    setShowForm(false);
    
    // 로컬 스토리지에 저장
    localStorage.setItem('travel_plans', JSON.stringify(formattedPlans));
    
    // 자동으로 지도에 위치 표시
    console.log('새 일정 생성됨, 지도 표시 시작');
    extractLocationsFromPlans(formattedPlans);
    
    toast.success('여행 일정이 생성되었습니다!');
  };

  const handlePlansChange = (updatedPlans: TravelPlan[]) => {
    setPlans(updatedPlans);
    localStorage.setItem('travel_plans', JSON.stringify(updatedPlans));
  };

  const handleLocationExtract = async (locations: Array<{name: string, address: string}>) => {
    console.log('지도에 위치 표시:', locations);
    
    // 가짜 지도에 위치 표시 (실제 지오코딩 없이)
    const fakeLocations: Location[] = locations.map((location, index) => ({
      name: location.name,
      lat: 37.5665 + (index * 0.01), // 서울 기준 가짜 좌표
      lng: 126.9780 + (index * 0.01),
      address: location.address
    }));
    
    setMapLocations(fakeLocations);
    toast.success(`${fakeLocations.length}개 장소가 지도에 표시됩니다.`);
  };

  const exportToPDF = () => {
    // PDF 출력 기능 (실제로는 라이브러리 필요)
    window.print();
    toast.success('인쇄 대화상자가 열렸습니다.');
  };

  const shareSchedule = async () => {
    const scheduleText = plans.map(plan => 
      `${plan.title}\n${plan.activities.map(a => `${a.time} - ${a.activity} (${a.location})`).join('\n')}`
    ).join('\n\n');

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'TravelFlow 여행 일정',
          text: scheduleText,
        });
      } catch (error) {
        console.error('공유 실패:', error);
      }
    } else {
      navigator.clipboard.writeText(scheduleText);
      toast.success('일정이 클립보드에 복사되었습니다!');
    }
  };

  const resetPlans = () => {
    setPlans([]);
    setMapLocations([]);
    setShowForm(true);
    localStorage.removeItem('travel_plans');
    toast.success('새로운 여행 계획을 시작합니다.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => navigate('/')}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>홈으로</span>
              </Button>
              <h1 className="text-3xl font-bold text-gray-800">여행 일정 관리</h1>
            </div>
            
            {plans.length > 0 && (
              <div className="flex space-x-2">
                <Button variant="outline" onClick={exportToPDF}>
                  <Download className="h-4 w-4 mr-2" />
                  PDF 저장
                </Button>
                <Button variant="outline" onClick={shareSchedule}>
                  <Share2 className="h-4 w-4 mr-2" />
                  공유하기
                </Button>
                <Button onClick={resetPlans}>
                  새 일정 만들기
                </Button>
              </div>
            )}
          </div>

          {showForm ? (
            <div className="max-w-4xl mx-auto">
              <TravelPlanForm onPlanGenerated={handlePlanGenerated} />
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <div className="space-y-6">
                <EditableTravelPlan 
                  plans={plans} 
                  onPlansChange={handlePlansChange}
                  onLocationExtract={handleLocationExtract}
                />
                
                <AIPlanChat 
                  plans={plans}
                  onPlansUpdate={(newPlans) => {
                    setPlans(newPlans);
                    localStorage.setItem('travel_plans', JSON.stringify(newPlans));
                    // 업데이트된 계획을 지도에 반영
                    extractLocationsFromPlans(newPlans);
                  }}
                />
              </div>
              <div className="space-y-6">
                <GoogleMap 
                  locations={mapLocations}
                  onLocationsChange={(newLocations) => setMapLocations(newLocations)}
                />
                {plans.length > 0 && (
                  <div className="bg-white rounded-lg p-6 shadow-lg">
                    <h3 className="text-lg font-semibold mb-4">여행 통계</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{plans.length}</div>
                        <div className="text-gray-600">여행 일수</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">
                          {plans.reduce((total, plan) => total + plan.activities.length, 0)}
                        </div>
                        <div className="text-gray-600">총 일정 수</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{mapLocations.length}</div>
                        <div className="text-gray-600">지도 표시 장소</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {plans.reduce((total, plan) => 
                            total + plan.activities.reduce((sum, activity) => sum + (activity.duration || 60), 0), 0
                          ) / 60}
                        </div>
                        <div className="text-gray-600">총 예상 시간(시간)</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default TravelPlan;
