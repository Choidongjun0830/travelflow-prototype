import { UserRecommendation } from '@/types/userRecommendations';

export const sampleUserRecommendations: UserRecommendation[] = [
  {
    id: 'user-rec-1',
    title: '부산 3박 4일 감성 여행 코스',
    description: '부산의 바다와 맛집을 만끽할 수 있는 알찬 여행 코스입니다. 특히 해운대와 광안리의 야경이 정말 아름다웠어요!',
    author: '여행러버김씨',
    authorAvatar: '👩‍🦱',
    location: '부산',
    duration: 4,
    tags: ['바다', '맛집', '야경', '감성', 'SNS'],
    rating: 4.8,
    budget: '50만원 이하',
    season: '가을',
    travelStyle: '커플',
    plans: [
      {
        id: 'day1-busan',
        title: '1일차 - 해운대 도착 & 탐방',
        day: 1,
        activities: [
          {
            id: 'act1-1',
            time: '14:00',
            activity: '해운대 해수욕장 산책',
            location: '48099 부산광역시 해운대구 우동 1411-23',
            description: '부산 도착 후 첫 번째 목적지. 파도 소리를 들으며 여유로운 시간을 보냈습니다.',
            duration: 90
          },
          {
            id: 'act1-2',
            time: '16:00',
            activity: '더베이101 전망대',
            location: '48099 부산광역시 해운대구 동백로 52',
            description: '해운대를 한눈에 내려다볼 수 있는 최고의 전망대. 사진 찍기 좋아요!',
            duration: 60
          },
          {
            id: 'act1-3',
            time: '18:00',
            activity: '해운대 맛집 저녁식사',
            location: '48058 부산광역시 해운대구 구남로 29',
            description: '현지인 추천 맛집에서 부산식 회와 밀면을 맛보았습니다.',
            duration: 120
          }
        ]
      },
      {
        id: 'day2-busan',
        title: '2일차 - 감천문화마을 & 자갈치시장',
        day: 2,
        activities: [
          {
            id: 'act2-1',
            time: '10:00',
            activity: '감천문화마을 탐방',
            location: '49310 부산광역시 사하구 감내2로 203',
            description: '부산의 마추픽추라 불리는 감천문화마을. 색색의 집들이 너무 예뻤어요.',
            duration: 180
          },
          {
            id: 'act2-2',
            time: '15:00',
            activity: '자갈치시장 투어',
            location: '48953 부산광역시 중구 자갈치해안로 52',
            description: '부산 대표 재래시장에서 신선한 해산물을 맛보고 구경했습니다.',
            duration: 120
          },
          {
            id: 'act2-3',
            time: '19:00',
            activity: '광안리 해변 야경 감상',
            location: '48303 부산광역시 수영구 광안해변로 219',
            description: '광안대교와 함께하는 로맨틱한 야경. 커플에게 강추합니다!',
            duration: 120
          }
        ]
      }
    ],
    photos: ['🏖️', '🌉', '🦐', '🎨'],
    tips: [
      '해운대는 주말에 매우 붐비니 평일 방문을 추천해요',
      '감천문화마을은 편한 신발 필수!',
      '자갈치시장에서는 흥정이 가능해요',
      '광안리 야경은 저녁 7시 이후가 베스트'
    ],
    createdAt: '2024-01-15',
    likes: 127,
    views: 2340,
    isRecommended: true
  },
  {
    id: 'user-rec-2',
    title: '제주도 힐링 여행 5박 6일',
    description: '제주도의 자연을 만끽하며 힐링할 수 있는 여유로운 여행 코스입니다. 렌터카로 섬 전체를 둘러보았어요.',
    author: '제주도마니아',
    authorAvatar: '🧑‍🌾',
    location: '제주도',
    duration: 6,
    tags: ['자연', '힐링', '렌터카', '카페', '오름'],
    rating: 4.9,
    budget: '100만원 이상',
    season: '봄',
    travelStyle: '가족',
    plans: [
      {
        id: 'day1-jeju',
        title: '1일차 - 제주공항 도착 & 제주시 탐방',
        day: 1,
        activities: [
          {
            id: 'act3-1',
            time: '11:00',
            activity: '제주공항 렌터카 수령',
            location: '63282 제주특별자치도 제주시 공항로 2',
            description: '여행의 시작, 렌터카를 받고 제주 여행을 시작했습니다.',
            duration: 60
          },
          {
            id: 'act3-2',
            time: '14:00',
            activity: '용두암 관광',
            location: '63102 제주특별자치도 제주시 용두암길 15',
            description: '제주도의 대표 관광지 중 하나. 용의 머리를 닮은 바위가 신기했어요.',
            duration: 90
          },
          {
            id: 'act3-3',
            time: '17:00',
            activity: '동문시장 구경',
            location: '63273 제주특별자치도 제주시 관덕로14길 20',
            description: '제주 전통시장에서 오메기떡과 흑돼지 구이를 맛보았습니다.',
            duration: 120
          }
        ]
      }
    ],
    photos: ['🌋', '🍊', '☁️', '🚗'],
    tips: [
      '렌터카 예약은 미리미리!',
      '제주도는 날씨 변화가 심하니 여러 겹 옷차림 추천',
      '오름 등반은 체력을 고려해서 계획하세요',
      '현지 카페들이 정말 예뻐요'
    ],
    createdAt: '2024-01-10',
    likes: 89,
    views: 1850,
    isRecommended: false
  },
  {
    id: 'user-rec-3',
    title: '경주 역사 문화 탐방 2박 3일',
    description: '천년 고도 경주의 역사와 문화를 깊이 있게 체험할 수 있는 여행입니다. 불국사와 석굴암은 정말 감동적이었어요!',
    author: '역사좋아',
    authorAvatar: '👨‍🏫',
    location: '경주',
    duration: 3,
    tags: ['역사', '문화', '유적지', '한옥', '전통'],
    rating: 4.6,
    budget: '30만원 이하',
    season: '봄',
    travelStyle: '혼자',
    plans: [
      {
        id: 'day1-gyeongju',
        title: '1일차 - 불국사 & 석굴암',
        day: 1,
        activities: [
          {
            id: 'act4-1',
            time: '09:00',
            activity: '불국사 참배',
            location: '38116 경상북도 경주시 불국로 385',
            description: '신라 천년의 불교 문화를 느낄 수 있는 곳. 다보탑과 석가탑이 인상적이었습니다.',
            duration: 150
          },
          {
            id: 'act4-2',
            time: '13:00',
            activity: '석굴암 견학',
            location: '38117 경상북도 경주시 불국로 873-243',
            description: '동양 조각의 백미라고 불리는 석굴암 본존불. 정말 경이로웠습니다.',
            duration: 120
          }
        ]
      }
    ],
    photos: ['🏛️', '🕉️', '🌸', '📿'],
    tips: [
      '불국사는 오전 일찍 가면 사람이 적어요',
      '석굴암은 예약제니 미리 확인하세요',
      '경주는 자전거 여행도 좋아요',
      '한복 체험도 추천해요'
    ],
    createdAt: '2024-01-08',
    likes: 64,
    views: 1320,
    isRecommended: false
  },
  {
    id: 'user-rec-4',
    title: '강릉 바다 & 카페 투어 2박 3일',
    description: '강릉의 아름다운 바다와 유명한 카페들을 둘러보는 감성 여행입니다. 정동진 일출은 꼭 보세요!',
    author: '카페러버',
    authorAvatar: '☕',
    location: '강릉',
    duration: 3,
    tags: ['바다', '카페', '일출', '감성', '커피'],
    rating: 4.7,
    budget: '50만원 이하',
    season: '여름',
    travelStyle: '친구',
    plans: [
      {
        id: 'day1-gangneung',
        title: '1일차 - 강릉 시내 & 경포대',
        day: 1,
        activities: [
          {
            id: 'act5-1',
            time: '11:00',
            activity: '강릉역 도착',
            location: '25440 강원특별자치도 강릉시 경강로 2007',
            description: 'KTX로 편리하게 강릉에 도착했습니다.',
            duration: 30
          },
          {
            id: 'act5-2',
            time: '14:00',
            activity: '경포대 해변 산책',
            location: '25465 강원특별자치도 강릉시 경포로 365',
            description: '강릉 대표 해변에서 시원한 바다를 만끽했습니다.',
            duration: 120
          },
          {
            id: 'act5-3',
            time: '17:00',
            activity: '테라로사 커피공장 방문',
            location: '25435 강원특별자치도 강릉시 구정면 현천길 7',
            description: '강릉 대표 로스터리 카페에서 진짜 커피를 맛보았습니다.',
            duration: 90
          }
        ]
      }
    ],
    photos: ['🌊', '☕', '🌅', '🏖️'],
    tips: [
      'KTX 예약은 미리미리!',
      '정동진 일출 보려면 새벽 4시 기상 필수',
      '강릉 커피거리도 꼭 가보세요',
      '해변가는 모래가 많으니 신발 주의'
    ],
    createdAt: '2024-01-05',
    likes: 93,
    views: 1670,
    isRecommended: true
  }
];

// 로컬스토리지 키
export const USER_RECOMMENDATIONS_KEY = 'user_recommendations';

// 로컬스토리지에서 사용자 추천 불러오기
export const getUserRecommendations = (): UserRecommendation[] => {
  try {
    const stored = localStorage.getItem(USER_RECOMMENDATIONS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed;
    }
    
    // 처음 실행시 샘플 데이터 저장
    localStorage.setItem(USER_RECOMMENDATIONS_KEY, JSON.stringify(sampleUserRecommendations));
    return sampleUserRecommendations;
  } catch (error) {
    console.error('사용자 추천 데이터 로드 실패:', error);
    return sampleUserRecommendations;
  }
};

// 로컬스토리지에 사용자 추천 저장
export const saveUserRecommendations = (recommendations: UserRecommendation[]) => {
  try {
    localStorage.setItem(USER_RECOMMENDATIONS_KEY, JSON.stringify(recommendations));
  } catch (error) {
    console.error('사용자 추천 데이터 저장 실패:', error);
  }
};

// 새 추천 추가
export const addUserRecommendation = (recommendation: Omit<UserRecommendation, 'id' | 'createdAt' | 'likes' | 'views'>) => {
  const recommendations = getUserRecommendations();
  const newRecommendation: UserRecommendation = {
    ...recommendation,
    id: `user-rec-${Date.now()}`,
    createdAt: new Date().toISOString().split('T')[0],
    likes: 0,
    views: 0
  };
  
  recommendations.unshift(newRecommendation);
  saveUserRecommendations(recommendations);
  return newRecommendation;
};

// 좋아요 토글
export const toggleLike = (id: string): number => {
  const recommendations = getUserRecommendations();
  const index = recommendations.findIndex(rec => rec.id === id);
  
  if (index !== -1) {
    // 간단한 좋아요 토글 (실제로는 사용자별 좋아요 상태를 저장해야 함)
    const isLiked = localStorage.getItem(`liked_${id}`) === 'true';
    
    if (isLiked) {
      recommendations[index].likes -= 1;
      localStorage.removeItem(`liked_${id}`);
    } else {
      recommendations[index].likes += 1;
      localStorage.setItem(`liked_${id}`, 'true');
    }
    
    saveUserRecommendations(recommendations);
    return recommendations[index].likes;
  }
  
  return 0;
};

// 조회수 증가
export const incrementViews = (id: string): number => {
  const recommendations = getUserRecommendations();
  const index = recommendations.findIndex(rec => rec.id === id);
  
  if (index !== -1) {
    recommendations[index].views += 1;
    saveUserRecommendations(recommendations);
    return recommendations[index].views;
  }
  
  return 0;
}; 