export interface Activity {
  id: string;
  time: string;
  activity: string;
  location: string;
  description: string;
  duration?: number;
}

export interface TravelPlan {
  id: string;
  title: string;
  day: number;
  activities: Activity[];
}

export interface UserRecommendation {
  id: string;
  title: string;
  description: string;
  author: string;
  authorAvatar?: string;
  location: string;
  duration: number; // 여행 일수
  tags: string[];
  rating: number;
  budget: string; // 예산대 (예: "50만원 이하", "100만원 이상")
  season: string; // 계절 (예: "봄", "여름", "가을", "겨울")
  travelStyle: string; // 여행 스타일 (예: "혼자", "커플", "가족", "친구")
  plans: TravelPlan[];
  photos: string[]; // 여행 사진 URL들
  tips: string[]; // 여행 팁들
  createdAt: string;
  likes: number;
  views: number;
  isRecommended: boolean; // 관리자 추천 여부
}

export interface UserRecommendationFilters {
  location?: string;
  duration?: string;
  budget?: string;
  season?: string;
  travelStyle?: string;
  tags?: string[];
  sortBy: 'latest' | 'popular' | 'rating';
} 