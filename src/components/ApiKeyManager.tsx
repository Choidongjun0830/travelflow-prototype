import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Key, Eye, EyeOff, Check, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

const ApiKeyManager = () => {
  const [geminiKey, setGeminiKey] = useState('');
  const [showGeminiKey, setShowGeminiKey] = useState(false);
  const [isKeysSaved, setIsKeysSaved] = useState(false);

  const handleSaveKeys = () => {
    if (!geminiKey.trim()) {
      toast.error('Gemini API 키를 입력해주세요!');
      return;
    }

    localStorage.setItem('gemini_api_key', geminiKey);
    setIsKeysSaved(true);
    toast.success('API 키가 성공적으로 저장되었습니다!');
  };

  const clearKeys = () => {
    setGeminiKey('');
    setIsKeysSaved(false);
    localStorage.removeItem('gemini_api_key');
    toast.success('API 키가 삭제되었습니다.');
  };

  React.useEffect(() => {
    const savedGeminiKey = localStorage.getItem('gemini_api_key');
    
    if (savedGeminiKey) {
      setGeminiKey(savedGeminiKey);
      setIsKeysSaved(true);
    }
  }, []);

  return (
    <Card className="w-full shadow-lg border-0 bg-white/90 backdrop-blur-sm">
      <CardHeader className="pb-6">
        <CardTitle className="flex items-center space-x-2 text-2xl">
          <Key className="h-6 w-6 text-yellow-500" />
          <span>API 키 관리</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <Alert className="mb-6 border-yellow-200 bg-yellow-50">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            AI 일정 생성 기능을 사용하려면 Gemini API 키가 필요합니다. 
            키는 브라우저에 안전하게 저장되며 외부로 전송되지 않습니다.
          </AlertDescription>
        </Alert>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="gemini-key" className="text-base font-semibold">
              Gemini API 키
            </Label>
            <div className="relative">
              <Input
                id="gemini-key"
                type={showGeminiKey ? 'text' : 'password'}
                placeholder="Google AI Studio에서 발급받은 Gemini API 키를 입력하세요"
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowGeminiKey(!showGeminiKey)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showGeminiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-sm text-gray-600">
              <a 
                href="https://aistudio.google.com/app/apikey" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Google AI Studio
              </a>에서 무료로 발급받을 수 있습니다.
            </p>
          </div>

          <div className="flex space-x-3">
            <Button 
              onClick={handleSaveKeys}
              className="flex-1 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white"
              disabled={!geminiKey.trim()}
            >
              {isKeysSaved ? (
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4" />
                  <span>키 저장됨</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Key className="h-4 w-4" />
                  <span>API 키 저장</span>
                </div>
              )}
            </Button>
            
            {isKeysSaved && (
              <Button 
                onClick={clearKeys}
                variant="outline"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                키 삭제
              </Button>
            )}
          </div>

          {isKeysSaved && (
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-2 text-green-800">
                <Check className="h-5 w-5" />
                <span className="font-semibold">API 키가 설정되었습니다!</span>
              </div>
              <p className="text-sm text-green-700 mt-1">
                이제 AI 여행 일정 생성 기능을 사용할 수 있습니다.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiKeyManager;
