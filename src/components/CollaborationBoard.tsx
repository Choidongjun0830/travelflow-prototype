import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Users, Plus, Clock, MapPin, CheckCircle, Circle, ThumbsUp, ThumbsDown, Vote, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';

interface Vote {
  userId: string;
  userName: string;
  type: 'approve' | 'reject';
}

interface ScheduleItem {
  id: number;
  time: string;
  activity: string;
  location: string;
  completed: boolean;
  assignee?: string;
  votes: Vote[];
  voteStatus: 'pending' | 'approved' | 'rejected';
}

const CollaborationBoard = () => {
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([
    {
      id: 1,
      time: '09:00',
      activity: '호텔 체크인',
      location: '명동 호텔',
      completed: false,
      assignee: '김철수',
      votes: [
        { userId: '1', userName: '김철수', type: 'approve' },
        { userId: '2', userName: '이영희', type: 'approve' }
      ],
      voteStatus: 'approved'
    },
    {
      id: 2,
      time: '10:30',
      activity: '경복궁 관람',
      location: '경복궁',
      completed: false,
      assignee: '이영희',
      votes: [
        { userId: '1', userName: '김철수', type: 'approve' },
        { userId: '2', userName: '이영희', type: 'approve' },
        { userId: '3', userName: '박민수', type: 'reject' }
      ],
      voteStatus: 'pending'
    },
    {
      id: 3,
      time: '12:00',
      activity: '점심식사',
      location: '광장시장',
      completed: true,
      assignee: '박민수',
      votes: [
        { userId: '1', userName: '김철수', type: 'approve' },
        { userId: '2', userName: '이영희', type: 'approve' },
        { userId: '3', userName: '박민수', type: 'approve' }
      ],
      voteStatus: 'approved'
    }
  ]);

  const [newActivity, setNewActivity] = useState('');
  const [currentUser] = useState({ id: '1', name: '김철수' }); // 현재 사용자 (실제로는 로그인 시스템에서 가져와야 함)

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
      completed: false,
      votes: [],
      voteStatus: 'pending'
    };
    
    setScheduleItems([...scheduleItems, newItem]);
    setNewActivity('');
    toast.success('새 일정이 추가되었습니다. 팀원들의 투표를 기다리고 있습니다.');
  };

  const vote = (itemId: number, voteType: 'approve' | 'reject') => {
    setScheduleItems(items =>
      items.map(item => {
        if (item.id === itemId) {
          // 기존 투표 제거 (사용자당 하나의 투표만 가능)
          const filteredVotes = item.votes.filter(vote => vote.userId !== currentUser.id);
          
          // 새 투표 추가
          const newVotes = [...filteredVotes, {
            userId: currentUser.id,
            userName: currentUser.name,
            type: voteType
          }];

          // 투표 상태 계산
          const approveCount = newVotes.filter(v => v.type === 'approve').length;
          const rejectCount = newVotes.filter(v => v.type === 'reject').length;
          
          let newVoteStatus: 'pending' | 'approved' | 'rejected' = 'pending';
          if (approveCount >= 2) { // 과반수 찬성 시 승인
            newVoteStatus = 'approved';
          } else if (rejectCount >= 2) { // 과반수 반대 시 거부
            newVoteStatus = 'rejected';
          }

          return {
            ...item,
            votes: newVotes,
            voteStatus: newVoteStatus
          };
        }
        return item;
      })
    );

    toast.success(`일정에 ${voteType === 'approve' ? '찬성' : '반대'} 투표를 했습니다.`);
  };

  const getVotePercentage = (item: ScheduleItem, type: 'approve' | 'reject') => {
    const totalVotes = item.votes.length;
    if (totalVotes === 0) return 0;
    const typeVotes = item.votes.filter(vote => vote.type === type).length;
    return Math.round((typeVotes / totalVotes) * 100);
  };

  const getUserVote = (item: ScheduleItem) => {
    return item.votes.find(vote => vote.userId === currentUser.id);
  };

  const getVoteStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getVoteStatusText = (status: string) => {
    switch (status) {
      case 'approved': return '승인됨';
      case 'rejected': return '거부됨';
      case 'pending': return '투표 중';
      default: return '미정';
    }
  };

  return (
    <Card className="w-full shadow-lg border-0 bg-white/90 backdrop-blur-sm mb-8">
      <CardHeader className="pb-6">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="h-6 w-6 text-purple-500" />
            <span className="text-2xl">협업 보드</span>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className="bg-purple-100 text-purple-700">
              3명 온라인
            </Badge>
            <Badge className="bg-blue-100 text-blue-700">
              <Vote className="h-3 w-3 mr-1" />
              투표 시스템
            </Badge>
          </div>
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
          {scheduleItems.map((item) => {
            const userVote = getUserVote(item);
            const approvePercentage = getVotePercentage(item, 'approve');
            const rejectPercentage = getVotePercentage(item, 'reject');
            
            return (
              <div
                key={item.id}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  item.completed
                    ? 'bg-green-50 border-green-200'
                    : item.voteStatus === 'approved'
                    ? 'bg-blue-50 border-blue-200'
                    : item.voteStatus === 'rejected'
                    ? 'bg-red-50 border-red-200'
                    : 'bg-white border-gray-200 hover:border-purple-300'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3 flex-1">
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
                      
                      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                        <MapPin className="h-3 w-3" />
                        <span>{item.location}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {item.assignee && (
                      <Badge className="text-xs">
                        {item.assignee}
                      </Badge>
                    )}
                    <Badge className={`text-xs ${getVoteStatusColor(item.voteStatus)}`}>
                      {getVoteStatusText(item.voteStatus)}
                    </Badge>
                  </div>
                </div>

                {/* 투표 섹션 */}
                {!item.completed && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <BarChart3 className="h-4 w-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">투표 현황</span>
                        <span className="text-xs text-gray-500">({item.votes.length}명 투표)</span>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant={userVote?.type === 'approve' ? 'default' : 'outline'}
                          onClick={() => vote(item.id, 'approve')}
                          className="flex items-center space-x-1"
                        >
                          <ThumbsUp className="h-3 w-3" />
                          <span>찬성</span>
                        </Button>
                        <Button
                          size="sm"
                          variant={userVote?.type === 'reject' ? 'destructive' : 'outline'}
                          onClick={() => vote(item.id, 'reject')}
                          className="flex items-center space-x-1"
                        >
                          <ThumbsDown className="h-3 w-3" />
                          <span>반대</span>
                        </Button>
                      </div>
                    </div>

                    {/* 투표 결과 프로그레스 바 */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">
                          찬성 {item.votes.filter(v => v.type === 'approve').length}명 / 
                          반대 {item.votes.filter(v => v.type === 'reject').length}명
                          {item.votes.length > 0 && ` (총 ${item.votes.length}명 투표)`}
                        </span>
                        <span className={`font-semibold ${
                          approvePercentage >= 50 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          찬성 {approvePercentage}%
                        </span>
                      </div>
                      <Progress 
                        value={approvePercentage} 
                        className={`h-3 ${
                          approvePercentage >= 70 ? '[&>div]:bg-green-500' : 
                          approvePercentage >= 50 ? '[&>div]:bg-yellow-500' : 
                          '[&>div]:bg-red-500'
                        }`}
                      />
                    </div>

                    {/* 투표한 사람들 */}
                    {item.votes.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="flex flex-wrap gap-2">
                          {item.votes.map((vote, index) => (
                            <Badge 
                              key={index} 
                              className={vote.type === 'approve' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                            >
                              {vote.userName} {vote.type === 'approve' ? '👍' : '👎'}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
          <h4 className="font-semibold text-purple-800 mb-2">협업 현황</h4>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {scheduleItems.filter(item => item.completed).length}
              </div>
              <div className="text-purple-700">완료된 일정</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {scheduleItems.filter(item => item.voteStatus === 'approved' && !item.completed).length}
              </div>
              <div className="text-blue-700">승인된 일정</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {scheduleItems.filter(item => item.voteStatus === 'pending').length}
              </div>
              <div className="text-yellow-700">투표 중인 일정</div>
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
