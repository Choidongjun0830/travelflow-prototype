import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { MapPin, Calendar, Users, Sparkles, Route, Clock, Share2, Download, ArrowRight } from "lucide-react";
import Header from "../components/Header";
import ApiKeyManager from "../components/ApiKeyManager";
import { recommendedPlans } from "../data/recommendedPlans";

const Index = () => {
  const navigate = useNavigate();

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

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button 
              size="lg" 
              onClick={() => navigate('/travel-plan')}
              className="bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600 text-white px-8 py-3"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              AI 여행 계획 시작하기
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/collaboration')}
              className="px-8 py-3"
            >
              <Users className="mr-2 h-5 w-5" />
              협업 보드 사용하기
            </Button>
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

      {/* API 키 설정 섹션 */}
      <section className="py-16 px-4 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">AI 기능 사용하기</h2>
            <p className="text-lg text-gray-600">
              맞춤형 AI 일정 생성과 실제 지도 표시를 위해 API 키를 설정해주세요
            </p>
          </div>
          <ApiKeyManager />
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
                  친구들과 함께 일정을 편집하고 실시간으로 의견을 공유하세요.
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
              <h3 className="text-xl font-semibold mb-4">편집 및 최적화</h3>
              <p className="text-gray-600">
                생성된 일정을 편집하고 경로를 최적화하여 완벽한 여행을 만드세요.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">
            지금 바로 시작해보세요!
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            AI의 도움으로 더 스마트하고 효율적인 여행을 계획하세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/travel-plan')}
              className="bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600 text-white px-8 py-3"
            >
              <Calendar className="mr-2 h-5 w-5" />
              여행 계획 시작하기
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/collaboration')}
              className="px-8 py-3"
            >
              <Users className="mr-2 h-5 w-5" />
              협업 보드 체험하기
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-gray-800 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <p>&copy; 2024 TravelFlow. AI와 함께하는 스마트한 여행 계획.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
