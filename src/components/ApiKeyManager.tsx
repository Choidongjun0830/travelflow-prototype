import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Key, Eye, EyeOff, Check, AlertTriangle, Map, TestTube } from 'lucide-react';
import { toast } from 'sonner';

const ApiKeyManager = () => {
  const [geminiKey, setGeminiKey] = useState('');
  const [mapsKey, setMapsKey] = useState('');
  const [showGeminiKey, setShowGeminiKey] = useState(false);
  const [showMapsKey, setShowMapsKey] = useState(false);
  const [isKeysSaved, setIsKeysSaved] = useState(false);
  const [isTestingGemini, setIsTestingGemini] = useState(false);

  // Gemini API 키 테스트 함수
  const testGeminiApiKey = async (apiKey: string) => {
    try {
      const response = await fetch(`/api/gemini/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: "Hello, please respond with just 'API key is working'"
            }]
          }],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 50,
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API 테스트 실패: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || 'API 응답 성공';
    } catch (error) {
      throw error;
    }
  };

  const handleTestGeminiKey = async () => {
    if (!geminiKey.trim()) {
      toast.error('먼저 Gemini API 키를 입력해주세요!');
      return;
    }

    setIsTestingGemini(true);
    
    try {
      toast.info('API 키를 테스트하고 있습니다...');
      const result = await testGeminiApiKey(geminiKey);
      toast.success('✅ Gemini API 키가 정상적으로 작동합니다!');
      console.log('API 테스트 성공:', result);
    } catch (error) {
      console.error('API 키 테스트 실패:', error);
      if (error instanceof Error) {
        const errorMessage = error.message.toLowerCase();
        if (errorMessage.includes('401') || errorMessage.includes('unauthorized')) {
          toast.error('❌ API 키가 유효하지 않습니다. 키를 다시 확인해주세요.');
        } else if (errorMessage.includes('403') || errorMessage.includes('forbidden')) {
          toast.error('❌ API 키 권한이 없습니다. Gemini API가 활성화되어 있는지 확인해주세요.');
        } else {
          toast.error(`❌ API 키 테스트 실패: ${error.message}`);
        }
      }
    } finally {
      setIsTestingGemini(false);
    }
  };

  const handleSaveKeys = () => {
    if (!geminiKey.trim() && !mapsKey.trim()) {
      toast.error('최소 하나의 API 키를 입력해주세요!');
      return;
    }

    if (geminiKey.trim()) {
      localStorage.setItem('gemini_api_key', geminiKey);
    }
    
    if (mapsKey.trim()) {
      localStorage.setItem('google_maps_api_key', mapsKey);
    }
    
    setIsKeysSaved(true);
    toast.success('API 키가 성공적으로 저장되었습니다!');
  };

  const clearKeys = () => {
    setGeminiKey('');
    setMapsKey('');
    setIsKeysSaved(false);
    localStorage.removeItem('gemini_api_key');
    localStorage.removeItem('google_maps_api_key');
    toast.success('API 키가 삭제되었습니다.');
  };

  React.useEffect(() => {
    const savedGeminiKey = localStorage.getItem('gemini_api_key');
    const savedMapsKey = localStorage.getItem('google_maps_api_key');
    
    if (savedGeminiKey) {
      setGeminiKey(savedGeminiKey);
    }
    
    if (savedMapsKey) {
      setMapsKey(savedMapsKey);
    }
    
    if (savedGeminiKey || savedMapsKey) {
      setIsKeysSaved(true);
    }
  }, []);

  const geminiSaved = geminiKey.trim() && localStorage.getItem('gemini_api_key');
  const mapsSaved = mapsKey.trim() && localStorage.getItem('google_maps_api_key');

  return (
    <Card className="w-full shadow-lg border-0 bg-white/90 backdrop-blur-sm">
      <CardHeader className="pb-6">
        <CardTitle className="flex items-center space-x-2 text-2xl">
          <Key className="h-6 w-6 text-yellow-500" />
          <span>API 키 관리</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <Alert className="mb-6 border-blue-200 bg-blue-50">
          <AlertTriangle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>Gemini API</strong>: AI 일정 생성 기능용 | <strong>Google Maps API</strong>: 실제 지도 표시 및 경로 계산용
            <br />키는 브라우저에 안전하게 저장되며 외부로 전송되지 않습니다.
          </AlertDescription>
        </Alert>

        <div className="space-y-6">
          {/* Gemini API 키 */}
          <div className="space-y-2">
            <Label htmlFor="gemini-key" className="text-base font-semibold flex items-center space-x-2">
              <span>🤖 Gemini API 키</span>
              {geminiSaved && <Check className="h-4 w-4 text-green-500" />}
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
            <div className="flex space-x-2">
              <p className="text-sm text-gray-600 flex-1">
                <a 
                  href="https://aistudio.google.com/app/apikey" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Google AI Studio
                </a>에서 무료로 발급받을 수 있습니다.
              </p>
              <Button
                onClick={handleTestGeminiKey}
                disabled={!geminiKey.trim() || isTestingGemini}
                size="sm"
                variant="outline"
                className="whitespace-nowrap"
              >
                {isTestingGemini ? (
                  <div className="flex items-center space-x-1">
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                    <span>테스트 중</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1">
                    <TestTube className="h-3 w-3" />
                    <span>키 테스트</span>
                  </div>
                )}
              </Button>
            </div>
          </div>

          {/* Google Maps API 키 */}
          <div className="space-y-2">
            <Label htmlFor="maps-key" className="text-base font-semibold flex items-center space-x-2">
              <span>🗺️ Google Maps API 키</span>
              {mapsSaved && <Check className="h-4 w-4 text-green-500" />}
            </Label>
            <div className="relative">
              <Input
                id="maps-key"
                type={showMapsKey ? 'text' : 'password'}
                placeholder="Google Cloud Console에서 발급받은 Maps API 키를 입력하세요"
                value={mapsKey}
                onChange={(e) => setMapsKey(e.target.value)}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowMapsKey(!showMapsKey)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showMapsKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-sm text-gray-600">
              <a 
                href="https://console.cloud.google.com/google/maps-apis/overview" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Google Cloud Console
              </a>에서 Maps JavaScript API를 활성화하고 키를 발급받으세요.
            </p>
          </div>

          <div className="flex space-x-3">
            <Button 
              onClick={handleSaveKeys}
              className="flex-1 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white"
              disabled={!geminiKey.trim() && !mapsKey.trim()}
            >
              <div className="flex items-center space-x-2">
                <Key className="h-4 w-4" />
                <span>API 키 저장</span>
              </div>
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

          {/* 저장 상태 표시 */}
          {(geminiSaved || mapsSaved) && (
            <div className="space-y-3">
              {geminiSaved && (
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-2 text-green-800">
                    <Check className="h-4 w-4" />
                    <span className="font-semibold">🤖 Gemini API 설정 완료</span>
                  </div>
                  <p className="text-sm text-green-700 mt-1">
                    AI 여행 일정 생성 기능을 사용할 수 있습니다.
                  </p>
                </div>
              )}
              
              {mapsSaved && (
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-2 text-blue-800">
                    <Check className="h-4 w-4" />
                    <span className="font-semibold">🗺️ Google Maps API 설정 완료</span>
                  </div>
                  <p className="text-sm text-blue-700 mt-1">
                    실제 지도 표시 및 경로 계산 기능을 사용할 수 있습니다.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiKeyManager;
