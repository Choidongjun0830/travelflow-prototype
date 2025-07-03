import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Heart, 
  Eye, 
  Star, 
  MapPin, 
  Calendar, 
  Clock, 
  DollarSign, 
  Users,
  Play,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { UserRecommendation } from '@/types/userRecommendations';
import { toggleLike, incrementViews } from '@/data/userRecommendations';
import { toast } from 'sonner';

interface UserRecommendationCardProps {
  recommendation: UserRecommendation;
  onUse: () => void;
}

const UserRecommendationCard = ({ recommendation, onUse }: UserRecommendationCardProps) => {
  const [likes, setLikes] = useState(recommendation.likes);
  const [views, setViews] = useState(recommendation.views);
  const [isLiked, setIsLiked] = useState(
    localStorage.getItem(`liked_${recommendation.id}`) === 'true'
  );
  const [showDetails, setShowDetails] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const newLikes = toggleLike(recommendation.id);
      setLikes(newLikes);
      setIsLiked(!isLiked);
      
      if (!isLiked) {
        toast.success('좋아요를 눌렀습니다!');
      }
    } catch (error) {
      console.error('좋아요 처리 실패:', error);
      toast.error('좋아요 처리에 실패했습니다.');
    }
  };

  const handleUse = () => {
    try {
      // 조회수 증가
      const newViews = incrementViews(recommendation.id);
      setViews(newViews);
      
      // 상위 컴포넌트의 onUse 콜백 실행
      onUse();
    } catch (error) {
      console.error('일정 사용 처리 실패:', error);
      toast.error('일정을 가져오는데 실패했습니다.');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star className="h-4 w-4 text-gray-300" />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          </div>
        </div>
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />
      );
    }

    return stars;
  };

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      {/* 관리자 추천 배지 */}
      {recommendation.isRecommended && (
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-center py-1 text-xs font-medium">
          🌟 관리자 추천
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-bold text-gray-800 line-clamp-2 mb-2">
              {recommendation.title}
            </CardTitle>
            <div className="flex items-center space-x-3 text-sm text-gray-600 mb-3">
              <div className="flex items-center space-x-1">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs">
                    {recommendation.authorAvatar || '👤'}
                  </AvatarFallback>
                </Avatar>
                <span>{recommendation.author}</span>
              </div>
              <span>•</span>
              <span>{formatDate(recommendation.createdAt)}</span>
            </div>
          </div>
          
          {/* 평점 */}
          <div className="flex items-center space-x-1 ml-2">
            <div className="flex">{renderStars(recommendation.rating)}</div>
            <span className="text-sm font-semibold text-gray-700">
              {recommendation.rating.toFixed(1)}
            </span>
          </div>
        </div>

        <p className="text-gray-600 text-sm line-clamp-3 mb-3">
          {recommendation.description}
        </p>

        {/* 여행 정보 */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center space-x-1 text-gray-600">
            <MapPin className="h-3 w-3" />
            <span>{recommendation.location}</span>
          </div>
          <div className="flex items-center space-x-1 text-gray-600">
            <Calendar className="h-3 w-3" />
            <span>{recommendation.duration}박 {recommendation.duration + 1}일</span>
          </div>
          <div className="flex items-center space-x-1 text-gray-600">
            <DollarSign className="h-3 w-3" />
            <span>{recommendation.budget}</span>
          </div>
          <div className="flex items-center space-x-1 text-gray-600">
            <Users className="h-3 w-3" />
            <span>{recommendation.travelStyle}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col">
        {/* 사진 미리보기 */}
        {recommendation.photos.length > 0 && (
          <div className="flex space-x-1 mb-3">
            {recommendation.photos.slice(0, 4).map((photo, index) => (
              <div 
                key={index}
                className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-lg"
              >
                {photo}
              </div>
            ))}
            {recommendation.photos.length > 4 && (
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-500">
                +{recommendation.photos.length - 4}
              </div>
            )}
          </div>
        )}

        {/* 태그 */}
        <div className="flex flex-wrap gap-1 mb-3">
          {recommendation.tags.slice(0, 3).map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {recommendation.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{recommendation.tags.length - 3}
            </Badge>
          )}
        </div>

        {/* 상세 정보 토글 */}
        {showDetails && (
          <div className="mb-4 space-y-3">
            {/* 일정 미리보기 */}
            {recommendation.plans.length > 0 && (
              <div>
                <h4 className="font-semibold text-sm text-gray-700 mb-2">일정 미리보기</h4>
                <div className="space-y-1">
                  {recommendation.plans.slice(0, 2).map((plan) => (
                    <div key={plan.id} className="text-xs text-gray-600">
                      <span className="font-medium">{plan.title}</span>
                      <span className="text-gray-500 ml-2">
                        ({plan.activities.length}개 활동)
                      </span>
                    </div>
                  ))}
                  {recommendation.plans.length > 2 && (
                    <div className="text-xs text-gray-500">
                      ...외 {recommendation.plans.length - 2}개 일정
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 여행 팁 */}
            {recommendation.tips.length > 0 && (
              <div>
                <h4 className="font-semibold text-sm text-gray-700 mb-2">여행 팁</h4>
                <ul className="space-y-1">
                  {recommendation.tips.slice(0, 2).map((tip, index) => (
                    <li key={index} className="text-xs text-gray-600 flex items-start">
                      <span className="text-blue-500 mr-1">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                  {recommendation.tips.length > 2 && (
                    <li className="text-xs text-gray-500">
                      ...외 {recommendation.tips.length - 2}개 팁
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* 통계 및 액션 */}
        <div className="mt-auto pt-3 border-t">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <Eye className="h-3 w-3" />
                <span>{views.toLocaleString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Heart className={`h-3 w-3 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                <span>{likes}</span>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
              className="text-xs p-1 h-auto"
            >
              {showDetails ? (
                <>간단히 <ChevronUp className="h-3 w-3 ml-1" /></>
              ) : (
                <>자세히 <ChevronDown className="h-3 w-3 ml-1" /></>
              )}
            </Button>
          </div>

          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleLike}
              className={`flex-1 ${isLiked ? 'text-red-500 border-red-200' : ''}`}
            >
              <Heart className={`h-4 w-4 mr-1 ${isLiked ? 'fill-red-500' : ''}`} />
              좋아요
            </Button>
            <Button
              onClick={handleUse}
              className="flex-1 bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600"
            >
              <Play className="h-4 w-4 mr-1" />
              사용하기
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserRecommendationCard; 