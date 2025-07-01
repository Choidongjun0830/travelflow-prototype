
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Users, Plus, Clock, MapPin, CheckCircle, Circle } from 'lucide-react';

interface ScheduleItem {
  id: number;
  time: string;
  activity: string;
  location: string;
  completed: boolean;
  assignee?: string;
}

const CollaborationBoard = () => {
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([
    {
      id: 1,
      time: '09:00',
      activity: '호텔 체크인',
      location: '명동 호텔',
      completed: false,
      assignee: '김철수'
    },
    {
      id: 2,
      time: '10:30',
      activity: '경복궁 관람',
      location: '경복궁',
      completed: false,
      assignee: '이영희'
    },
    {
      id: 3,
      time: '12:00',
      activity: '점심식사',
      location: '광장시장',
      completed: true,
      assignee: '박민수'
    }
  ]);

  const [newActivity, setNewActivity] = useState('');

  const toggleComplete = (id: number) => {
    setScheduleItems(items =>
      items.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const addActivity = () => {
    if (!newActivity.trim()) return;
    
    const newItem: ScheduleItem = {
      id: Date.now(),
      time: '미정',
      activity: newActivity,
      location: '위치 미정',
      completed: false
    };
    
    setScheduleItems([...scheduleItems, newItem]);
    setNewActivity('');
  };

  return (
    <Card className="w-full shadow-lg border-0 bg-white/90 backdrop-blur-sm mb-8">
      <CardHeader className="pb-6">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="h-6 w-6 text-purple-500" />
            <span className="text-2xl">협업 보드</span>
          </div>
          <Badge variant="secondary" className="bg-purple-100 text-purple-700">
            3명 온라인
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="mb-6">
          <div className="flex space-x-2">
            <Input
              placeholder="새 일정을 추가하세요..."
              value={newActivity}
              onChange={(e) => setNewActivity(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addActivity()}
              className="flex-1"
            />
            <Button 
              onClick={addActivity}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {scheduleItems.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                item.completed
                  ? 'bg-green-50 border-green-200'
                  : 'bg-white border-gray-200 hover:border-purple-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => toggleComplete(item.id)}
                    className="text-purple-500 hover:text-purple-700"
                  >
                    {item.completed ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <Circle className="h-5 w-5" />
                    )}
                  </button>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="font-semibold text-purple-700">{item.time}</span>
                      <span className={`${item.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                        {item.activity}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MapPin className="h-3 w-3" />
                      <span>{item.location}</span>
                    </div>
                  </div>
                </div>
                
                {item.assignee && (
                  <Badge variant="outline" className="text-xs">
                    {item.assignee}
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
          <h4 className="font-semibold text-purple-800 mb-2">협업 현황</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {scheduleItems.filter(item => item.completed).length}
              </div>
              <div className="text-purple-700">완료된 일정</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {scheduleItems.filter(item => !item.completed).length}
              </div>
              <div className="text-orange-700">진행 중인 일정</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">3</div>
              <div className="text-green-700">참여자 수</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CollaborationBoard;
