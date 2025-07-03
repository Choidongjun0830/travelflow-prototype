import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  MessageCircle, 
  Send, 
  UserPlus, 
  Eye,
  Clock,
  X,
  Share2,
  Link,
  Vote,
  Plus,
  Check,
  BarChart3,
  Calendar,
  Crown,
  Edit,
  Zap,
  Heart,
  MessageSquare
} from 'lucide-react';
import { toast } from 'sonner';

interface Comment {
  id: string;
  author: string;
  authorAvatar: string;
  content: string;
  timestamp: string;
  dayNumber?: number; // 특정 일차에 대한 댓글
  activityId?: string; // 특정 활동에 대한 댓글
}

interface VoteOption {
  id: string;
  text: string;
  votes: string[]; // 투표한 사용자 ID 배열
}

interface Poll {
  id: string;
  title: string;
  description?: string;
  creator: string;
  creatorAvatar: string;
  options: VoteOption[];
  isMultipleChoice: boolean;
  isAnonymous: boolean;
  endTime?: string;
  isActive: boolean;
  createdAt: string;
}

interface Collaborator {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline';
  role: 'owner' | 'editor' | 'viewer';
  lastSeen?: string;
}

interface CollaborationPanelProps {
  planId: string;
  isCollaborationMode: boolean;
  onToggleCollaboration: () => void;
}

const CollaborationPanel = ({ 
  planId, 
  isCollaborationMode, 
  onToggleCollaboration 
}: CollaborationPanelProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [newComment, setNewComment] = useState('');
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showCreatePollModal, setShowCreatePollModal] = useState(false);
  const [activeTab, setActiveTab] = useState('comments');
  
  // 투표 생성 폼 상태
  const [newPoll, setNewPoll] = useState({
    title: '',
    description: '',
    options: ['', ''],
    isMultipleChoice: false,
    isAnonymous: false,
    hasEndTime: false,
    endTime: ''
  });

  const [currentUser] = useState({
    id: 'current-user',
    name: '나',
    avatar: '👤'
  });

  // 샘플 데이터 로드
  useEffect(() => {
    if (isCollaborationMode) {
      // 샘플 협업자들
      setCollaborators([
        {
          id: 'user-1',
          name: '김여행',
          avatar: '👩‍💼',
          status: 'online',
          role: 'owner',
        },
        {
          id: 'user-2',
          name: '박모험',
          avatar: '🧑‍💻',
          status: 'online',
          role: 'editor',
        },
        {
          id: 'user-3',
          name: '이탐험',
          avatar: '👨‍🎓',
          status: 'offline',
          role: 'viewer',
          lastSeen: '10분 전'
        }
      ]);

      // 샘플 댓글들
      setComments([
        {
          id: 'comment-1',
          author: '김여행',
          authorAvatar: '👩‍💼',
          content: '1일차 일정 정말 좋네요! 해운대 일출도 보면 어떨까요?',
          timestamp: '2024-01-20T10:30:00Z',
          dayNumber: 1
        },
        {
          id: 'comment-2',
          author: '박모험',
          authorAvatar: '🧑‍💻',
          content: '광안리 야경 시간을 좀 더 늦춰도 될 것 같아요. 8시 정도?',
          timestamp: '2024-01-20T11:15:00Z',
          dayNumber: 1
        },
        {
          id: 'comment-3',
          author: '이탐험',
          authorAvatar: '👨‍🎓',
          content: '전체적으로 일정이 알차네요! 혹시 예산도 공유해주실 수 있나요?',
          timestamp: '2024-01-20T14:20:00Z'
        }
      ]);

      // 샘플 투표들
      setPolls([
        {
          id: 'poll-1',
          title: '2일차 점심 식당 선택',
          description: '감천문화마을 근처에서 점심을 먹을 곳을 정해봐요!',
          creator: '김여행',
          creatorAvatar: '👩‍💼',
          options: [
            { id: 'opt1', text: '돼지국밥 맛집', votes: ['user-1', 'user-2'] },
            { id: 'opt2', text: '해물칼국수', votes: ['user-3'] },
            { id: 'opt3', text: '부산 밀면', votes: ['current-user'] },
            { id: 'opt4', text: '현지 카페에서 간단히', votes: [] }
          ],
          isMultipleChoice: false,
          isAnonymous: false,
          isActive: true,
          createdAt: '2024-01-20T09:00:00Z'
        },
        {
          id: 'poll-2',
          title: '숙소 위치 투표',
          description: '어느 지역에 숙소를 잡을까요?',
          creator: '박모험',
          creatorAvatar: '🧑‍💻',
          options: [
            { id: 'opt5', text: '해운대 해변가', votes: ['user-1', 'user-2', 'current-user'] },
            { id: 'opt6', text: '서면 중심가', votes: ['user-3'] },
            { id: 'opt7', text: '남포동 근처', votes: [] }
          ],
          isMultipleChoice: false,
          isAnonymous: false,
          isActive: false,
          createdAt: '2024-01-19T15:30:00Z'
        }
      ]);
    }
  }, [isCollaborationMode]);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) return '방금 전';
    if (diffMinutes < 60) return `${diffMinutes}분 전`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}시간 전`;
    return `${Math.floor(diffMinutes / 1440)}일 전`;
  };

  const handleSendComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: `comment-${Date.now()}`,
      author: currentUser.name,
      authorAvatar: currentUser.avatar,
      content: newComment.trim(),
      timestamp: new Date().toISOString()
    };

    setComments([comment, ...comments]);
    setNewComment('');
    toast.success('댓글이 추가되었습니다.');
  };

  const handleCreatePoll = () => {
    if (!newPoll.title.trim()) {
      toast.error('투표 제목을 입력해주세요.');
      return;
    }

    const validOptions = newPoll.options.filter(opt => opt.trim() !== '');
    if (validOptions.length < 2) {
      toast.error('최소 2개의 선택지를 입력해주세요.');
      return;
    }

    const poll: Poll = {
      id: `poll-${Date.now()}`,
      title: newPoll.title,
      description: newPoll.description,
      creator: currentUser.name,
      creatorAvatar: currentUser.avatar,
      options: validOptions.map((text, index) => ({
        id: `opt-${Date.now()}-${index}`,
        text,
        votes: []
      })),
      isMultipleChoice: newPoll.isMultipleChoice,
      isAnonymous: newPoll.isAnonymous,
      endTime: newPoll.hasEndTime ? newPoll.endTime : undefined,
      isActive: true,
      createdAt: new Date().toISOString()
    };

    setPolls([poll, ...polls]);
    setNewPoll({
      title: '',
      description: '',
      options: ['', ''],
      isMultipleChoice: false,
      isAnonymous: false,
      hasEndTime: false,
      endTime: ''
    });
    setShowCreatePollModal(false);
    toast.success('투표가 생성되었습니다!');
  };

  const handleVote = (pollId: string, optionId: string) => {
    setPolls(polls.map(poll => {
      if (poll.id === pollId) {
        const isAlreadyVoted = poll.options.some(opt => opt.votes.includes(currentUser.id));
        
        if (poll.isMultipleChoice) {
          // 복수 선택: 해당 옵션의 투표를 토글
          return {
            ...poll,
            options: poll.options.map(opt => {
              if (opt.id === optionId) {
                const hasVoted = opt.votes.includes(currentUser.id);
                return {
                  ...opt,
                  votes: hasVoted 
                    ? opt.votes.filter(id => id !== currentUser.id)
                    : [...opt.votes, currentUser.id]
                };
              }
              return opt;
            })
          };
        } else {
          // 단일 선택: 기존 투표 제거 후 새 옵션에 투표
          return {
            ...poll,
            options: poll.options.map(opt => ({
              ...opt,
              votes: opt.id === optionId 
                ? [...opt.votes.filter(id => id !== currentUser.id), currentUser.id]
                : opt.votes.filter(id => id !== currentUser.id)
            }))
          };
        }
      }
      return poll;
    }));
    
    toast.success('투표가 완료되었습니다!');
  };

  const handleClosePoll = (pollId: string) => {
    setPolls(polls.map(poll => 
      poll.id === pollId ? { ...poll, isActive: false } : poll
    ));
    toast.success('투표가 종료되었습니다.');
  };

  const getTotalVotes = (poll: Poll) => {
    return poll.options.reduce((total, option) => total + option.votes.length, 0);
  };

  const getVotePercentage = (option: VoteOption, totalVotes: number) => {
    if (totalVotes === 0) return 0;
    return Math.round((option.votes.length / totalVotes) * 100);
  };

  const hasUserVoted = (poll: Poll) => {
    return poll.options.some(opt => opt.votes.includes(currentUser.id));
  };

  const addPollOption = () => {
    setNewPoll({
      ...newPoll,
      options: [...newPoll.options, '']
    });
  };

  const removePollOption = (index: number) => {
    if (newPoll.options.length > 2) {
      setNewPoll({
        ...newPoll,
        options: newPoll.options.filter((_, i) => i !== index)
      });
    }
  };

  const updatePollOption = (index: number, value: string) => {
    setNewPoll({
      ...newPoll,
      options: newPoll.options.map((opt, i) => i === index ? value : opt)
    });
  };

  const handleInviteCollaborator = () => {
    if (!inviteEmail.trim()) {
      toast.error('이메일을 입력해주세요.');
      return;
    }

    // 실제로는 서버에 초대 요청을 보내야 함
    toast.success(`${inviteEmail}에게 초대장을 보냈습니다.`);
    setInviteEmail('');
    setShowInviteModal(false);
  };

  const generateShareLink = () => {
    const shareUrl = `${window.location.origin}/travel-plan?shared=${planId}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success('공유 링크가 클립보드에 복사되었습니다!');
  };

  if (!isCollaborationMode) {
    return (
      <div className="h-full flex items-center justify-center">
        <Card className="border-none shadow-lg bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900">
          <CardContent className="flex flex-col items-center justify-center text-center p-12">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-blue-200 rounded-full animate-pulse opacity-50"></div>
              <Users className="h-20 w-20 text-blue-600 relative z-10" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-3">
              협업 모드
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-sm leading-relaxed">
              친구들과 함께 여행 계획을 세워보세요.<br/>
              실시간으로 의견을 나누고 함께 편집할 수 있습니다.
            </p>
            <Button 
              onClick={onToggleCollaboration}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Zap className="h-5 w-5 mr-2" />
              협업 시작하기
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* 협업자 목록 */}
      <Card className="border-none shadow-lg bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center text-gray-800 dark:text-gray-200">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <span>협업자</span>
                <Badge variant="secondary" className="ml-2">
                  {collaborators.length + 1}명
                </Badge>
              </div>
            </CardTitle>
            <div className="flex space-x-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={generateShareLink}
                className="hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors"
              >
                <Link className="h-4 w-4 mr-2" />
                링크 복사
              </Button>
              <Button 
                size="sm"
                onClick={() => setShowInviteModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-md"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                초대하기
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            {/* 현재 사용자 */}
            <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-xl border border-blue-200 dark:border-blue-800">
              <div className="relative">
                <Avatar className="h-10 w-10 border-2 border-blue-300">
                  <AvatarFallback className="bg-blue-100 text-blue-700 text-lg">
                    {currentUser.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-gray-800 dark:text-gray-200">{currentUser.name}</span>
                  <Badge className="bg-blue-600 text-white text-xs px-2 py-1">
                    <Crown className="h-3 w-3 mr-1" />
                    방장
                  </Badge>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">지금 활동 중</span>
              </div>
              <div className="flex items-center space-x-1 text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">온라인</span>
              </div>
            </div>

            {/* 다른 협업자들 */}
            {collaborators.map((collaborator) => (
              <div 
                key={collaborator.id} 
                className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200"
              >
                <div className="relative">
                  <Avatar className="h-10 w-10 border-2 border-gray-200 dark:border-gray-600">
                    <AvatarFallback className="bg-gray-100 dark:bg-gray-700 text-lg">
                      {collaborator.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 border-2 border-white rounded-full ${
                    collaborator.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                  }`}></div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-800 dark:text-gray-200">{collaborator.name}</span>
                    <Badge 
                      variant={collaborator.role === 'owner' ? 'default' : 'outline'} 
                      className="text-xs"
                    >
                      {collaborator.role === 'owner' && <Crown className="h-3 w-3 mr-1" />}
                      {collaborator.role === 'editor' && <Edit className="h-3 w-3 mr-1" />}
                      {collaborator.role === 'viewer' && <Eye className="h-3 w-3 mr-1" />}
                      {collaborator.role === 'owner' ? '방장' : collaborator.role === 'editor' ? '편집자' : '관람자'}
                    </Badge>
                  </div>
                  <span className="text-sm text-gray-500">
                    {collaborator.status === 'online' ? '지금 활동 중' : `마지막 접속: ${collaborator.lastSeen}`}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className={`w-2 h-2 rounded-full ${
                    collaborator.status === 'online' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                  }`}></div>
                  <span className={`text-sm font-medium ${
                    collaborator.status === 'online' ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {collaborator.status === 'online' ? '온라인' : '오프라인'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 댓글 및 투표 탭 */}
      <Card className="flex-1 flex flex-col border-none shadow-lg">
        <CardHeader className="pb-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
              <TabsTrigger 
                value="comments" 
                className="flex items-center justify-center rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-200"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                댓글
                <Badge variant="secondary" className="ml-2 text-xs">
                  {comments.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger 
                value="polls" 
                className="flex items-center justify-center rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-200"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                투표
                <Badge variant="secondary" className="ml-2 text-xs">
                  {polls.length}
                </Badge>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col pt-2">
          <Tabs value={activeTab} className="flex-1 flex flex-col">
            {/* 댓글 탭 */}
            <TabsContent value="comments" className="flex-1 flex flex-col mt-0">
              {/* 댓글 입력 */}
              <div className="mb-4">
                <div className="flex space-x-3">
                  <Avatar className="h-9 w-9 border-2 border-blue-200">
                    <AvatarFallback className="bg-blue-100 text-blue-700">
                      {currentUser.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <Textarea
                      placeholder="의견이나 제안사항을 남겨주세요..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      rows={2}
                      className="border-2 border-gray-200 dark:border-gray-700 focus:border-blue-400 rounded-xl resize-none"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendComment();
                        }
                      }}
                    />
                    <div className="flex justify-end">
                      <Button 
                        onClick={handleSendComment}
                        disabled={!newComment.trim()}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white shadow-md disabled:opacity-50 transition-all duration-200"
                      >
                        <Send className="h-4 w-4 mr-1" />
                        댓글 작성
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 댓글 목록 */}
              <div className="flex-1 space-y-3 overflow-y-auto">
                {comments.length === 0 ? (
                  <div className="text-center text-gray-500 mt-8">
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl max-w-sm mx-auto">
                      <MessageCircle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                      <p className="text-base font-medium mb-1">아직 댓글이 없습니다</p>
                      <p className="text-sm text-gray-400">첫 번째 의견을 남겨보세요!</p>
                    </div>
                  </div>
                ) : (
                  comments.map((comment) => (
                    <div 
                      key={comment.id} 
                      className="bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-750 border border-gray-200 dark:border-gray-700 rounded-xl p-3 shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-start space-x-3">
                        <Avatar className="h-8 w-8 border-2 border-gray-200">
                          <AvatarFallback className="bg-gray-100 dark:bg-gray-700 text-sm">
                            {comment.authorAvatar}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-gray-800 dark:text-gray-200 text-sm">{comment.author}</span>
                            {comment.dayNumber && (
                              <Badge className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5">
                                {comment.dayNumber}일차
                              </Badge>
                            )}
                            <span className="text-xs text-gray-500 flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {formatTime(comment.timestamp)}
                            </span>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">{comment.content}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>

            {/* 투표 탭 */}
            <TabsContent value="polls" className="flex-1 flex flex-col mt-0">
              {/* 투표 생성 버튼 */}
              <div className="mb-4">
                <Button 
                  onClick={() => setShowCreatePollModal(true)}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 h-10 rounded-xl"
                >
                  <Vote className="h-4 w-4 mr-2" />
                  새 투표 만들기
                </Button>
              </div>

              {/* 투표 목록 */}
              <div className="flex-1 space-y-4 overflow-y-auto">
                {polls.length === 0 ? (
                  <div className="text-center text-gray-500 mt-8">
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl max-w-sm mx-auto">
                      <Vote className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                      <p className="text-base font-medium mb-1">아직 투표가 없습니다</p>
                      <p className="text-sm text-gray-400">첫 번째 투표를 만들어보세요!</p>
                    </div>
                  </div>
                ) : (
                  polls.map((poll) => {
                    const totalVotes = getTotalVotes(poll);
                    const userVoted = hasUserVoted(poll);
                    
                    return (
                      <div 
                        key={poll.id} 
                        className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-750 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        {/* 투표 헤더 */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="font-bold text-base text-gray-800 dark:text-gray-200">{poll.title}</h4>
                              {poll.isActive ? (
                                <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-2 py-1 rounded-full text-xs">
                                  <div className="w-1.5 h-1.5 bg-white rounded-full mr-1 animate-pulse"></div>
                                  진행 중
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="text-gray-500 px-2 py-1 rounded-full text-xs">
                                  종료됨
                                </Badge>
                              )}
                            </div>
                            {poll.description && (
                              <p className="text-gray-600 dark:text-gray-400 mb-2 leading-relaxed text-sm">{poll.description}</p>
                            )}
                            <div className="flex items-center space-x-2 text-xs text-gray-500">
                              <div className="flex items-center space-x-1">
                                <Avatar className="h-5 w-5">
                                  <AvatarFallback className="text-xs">{poll.creatorAvatar}</AvatarFallback>
                                </Avatar>
                                <span className="font-medium">{poll.creator}</span>
                              </div>
                              <span>•</span>
                              <span>{formatTime(poll.createdAt)}</span>
                              <span>•</span>
                              <span className="flex items-center">
                                <BarChart3 className="h-3 w-3 mr-1" />
                                {totalVotes}표
                              </span>
                            </div>
                          </div>
                          
                          {poll.creator === currentUser.name && poll.isActive && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleClosePoll(poll.id)}
                              className="text-gray-400 hover:text-red-500 hover:bg-red-50 h-8 w-8 p-0"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>

                        {/* 투표 옵션들 */}
                        <div className="space-y-2">
                          {poll.options.map((option) => {
                            const percentage = getVotePercentage(option, totalVotes);
                            const hasVoted = option.votes.includes(currentUser.id);
                            
                            return (
                              <div key={option.id} className="space-y-1">
                                <div 
                                  className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                                    poll.isActive 
                                      ? hasVoted 
                                        ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-300 shadow-md' 
                                        : 'hover:bg-gray-50 hover:border-gray-300 border-gray-200'
                                      : 'bg-gray-50 border-gray-200'
                                  }`}
                                  onClick={() => poll.isActive && handleVote(poll.id, option.id)}
                                >
                                  <div className="flex items-center space-x-2 flex-1">
                                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                                      hasVoted 
                                        ? 'bg-blue-500 border-blue-500 scale-110' 
                                        : 'border-gray-300 hover:border-blue-400'
                                    }`}>
                                      {hasVoted && <Check className="h-2.5 w-2.5 text-white" />}
                                    </div>
                                    <span className={`font-medium text-sm ${hasVoted ? 'text-blue-700' : 'text-gray-700'}`}>
                                      {option.text}
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <span className="text-sm text-gray-500 font-medium">
                                      {option.votes.length}표
                                    </span>
                                    {!poll.isActive && (
                                      <span className="text-sm text-gray-500 font-bold">
                                        {percentage}%
                                      </span>
                                    )}
                                  </div>
                                </div>
                                
                                {/* 결과 진행바 */}
                                {(!poll.isActive || userVoted) && (
                                  <div className="px-3">
                                    <Progress 
                                      value={percentage} 
                                      className="h-1.5 bg-gray-200" 
                                    />
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {/* 투표 정보 */}
                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <div className="flex items-center space-x-3">
                              <span className="flex items-center">
                                {poll.isMultipleChoice ? (
                                  <>
                                    <Check className="h-3 w-3 mr-1" />
                                    복수 선택
                                  </>
                                ) : (
                                  <>
                                    <div className="w-3 h-3 rounded-full border mr-1"></div>
                                    단일 선택
                                  </>
                                )}
                              </span>
                              {poll.isAnonymous && (
                                <span className="flex items-center">
                                  <Eye className="h-3 w-3 mr-1" />
                                  익명 투표
                                </span>
                              )}
                            </div>
                            {poll.endTime && (
                              <span className="flex items-center bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-lg">
                                <Calendar className="h-3 w-3 mr-1" />
                                마감: {new Date(poll.endTime).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </TabsContent>
          </Tabs>

          {/* 협업 모드 종료 */}
          <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
            <Button 
              variant="outline" 
              onClick={onToggleCollaboration}
              className="w-full h-10 border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all duration-200"
            >
              <X className="h-4 w-4 mr-2" />
              협업 모드 종료
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 투표 생성 모달 */}
      {showCreatePollModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl border-none">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center justify-between text-xl">
                <div className="flex items-center">
                  <Vote className="h-6 w-6 mr-3" />
                  새 투표 만들기
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowCreatePollModal(false)}
                  className="text-white hover:bg-white hover:bg-opacity-20"
                >
                  <X className="h-5 w-5" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              {/* 제목 */}
              <div>
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                  투표 제목 *
                </label>
                <Input
                  placeholder="투표 제목을 입력하세요"
                  value={newPoll.title}
                  onChange={(e) => setNewPoll({ ...newPoll, title: e.target.value })}
                  className="border-2 border-gray-200 focus:border-purple-400 rounded-xl h-12"
                />
              </div>

              {/* 설명 */}
              <div>
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                  설명 (선택사항)
                </label>
                <Textarea
                  placeholder="투표에 대한 설명을 입력하세요"
                  value={newPoll.description}
                  onChange={(e) => setNewPoll({ ...newPoll, description: e.target.value })}
                  rows={3}
                  className="border-2 border-gray-200 focus:border-purple-400 rounded-xl resize-none"
                />
              </div>

              {/* 선택지 */}
              <div>
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 block">
                  선택지 *
                </label>
                <div className="space-y-3">
                  {newPoll.options.map((option, index) => (
                    <div key={index} className="flex space-x-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-sm font-medium text-gray-600">
                        {index + 1}
                      </div>
                      <Input
                        placeholder={`선택지 ${index + 1}`}
                        value={option}
                        onChange={(e) => updatePollOption(index, e.target.value)}
                        className="flex-1 border-2 border-gray-200 focus:border-purple-400 rounded-xl"
                      />
                      {newPoll.options.length > 2 && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removePollOption(index)}
                          className="w-8 h-8 p-0 text-red-500 hover:bg-red-50"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={addPollOption}
                    className="w-full h-10 border-2 border-dashed border-gray-300 hover:border-purple-400 text-gray-600 hover:text-purple-600 rounded-xl"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    선택지 추가
                  </Button>
                </div>
              </div>

              {/* 옵션들 */}
              <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">투표 설정</h4>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newPoll.isMultipleChoice}
                    onChange={(e) => setNewPoll({ ...newPoll, isMultipleChoice: e.target.checked })}
                    className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">복수 선택 허용</span>
                </label>
                
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newPoll.isAnonymous}
                    onChange={(e) => setNewPoll({ ...newPoll, isAnonymous: e.target.checked })}
                    className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">익명 투표</span>
                </label>
                
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newPoll.hasEndTime}
                    onChange={(e) => setNewPoll({ ...newPoll, hasEndTime: e.target.checked })}
                    className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">마감 시간 설정</span>
                </label>
              </div>

              {/* 마감 시간 */}
              {newPoll.hasEndTime && (
                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                    마감 시간
                  </label>
                  <Input
                    type="datetime-local"
                    value={newPoll.endTime}
                    onChange={(e) => setNewPoll({ ...newPoll, endTime: e.target.value })}
                    className="border-2 border-gray-200 focus:border-purple-400 rounded-xl h-12"
                    min={new Date().toISOString().slice(0, 16)}
                  />
                </div>
              )}

              {/* 버튼들 */}
              <div className="flex space-x-3 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setShowCreatePollModal(false)}
                  className="flex-1 h-12 border-2 rounded-xl"
                >
                  취소
                </Button>
                <Button 
                  onClick={handleCreatePoll}
                  className="flex-1 h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl shadow-lg"
                >
                  <Vote className="h-4 w-4 mr-2" />
                  투표 만들기
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 초대 모달 */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
          <Card className="w-96 shadow-2xl border-none">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center justify-between text-xl">
                <div className="flex items-center">
                  <UserPlus className="h-6 w-6 mr-3" />
                  협업자 초대
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowInviteModal(false)}
                  className="text-white hover:bg-white hover:bg-opacity-20"
                >
                  <X className="h-5 w-5" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div>
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                  이메일 주소
                </label>
                <Input
                  type="email"
                  placeholder="friend@example.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="border-2 border-gray-200 focus:border-blue-400 rounded-xl h-12"
                />
              </div>
              <div className="flex space-x-3">
                <Button 
                  variant="outline" 
                  onClick={() => setShowInviteModal(false)}
                  className="flex-1 h-12 border-2 rounded-xl"
                >
                  취소
                </Button>
                <Button 
                  onClick={handleInviteCollaborator}
                  className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-lg"
                >
                  <Send className="h-4 w-4 mr-2" />
                  초대하기
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CollaborationPanel; 