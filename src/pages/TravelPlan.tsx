import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import TravelPlanForm from '../components/TravelPlanForm';
import EditableTravelPlan from '../components/EditableTravelPlan';
import GoogleMap from '../components/GoogleMap';
import AIPlanChat from '../components/AIPlanChat';
import CollaborationPanel from '../components/CollaborationPanel';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Download, Share2, Users, Map, MessageCircle } from 'lucide-react';
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
  const [activeDay, setActiveDay] = useState<number>(1);
  const [activePlan, setActivePlan] = useState<TravelPlan | null>(null);
  const [isCollaborationMode, setIsCollaborationMode] = useState(false);
  const [rightPanelView, setRightPanelView] = useState<'map' | 'collaboration'>('map');

  useEffect(() => {
    // 먼저 추천 일정 확인
    const recommendedPlan = localStorage.getItem('recommendedPlan');
    if (recommendedPlan) {
      try {
        const parsedRecommendedPlan = JSON.parse(recommendedPlan);
        console.log('추천 일정 발견:', parsedRecommendedPlan.title);
        
        // 추천 일정을 일반 일정 포맷으로 변환
        const formattedPlans: TravelPlan[] = parsedRecommendedPlan.plans.map((plan: any) => ({
          id: plan.id,
          title: plan.title,
          day: plan.day,
          activities: plan.activities.map((activity: any) => ({
            id: activity.id,
            time: activity.time,
            activity: activity.activity,
            location: activity.location,
            description: activity.description,
            duration: activity.duration || 60
          }))
        }));

        setPlans(formattedPlans);
        setShowForm(false);
        
        // 일반 여행 계획으로 저장
        localStorage.setItem('travel_plans', JSON.stringify(formattedPlans));
        // 추천 일정 데이터는 제거 (한 번만 사용)
        localStorage.removeItem('recommendedPlan');
        
        // 자동으로 지도에 표시
        extractLocationsFromPlans(formattedPlans);
        toast.success(`${parsedRecommendedPlan.title} 일정을 불러왔습니다!`);
        
        return; // 추천 일정을 로드했으면 기존 일정 확인 생략
      } catch (error) {
        console.error('추천 일정을 불러오는데 실패했습니다:', error);
        localStorage.removeItem('recommendedPlan');
      }
    }

    // 추천 일정이 없으면 로컬 스토리지에서 저장된 일정 불러오기
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

  // 현재 선택된 날짜의 위치만 추출하는 함수
  const extractLocationsFromActivePlan = async (plan: TravelPlan | null, showToast: boolean = false) => {
    if (!plan || plan.activities.length === 0) {
      console.log('❌ 현재 날짜에 표시할 일정이 없습니다.');
      setMapLocations([]);
      return;
    }

    const uniqueLocations = Array.from(
      new Set(plan.activities.map(activity => activity.location))
    ).filter(location => location && location.trim() !== '').map(location => {
      const activity = plan.activities.find(a => a.location === location);
      return {
        name: activity?.activity || location,
        address: location
      };
    });

    if (uniqueLocations.length === 0) {
      console.log('❌ 추출할 위치가 없습니다.');
      setMapLocations([]);
      return;
    }

    console.log(`🗺️ ${plan.day}일차 위치 추출:`, uniqueLocations.length, '개 장소');
    console.log('📍 추출된 위치 목록:', uniqueLocations);
    
    // Google Maps API를 사용한 실제 지오코딩 시도
    try {
      const { geocodeMultipleAddresses, hasValidGoogleMapsKey } = await import('@/utils/googleMaps');
      
      console.log('🔑 Google Maps API 키 확인:', hasValidGoogleMapsKey());
      
      if (hasValidGoogleMapsKey()) {
        console.log(`🚀 ${plan.day}일차 - Google Maps API로 지오코딩 시작...`);
        const geocodedLocations = await geocodeMultipleAddresses(uniqueLocations);
        console.log('✅ 지오코딩 완료:', geocodedLocations);
        
        // 유효한 좌표인지 확인
        const validLocations = geocodedLocations.filter(loc => 
          loc.lat !== 0 && loc.lng !== 0 && 
          !isNaN(loc.lat) && !isNaN(loc.lng)
        );
        
        console.log(`📊 ${plan.day}일차 유효한 좌표:`, validLocations.length, '/', geocodedLocations.length);
        
        setMapLocations(validLocations);
        if (showToast) {
          toast.success(`${plan.day}일차: ${validLocations.length}개 장소가 지도에 표시됩니다.`);
        }
      } else {
        // API 키가 없으면 가짜 좌표 사용
        console.log(`⚠️ ${plan.day}일차 - Google Maps API 키가 없어 가짜 좌표 사용`);
        const fakeLocations: Location[] = uniqueLocations.map((location, index) => ({
          name: location.name,
          lat: 37.5665 + (index * 0.01), // 서울 기준 가짜 좌표
          lng: 126.9780 + (index * 0.01),
          address: location.address
        }));
        
        console.log('🎭 가짜 좌표 생성:', fakeLocations);
        setMapLocations(fakeLocations);
        if (showToast) {
          toast.success(`${plan.day}일차: ${fakeLocations.length}개 장소가 지도에 표시됩니다. (데모 좌표)`);
        }
      }
    } catch (error) {
      console.error(`❌ ${plan.day}일차 지오코딩 에러:`, error);
      // 에러 발생시 가짜 좌표로 폴백
      const fakeLocations: Location[] = uniqueLocations.map((location, index) => ({
        name: location.name,
        lat: 37.5665 + (index * 0.01),
        lng: 126.9780 + (index * 0.01),
        address: location.address
      }));
      
      console.log('🔄 폴백: 가짜 좌표 생성:', fakeLocations);
      setMapLocations(fakeLocations);
      if (showToast) {
        toast.success(`${plan.day}일차: ${fakeLocations.length}개 장소가 지도에 표시됩니다. (데모 좌표)`);
      }
    }
  };

  // 탭 변경 시 호출되는 콜백 함수
  const handleActiveTabChange = (dayNumber: number, plan: TravelPlan | null) => {
    console.log(`📅 탭 변경: ${dayNumber}일차로 이동`);
    setActiveDay(dayNumber);
    setActivePlan(plan);
    
    // 해당 날짜의 위치만 지도에 표시 (알림 없음)
    extractLocationsFromActivePlan(plan, false);
  };

  // 기존 extractLocationsFromPlans 함수는 전체 일정용으로 유지하되, 1일차만 표시하도록 수정
  const extractLocationsFromPlans = async (travelPlans: TravelPlan[]) => {
    if (travelPlans.length === 0) {
      console.log('❌ 추출할 일정이 없습니다.');
      return;
    }

    // 첫 번째 일정 (1일차)만 표시
    const firstPlan = travelPlans.find(plan => plan.day === 1) || travelPlans[0];
    console.log('🎯 초기 로드: 1일차 일정을 지도에 표시');
    
    setActiveDay(firstPlan.day);
    setActivePlan(firstPlan);
    await extractLocationsFromActivePlan(firstPlan, false); // 초기 로드시 알림 없음
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
    console.log('🗺️ "지도에서 보기" 버튼 클릭 - 현재 선택된 날짜의 일정 표시');
    
    // 현재 선택된 날짜의 일정만 표시 (알림 있음)
    if (activePlan) {
      console.log(`📍 ${activePlan.day}일차 일정을 지도에 표시`);
      await extractLocationsFromActivePlan(activePlan, true); // 버튼 클릭시 알림 표시
    } else {
      console.log('❌ 선택된 날짜가 없습니다.');
      toast.error('표시할 일정이 없습니다.');
    }
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
    setIsCollaborationMode(false);
    setRightPanelView('map');
    localStorage.removeItem('travel_plans');
    toast.success('새로운 여행 계획을 시작합니다.');
  };

  const toggleCollaboration = () => {
    setIsCollaborationMode(!isCollaborationMode);
    if (!isCollaborationMode) {
      setRightPanelView('collaboration');
      toast.success('협업 모드가 활성화되었습니다!');
    } else {
      setRightPanelView('map');
      toast.success('협업 모드가 종료되었습니다.');
    }
  };

  const switchRightPanel = (view: 'map' | 'collaboration') => {
    setRightPanelView(view);
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
              
              {/* 협업 모드 표시 */}
              {isCollaborationMode && (
                <Badge className="bg-green-100 text-green-700 border-green-200">
                  <Users className="h-3 w-3 mr-1" />
                  협업 모드
                </Badge>
              )}
            </div>
            
            {plans.length > 0 && (
              <div className="flex space-x-2">
                {/* 협업 토글 버튼 */}
                <Button 
                  variant={isCollaborationMode ? "default" : "outline"}
                  onClick={toggleCollaboration}
                >
                  <Users className="h-4 w-4 mr-2" />
                  {isCollaborationMode ? '협업 중' : '협업하기'}
                </Button>
                
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
                  onActiveTabChange={handleActiveTabChange}
                />
                
                <AIPlanChat 
                  plans={plans}
                  onPlansUpdate={(newPlans) => {
                    console.log('🤖 AI 채팅으로 일정 업데이트됨');
                    setPlans(newPlans);
                    localStorage.setItem('travel_plans', JSON.stringify(newPlans));
                    
                    // 현재 선택된 날짜의 업데이트된 일정을 지도에 반영 (알림 없음)
                    const updatedActivePlan = newPlans.find(plan => plan.day === activeDay);
                    if (updatedActivePlan) {
                      console.log(`📅 ${activeDay}일차 업데이트된 일정을 지도에 반영`);
                      setActivePlan(updatedActivePlan);
                      extractLocationsFromActivePlan(updatedActivePlan, false); // AI 업데이트시 알림 없음
                    }
                  }}
                />
              </div>
              
              <div className="space-y-6">
                {/* 우측 패널 전환 버튼 */}
                {isCollaborationMode && (
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <Button
                      variant={rightPanelView === 'map' ? 'default' : 'ghost'}
                      onClick={() => switchRightPanel('map')}
                      className="flex-1"
                      size="sm"
                    >
                      <Map className="h-4 w-4 mr-2" />
                      지도
                    </Button>
                    <Button
                      variant={rightPanelView === 'collaboration' ? 'default' : 'ghost'}
                      onClick={() => switchRightPanel('collaboration')}
                      className="flex-1"
                      size="sm"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      협업
                    </Button>
                  </div>
                )}

                {/* 지도 또는 협업 패널 */}
                {rightPanelView === 'map' ? (
                  <GoogleMap 
                    locations={mapLocations}
                    onLocationsChange={(newLocations) => setMapLocations(newLocations)}
                  />
                ) : (
                  <CollaborationPanel
                    planId={plans[0]?.id || 'default'}
                    isCollaborationMode={isCollaborationMode}
                    onToggleCollaboration={toggleCollaboration}
                  />
                )}
                
                {plans.length > 0 && (
                  <div className="bg-white rounded-lg p-6 shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">여행 통계</h3>
                      {activePlan && (
                        <div className="flex items-center space-x-2 text-sm">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="text-gray-600">현재 지도: {activePlan.day}일차</span>
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{plans.length}</div>
                        <div className="text-gray-600">여행 일수</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">
                          {activePlan ? activePlan.activities.length : plans.reduce((total, plan) => total + plan.activities.length, 0)}
                        </div>
                        <div className="text-gray-600">{activePlan ? `${activePlan.day}일차 일정` : '총 일정 수'}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{mapLocations.length}</div>
                        <div className="text-gray-600">지도 표시 장소</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {activePlan 
                            ? Math.round(activePlan.activities.reduce((sum, activity) => sum + (activity.duration || 60), 0) / 60)
                            : Math.round(plans.reduce((total, plan) => 
                                total + plan.activities.reduce((sum, activity) => sum + (activity.duration || 60), 0), 0
                              ) / 60)
                          }
                        </div>
                        <div className="text-gray-600">{activePlan ? `${activePlan.day}일차 예상시간(시간)` : '총 예상 시간(시간)'}</div>
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
