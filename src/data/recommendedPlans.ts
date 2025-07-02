export interface RecommendedPlan {
  id: string;
  title: string;
  destination: string;
  duration: string;
  purpose: string;
  description: string;
  image: string;
  plans: Array<{
    id: string;
    title: string;
    day: number;
    activities: Array<{
      id: string;
      time: string;
      activity: string;
      location: string;
      description: string;
      duration?: number;
    }>;
  }>;
}

export const recommendedPlans: RecommendedPlan[] = [
  {
    id: "seoul-foodie-3days",
    title: "서울 3박 4일 맛집 탐방",
    destination: "서울",
    duration: "3박 4일",
    purpose: "맛집 탐방",
    description: "서울의 유명 맛집과 전통 음식을 중심으로 한 미식 여행",
    image: "🍜",
    plans: [
      {
        id: "plan-0",
        title: "1일차 - 강남 & 홍대 맛집",
        day: 1,
        activities: [
          {
            id: "activity-0-0",
            time: "12:00",
            activity: "본죽 강남점에서 점심",
            location: "강남구 테헤란로",
            description: "건강한 죽으로 여행 첫 끼 시작",
            duration: 60
          },
          {
            id: "activity-0-1",
            time: "15:00",
            activity: "카페 투썸플레이스",
            location: "강남역 근처",
            description: "달콤한 디저트와 커피로 휴식",
            duration: 90
          },
          {
            id: "activity-0-2",
            time: "18:00",
            activity: "홍대 치킨집 투어",
            location: "홍익대학교 앞",
            description: "한국의 대표 야식 치킨 맛보기",
            duration: 120
          }
        ]
      },
      {
        id: "plan-1",
        title: "2일차 - 명동 & 동대문 전통 음식",
        day: 2,
        activities: [
          {
            id: "activity-1-0",
            time: "09:00",
            activity: "명동교자 본점",
            location: "명동",
            description: "서울 대표 만두집에서 아침식사",
            duration: 60
          },
          {
            id: "activity-1-1",
            time: "13:00",
            activity: "광장시장 먹거리 투어",
            location: "종로구 광장시장",
            description: "빈대떡, 마약김밥, 순대 등 전통 길거리 음식",
            duration: 150
          },
          {
            id: "activity-1-2",
            time: "19:00",
            activity: "동대문 족발집",
            location: "동대문시장 근처",
            description: "쫄깃한 족발과 보쌈으로 저녁식사",
            duration: 90
          }
        ]
      },
      {
        id: "plan-2",
        title: "3일차 - 강남 고급 맛집",
        day: 3,
        activities: [
          {
            id: "activity-2-0",
            time: "11:00",
            activity: "압구정 브런치 카페",
            location: "압구정로데오",
            description: "세련된 브런치로 여유로운 시작",
            duration: 120
          },
          {
            id: "activity-2-1",
            time: "17:00",
            activity: "청담동 한정식집",
            location: "청담동",
            description: "고급 한정식으로 특별한 저녁",
            duration: 120
          },
          {
            id: "activity-2-2",
            time: "21:00",
            activity: "강남 디저트 카페",
            location: "강남역 근처",
            description: "달콤한 디저트로 여행 마무리",
            duration: 90
          }
        ]
      }
    ]
  },
  {
    id: "jeju-nature-4days",
    title: "제주도 3박 4일 자연 경관",
    destination: "제주도",
    duration: "3박 4일",
    purpose: "자연 경관",
    description: "제주도의 아름다운 자연과 바다를 만끽하는 힐링 여행",
    image: "🌊",
    plans: [
      {
        id: "plan-0",
        title: "1일차 - 서귀포 해안가",
        day: 1,
        activities: [
          {
            id: "activity-0-0",
            time: "10:00",
            activity: "정방폭포 관람",
            location: "서귀포시 정방동",
            description: "바다로 직접 떨어지는 폭포의 장관",
            duration: 90
          },
          {
            id: "activity-0-1",
            time: "14:00",
            activity: "천지연폭포 산책",
            location: "서귀포시 천지동",
            description: "신비로운 계곡과 폭포 트레킹",
            duration: 120
          },
          {
            id: "activity-0-2",
            time: "17:00",
            activity: "서귀포 매일올레시장",
            location: "서귀포시 중앙로",
            description: "현지 특산품과 제주 흑돼지 맛보기",
            duration: 90
          }
        ]
      },
      {
        id: "plan-1",
        title: "2일차 - 한라산 & 성산일출봉",
        day: 2,
        activities: [
          {
            id: "activity-1-0",
            time: "06:00",
            activity: "성산일출봉 일출 관람",
            location: "서귀포시 성산읍",
            description: "제주도 대표 일출 명소에서 새벽 일출",
            duration: 120
          },
          {
            id: "activity-1-1",
            time: "10:00",
            activity: "한라산 등반 (어리목 코스)",
            location: "제주시 해안동",
            description: "제주도 최고봉 한라산 트레킹",
            duration: 300
          },
          {
            id: "activity-1-2",
            time: "18:00",
            activity: "애월 해안도로 드라이브",
            location: "제주시 애월읍",
            description: "아름다운 해안선 따라 드라이브",
            duration: 90
          }
        ]
      },
      {
        id: "plan-2",
        title: "3일차 - 우도 & 해변",
        day: 3,
        activities: [
          {
            id: "activity-2-0",
            time: "09:00",
            activity: "우도 배 이동",
            location: "성산포항",
            description: "아름다운 우도로 떠나는 바다 여행",
            duration: 30
          },
          {
            id: "activity-2-1",
            time: "10:00",
            activity: "우도 해안 자전거 투어",
            location: "우도",
            description: "푸른 바다와 함께하는 자전거 라이딩",
            duration: 180
          },
          {
            id: "activity-2-2",
            time: "16:00",
            activity: "협재해수욕장",
            location: "제주시 한림읍",
            description: "에메랄드빛 바다에서 해수욕",
            duration: 120
          }
        ]
      }
    ]
  },
  {
    id: "kyoto-culture-5days",
    title: "교토 4박 5일 문화 유적",
    destination: "교토",
    duration: "4박 5일",
    purpose: "문화 유적",
    description: "일본 전통 문화와 역사가 살아 숨쉬는 교토의 깊이 있는 탐방",
    image: "⛩️",
    plans: [
      {
        id: "plan-0",
        title: "1일차 - 기온 & 청수사",
        day: 1,
        activities: [
          {
            id: "activity-0-0",
            time: "10:00",
            activity: "청수사 참배",
            location: "히가시야마구 청수",
            description: "교토의 대표 목조 사찰 관람",
            duration: 120
          },
          {
            id: "activity-0-1",
            time: "14:00",
            activity: "기온 거리 산책",
            location: "히가시야마구 기온",
            description: "전통 게이샤 거리와 찻집 체험",
            duration: 150
          },
          {
            id: "activity-0-2",
            time: "18:00",
            activity: "폰토초 골목 저녁식사",
            location: "나카교구 폰토초",
            description: "전통 가이세키 요리 체험",
            duration: 120
          }
        ]
      },
      {
        id: "plan-1",
        title: "2일차 - 후시미 & 니조성",
        day: 2,
        activities: [
          {
            id: "activity-1-0",
            time: "09:00",
            activity: "후시미 이나리 신사",
            location: "후시미구 이나리",
            description: "수천 개의 빨간 도리이 터널 체험",
            duration: 150
          },
          {
            id: "activity-1-1",
            time: "14:00",
            activity: "니조성 관람",
            location: "나카교구 니조성",
            description: "에도시대 쇼군의 거처 둘러보기",
            duration: 120
          },
          {
            id: "activity-1-2",
            time: "17:00",
            activity: "니시키 시장",
            location: "나카교구 니시키코지",
            description: "교토의 부엌에서 전통 음식 맛보기",
            duration: 90
          }
        ]
      },
      {
        id: "plan-2",
        title: "3일차 - 아라시야마 대나무 숲",
        day: 3,
        activities: [
          {
            id: "activity-2-0",
            time: "09:00",
            activity: "아라시야마 대나무 숲",
            location: "우쿄구 아라시야마",
            description: "신비로운 대나무 숲길 산책",
            duration: 90
          },
          {
            id: "activity-2-1",
            time: "11:00",
            activity: "테류지 사원",
            location: "우쿄구 아라시야마",
            description: "선종의 대표 사원과 정원 감상",
            duration: 120
          },
          {
            id: "activity-2-2",
            time: "15:00",
            activity: "토게츠교 산책",
            location: "우쿄구 아라시야마",
            description: "계절별 아름다운 풍경의 다리",
            duration: 60
          }
        ]
      }
    ]
  },
  {
    id: "shanghai-foodie-4days",
    title: "상하이 3박 4일 맛집 탐방",
    destination: "상하이",
    duration: "3박 4일",
    purpose: "맛집 탐방",
    description: "동서양이 만나는 상하이의 다양한 음식 문화 체험",
    image: "🥟",
    plans: [
      {
        id: "plan-0",
        title: "1일차 - 와이탄 & 난징로",
        day: 1,
        activities: [
          {
            id: "activity-0-0",
            time: "11:00",
            activity: "남상만두 본점",
            location: "황푸구 와이탄",
            description: "상하이 대표 샤오롱바오 맛집",
            duration: 90
          },
          {
            id: "activity-0-1",
            time: "15:00",
            activity: "난징로 거리 음식",
            location: "황푸구 난징로",
            description: "길거리 음식과 전통 간식 투어",
            duration: 120
          },
          {
            id: "activity-0-2",
            time: "19:00",
            activity: "와이탄 레스토랑",
            location: "황푸구 와이탄",
            description: "황푸강 야경과 함께하는 저녁식사",
            duration: 120
          }
        ]
      },
      {
        id: "plan-1",
        title: "2일차 - 프랑스 조계지 & 신천지",
        day: 2,
        activities: [
          {
            id: "activity-1-0",
            time: "10:00",
            activity: "프랑스 조계지 브런치",
            location: "서휘구 화이하이로",
            description: "유럽풍 카페에서 여유로운 브런치",
            duration: 120
          },
          {
            id: "activity-1-1",
            time: "14:00",
            activity: "상하이 게요리 전문점",
            location: "서휘구",
            description: "상하이 대표 음식 털게 요리",
            duration: 90
          },
          {
            id: "activity-1-2",
            time: "18:00",
            activity: "신천지 파인다이닝",
            location: "황푸구 신천지",
            description: "모던 상하이 요리와 칵테일",
            duration: 150
          }
        ]
      },
      {
        id: "plan-2",
        title: "3일차 - 예원 & 전통 시장",
        day: 3,
        activities: [
          {
            id: "activity-2-0",
            time: "09:00",
            activity: "예원 전통 찻집",
            location: "황푸구 예원",
            description: "중국 전통 차와 점심 조합",
            duration: 120
          },
          {
            id: "activity-2-1",
            time: "13:00",
            activity: "창핑루 미식거리",
            location: "징안구 창핑로",
            description: "현지인들의 숨은 맛집 탐방",
            duration: 150
          },
          {
            id: "activity-2-2",
            time: "17:00",
            activity: "상하이 야시장",
            location: "황푸구",
            description: "다양한 길거리 음식으로 마무리",
            duration: 120
          }
        ]
      }
    ]
  }
]; 