
import React, { useState } from 'react';
import Header from '../components/Header';
import TravelPlanForm from '../components/TravelPlanForm';
import TravelPlanDisplay from '../components/TravelPlanDisplay';
import MapVisualization from '../components/MapVisualization';
import CollaborationBoard from '../components/CollaborationBoard';
import ApiKeyManager from '../components/ApiKeyManager';

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

const Index = () => {
  const [generatedPlans, setGeneratedPlans] = useState<TravelPlan[]>([]);

  const handlePlanGenerated = (plans: TravelPlan[]) => {
    setGeneratedPlans(plans);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent mb-4">
              TravelFlow
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              AI로 완벽한 여행 일정을 생성하고, 팀과 함께 협업하여 최고의 여행을 계획하세요
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <TravelPlanForm onPlanGenerated={handlePlanGenerated} />
            <MapVisualization />
          </div>
          
          {generatedPlans.length > 0 && (
            <div className="mb-8">
              <TravelPlanDisplay plans={generatedPlans} />
            </div>
          )}
          
          <CollaborationBoard />
          <ApiKeyManager />
        </div>
      </main>
    </div>
  );
};

export default Index;
