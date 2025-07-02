import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Send, Bot, User, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Activity {
  id: string;
  time: string;
  activity: string;
  location: string;
  description: string;
  duration?: number;
}

interface TravelPlan {
  id: string;
  title: string;
  day: number;
  activities: Activity[];
}

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface AIPlanChatProps {
  plans: TravelPlan[];
  onPlansUpdate: (newPlans: TravelPlan[]) => void;
}

const AIPlanChat = ({ plans, onPlansUpdate }: AIPlanChatProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const createAIPrompt = (userMessage: string) => {
    const currentPlansJson = JSON.stringify(plans, null, 2);
    
    return `
현재 여행 계획:
${currentPlansJson}

사용자 요청: "${userMessage}"

위의 현재 여행 계획을 기반으로 사용자의 요청을 반영하여 계획을 수정해주세요.

다음 규칙을 따라주세요:
1. 사용자 요청을 분석하여 적절한 수정사항을 적용
2. 기존 계획의 구조와 형식을 유지
3. 응답은 다음 형식으로만 제공:

RESPONSE_START
{수정된 계획에 대한 간단한 설명}
JSON_START
[수정된 전체 여행 계획 JSON]
JSON_END
RESPONSE_END

예시:
RESPONSE_START
첫째 날에 맛집 2곳을 추가하고 일정 시간을 조정했습니다.
JSON_START
[
  {
    "id": "plan-0",
    "title": "1일차 - 도착 및 맛집 탐방",
    "day": 1,
    "activities": [...]
  }
]
JSON_END
RESPONSE_END

중요: 반드시 위 형식을 정확히 따라주세요.
`;
  };

  const parseAIResponse = (response: string) => {
    try {
      // RESPONSE_START와 RESPONSE_END 사이의 내용 추출
      const responseMatch = response.match(/RESPONSE_START\s*([\s\S]*?)\s*RESPONSE_END/);
      if (!responseMatch) {
        throw new Error('응답 형식이 올바르지 않습니다.');
      }

      const responseContent = responseMatch[1];
      
      // JSON_START와 JSON_END 사이의 JSON 추출
      const jsonMatch = responseContent.match(/JSON_START\s*([\s\S]*?)\s*JSON_END/);
      if (!jsonMatch) {
        throw new Error('JSON 데이터를 찾을 수 없습니다.');
      }

      // 설명 부분 추출 (JSON_START 이전 부분)
      const descriptionMatch = responseContent.match(/^([\s\S]*?)\s*JSON_START/);
      const description = descriptionMatch ? descriptionMatch[1].trim() : 'AI가 계획을 수정했습니다.';

      // JSON 파싱
      const jsonText = jsonMatch[1].trim();
      const updatedPlans = JSON.parse(jsonText);

      return {
        description,
        plans: updatedPlans
      };
    } catch (error) {
      console.error('AI 응답 파싱 오류:', error);
      throw new Error('AI 응답을 처리하는 중 오류가 발생했습니다.');
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const apiKey = localStorage.getItem('gemini_api_key');
    if (!apiKey) {
      toast.error('Gemini API 키가 필요합니다.');
      return;
    }

    if (plans.length === 0) {
      toast.error('먼저 여행 계획을 생성해주세요.');
      return;
    }

    // 사용자 메시지 추가
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const prompt = createAIPrompt(inputMessage);
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
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

      if (!response.ok) {
        throw new Error(`API 호출 실패: ${response.status}`);
      }

      const data = await response.json();
      const aiResponseText = data.candidates[0].content.parts[0].text;

      // AI 응답 파싱
      const { description, plans: updatedPlans } = parseAIResponse(aiResponseText);

      // AI 메시지 추가
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: description,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);

      // 계획 업데이트
      onPlansUpdate(updatedPlans);
      toast.success('AI가 여행 계획을 업데이트했습니다!');

    } catch (error) {
      console.error('AI 채팅 오류:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: '죄송합니다. 요청을 처리하는 중 오류가 발생했습니다. 다시 시도해주세요.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      toast.error('AI 응답 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickSuggestions = [
    "첫째 날 일정을 더 여유롭게 만들어줘",
    "맛집을 더 추가해줘", 
    "쇼핑 시간을 늘려줘",
    "문화 관광지를 더 넣어줘",
    "이동 시간을 줄여줘"
  ];

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MessageCircle className="h-5 w-5 text-purple-500" />
          <span>AI와 계획 발전시키기</span>
          <Badge className="bg-purple-100 text-purple-700">
            베타
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {/* 메시지 영역 */}
        <div className="h-64 overflow-y-auto mb-4 p-3 bg-gray-50 rounded-lg">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 mt-16">
              <Bot className="h-12 w-12 mx-auto mb-2 text-gray-400" />
              <p>AI에게 여행 계획 개선 요청을 해보세요!</p>
              <p className="text-sm mt-1">예: "더 많은 맛집을 추가해줘"</p>
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-white text-gray-800 border border-gray-200'
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {message.type === 'ai' && <Bot className="h-4 w-4 mt-1 text-purple-500" />}
                      {message.type === 'user' && <User className="h-4 w-4 mt-1" />}
                      <div className="flex-1">
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white text-gray-800 border border-gray-200 p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin text-purple-500" />
                      <span className="text-sm">AI가 생각 중...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* 빠른 제안 */}
        {messages.length === 0 && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">빠른 제안:</p>
            <div className="flex flex-wrap gap-2">
              {quickSuggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setInputMessage(suggestion)}
                  className="text-xs"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* 입력 영역 */}
        <div className="flex space-x-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="AI에게 계획 개선 요청을 해보세요..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button 
            onClick={sendMessage}
            disabled={isLoading || !inputMessage.trim()}
            className="bg-purple-500 hover:bg-purple-600"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>

        <p className="text-xs text-gray-500 mt-2">
          💡 팁: "맛집 추가", "시간 조정", "장소 변경" 등 구체적으로 요청하면 더 좋은 결과를 얻을 수 있어요
        </p>
      </CardContent>
    </Card>
  );
};

export default AIPlanChat; 