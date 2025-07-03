import { TravelPlan, currentUser } from './users';

// 내가 계획한/생성한 여행 일정들
export const myTravelPlans: TravelPlan[] = [
  {
    id: 'plan-1',
    title: '부산 3박 4일 맛집 여행',
    destination: '부산',
    startDate: '2024-03-15',
    endDate: '2024-03-18',
    duration: '3박 4일',
    purpose: '맛집 탐방',
    status: 'completed',
    createdAt: '2024-02-20T10:00:00Z',
    updatedAt: '2024-03-18T18:00:00Z',
    collaborators: [currentUser.id, 'user-1', 'user-2'],
    isPublic: true,
    image: '🦐',
    description: '부산의 유명 맛집들과 해운대, 광안리를 즐기는 미식 여행',
    budget: {
      total: 800000,
      spent: 750000,
      currency: 'KRW'
    },
    plans: [
      {
        day: 1,
        date: '2024-03-15',
        activities: [
          {
            id: 'act-1-1',
            time: '10:00',
            title: '부산역 도착',
            location: '부산역',
            address: '부산광역시 동구 중앙대로 206',
            duration: '30분',
            cost: 0,
            notes: 'KTX로 도착'
          },
          {
            id: 'act-1-2',
            time: '12:00',
            title: '돼지국밥 맛집 - 송정3대국밥',
            location: '송정3대국밥',
            address: '부산광역시 해운대구 송정해변로 10',
            duration: '1시간',
            cost: 8000,
            notes: '부산 대표 돼지국밥'
          },
          {
            id: 'act-1-3',
            time: '15:00',
            title: '해운대 해수욕장 산책',
            location: '해운대 해수욕장',
            address: '부산광역시 해운대구 우동',
            duration: '2시간',
            cost: 0
          }
        ]
      },
      {
        day: 2,
        date: '2024-03-16',
        activities: [
          {
            id: 'act-2-1',
            time: '09:00',
            title: '자갈치시장 구경',
            location: '자갈치시장',
            address: '부산광역시 중구 자갈치해안로 52',
            duration: '2시간',
            cost: 50000,
            notes: '신선한 회와 해산물'
          },
          {
            id: 'act-2-2',
            time: '14:00',
            title: '감천문화마을 탐방',
            location: '감천문화마을',
            address: '부산광역시 사하구 감천동',
            duration: '3시간',
            cost: 5000
          }
        ]
      }
    ]
  },
  {
    id: 'plan-2',
    title: '제주도 힐링 여행',
    destination: '제주도',
    startDate: '2024-05-10',
    endDate: '2024-05-13',
    duration: '3박 4일',
    purpose: '힐링',
    status: 'planning',
    createdAt: '2024-04-01T09:00:00Z',
    updatedAt: '2024-04-15T16:30:00Z',
    collaborators: [currentUser.id, 'user-3'],
    isPublic: false,
    image: '🌺',
    description: '제주도의 아름다운 자연과 함께하는 힐링 여행',
    budget: {
      total: 1200000,
      spent: 200000,
      currency: 'KRW'
    },
    plans: [
      {
        day: 1,
        date: '2024-05-10',
        activities: [
          {
            id: 'act-3-1',
            time: '11:00',
            title: '제주공항 도착',
            location: '제주국제공항',
            address: '제주특별자치도 제주시 공항로 2',
            duration: '1시간',
            cost: 180000,
            notes: '항공료 포함'
          },
          {
            id: 'act-3-2',
            time: '15:00',
            title: '한라산 둘레길 산책',
            location: '한라산 둘레길',
            address: '제주특별자치도 제주시 1100로',
            duration: '3시간',
            cost: 0
          }
        ]
      }
    ]
  },
  {
    id: 'plan-3',
    title: '서울 카페 투어',
    destination: '서울',
    startDate: '2024-02-03',
    endDate: '2024-02-04',
    duration: '1박 2일',
    purpose: '카페 투어',
    status: 'completed',
    createdAt: '2024-01-15T14:00:00Z',
    updatedAt: '2024-02-04T20:00:00Z',
    collaborators: [currentUser.id],
    isPublic: true,
    image: '☕',
    description: '서울의 핫한 카페들을 돌아보는 주말 여행',
    budget: {
      total: 300000,
      spent: 280000,
      currency: 'KRW'
    },
    plans: [
      {
        day: 1,
        date: '2024-02-03',
        activities: [
          {
            id: 'act-4-1',
            time: '10:00',
            title: '성수동 카페거리',
            location: '성수동',
            address: '서울특별시 성동구 성수동1가',
            duration: '4시간',
            cost: 50000,
            notes: '트렌디한 카페들이 모여있는 곳'
          },
          {
            id: 'act-4-2',
            time: '16:00',
            title: '한남동 루프탑 카페',
            location: '한남동',
            address: '서울특별시 용산구 한남동',
            duration: '2시간',
            cost: 30000
          }
        ]
      }
    ]
  },
  {
    id: 'plan-4',
    title: '강릉 바다 여행',
    destination: '강릉',
    startDate: '2024-06-20',
    endDate: '2024-06-22',
    duration: '2박 3일',
    purpose: '자연 탐방',
    status: 'planning',
    createdAt: '2024-04-10T11:00:00Z',
    updatedAt: '2024-04-20T15:00:00Z',
    collaborators: [currentUser.id, 'user-1', 'user-4'],
    isPublic: false,
    image: '🌊',
    description: '동해안의 아름다운 바다와 해변을 즐기는 여행',
    budget: {
      total: 600000,
      spent: 0,
      currency: 'KRW'
    },
    plans: [
      {
        day: 1,
        date: '2024-06-20',
        activities: [
          {
            id: 'act-5-1',
            time: '09:00',
            title: '경포해변 산책',
            location: '경포해변',
            address: '강원특별자치도 강릉시 창해로',
            duration: '2시간',
            cost: 0
          }
        ]
      }
    ]
  },
  {
    id: 'plan-5',
    title: '교토 문화 체험',
    destination: '교토',
    startDate: '2023-11-15',
    endDate: '2023-11-19',
    duration: '4박 5일',
    purpose: '문화 체험',
    status: 'completed',
    createdAt: '2023-09-10T10:00:00Z',
    updatedAt: '2023-11-19T22:00:00Z',
    collaborators: [currentUser.id, 'user-2'],
    isPublic: true,
    image: '⛩️',
    description: '일본 전통 문화를 체험하고 교토의 아름다운 사찰들을 둘러보는 여행',
    budget: {
      total: 1500000,
      spent: 1420000,
      currency: 'KRW'
    },
    plans: [
      {
        day: 1,
        date: '2023-11-15',
        activities: [
          {
            id: 'act-6-1',
            time: '14:00',
            title: '후시미 이나리 대사',
            location: '후시미 이나리 대사',
            address: '68 Fukakusa Yabunouchicho, Fushimi Ward, Kyoto',
            duration: '3시간',
            cost: 0,
            notes: '천 개의 도리이로 유명한 곳'
          }
        ]
      }
    ]
  },
  {
    id: 'plan-6',
    title: '전주 한옥마을 여행',
    destination: '전주',
    startDate: '2024-07-05',
    endDate: '2024-07-07',
    duration: '2박 3일',
    purpose: '문화 체험',
    status: 'cancelled',
    createdAt: '2024-03-20T13:00:00Z',
    updatedAt: '2024-06-01T09:00:00Z',
    collaborators: [currentUser.id],
    isPublic: false,
    image: '🏯',
    description: '전통 한옥과 맛있는 전주 음식을 즐기는 여행 (일정 변경으로 취소)',
    plans: []
  }
];

// 상태별로 여행 계획 필터링
export const getMyPlansByStatus = (status: TravelPlan['status']): TravelPlan[] => {
  return myTravelPlans.filter(plan => plan.status === status);
};

// 목적지별로 여행 계획 필터링
export const getMyPlansByDestination = (destination: string): TravelPlan[] => {
  return myTravelPlans.filter(plan => plan.destination.includes(destination));
};

// 최근 업데이트된 순으로 정렬
export const getMyPlansRecentlyUpdated = (): TravelPlan[] => {
  return [...myTravelPlans].sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
};

// 여행 계획 통계
export const getMyTravelStats = () => {
  const totalPlans = myTravelPlans.length;
  const completedPlans = getMyPlansByStatus('completed').length;
  const planningPlans = getMyPlansByStatus('planning').length;
  const cancelledPlans = getMyPlansByStatus('cancelled').length;
  
  const totalBudget = myTravelPlans.reduce((sum, plan) => 
    sum + (plan.budget?.total || 0), 0
  );
  
  const totalSpent = myTravelPlans.reduce((sum, plan) => 
    sum + (plan.budget?.spent || 0), 0
  );

  const destinations = [...new Set(myTravelPlans.map(plan => plan.destination))];
  
  return {
    totalPlans,
    completedPlans,
    planningPlans,
    cancelledPlans,
    totalBudget,
    totalSpent,
    destinations: destinations.length,
    mostVisitedDestination: destinations.length > 0 ? destinations[0] : null
  };
};

// 새 여행 계획 추가
export const addMyTravelPlan = (plan: Omit<TravelPlan, 'id' | 'createdAt' | 'updatedAt'>): TravelPlan => {
  const newPlan: TravelPlan = {
    ...plan,
    id: `plan-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  myTravelPlans.push(newPlan);
  return newPlan;
};

// 여행 계획 업데이트
export const updateMyTravelPlan = (planId: string, updates: Partial<TravelPlan>): boolean => {
  const planIndex = myTravelPlans.findIndex(plan => plan.id === planId);
  if (planIndex !== -1) {
    myTravelPlans[planIndex] = {
      ...myTravelPlans[planIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    return true;
  }
  return false;
};

// 여행 계획 삭제
export const deleteMyTravelPlan = (planId: string): boolean => {
  const planIndex = myTravelPlans.findIndex(plan => plan.id === planId);
  if (planIndex !== -1) {
    myTravelPlans.splice(planIndex, 1);
    return true;
  }
  return false;
}; 