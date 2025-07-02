
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import CollaborationBoard from '../components/CollaborationBoard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Users, Link2, UserPlus } from 'lucide-react';
import { toast } from 'sonner';

interface BoardMember {
  id: string;
  name: string;
  avatar?: string;
  role: 'owner' | 'editor' | 'viewer';
  joinedAt: string;
}

const Collaboration = () => {
  const navigate = useNavigate();
  const [boardId, setBoardId] = useState<string>('');
  const [members, setMembers] = useState<BoardMember[]>([
    {
      id: '1',
      name: '김철수',
      role: 'owner',
      joinedAt: '2024-01-01'
    },
    {
      id: '2', 
      name: '이영희',
      role: 'editor',
      joinedAt: '2024-01-02'
    },
    {
      id: '3',
      name: '박민수',
      role: 'editor', 
      joinedAt: '2024-01-03'
    }
  ]);
  const [inviteEmail, setInviteEmail] = useState('');

  useEffect(() => {
    // 현재 보드 ID 생성 또는 불러오기
    const currentBoardId = localStorage.getItem('collaboration_board_id') || generateBoardId();
    setBoardId(currentBoardId);
    localStorage.setItem('collaboration_board_id', currentBoardId);
  }, []);

  const generateBoardId = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  const getShareableLink = () => {
    return `${window.location.origin}/collaboration?board=${boardId}`;
  };

  const copyShareLink = async () => {
    const shareLink = getShareableLink();
    try {
      await navigator.clipboard.writeText(shareLink);
      toast.success('공유 링크가 클립보드에 복사되었습니다!');
    } catch (error) {
      toast.error('링크 복사에 실패했습니다.');
    }
  };

  const inviteMember = () => {
    if (!inviteEmail.trim()) {
      toast.error('이메일을 입력해주세요.');
      return;
    }

    if (!inviteEmail.includes('@')) {
      toast.error('올바른 이메일 형식을 입력해주세요.');
      return;
    }

    // 실제로는 백엔드 API 호출
    const newMember: BoardMember = {
      id: Date.now().toString(),
      name: inviteEmail.split('@')[0],
      role: 'editor',
      joinedAt: new Date().toISOString().split('T')[0]
    };

    setMembers([...members, newMember]);
    setInviteEmail('');
    toast.success(`${inviteEmail}에게 초대장을 보냈습니다!`);
  };

  const changeMemberRole = (memberId: string, newRole: BoardMember['role']) => {
    setMembers(members.map(member => 
      member.id === memberId ? { ...member, role: newRole } : member
    ));
    toast.success('멤버 권한이 변경되었습니다.');
  };

  const removeMember = (memberId: string) => {
    setMembers(members.filter(member => member.id !== memberId));
    toast.success('멤버가 제거되었습니다.');
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner': return 'bg-purple-100 text-purple-800';
      case 'editor': return 'bg-blue-100 text-blue-800';
      case 'viewer': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'owner': return '소유자';
      case 'editor': return '편집자';
      case 'viewer': return '뷰어';
      default: return '뷰어';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => navigate('/')}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>홈으로</span>
              </Button>
              <h1 className="text-3xl font-bold text-gray-800">협업 보드</h1>
            </div>
            
            <Button onClick={copyShareLink} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
              <Link2 className="h-4 w-4 mr-2" />
              링크 공유
            </Button>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2">
              <CollaborationBoard />
            </div>
            
            <div className="space-y-6">
              {/* 멤버 관리 */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-purple-500" />
                    <span>멤버 관리</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="이메일 주소로 초대"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && inviteMember()}
                    />
                    <Button onClick={inviteMember} size="sm">
                      <UserPlus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    {members.map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                            {member.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium text-sm">{member.name}</div>
                            <div className="text-xs text-gray-500">
                              {new Date(member.joinedAt).toLocaleDateString()} 참여
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <select
                            value={member.role}
                            onChange={(e) => changeMemberRole(member.id, e.target.value as BoardMember['role'])}
                            className="text-xs px-2 py-1 rounded border"
                            disabled={member.role === 'owner'}
                          >
                            <option value="owner">소유자</option>
                            <option value="editor">편집자</option>
                            <option value="viewer">뷰어</option>
                          </select>
                          
                          {member.role !== 'owner' && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeMember(member.id)}
                              className="text-red-500 hover:bg-red-50"
                            >
                              제거
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* 보드 정보 */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>보드 정보</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">보드 ID</label>
                    <div className="text-sm font-mono bg-gray-100 p-2 rounded mt-1">
                      {boardId}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-600">공유 링크</label>
                    <div className="text-sm bg-gray-100 p-2 rounded mt-1 break-all">
                      {getShareableLink()}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-600">{members.length}</div>
                      <div className="text-xs text-gray-600">총 멤버</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-pink-600">
                        {members.filter(m => m.role === 'editor').length}
                      </div>
                      <div className="text-xs text-gray-600">편집자</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 권한 안내 */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-sm">권한 안내</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-xs">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded text-xs ${getRoleColor('owner')}`}>
                      소유자
                    </span>
                    <span className="text-gray-600">모든 권한</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded text-xs ${getRoleColor('editor')}`}>
                      편집자
                    </span>
                    <span className="text-gray-600">일정 추가/수정/삭제</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded text-xs ${getRoleColor('viewer')}`}>
                      뷰어
                    </span>
                    <span className="text-gray-600">보기만 가능</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Collaboration;
