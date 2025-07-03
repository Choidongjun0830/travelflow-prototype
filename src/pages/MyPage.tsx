import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  User, 
  MapPin, 
  Calendar, 
  Clock, 
  Heart,
  Eye,
  Share2,
  Edit,
  Filter,
  Search,
  TrendingUp,
  Wallet,
  Plane,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  BarChart3
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { currentUser } from '../data/users';
import { 
  myTravelPlans, 
  getMyPlansByStatus, 
  getMyTravelStats,
  getMyPlansRecentlyUpdated 
} from '../data/myTravelPlans';
import type { TravelPlan } from '../data/users';

const MyPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'all' | TravelPlan['status']>('all');
  const [selectedTab, setSelectedTab] = useState('overview');

  const stats = getMyTravelStats();
  
  const filteredPlans = myTravelPlans.filter(plan => {
    const matchesSearch = plan.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         plan.destination.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || plan.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: TravelPlan['status']) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-700 px-2 py-1"><CheckCircle className="h-3 w-3 mr-1" />완료</Badge>;
      case 'planning':
        return <Badge className="bg-blue-100 text-blue-700 px-2 py-1"><AlertCircle className="h-3 w-3 mr-1" />계획 중</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-700 px-2 py-1"><XCircle className="h-3 w-3 mr-1" />취소됨</Badge>;
      default:
        return null;
    }
  };

  const handlePlanClick = (plan: TravelPlan) => {
    // 여행 계획을 로컬 스토리지에 저장하고 여행 계획 페이지로 이동
    localStorage.setItem('currentPlan', JSON.stringify(plan));
    navigate('/travel-plan');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 프로필 헤더 */}
        <Card className="mb-8 border-none shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
              <div className="relative">
                <Avatar className="h-24 w-24 border-4 border-white/20">
                  <AvatarFallback className="bg-white/20 text-white text-3xl">
                    {currentUser.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2">
                  <span className="text-2xl">{currentUser.profileImage}</span>
                </div>
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold mb-2">{currentUser.name}</h1>
                <p className="text-blue-100 mb-3">{currentUser.email}</p>
                <p className="text-white/90 mb-4 max-w-md">{currentUser.bio}</p>
                
                <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                  {currentUser.travelStyle.slice(0, 3).map((style) => (
                    <Badge key={style} variant="secondary" className="bg-white/20 text-white border-white/30">
                      {style}
                    </Badge>
                  ))}
                  {currentUser.travelStyle.length > 3 && (
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                      +{currentUser.travelStyle.length - 3}
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center justify-center md:justify-start space-x-4 text-sm text-blue-100">
                  <span className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDate(currentUser.joinDate)} 가입
                  </span>
                  <span className="flex items-center">
                    <Plane className="h-4 w-4 mr-1" />
                    총 {currentUser.totalTrips}번의 여행
                  </span>
                </div>
              </div>
              
              <Button 
                variant="secondary" 
                className="bg-white/20 text-white border-white/30 hover:bg-white/30"
              >
                <Edit className="h-4 w-4 mr-2" />
                프로필 수정
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 탭 네비게이션 */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white shadow-md rounded-xl">
            <TabsTrigger 
              value="overview"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              대시보드
            </TabsTrigger>
            <TabsTrigger 
              value="plans"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              <MapPin className="h-4 w-4 mr-2" />
              내 여행 계획
            </TabsTrigger>
            <TabsTrigger 
              value="favorites"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              <Heart className="h-4 w-4 mr-2" />
              관심 목록
            </TabsTrigger>
          </TabsList>

          {/* 대시보드 탭 */}
          <TabsContent value="overview" className="space-y-6">
            {/* 통계 카드들 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">총 여행 계획</p>
                      <p className="text-3xl font-bold text-blue-600">{stats.totalPlans}</p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-full">
                      <MapPin className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">완료된 여행</p>
                      <p className="text-3xl font-bold text-green-600">{stats.completedPlans}</p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-full">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">계획 중</p>
                      <p className="text-3xl font-bold text-orange-600">{stats.planningPlans}</p>
                    </div>
                    <div className="p-3 bg-orange-100 rounded-full">
                      <AlertCircle className="h-6 w-6 text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">방문한 도시</p>
                      <p className="text-3xl font-bold text-purple-600">{stats.destinations}</p>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-full">
                      <Plane className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 예산 정보 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-none shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Wallet className="h-5 w-5 mr-2 text-green-600" />
                    여행 예산 현황
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">총 예산</span>
                      <span className="font-bold text-lg">{formatCurrency(stats.totalBudget)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">총 지출</span>
                      <span className="font-bold text-lg text-red-600">{formatCurrency(stats.totalSpent)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t">
                      <span className="text-gray-600 font-medium">잔여 예산</span>
                      <span className="font-bold text-xl text-green-600">
                        {formatCurrency(stats.totalBudget - stats.totalSpent)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                    최근 활동
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {getMyPlansRecentlyUpdated().slice(0, 4).map((plan) => (
                      <div key={plan.id} className="flex items-center justify-between py-2">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{plan.image}</span>
                          <div>
                            <p className="font-medium text-sm">{plan.title}</p>
                            <p className="text-xs text-gray-500">{formatDate(plan.updatedAt)}</p>
                          </div>
                        </div>
                        {getStatusBadge(plan.status)}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* 여행 계획 탭 */}
          <TabsContent value="plans" className="space-y-6">
            {/* 검색 및 필터 */}
            <Card className="border-none shadow-lg">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="여행 계획이나 목적지를 검색하세요..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 border-gray-200 focus:border-blue-400 rounded-xl"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant={selectedStatus === 'all' ? 'default' : 'outline'}
                      onClick={() => setSelectedStatus('all')}
                      size="sm"
                    >
                      전체
                    </Button>
                    <Button
                      variant={selectedStatus === 'planning' ? 'default' : 'outline'}
                      onClick={() => setSelectedStatus('planning')}
                      size="sm"
                      className="data-[state=active]:bg-blue-600"
                    >
                      계획 중
                    </Button>
                    <Button
                      variant={selectedStatus === 'completed' ? 'default' : 'outline'}
                      onClick={() => setSelectedStatus('completed')}
                      size="sm"
                    >
                      완료
                    </Button>
                    <Button
                      variant={selectedStatus === 'cancelled' ? 'default' : 'outline'}
                      onClick={() => setSelectedStatus('cancelled')}
                      size="sm"
                    >
                      취소
                    </Button>
                  </div>

                  <Button
                    onClick={() => navigate('/travel-plan')}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    새 계획
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* 여행 계획 목록 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPlans.map((plan) => (
                <Card 
                  key={plan.id}
                  className="border-none shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
                  onClick={() => handlePlanClick(plan)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-4xl group-hover:scale-110 transition-transform duration-300">
                        {plan.image}
                      </div>
                      {getStatusBadge(plan.status)}
                    </div>
                    
                    <h3 className="font-bold text-lg mb-2 group-hover:text-blue-600 transition-colors">
                      {plan.title}
                    </h3>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        {plan.destination}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        {formatDate(plan.startDate)} - {formatDate(plan.endDate)}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        {plan.duration}
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {plan.description}
                    </p>

                    {plan.budget && (
                      <div className="bg-gray-50 rounded-lg p-3 mb-4">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">예산</span>
                          <span className="font-medium">{formatCurrency(plan.budget.total)}</span>
                        </div>
                        {plan.budget.spent > 0 && (
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">지출</span>
                            <span className="font-medium text-red-600">{formatCurrency(plan.budget.spent)}</span>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <User className="h-3 w-3" />
                        <span>{plan.collaborators.length}명 참여</span>
                        {plan.isPublic && (
                          <>
                            <Eye className="h-3 w-3" />
                            <span>공개</span>
                          </>
                        )}
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          // 공유 기능 구현
                        }}
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredPlans.length === 0 && (
              <Card className="border-none shadow-lg">
                <CardContent className="p-12 text-center">
                  <div className="text-6xl mb-4">✈️</div>
                  <h3 className="text-xl font-semibold mb-2">여행 계획이 없습니다</h3>
                  <p className="text-gray-600 mb-6">새로운 여행 계획을 세워보세요!</p>
                  <Button 
                    onClick={() => navigate('/travel-plan')}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    첫 번째 여행 계획 만들기
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* 관심 목록 탭 */}
          <TabsContent value="favorites" className="space-y-6">
            <Card className="border-none shadow-lg">
              <CardContent className="p-12 text-center">
                <div className="text-6xl mb-4">❤️</div>
                <h3 className="text-xl font-semibold mb-2">관심 목록</h3>
                <p className="text-gray-600 mb-6">
                  좋아하는 여행지나 추천 일정을 저장해보세요!
                </p>
                <Button 
                  onClick={() => navigate('/user-recommendations')}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Heart className="h-4 w-4 mr-2" />
                  추천 일정 둘러보기
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MyPage; 