
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Users, MapPin, Sparkles, Route, Share2 } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Sparkles className="h-8 w-8 text-blue-500" />,
      title: "AI 여행 일정 생성",
      description: "Gemini AI가 여행지, 기간, 취향을 바탕으로 맞춤형 일정을 자동 생성합니다.",
      action: () => navigate('/travel-plan')
    },
    {
      icon: <MapPin className="h-8 w-8 text-orange-500" />,
      title: "지도 기반 경로 최적화",
      description: "Google Maps와 연동하여 동선을 시각화하고 최적 경로를 계산합니다.",
      action: () => navigate('/travel-plan')
    },
    {
      icon: <Users className="h-8 w-8 text-purple-500" />,
      title: "실시간 협업 보드",
      description: "동행자와 함께 일정을 공유하고 실시간으로 편집할 수 있습니다.",
      action: () => navigate('/collaboration')
    }
  ];

  const personas = [
    {
      name: "이서연",
      age: "25세, 디자이너",
      type: "개인 여행자",
      description: "계획형 여행자로 AI가 초안을 짜주고 직접 수정하는 방식을 선호",
      color: "from-blue-500 to-teal-500"
    },
    {
      name: "최민재", 
      age: "23세, 대학생",
      type: "친구/커플 여행자",
      description: "즉흥적이며 친구들과의 협업과 공유가 중요한 사용자",
      color: "from-purple-500 to-pink-500"
    },
    {
      name: "김정우",
      age: "38세, 가족 가장", 
      type: "가족 여행자",
      description: "가족 만족도가 중요하며 체계적이고 안전한 일정을 선호",
      color: "from-orange-500 to-red-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent mb-6">
              TravelFlow
            </h1>
            <p className="text-2xl text-gray-600 max-w-3xl mx-auto mb-8">
              AI로 완벽한 여행 일정을 생성하고, 팀과 함께 협업하여 최고의 여행을 계획하세요
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Button 
                size="lg"
                onClick={() => navigate('/travel-plan')}
                className="bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600 text-white px-8 py-6 text-lg"
              >
                <Calendar className="h-5 w-5 mr-2" />
                여행 계획 시작하기
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate('/collaboration')}
                className="px-8 py-6 text-lg"
              >
                <Users className="h-5 w-5 mr-2" />
                협업 보드 열기
              </Button>
            </div>
          </div>

          {/* Features Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">주요 기능</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card 
                  key={index} 
                  className="shadow-lg border-0 bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
                  onClick={feature.action}
                >
                  <CardHeader className="text-center pb-4">
                    <div className="flex justify-center mb-4">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-center leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Personas Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">이런 분들을 위해 만들었어요</h2>
            <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
              다양한 여행 스타일과 니즈를 고려하여 설계된 TravelFlow를 만나보세요
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {personas.map((persona, index) => (
                <Card key={index} className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
                  <CardHeader>
                    <div className={`w-16 h-16 bg-gradient-to-r ${persona.color} rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4`}>
                      {persona.name.charAt(0)}
                    </div>
                    <CardTitle className="text-center">
                      <div className="text-lg font-bold">{persona.name}</div>
                      <div className="text-sm text-gray-500 font-normal">{persona.age}</div>
                      <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-2 bg-gradient-to-r ${persona.color} text-white`}>
                        {persona.type}
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-center text-sm leading-relaxed">
                      {persona.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-gradient-to-r from-blue-500 to-orange-500 rounded-2xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">지금 바로 시작해보세요!</h2>
            <p className="text-xl mb-8 opacity-90">
              몇 분만에 완벽한 여행 일정을 만들어보세요
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Button 
                size="lg"
                onClick={() => navigate('/travel-plan')}
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-6 text-lg font-semibold"
              >
                <Sparkles className="h-5 w-5 mr-2" />
                AI로 일정 생성하기
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate('/collaboration')}
                className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg"
              >
                <Share2 className="h-5 w-5 mr-2" />
                친구와 함께 계획하기
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
