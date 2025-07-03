import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Filter } from 'lucide-react';
import { UserRecommendation, UserRecommendationFilters } from '@/types/userRecommendations';

interface RecommendationFiltersProps {
  filters: UserRecommendationFilters;
  onFiltersChange: (filters: UserRecommendationFilters) => void;
  recommendations: UserRecommendation[];
}

const RecommendationFilters = ({ 
  filters, 
  onFiltersChange, 
  recommendations 
}: RecommendationFiltersProps) => {
  
  // 고유한 값들 추출
  const uniqueLocations = Array.from(new Set(recommendations.map(rec => rec.location))).sort();
  const uniqueBudgets = Array.from(new Set(recommendations.map(rec => rec.budget))).sort();
  const uniqueSeasons = Array.from(new Set(recommendations.map(rec => rec.season))).sort();
  const uniqueTravelStyles = Array.from(new Set(recommendations.map(rec => rec.travelStyle))).sort();
  const allTags = Array.from(new Set(recommendations.flatMap(rec => rec.tags))).sort();

  const updateFilter = (key: keyof UserRecommendationFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value === 'all' ? undefined : value
    });
  };

  const clearFilters = () => {
    onFiltersChange({ sortBy: filters.sortBy });
  };

  const hasActiveFilters = filters.location || filters.duration || filters.budget || 
                          filters.season || filters.travelStyle || 
                          (filters.tags && filters.tags.length > 0);

  const toggleTag = (tag: string) => {
    const currentTags = filters.tags || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag];
    
    updateFilter('tags', newTags.length > 0 ? newTags : undefined);
  };

  return (
    <div className="space-y-4">
      {/* 메인 필터 */}
      <div className="flex flex-wrap gap-3">
        {/* 정렬 */}
        <div className="min-w-[120px]">
          <Select value={filters.sortBy} onValueChange={(value) => updateFilter('sortBy', value)}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="정렬" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">최신순</SelectItem>
              <SelectItem value="popular">인기순</SelectItem>
              <SelectItem value="rating">평점순</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 지역 */}
        <div className="min-w-[120px]">
          <Select value={filters.location || 'all'} onValueChange={(value) => updateFilter('location', value)}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="지역" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">모든 지역</SelectItem>
              {uniqueLocations.map(location => (
                <SelectItem key={location} value={location}>{location}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 기간 */}
        <div className="min-w-[120px]">
          <Select value={filters.duration || 'all'} onValueChange={(value) => updateFilter('duration', value)}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="기간" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">모든 기간</SelectItem>
              <SelectItem value="1-2">1-2일</SelectItem>
              <SelectItem value="3-4">3-4일</SelectItem>
              <SelectItem value="5-7">5-7일</SelectItem>
              <SelectItem value="8">8일 이상</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 예산 */}
        <div className="min-w-[120px]">
          <Select value={filters.budget || 'all'} onValueChange={(value) => updateFilter('budget', value)}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="예산" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">모든 예산</SelectItem>
              {uniqueBudgets.map(budget => (
                <SelectItem key={budget} value={budget}>{budget}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 계절 */}
        <div className="min-w-[100px]">
          <Select value={filters.season || 'all'} onValueChange={(value) => updateFilter('season', value)}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="계절" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">모든 계절</SelectItem>
              {uniqueSeasons.map(season => (
                <SelectItem key={season} value={season}>{season}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 여행 스타일 */}
        <div className="min-w-[100px]">
          <Select value={filters.travelStyle || 'all'} onValueChange={(value) => updateFilter('travelStyle', value)}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="스타일" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">모든 스타일</SelectItem>
              {uniqueTravelStyles.map(style => (
                <SelectItem key={style} value={style}>{style}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 필터 초기화 */}
        {hasActiveFilters && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={clearFilters}
            className="h-9 px-3"
          >
            <X className="h-4 w-4 mr-1" />
            초기화
          </Button>
        )}
      </div>

      {/* 태그 필터 */}
      <div>
        <div className="flex items-center space-x-2 mb-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">태그로 필터링</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {allTags.slice(0, 12).map(tag => {
            const isSelected = filters.tags?.includes(tag) || false;
            return (
              <Badge
                key={tag}
                variant={isSelected ? "default" : "outline"}
                className={`cursor-pointer transition-colors ${
                  isSelected 
                    ? 'bg-blue-500 hover:bg-blue-600' 
                    : 'hover:bg-gray-100'
                }`}
                onClick={() => toggleTag(tag)}
              >
                {tag}
                {isSelected && <X className="h-3 w-3 ml-1" />}
              </Badge>
            );
          })}
          {allTags.length > 12 && (
            <Badge variant="outline" className="text-gray-500">
              +{allTags.length - 12}개 더
            </Badge>
          )}
        </div>
      </div>

      {/* 활성 필터 요약 */}
      {hasActiveFilters && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">활성 필터</span>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearFilters}
              className="text-blue-600 hover:text-blue-700 h-auto p-1"
            >
              모두 제거
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {filters.location && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                📍 {filters.location}
                <X 
                  className="h-3 w-3 ml-1 cursor-pointer" 
                  onClick={() => updateFilter('location', undefined)}
                />
              </Badge>
            )}
            {filters.duration && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                📅 {filters.duration}일
                <X 
                  className="h-3 w-3 ml-1 cursor-pointer" 
                  onClick={() => updateFilter('duration', undefined)}
                />
              </Badge>
            )}
            {filters.budget && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                💰 {filters.budget}
                <X 
                  className="h-3 w-3 ml-1 cursor-pointer" 
                  onClick={() => updateFilter('budget', undefined)}
                />
              </Badge>
            )}
            {filters.season && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                🌤️ {filters.season}
                <X 
                  className="h-3 w-3 ml-1 cursor-pointer" 
                  onClick={() => updateFilter('season', undefined)}
                />
              </Badge>
            )}
            {filters.travelStyle && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                👥 {filters.travelStyle}
                <X 
                  className="h-3 w-3 ml-1 cursor-pointer" 
                  onClick={() => updateFilter('travelStyle', undefined)}
                />
              </Badge>
            )}
            {filters.tags && filters.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="bg-blue-100 text-blue-800">
                🏷️ {tag}
                <X 
                  className="h-3 w-3 ml-1 cursor-pointer" 
                  onClick={() => toggleTag(tag)}
                />
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecommendationFilters; 