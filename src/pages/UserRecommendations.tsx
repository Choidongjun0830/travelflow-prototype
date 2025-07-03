import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import UserRecommendationCard from '../components/UserRecommendationCard';
import RecommendationFilters from '../components/RecommendationFilters';
import AddRecommendationModal from '../components/AddRecommendationModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, TrendingUp, Star, Users, MapPin } from 'lucide-react';
import { getUserRecommendations } from '@/data/userRecommendations';
import { UserRecommendation, UserRecommendationFilters } from '@/types/userRecommendations';
import { toast } from 'sonner';

const UserRecommendations = () => {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState<UserRecommendation[]>([]);
  const [filteredRecommendations, setFilteredRecommendations] = useState<UserRecommendation[]>([]);
  const [filters, setFilters] = useState<UserRecommendationFilters>({ sortBy: 'latest' });
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // 데이터 로드
  useEffect(() => {
    setLoading(true);
    try {
      const data = getUserRecommendations();
      setRecommendations(data);
      setFilteredRecommendations(data);
    } catch (error) {
      console.error('추천 데이터 로드 실패:', error);
      toast.error('추천 일정을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  // 필터링 및 검색
  useEffect(() => {
    let filtered = [...recommendations];

    // 검색어 필터링
    if (searchTerm) {
      filtered = filtered.filter(rec => 
        rec.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rec.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rec.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rec.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rec.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // 위치 필터링
    if (filters.location) {
      filtered = filtered.filter(rec => rec.location === filters.location);
    }

    // 기간 필터링
    if (filters.duration) {
      const [min, max] = filters.duration.split('-').map(Number);
      filtered = filtered.filter(rec => {
        if (max) {
          return rec.duration >= min && rec.duration <= max;
        } else {
          return rec.duration >= min;
        }
      });
    }

    // 예산 필터링
    if (filters.budget) {
      filtered = filtered.filter(rec => rec.budget === filters.budget);
    }

    // 계절 필터링
    if (filters.season) {
      filtered = filtered.filter(rec => rec.season === filters.season);
    }

    // 여행 스타일 필터링
    if (filters.travelStyle) {
      filtered = filtered.filter(rec => rec.travelStyle === filters.travelStyle);
    }

    // 태그 필터링
    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter(rec => 
        filters.tags!.some(tag => rec.tags.includes(tag))
      );
    }

    // 정렬
    switch (filters.sortBy) {
      case 'popular':
        filtered.sort((a, b) => b.likes - a.likes);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'latest':
      default:
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    setFilteredRecommendations(filtered);
  }, [recommendations, filters, searchTerm]);

  // 추천 일정 사용하기
  const handleUseRecommendation = (recommendation: UserRecommendation) => {
    try {
      // 추천 일정을 여행 계획 포맷으로 변환
      const formattedPlans = recommendation.plans.map(plan => ({
        ...plan,
        activities: plan.activities.map(activity => ({
          ...activity,
          duration: activity.duration || 60
        }))
      }));

      // 로컬스토리지에 저장
      const travelPlanData = {
        title: recommendation.title,
        plans: formattedPlans,
        source: 'user-recommendation',
        originalId: recommendation.id
      };

      localStorage.setItem('recommendedPlan', JSON.stringify(travelPlanData));
      
      // 조회수 증가는 UserRecommendationCard에서 처리
      
      // 여행 계획 페이지로 이동
      navigate('/travel-plan');
      toast.success(`"${recommendation.title}" 일정을 가져왔습니다!`);
    } catch (error) {
      console.error('일정 가져오기 실패:', error);
      toast.error('일정을 가져오는데 실패했습니다.');
    }
  };

  // 통계 계산
  const stats = {
    total: recommendations.length,
    thisMonth: recommendations.filter(rec => {
      const recDate = new Date(rec.createdAt);
      const now = new Date();
      return recDate.getMonth() === now.getMonth() && recDate.getFullYear() === now.getFullYear();
    }).length,
    avgRating: recommendations.length > 0 
      ? (recommendations.reduce((sum, rec) => sum + rec.rating, 0) / recommendations.length).toFixed(1)
      : '0.0',
    topLocations: Object.entries(
      recommendations.reduce((acc, rec) => {
        acc[rec.location] = (acc[rec.location] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    ).sort(([,a], [,b]) => b - a).slice(0, 3)
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">추천 일정을 불러오는 중...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* 헤더 */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              여행자들의 추천 일정
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              실제 여행을 다녀온 사람들이 공유하는 생생한 여행 후기와 일정을 만나보세요
            </p>
            <Button 
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600 text-white px-6 py-3 text-lg"
            >
              <Plus className="h-5 w-5 mr-2" />
              내 여행 일정 공유하기
            </Button>
          </div>

          {/* 통계 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="flex items-center justify-center mb-2">
                  <Users className="h-5 w-5 text-blue-500 mr-2" />
                  <span className="text-2xl font-bold text-blue-600">{stats.total}</span>
                </div>
                <p className="text-sm text-gray-600">총 추천 일정</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-2xl font-bold text-green-600">{stats.thisMonth}</span>
                </div>
                <p className="text-sm text-gray-600">이번 달 신규</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="flex items-center justify-center mb-2">
                  <Star className="h-5 w-5 text-yellow-500 mr-2" />
                  <span className="text-2xl font-bold text-yellow-600">{stats.avgRating}</span>
                </div>
                <p className="text-sm text-gray-600">평균 평점</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="flex items-center justify-center mb-2">
                  <MapPin className="h-5 w-5 text-red-500 mr-2" />
                  <span className="text-sm font-bold text-red-600">
                    {stats.topLocations[0]?.[0] || '서울'}
                  </span>
                </div>
                <p className="text-sm text-gray-600">인기 여행지</p>
              </CardContent>
            </Card>
          </div>

          {/* 검색 및 필터 */}
          <div className="flex flex-col lg:flex-row gap-6 mb-8">
            {/* 검색바 */}
            <div className="lg:w-1/3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="제목, 내용, 지역, 작성자, 태그로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* 필터 */}
            <div className="lg:w-2/3">
              <RecommendationFilters
                filters={filters}
                onFiltersChange={setFilters}
                recommendations={recommendations}
              />
            </div>
          </div>

          {/* 결과 */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <p className="text-gray-600">
                총 <span className="font-semibold text-blue-600">{filteredRecommendations.length}</span>개의 추천 일정
              </p>
              
              {/* 인기 태그 */}
              <div className="hidden md:flex items-center space-x-2">
                <span className="text-sm text-gray-500">인기 태그:</span>
                {['바다', '맛집', '힐링', '문화', '자연'].map(tag => (
                  <Badge 
                    key={tag}
                    variant="outline"
                    className="cursor-pointer hover:bg-blue-50"
                    onClick={() => setSearchTerm(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* 추천 일정 목록 */}
          {filteredRecommendations.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredRecommendations.map((recommendation) => (
                <UserRecommendationCard
                  key={recommendation.id}
                  recommendation={recommendation}
                  onUse={() => handleUseRecommendation(recommendation)}
                />
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <div className="text-gray-400 mb-4">
                  <Search className="h-16 w-16 mx-auto mb-4" />
                </div>
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  검색 결과가 없습니다
                </h3>
                <p className="text-gray-500 mb-4">
                  다른 검색어나 필터를 시도해보세요
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm('');
                    setFilters({ sortBy: 'latest' });
                  }}
                >
                  필터 초기화
                </Button>
              </CardContent>
            </Card>
          )}

          {/* 새 일정 추가 모달 */}
          <AddRecommendationModal
            open={showAddModal}
            onClose={() => setShowAddModal(false)}
            onAdd={(newRecommendation) => {
              setRecommendations([newRecommendation, ...recommendations]);
              toast.success('새로운 추천 일정이 등록되었습니다!');
            }}
          />
        </div>
      </main>
    </div>
  );
};

export default UserRecommendations; 