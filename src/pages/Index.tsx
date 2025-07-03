import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { MapPin, Calendar, Users, Sparkles, Route, Clock, Share2, Download, ArrowRight, Star, Settings, X } from "lucide-react";
import Header from "../components/Header";
import ApiKeyManager from "../components/ApiKeyManager";
import { recommendedPlans } from "../data/recommendedPlans";
import { useState } from "react";

const Index = () => {
  const navigate = useNavigate();
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);

  const handleRecommendedPlanClick = (plan: typeof recommendedPlans[0]) => {
    // 추천 일정을 로컬 스토리지에 저장
    localStorage.setItem('recommendedPlan', JSON.stringify(plan));
    // 여행 계획 페이지로 이동
    navigate('/travel-plan');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm">
              ✨ AI 기반 여행 계획 도구
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent mb-6">
              TravelFlow
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              AI가 맞춤형 여행 일정을 생성하고, 친구들과 실시간으로 협업하며, 
              최적화된 경로로 완벽한 여행을 계획하세요.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button 
              size="lg" 
              onClick={() => navigate('/travel-plan')}
              className="bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600 text-white px-8 py-3"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              AI 여행 계획 시작하기
            </Button>
          </div>

          {/* API 키 관리 버튼 */}
          <div className="mt-6">
            <Button 
              variant="outline"
              onClick={() => setShowApiKeyModal(true)}
              className="text-sm px-6 py-2 border-gray-300 text-gray-600 hover:bg-gray-50"
            >
              <Settings className="mr-2 h-4 w-4" />
              API 키 관리하기
            </Button>
            <p className="text-xs text-gray-500 mt-2">
              AI 기능 사용을 위해 API 키 설정이 필요합니다
            </p>
          </div>
        </div>
      </section>

      {/* 추천 여행 일정 섹션 */}
      <section className="py-16 px-4 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">추천 여행 일정</h2>
            <p className="text-lg text-gray-600">
              인기 여행지의 검증된 코스로 쉽고 빠르게 여행을 시작하세요
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendedPlans.map((plan) => (
              <Card 
                key={plan.id} 
                className="hover:shadow-xl transition-all duration-300 cursor-pointer border-0 bg-white/80 backdrop-blur-sm group"
                onClick={() => handleRecommendedPlanClick(plan)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-4xl">{plan.image}</div>
                    <Badge variant="outline" className="text-xs">
                      {plan.duration}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg leading-tight group-hover:text-blue-600 transition-colors">
                    {plan.title}
                  </CardTitle>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <MapPin className="h-4 w-4" />
                    <span>{plan.destination}</span>
                    <Badge className="text-xs bg-orange-100 text-orange-700">
                      {plan.purpose}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-sm mb-4">
                    {plan.description}
                  </CardDescription>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{plan.plans.length}일 일정</span>
                    </div>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-sm text-gray-500 mb-4">
              더 개인화된 일정이 필요하신가요?
            </p>
            <Button 
              variant="outline"
              onClick={() => navigate('/travel-plan')}
              className="px-6"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              AI로 맞춤 일정 생성하기
            </Button>
          </div>
        </div>
      </section>

      {/* 사용자 추천 일정 섹션 */}
      <section className="py-16 px-4 bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">여행자들의 생생한 후기</h2>
            <p className="text-lg text-gray-600 mb-8">
              실제 여행을 다녀온 사람들이 공유하는 진짜 여행 일정과 꿀팁을 만나보세요
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="text-center hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                  👥
                </div>
                <CardTitle className="text-lg">실제 여행자 후기</CardTitle>
                <CardDescription>
                  가본 사람만 아는 진짜 꿀팁과 숨은 명소들을 발견해보세요
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                  ⭐
                </div>
                <CardTitle className="text-lg">검증된 일정</CardTitle>
                <CardDescription>
                  평점과 후기로 검증된 믿을 수 있는 여행 일정들을 만나보세요
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                  🎯
                </div>
                <CardTitle className="text-lg">바로 사용 가능</CardTitle>
                <CardDescription>
                  마음에 드는 일정을 클릭 한 번으로 내 계획으로 가져와 수정하세요
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className="text-center space-y-4">
            <p className="text-sm text-gray-600">
              🔥 이번 주 인기: 부산 맛집 투어, 제주도 힐링 여행, 경주 역사 탐방
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => navigate('/user-recommendations')}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3"
              >
                <Star className="mr-2 h-5 w-5" />
                추천 일정 둘러보기
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/user-recommendations')}
                className="px-8 py-3 border-purple-200 text-purple-600 hover:bg-purple-50"
              >
                내 여행 일정 공유하기
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">주요 기능</h2>
            <p className="text-lg text-gray-600">
              여행 계획부터 실행까지, 모든 과정을 스마트하게
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <CardTitle>AI 일정 자동 생성</CardTitle>
                <CardDescription>
                  여행지, 기간, 선호도를 입력하면 AI가 맞춤형 일정을 자동으로 생성합니다.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mb-4">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <CardTitle>스마트 지도 연동</CardTitle>
                <CardDescription>
                  모든 목적지를 지도에 시각화하고 최적 경로를 자동으로 계산합니다.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-4">
                  <Route className="h-6 w-6 text-white" />
                </div>
                <CardTitle>경로 최적화</CardTitle>
                <CardDescription>
                  이동 시간과 거리를 고려하여 가장 효율적인 여행 동선을 제안합니다.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <CardTitle>실시간 협업</CardTitle>
                <CardDescription>
                  여행 계획을 세우면서 친구들과 실시간으로 의견을 나누고 함께 편집하세요.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-teal-600 rounded-lg flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <CardTitle>유연한 일정 편집</CardTitle>
                <CardDescription>
                  생성된 일정을 자유롭게 수정, 추가, 삭제하여 완벽한 여행을 만드세요.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-pink-600 rounded-lg flex items-center justify-center mb-4">
                  <Share2 className="h-6 w-6 text-white" />
                </div>
                <CardTitle>간편한 공유</CardTitle>
                <CardDescription>
                  완성된 일정을 PDF로 저장하거나 링크로 공유하여 모두와 함께하세요.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-50 to-orange-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">사용법</h2>
            <p className="text-lg text-gray-600">
              3단계로 완성하는 완벽한 여행 계획
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold mb-4">여행 정보 입력</h3>
              <p className="text-gray-600">
                목적지, 여행 기간, 선호하는 여행 스타일을 입력하세요.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold mb-4">AI 일정 생성</h3>
              <p className="text-gray-600">
                AI가 맞춤형 여행 일정을 자동으로 생성하고 지도에 표시합니다.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold mb-4">편집 및 협업</h3>
              <p className="text-gray-600">
                생성된 일정을 편집하고 친구들과 실시간으로 협업하여 완벽한 여행을 만드세요.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-gray-800 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <p>&copy; 2024 TravelFlow. AI와 함께하는 스마트한 여행 계획.</p>
        </div>
      </footer>

      {/* API 키 관리 모달 */}
      {showApiKeyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">API 키 관리</h2>
                  <p className="text-blue-100">AI 기능 사용을 위해 API 키를 설정해주세요</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowApiKeyModal(false)}
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg"
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>
            </div>
            <div className="p-6">
              <ApiKeyManager />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
