export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio?: string;
  joinDate: string;
  travelStyle: string[];
  favoriteDestinations: string[];
  totalTrips: number;
  profileImage?: string;
}

export interface TravelPlan {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  duration: string;
  purpose: string;
  status: 'planning' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  collaborators: string[]; // 사용자 ID 배열
  isPublic: boolean;
  image: string;
  description: string;
  budget?: {
    total: number;
    spent: number;
    currency: string;
  };
  plans: {
    day: number;
    date: string;
    activities: {
      id: string;
      time: string;
      title: string;
      location: string;
      address: string;
      duration: string;
      cost?: number;
      notes?: string;
    }[];
  }[];
}

// 현재 로그인한 사용자
export const currentUser: User = {
  id: 'user-current',
  name: '김여행',
  email: 'travel.kim@example.com',
  avatar: '👩‍💼',
  bio: '여행을 사랑하는 마케터입니다. 맛집과 카페 탐방을 좋아해요!',
  joinDate: '2023-06-15',
  travelStyle: ['맛집 탐방', '도시 여행', '카페 투어', '문화 체험'],
  favoriteDestinations: ['서울', '부산', '제주도', '도쿄', '오사카'],
  totalTrips: 12,
  profileImage: '🌟'
};

// 더미 사용자들
export const users: User[] = [
  currentUser,
  {
    id: 'user-1',
    name: '박모험',
    email: 'adventure.park@example.com',
    avatar: '🧑‍💻',
    bio: '등산과 트레킹을 좋아하는 개발자입니다.',
    joinDate: '2023-03-20',
    travelStyle: ['등산', '자연 탐방', '캠핑', '액티비티'],
    favoriteDestinations: ['지리산', '설악산', '제주도', '네팔', '페루'],
    totalTrips: 18,
    profileImage: '🏔️'
  },
  {
    id: 'user-2',
    name: '이탐험',
    email: 'explorer.lee@example.com',
    avatar: '👨‍🎓',
    bio: '역사와 문화에 관심이 많은 학생입니다.',
    joinDate: '2023-08-10',
    travelStyle: ['문화 탐방', '역사 체험', '박물관', '전통 건축'],
    favoriteDestinations: ['경주', '교토', '로마', '아테네', '카이로'],
    totalTrips: 8,
    profileImage: '🏛️'
  },
  {
    id: 'user-3',
    name: '최힐링',
    email: 'healing.choi@example.com',
    avatar: '👩‍🎨',
    bio: '여유로운 힐링 여행을 선호하는 디자이너입니다.',
    joinDate: '2023-01-05',
    travelStyle: ['힐링', '온천', '리조트', '자연 치유'],
    favoriteDestinations: ['제주도', '강릉', '춘천', '발리', '몰디브'],
    totalTrips: 15,
    profileImage: '🌸'
  },
  {
    id: 'user-4',
    name: '정액티브',
    email: 'active.jung@example.com',
    avatar: '🏃‍♂️',
    bio: '스포츠와 액티비티를 즐기는 트레이너입니다.',
    joinDate: '2023-04-18',
    travelStyle: ['스포츠', '수상 스포츠', '스키', '패러글라이딩'],
    favoriteDestinations: ['강릉', '양양', '평창', '뉴질랜드', '스위스'],
    totalTrips: 22,
    profileImage: '🏄‍♂️'
  },
  {
    id: 'user-5',
    name: '한포토',
    email: 'photo.han@example.com',
    avatar: '📸',
    bio: '사진 찍기를 좋아하는 프리랜서 포토그래퍼입니다.',
    joinDate: '2023-07-22',
    travelStyle: ['사진 촬영', '풍경', '야경', '인물 사진'],
    favoriteDestinations: ['부산', '제주도', '파리', '산토리니', '아이슬란드'],
    totalTrips: 28,
    profileImage: '📷'
  }
];

// 사용자 ID로 사용자 정보 찾기
export const getUserById = (id: string): User | undefined => {
  return users.find(user => user.id === id);
};

// 현재 사용자의 여행 스타일 가져오기
export const getCurrentUserTravelStyles = (): string[] => {
  return currentUser.travelStyle;
};

// 사용자 정보 업데이트
export const updateUserProfile = (userId: string, updates: Partial<User>): boolean => {
  const userIndex = users.findIndex(user => user.id === userId);
  if (userIndex !== -1) {
    users[userIndex] = { ...users[userIndex], ...updates };
    return true;
  }
  return false;
}; 