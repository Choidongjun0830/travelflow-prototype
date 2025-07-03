import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X, Save, MapPin, Calendar, DollarSign, Users, Star } from 'lucide-react';
import { UserRecommendation, TravelPlan, Activity } from '@/types/userRecommendations';
import { addUserRecommendation } from '@/data/userRecommendations';
import { toast } from 'sonner';

interface AddRecommendationModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (recommendation: UserRecommendation) => void;
}

const AddRecommendationModal = ({ open, onClose, onAdd }: AddRecommendationModalProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    author: '',
    location: '',
    duration: 1,
    budget: '',
    season: '',
    travelStyle: '',
    rating: 5,
    photos: [] as string[],
    tips: [] as string[],
    tags: [] as string[]
  });

  const [plans, setPlans] = useState<TravelPlan[]>([
    {
      id: 'day-1',
      title: '1일차',
      day: 1,
      activities: []
    }
  ]);

  const [newTag, setNewTag] = useState('');
  const [newTip, setNewTip] = useState('');
  const [newPhoto, setNewPhoto] = useState('');

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      author: '',
      location: '',
      duration: 1,
      budget: '',
      season: '',
      travelStyle: '',
      rating: 5,
      photos: [],
      tips: [],
      tags: []
    });
    setPlans([{
      id: 'day-1',
      title: '1일차',
      day: 1,
      activities: []
    }]);
    setNewTag('');
    setNewTip('');
    setNewPhoto('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const addDay = () => {
    const newDay = plans.length + 1;
    setPlans([...plans, {
      id: `day-${newDay}`,
      title: `${newDay}일차`,
      day: newDay,
      activities: []
    }]);
    setFormData({ ...formData, duration: newDay });
  };

  const removeDay = (dayId: string) => {
    if (plans.length <= 1) return;
    
    const filteredPlans = plans.filter(plan => plan.id !== dayId);
    const reindexedPlans = filteredPlans.map((plan, index) => ({
      ...plan,
      day: index + 1,
      title: `${index + 1}일차`,
      id: `day-${index + 1}`
    }));
    
    setPlans(reindexedPlans);
    setFormData({ ...formData, duration: reindexedPlans.length });
  };

  const addActivity = (planId: string) => {
    setPlans(plans.map(plan => {
      if (plan.id === planId) {
        const newActivity: Activity = {
          id: `act-${Date.now()}`,
          time: '',
          activity: '',
          location: '',
          description: '',
          duration: 60
        };
        return {
          ...plan,
          activities: [...plan.activities, newActivity]
        };
      }
      return plan;
    }));
  };

  const updateActivity = (planId: string, activityId: string, field: keyof Activity, value: any) => {
    setPlans(plans.map(plan => {
      if (plan.id === planId) {
        return {
          ...plan,
          activities: plan.activities.map(activity => 
            activity.id === activityId 
              ? { ...activity, [field]: value }
              : activity
          )
        };
      }
      return plan;
    }));
  };

  const removeActivity = (planId: string, activityId: string) => {
    setPlans(plans.map(plan => {
      if (plan.id === planId) {
        return {
          ...plan,
          activities: plan.activities.filter(activity => activity.id !== activityId)
        };
      }
      return plan;
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()]
      });
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag)
    });
  };

  const addTip = () => {
    if (newTip.trim()) {
      setFormData({
        ...formData,
        tips: [...formData.tips, newTip.trim()]
      });
      setNewTip('');
    }
  };

  const removeTip = (index: number) => {
    setFormData({
      ...formData,
      tips: formData.tips.filter((_, i) => i !== index)
    });
  };

  const addPhoto = () => {
    if (newPhoto.trim()) {
      setFormData({
        ...formData,
        photos: [...formData.photos, newPhoto.trim()]
      });
      setNewPhoto('');
    }
  };

  const removePhoto = (index: number) => {
    setFormData({
      ...formData,
      photos: formData.photos.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async () => {
    // 유효성 검사
    if (!formData.title.trim()) {
      toast.error('제목을 입력해주세요.');
      return;
    }
    if (!formData.description.trim()) {
      toast.error('설명을 입력해주세요.');
      return;
    }
    if (!formData.author.trim()) {
      toast.error('작성자명을 입력해주세요.');
      return;
    }
    if (!formData.location.trim()) {
      toast.error('여행 지역을 입력해주세요.');
      return;
    }
    if (!formData.budget) {
      toast.error('예산대를 선택해주세요.');
      return;
    }
    if (!formData.season) {
      toast.error('여행 계절을 선택해주세요.');
      return;
    }
    if (!formData.travelStyle) {
      toast.error('여행 스타일을 선택해주세요.');
      return;
    }

    // 최소 하나의 활동이 있는지 확인
    const hasActivities = plans.some(plan => plan.activities.length > 0);
    if (!hasActivities) {
      toast.error('최소 하나의 여행 일정을 추가해주세요.');
      return;
    }

    try {
      const newRecommendation = addUserRecommendation({
        title: formData.title,
        description: formData.description,
        author: formData.author,
        authorAvatar: '👤', // 기본 아바타
        location: formData.location,
        duration: formData.duration,
        tags: formData.tags,
        rating: formData.rating,
        budget: formData.budget,
        season: formData.season,
        travelStyle: formData.travelStyle,
        plans: plans.filter(plan => plan.activities.length > 0), // 활동이 있는 일정만 저장
        photos: formData.photos,
        tips: formData.tips,
        isRecommended: false
      });

      onAdd(newRecommendation);
      handleClose();
      toast.success('여행 일정이 성공적으로 등록되었습니다!');
    } catch (error) {
      console.error('일정 등록 실패:', error);
      toast.error('일정 등록에 실패했습니다.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>새 여행 일정 공유하기</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* 기본 정보 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">기본 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">제목 *</Label>
                  <Input
                    id="title"
                    placeholder="예: 부산 3박 4일 맛집 여행"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="author">작성자명 *</Label>
                  <Input
                    id="author"
                    placeholder="닉네임을 입력하세요"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">여행 소개 *</Label>
                <Textarea
                  id="description"
                  placeholder="이 여행의 특별한 점이나 추천 이유를 자세히 적어주세요"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="location">여행 지역 *</Label>
                  <Input
                    id="location"
                    placeholder="예: 부산"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="budget">예산대 *</Label>
                  <Select value={formData.budget} onValueChange={(value) => setFormData({ ...formData, budget: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30만원 이하">30만원 이하</SelectItem>
                      <SelectItem value="50만원 이하">50만원 이하</SelectItem>
                      <SelectItem value="100만원 이하">100만원 이하</SelectItem>
                      <SelectItem value="100만원 이상">100만원 이상</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="season">계절 *</Label>
                  <Select value={formData.season} onValueChange={(value) => setFormData({ ...formData, season: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="봄">봄</SelectItem>
                      <SelectItem value="여름">여름</SelectItem>
                      <SelectItem value="가을">가을</SelectItem>
                      <SelectItem value="겨울">겨울</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="travelStyle">여행 스타일 *</Label>
                  <Select value={formData.travelStyle} onValueChange={(value) => setFormData({ ...formData, travelStyle: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="혼자">혼자</SelectItem>
                      <SelectItem value="커플">커플</SelectItem>
                      <SelectItem value="가족">가족</SelectItem>
                      <SelectItem value="친구">친구</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>평점</Label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star
                      key={star}
                      className={`h-6 w-6 cursor-pointer ${
                        star <= formData.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                      }`}
                      onClick={() => setFormData({ ...formData, rating: star })}
                    />
                  ))}
                  <span className="text-sm text-gray-600">({formData.rating}/5)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 여행 일정 */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">여행 일정</CardTitle>
                <Button onClick={addDay} size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  일차 추가
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {plans.map((plan) => (
                <div key={plan.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold">{plan.title}</h4>
                    {plans.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeDay(plan.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="space-y-3">
                    {plan.activities.map((activity) => (
                      <div key={activity.id} className="border rounded p-3 bg-gray-50">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                          <Input
                            placeholder="시간 (예: 14:00)"
                            value={activity.time}
                            onChange={(e) => updateActivity(plan.id, activity.id, 'time', e.target.value)}
                          />
                          <Input
                            placeholder="활동명"
                            value={activity.activity}
                            onChange={(e) => updateActivity(plan.id, activity.id, 'activity', e.target.value)}
                          />
                        </div>
                        <Input
                          placeholder="장소 (정확한 주소 권장)"
                          value={activity.location}
                          onChange={(e) => updateActivity(plan.id, activity.id, 'location', e.target.value)}
                          className="mb-2"
                        />
                        <div className="flex space-x-2">
                          <Textarea
                            placeholder="설명"
                            value={activity.description}
                            onChange={(e) => updateActivity(plan.id, activity.id, 'description', e.target.value)}
                            rows={2}
                            className="flex-1"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeActivity(plan.id, activity.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}

                    <Button
                      variant="outline"
                      onClick={() => addActivity(plan.id)}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      활동 추가
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* 태그, 사진, 팁 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 태그 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">태그</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex space-x-2">
                  <Input
                    placeholder="태그 입력"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  />
                  <Button onClick={addTag} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {formData.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                      <X
                        className="h-3 w-3 ml-1 cursor-pointer"
                        onClick={() => removeTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 사진 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">사진 (이모지)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex space-x-2">
                  <Input
                    placeholder="🏖️ 이모지 입력"
                    value={newPhoto}
                    onChange={(e) => setNewPhoto(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addPhoto()}
                  />
                  <Button onClick={addPhoto} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {formData.photos.map((photo, index) => (
                    <div key={index} className="relative">
                      <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center text-lg">
                        {photo}
                      </div>
                      <X
                        className="absolute -top-1 -right-1 h-3 w-3 cursor-pointer bg-red-500 text-white rounded-full"
                        onClick={() => removePhoto(index)}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 여행 팁 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">여행 팁</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex space-x-2">
                  <Input
                    placeholder="팁 입력"
                    value={newTip}
                    onChange={(e) => setNewTip(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTip()}
                  />
                  <Button onClick={addTip} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-1">
                  {formData.tips.map((tip, index) => (
                    <div key={index} className="flex items-start space-x-2 text-sm">
                      <span className="text-blue-500">•</span>
                      <span className="flex-1">{tip}</span>
                      <X
                        className="h-3 w-3 cursor-pointer text-gray-400 hover:text-red-500"
                        onClick={() => removeTip(index)}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 제출 버튼 */}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={handleClose}>
              취소
            </Button>
            <Button onClick={handleSubmit}>
              <Save className="h-4 w-4 mr-1" />
              등록하기
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddRecommendationModal; 