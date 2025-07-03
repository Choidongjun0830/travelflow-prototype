import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Heart, Sparkles, ThumbsUp, ThumbsDown, X } from 'lucide-react';
import { toast } from 'sonner';

interface TravelPlan {
  title: string;
  day: number;
  activities: Array<{
    time: string;
    activity: string;
    location: string;
    description: string;
  }>;
}

interface TravelPlanFormProps {
  onPlanGenerated?: (plan: TravelPlan[]) => void;
}

const TravelPlanForm = ({ onPlanGenerated }: TravelPlanFormProps) => {
  const [formData, setFormData] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    interests: '',
    budget: '',
    travelers: 1
  });
  
  const [preferences, setPreferences] = useState({
    mustVisitPlaces: [] as string[],
    mustDoActivities: [] as string[],
    avoidPlaces: [] as string[],
    avoidActivities: [] as string[],
    maxWalkingDistance: 5,
    budgetPerActivity: 50
  });
  
  const [newMustVisit, setNewMustVisit] = useState('');
  const [newMustDo, setNewMustDo] = useState('');
  const [newAvoidPlace, setNewAvoidPlace] = useState('');
  const [newAvoidActivity, setNewAvoidActivity] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePreferenceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPreferences(prev => ({
      ...prev,
      [name]: name === 'maxWalkingDistance' || name === 'budgetPerActivity' ? Number(value) : value
    }));
  };

  const addPreference = (type: 'mustVisitPlaces' | 'mustDoActivities' | 'avoidPlaces' | 'avoidActivities', value: string) => {
    if (!value.trim()) return;
    
    setPreferences(prev => ({
      ...prev,
      [type]: [...prev[type], value.trim()]
    }));
    
    // Clear input
    switch(type) {
      case 'mustVisitPlaces': setNewMustVisit(''); break;
      case 'mustDoActivities': setNewMustDo(''); break;
      case 'avoidPlaces': setNewAvoidPlace(''); break;
      case 'avoidActivities': setNewAvoidActivity(''); break;
    }
  };

  const removePreference = (type: 'mustVisitPlaces' | 'mustDoActivities' | 'avoidPlaces' | 'avoidActivities', index: number) => {
    setPreferences(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  const generateTravelPlan = async (apiKey: string, prompt: string) => {
    // 프록시를 통한 API 호출로 변경
    const response = await fetch(`/api/gemini/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 4096,
        }
      })
    });

    console.log('API 응답 상태:', response.status);
    console.log('API 응답 헤더:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API 에러 응답:', errorText);
      throw new Error(`API 호출 실패: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('API 성공 응답:', data);
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('API 응답 형식이 올바르지 않습니다.');
    }
    
    return data.candidates[0].content.parts[0].text;
  };

  const createPrompt = () => {
    const days = Math.ceil((new Date(formData.endDate).getTime() - new Date(formData.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    return `
다음 조건에 맞는 ${days}일 여행 일정을 JSON 형태로만 생성해주세요. 다른 설명 없이 오직 JSON만 응답해주세요:

기본 정보:
- 목적지: ${formData.destination}
- 여행 기간: ${formData.startDate} ~ ${formData.endDate} (${days}일)
- 여행자 수: ${formData.travelers}명
- 관심사: ${formData.interests}
- 예산: ${formData.budget}만원

🚨 **반드시 준수해야 할 필수 조건** 🚨

${preferences.mustVisitPlaces.length > 0 ? `
⭐ **필수 방문 장소** (반드시 일정에 포함할 것):
${preferences.mustVisitPlaces.map((place, index) => `${index + 1}. ${place}`).join('\n')}

‼️ 위 장소들은 절대로 빠뜨리지 말고 반드시 여행 일정에 포함시켜야 합니다.
` : ''}

${preferences.mustDoActivities.length > 0 ? `
⭐ **필수 활동** (반드시 일정에 포함할 것):
${preferences.mustDoActivities.map((activity, index) => `${index + 1}. ${activity}`).join('\n')}

‼️ 위 활동들은 절대로 빠뜨리지 말고 반드시 여행 일정에 포함시켜야 합니다.
` : ''}

${preferences.avoidPlaces.length > 0 ? `
❌ **절대 포함 금지 장소**:
${preferences.avoidPlaces.join(', ')}
` : ''}

${preferences.avoidActivities.length > 0 ? `
❌ **절대 포함 금지 활동**:
${preferences.avoidActivities.join(', ')}
` : ''}

제약 조건:
- 장소 간 최대 도보 거리: ${preferences.maxWalkingDistance}km 이내
- 활동당 최대 예산: ${preferences.budgetPerActivity}만원 이하

🎯 **주소 정확성 요구사항** 🎯
location 필드에는 반드시 다음 중 하나의 형식으로 정확한 주소를 포함해야 합니다:

**한국의 경우:**
- 우편번호 포함: "04524 서울특별시 중구 명동길 26 (명동2가)"
- 도로명주소: "서울특별시 종로구 종로 1 (종로1가)"
- 상세주소: "서울특별시 강남구 테헤란로 152 강남파이낸스센터"

**일본의 경우:**
- 우편번호: "〒100-0005 東京都千代田区丸の内1丁目"
- 상세주소: "京都府京都市東山区清水1丁目294"

**중국의 경우:**
- "上海市黄浦区南京东路 200号"
- "北京市东城区天安门广场"

**기타 국가:**
- 우편번호와 상세 주소를 모두 포함
- 유명 랜드마크의 경우 정확한 주소 명시

❗ 절대로 "명동", "강남", "시부야" 같은 일반적인 지역명만 사용하지 마세요.
❗ 반드시 구체적인 도로명, 건물명, 우편번호가 포함된 정확한 주소를 사용하세요.

응답 형식 (JSON만):
[
  {
    "title": "1일차 - 도착 및 시내 탐방",
    "day": 1,
    "activities": [
      {
        "time": "09:00",
        "activity": "${preferences.mustVisitPlaces.length > 0 ? preferences.mustVisitPlaces[0] + ' 방문' : '공항 도착'}",
        "location": "${preferences.mustVisitPlaces.length > 0 ? 
          (formData.destination.includes('서울') ? '04524 서울특별시 중구 명동길 26' : 
           formData.destination.includes('도쿄') ? '〒100-0005 東京都千代田区丸の内1丁目' :
           formData.destination.includes('상하이') ? '上海市黄浦区南京东路 200号' :
           '정확한 우편번호와 주소 포함 필요') : 
          (formData.destination.includes('서울') ? '07505 서울특별시 강서구 하늘길 112 (공항동) 인천국제공항' :
           formData.destination + ' 국제공항')}",
        "description": "${preferences.mustVisitPlaces.length > 0 ? '필수 방문 장소 - ' + preferences.mustVisitPlaces[0] + ' 관람' : '공항 도착 후 숙소로 이동'}"
      }
    ]
  }
]

🔥 **중요한 지시사항** 🔥:
1. 오직 유효한 JSON 형식으로만 응답할 것
2. 필수 방문 장소와 필수 활동을 절대로 빠뜨리지 말 것 
3. 각 필수 장소/활동은 반드시 하나 이상의 일정에 포함될 것
4. 금지된 장소/활동은 절대 포함하지 말 것
5. 제약 조건을 엄격히 준수할 것
6. **location 필드에는 반드시 우편번호와 상세 주소를 포함한 정확한 주소 사용**
7. JSON 외 다른 텍스트나 설명은 절대 포함하지 말 것

⚠️ 필수 조건과 주소 정확성을 지키지 않으면 응답이 거부됩니다.

🌍 **주요 관광지 주소 참고 예시**:
- 경복궁: "03045 서울특별시 종로구 사직로 161"
- 명동성당: "04537 서울특별시 중구 명동길 74"
- 도쿄 스카이트리: "〒131-0045 東京都墨田区押上1丁目1-2"
- 교토 청수사: "〒605-0862 京都府京都市東山区清水1丁目294"
- 상하이 와이탄: "上海市黄浦区中山东一路"
- 제주 성산일출봉: "63643 제주특별자치도 서귀포시 성산읍 성산리 1"
`;
  };

  const parseJsonFromResponse = (response: string): TravelPlan[] => {
    try {
      // 먼저 ```json으로 감싸진 부분 찾기
      let jsonText = response;
      
      const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        jsonText = jsonMatch[1];
      } else {
        // JSON 배열 패턴 찾기
        const arrayMatch = response.match(/\[([\s\S]*)\]/);
        if (arrayMatch) {
          jsonText = arrayMatch[0];
        }
      }
      
      // JSON 파싱 시도
      const parsed = JSON.parse(jsonText);
      
      // 배열인지 확인
      if (!Array.isArray(parsed)) {
        throw new Error('응답이 배열 형태가 아닙니다.');
      }
      
      return parsed;
    } catch (error) {
      console.error('JSON 파싱 실패:', error);
      console.error('원본 응답:', response);
      
      // 파싱 실패 시 기본 일정 반환
      return [{
        title: "1일차 - 기본 일정",
        day: 1,
        activities: [{
          time: "09:00",
          activity: "여행 시작",
          location: formData.destination,
          description: "AI 응답 처리 중 오류가 발생했습니다. 다시 시도해주세요."
        }]
      }];
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.destination || !formData.startDate || !formData.endDate) {
      toast.error('필수 정보를 모두 입력해주세요!');
      return;
    }

    // API 키 확인
    const apiKey = localStorage.getItem('gemini_api_key');
    if (!apiKey) {
      toast.error('먼저 Gemini API 키를 설정해주세요!');
      return;
    }

    console.log('여행 계획 생성 시작...');
    console.log('API 키 존재:', !!apiKey);
    console.log('API 키 길이:', apiKey.length);

    setIsGenerating(true);
    
    try {
      const prompt = createPrompt();
      console.log('생성된 프롬프트:', prompt);
      
      toast.info('AI가 맞춤형 여행 일정을 생성하고 있습니다...');
      
      const result = await generateTravelPlan(apiKey, prompt);
      console.log('AI 응답:', result);
      
      // JSON 파싱
      const travelPlan = parseJsonFromResponse(result);
      
      toast.success('AI 여행 일정이 성공적으로 생성되었습니다!');
      
      // 생성된 일정을 부모 컴포넌트로 전달
      if (onPlanGenerated) {
        onPlanGenerated(travelPlan);
      }
      
      console.log('파싱된 여행 일정:', travelPlan);
      
    } catch (error) {
      console.error('일정 생성 오류:', error);
      
      if (error instanceof Error) {
        const errorMessage = error.message.toLowerCase();
        
        if (errorMessage.includes('401') || errorMessage.includes('unauthorized')) {
          toast.error('API 키가 유효하지 않습니다. Gemini API 키를 다시 확인해주세요.');
        } else if (errorMessage.includes('403') || errorMessage.includes('forbidden')) {
          toast.error('API 키 권한이 없습니다. Google AI Studio에서 Gemini API가 활성화되어 있는지 확인해주세요.');
        } else if (errorMessage.includes('400') || errorMessage.includes('bad request')) {
          toast.error('요청 형식이 올바르지 않습니다. 입력 정보를 다시 확인해주세요.');
        } else if (errorMessage.includes('429') || errorMessage.includes('rate limit')) {
          toast.error('API 호출 한도를 초과했습니다. 잠시 후 다시 시도해주세요.');
        } else if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
          toast.error('네트워크 연결에 문제가 있습니다. 인터넷 연결을 확인해주세요.');
        } else if (errorMessage.includes('cors')) {
          toast.error('브라우저 보안 문제가 발생했습니다. 페이지를 새로고침 후 다시 시도해주세요.');
        } else {
          toast.error(`일정 생성 중 오류가 발생했습니다: ${error.message}`);
        }
        
        // 개발자를 위한 상세 로그
        console.group('🚨 API 호출 실패 - 디버깅 정보');
        console.log('에러 타입:', error.constructor.name);
        console.log('에러 메시지:', error.message);
        console.log('스택 트레이스:', error.stack);
        console.log('API 키 첫 10자리:', apiKey.substring(0, 10) + '...');
        console.groupEnd();
      } else {
        toast.error('일정 생성 중 알 수 없는 오류가 발생했습니다.');
        console.error('알 수 없는 에러:', error);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="w-full shadow-lg border-0 bg-white/90 backdrop-blur-sm">
      <CardHeader className="pb-6">
        <CardTitle className="flex items-center space-x-2 text-2xl">
          <Sparkles className="h-6 w-6 text-blue-500" />
          <span>AI 여행 계획 생성</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 기본 정보 */}
          <div className="space-y-2">
            <Label htmlFor="destination" className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span>목적지</span>
            </Label>
            <Input
              id="destination"
              name="destination"
              placeholder="예: 서울, 제주도, 도쿄..."
              value={formData.destination}
              onChange={handleInputChange}
              className="bg-white/50"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate" className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span>출발일</span>
              </Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleInputChange}
                className="bg-white/50"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endDate">도착일</Label>
              <Input
                id="endDate"
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleInputChange}
                className="bg-white/50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="interests" className="flex items-center space-x-2">
              <Heart className="h-4 w-4 text-gray-500" />
              <span>관심사 및 취향</span>
            </Label>
            <Textarea
              id="interests"
              name="interests"
              placeholder="예: 맛집 탐방, 문화유적 관람, 자연 경관, 쇼핑, 야경 감상..."
              value={formData.interests}
              onChange={handleInputChange}
              className="bg-white/50 min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budget">예산 (만원)</Label>
              <Input
                id="budget"
                name="budget"
                type="number"
                placeholder="예: 100"
                value={formData.budget}
                onChange={handleInputChange}
                className="bg-white/50"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="travelers">여행자 수</Label>
              <Input
                id="travelers"
                name="travelers"
                type="number"
                min="1"
                value={formData.travelers}
                onChange={handleInputChange}
                className="bg-white/50"
              />
            </div>
          </div>

          {/* 선호도 설정 */}
          <div className="space-y-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
            <h3 className="text-lg font-semibold text-green-800 flex items-center space-x-2">
              <ThumbsUp className="h-5 w-5" />
              <span>꼭 가고 싶은 곳 / 하고 싶은 일</span>
            </h3>
            
            {/* 꼭 가고 싶은 장소 */}
            <div className="space-y-2">
              <Label>꼭 방문할 장소</Label>
              <div className="flex space-x-2">
                <Input
                  placeholder="예: 경복궁, 명동..."
                  value={newMustVisit}
                  onChange={(e) => setNewMustVisit(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPreference('mustVisitPlaces', newMustVisit))}
                  className="bg-white/50"
                />
                <Button type="button" onClick={() => addPreference('mustVisitPlaces', newMustVisit)} size="sm">
                  추가
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {preferences.mustVisitPlaces.map((place, index) => (
                  <div key={index}>
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      {place}
                      <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => removePreference('mustVisitPlaces', index)} />
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* 꼭 하고 싶은 활동 */}
            <div className="space-y-2">
              <Label>꼭 하고 싶은 활동</Label>
              <div className="flex space-x-2">
                <Input
                  placeholder="예: 한복 체험, 야경 보기..."
                  value={newMustDo}
                  onChange={(e) => setNewMustDo(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPreference('mustDoActivities', newMustDo))}
                  className="bg-white/50"
                />
                <Button type="button" onClick={() => addPreference('mustDoActivities', newMustDo)} size="sm">
                  추가
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {preferences.mustDoActivities.map((activity, index) => (
                  <div key={index}>
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      {activity}
                      <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => removePreference('mustDoActivities', index)} />
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 피하고 싶은 것들 */}
          <div className="space-y-4 p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border border-red-200">
            <h3 className="text-lg font-semibold text-red-800 flex items-center space-x-2">
              <ThumbsDown className="h-5 w-5" />
              <span>피하고 싶은 곳 / 하기 싫은 일</span>
            </h3>
            
            {/* 피하고 싶은 장소 */}
            <div className="space-y-2">
              <Label>피하고 싶은 장소</Label>
              <div className="flex space-x-2">
                <Input
                  placeholder="예: 번화가, 쇼핑몰..."
                  value={newAvoidPlace}
                  onChange={(e) => setNewAvoidPlace(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPreference('avoidPlaces', newAvoidPlace))}
                  className="bg-white/50"
                />
                <Button type="button" onClick={() => addPreference('avoidPlaces', newAvoidPlace)} size="sm" variant="outline">
                  추가
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {preferences.avoidPlaces.map((place, index) => (
                  <div key={index}>
                    <Badge className="bg-red-100 text-red-800 border-red-200">
                      {place}
                      <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => removePreference('avoidPlaces', index)} />
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* 피하고 싶은 활동 */}
            <div className="space-y-2">
              <Label>피하고 싶은 활동</Label>
              <div className="flex space-x-2">
                <Input
                  placeholder="예: 등산, 극한 스포츠..."
                  value={newAvoidActivity}
                  onChange={(e) => setNewAvoidActivity(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPreference('avoidActivities', newAvoidActivity))}
                  className="bg-white/50"
                />
                <Button type="button" onClick={() => addPreference('avoidActivities', newAvoidActivity)} size="sm" variant="outline">
                  추가
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {preferences.avoidActivities.map((activity, index) => (
                  <div key={index}>
                    <Badge className="bg-red-100 text-red-800 border-red-200">
                      {activity}
                      <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => removePreference('avoidActivities', index)} />
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 제약 조건 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="space-y-2">
              <Label htmlFor="maxWalkingDistance">최대 도보 거리 (km)</Label>
              <Input
                id="maxWalkingDistance"
                name="maxWalkingDistance"
                type="number"
                min="1"
                max="20"
                value={preferences.maxWalkingDistance}
                onChange={handlePreferenceChange}
                className="bg-white/50"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="budgetPerActivity">활동당 최대 예산 (만원)</Label>
              <Input
                id="budgetPerActivity"
                name="budgetPerActivity"
                type="number"
                min="1"
                value={preferences.budgetPerActivity}
                onChange={handlePreferenceChange}
                className="bg-white/50"
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600 text-white py-6 text-lg font-semibold"
            disabled={isGenerating}
          >
            {isGenerating ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>AI가 맞춤형 일정을 생성 중...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5" />
                <span>맞춤형 AI 여행 일정 생성하기</span>
              </div>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TravelPlanForm;
