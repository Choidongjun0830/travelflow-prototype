import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, MapPin, Calendar, Edit, Trash2, Plus, GripVertical } from 'lucide-react';
import { toast } from 'sonner';

interface Activity {
  id: string;
  time: string;
  activity: string;
  location: string;
  description: string;
  duration?: number; // 예상 소요시간(분)
}

interface TravelPlan {
  id: string;
  title: string;
  day: number;
  activities: Activity[];
}

interface EditableTravelPlanProps {
  plans: TravelPlan[];
  onPlansChange: (plans: TravelPlan[]) => void;
  onLocationExtract: (locations: Array<{name: string, address: string}>) => void;
}

const EditableTravelPlan = ({ plans, onPlansChange, onLocationExtract }: EditableTravelPlanProps) => {
  const [editingActivity, setEditingActivity] = useState<string | null>(null);
  const [newActivity, setNewActivity] = useState<Partial<Activity>>({});
  const [activeTab, setActiveTab] = useState('day-1');

  const updateActivity = (planId: string, activityId: string, updates: Partial<Activity>) => {
    const updatedPlans = plans.map(plan => {
      if (plan.id === planId) {
        return {
          ...plan,
          activities: plan.activities.map(activity =>
            activity.id === activityId ? { ...activity, ...updates } : activity
          )
        };
      }
      return plan;
    });
    
    onPlansChange(updatedPlans);
    toast.success('일정이 수정되었습니다.');
  };

  const deleteActivity = (planId: string, activityId: string) => {
    const updatedPlans = plans.map(plan => {
      if (plan.id === planId) {
        return {
          ...plan,
          activities: plan.activities.filter(activity => activity.id !== activityId)
        };
      }
      return plan;
    });
    
    onPlansChange(updatedPlans);
    toast.success('일정이 삭제되었습니다.');
  };

  const addActivity = (planId: string) => {
    if (!newActivity.activity || !newActivity.location) {
      toast.error('활동명과 장소를 입력해주세요.');
      return;
    }

    const activity: Activity = {
      id: Date.now().toString(),
      time: newActivity.time || '미정',
      activity: newActivity.activity,
      location: newActivity.location,
      description: newActivity.description || '',
      duration: newActivity.duration || 60
    };

    const updatedPlans = plans.map(plan => {
      if (plan.id === planId) {
        return {
          ...plan,
          activities: [...plan.activities, activity]
        };
      }
      return plan;
    });
    
    onPlansChange(updatedPlans);
    setNewActivity({});
    toast.success('새 일정이 추가되었습니다.');
  };

  const extractLocations = () => {
    const locations = plans.flatMap(plan => 
      plan.activities.map(activity => ({
        name: activity.activity,
        address: activity.location
      }))
    );
    
    onLocationExtract(locations);
    toast.success('지도에 장소들이 표시됩니다.');
  };

  const moveActivity = (planId: string, activityId: string, direction: 'up' | 'down') => {
    const updatedPlans = plans.map(plan => {
      if (plan.id === planId) {
        const activities = [...plan.activities];
        const index = activities.findIndex(a => a.id === activityId);
        
        if (direction === 'up' && index > 0) {
          [activities[index], activities[index - 1]] = [activities[index - 1], activities[index]];
        } else if (direction === 'down' && index < activities.length - 1) {
          [activities[index], activities[index + 1]] = [activities[index + 1], activities[index]];
        }
        
        return { ...plan, activities };
      }
      return plan;
    });
    
    onPlansChange(updatedPlans);
  };

  const calculateDayDuration = (activities: Activity[]) => {
    return activities.reduce((total, activity) => total + (activity.duration || 60), 0);
  };

  const renderPlanContent = (plan: TravelPlan) => (
    <Card className="shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-blue-500" />
            <span>{plan.title}</span>
          </CardTitle>
          <Badge>
            총 {Math.floor(calculateDayDuration(plan.activities) / 60)}시간 {calculateDayDuration(plan.activities) % 60}분
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {plan.activities.map((activity, index) => (
          <div key={activity.id} className="border rounded-lg p-4 bg-gradient-to-r from-blue-50 to-orange-50">
            {editingActivity === activity.id ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    placeholder="시간"
                    defaultValue={activity.time}
                    onChange={(e) => updateActivity(plan.id, activity.id, { time: e.target.value })}
                  />
                  <Input
                    placeholder="예상 소요시간(분)"
                    type="number"
                    defaultValue={activity.duration || 60}
                    onChange={(e) => updateActivity(plan.id, activity.id, { duration: parseInt(e.target.value) || 60 })}
                  />
                </div>
                <Input
                  placeholder="활동명"
                  defaultValue={activity.activity}
                  onChange={(e) => updateActivity(plan.id, activity.id, { activity: e.target.value })}
                />
                <Input
                  placeholder="장소"
                  defaultValue={activity.location}
                  onChange={(e) => updateActivity(plan.id, activity.id, { location: e.target.value })}
                />
                <Textarea
                  placeholder="설명"
                  defaultValue={activity.description}
                  onChange={(e) => updateActivity(plan.id, activity.id, { description: e.target.value })}
                />
                <Button onClick={() => setEditingActivity(null)} size="sm">
                  완료
                </Button>
              </div>
            ) : (
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="flex flex-col items-center space-y-1">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-orange-500 rounded-lg text-white font-semibold flex items-center justify-center text-sm">
                      {index + 1}
                    </div>
                    <GripVertical className="h-4 w-4 text-gray-400" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-semibold text-blue-600">{activity.time}</span>
                      {activity.duration && (
                        <Badge className="text-xs">
                          {activity.duration}분
                        </Badge>
                      )}
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">{activity.activity}</h3>
                    
                    <div className="flex items-center space-x-1 mb-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{activity.location}</span>
                    </div>
                    
                    <p className="text-gray-700 text-sm">{activity.description}</p>
                  </div>
                </div>
                
                <div className="flex space-x-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => moveActivity(plan.id, activity.id, 'up')}
                    disabled={index === 0}
                  >
                    ↑
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => moveActivity(plan.id, activity.id, 'down')}
                    disabled={index === plan.activities.length - 1}
                  >
                    ↓
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditingActivity(activity.id)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteActivity(plan.id, activity.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
        
        {/* 새 일정 추가 */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
          <div className="grid grid-cols-2 gap-3 mb-3">
            <Input
              placeholder="시간 (예: 14:00)"
              value={newActivity.time || ''}
              onChange={(e) => setNewActivity({...newActivity, time: e.target.value})}
            />
            <Input
              placeholder="소요시간(분)"
              type="number"
              value={newActivity.duration || ''}
              onChange={(e) => setNewActivity({...newActivity, duration: parseInt(e.target.value)})}
            />
          </div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <Input
              placeholder="활동명"
              value={newActivity.activity || ''}
              onChange={(e) => setNewActivity({...newActivity, activity: e.target.value})}
            />
            <Input
              placeholder="장소"
              value={newActivity.location || ''}
              onChange={(e) => setNewActivity({...newActivity, location: e.target.value})}
            />
          </div>
          <Textarea
            placeholder="설명"
            value={newActivity.description || ''}
            onChange={(e) => setNewActivity({...newActivity, description: e.target.value})}
            className="mb-3"
          />
          <Button onClick={() => addActivity(plan.id)} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            일정 추가
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  if (!plans || plans.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="text-center py-12">
          <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">여행 일정이 없습니다</h3>
          <p className="text-gray-500">AI로 여행 일정을 생성해보세요!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">여행 일정 편집</h2>
        <Button onClick={extractLocations} variant="outline">
          <MapPin className="h-4 w-4 mr-2" />
          지도에서 보기
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className={`w-full flex justify-start gap-2 bg-gray-100 p-2 rounded-lg overflow-x-auto overflow-y-hidden h-[60px]`}>
          {plans.map((plan) => (
            <TabsTrigger 
              key={plan.id} 
              value={`day-${plan.day}`}
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm px-6 py-4 rounded-md transition-all whitespace-nowrap flex-shrink-0 h-[44px]"
            >
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span className="font-medium">{plan.day}일차</span>
                <Badge className="text-xs bg-blue-100 text-blue-700">
                  {plan.activities.length}개
                </Badge>
              </div>
            </TabsTrigger>
          ))}
        </TabsList>

        {plans.map((plan) => (
          <TabsContent key={plan.id} value={`day-${plan.day}`} className="mt-6">
            {renderPlanContent(plan)}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default EditableTravelPlan;
