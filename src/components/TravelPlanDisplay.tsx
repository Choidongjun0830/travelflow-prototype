
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, MapPin, Calendar } from 'lucide-react';

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

interface TravelPlanDisplayProps {
  plans: TravelPlan[];
}

const TravelPlanDisplay = ({ plans }: TravelPlanDisplayProps) => {
  if (!plans || plans.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">생성된 여행 일정</h2>
        <p className="text-gray-600">AI가 맞춤형으로 생성한 여행 계획입니다</p>
      </div>
      
      <div className="grid gap-6">
        {plans.map((plan, planIndex) => (
          <Card key={planIndex} className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2 text-xl">
                <Calendar className="h-5 w-5 text-blue-500" />
                <span>{plan.title}</span>
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                {plan.activities.map((activity, activityIndex) => (
                  <div 
                    key={activityIndex} 
                    className="flex items-start space-x-4 p-4 bg-gradient-to-r from-blue-50 to-orange-50 rounded-lg border border-blue-100"
                  >
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-orange-500 rounded-lg text-white font-semibold">
                        <Clock className="h-5 w-5" />
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-semibold text-blue-600">{activity.time}</span>
                        <span className="text-gray-400">•</span>
                        <h3 className="text-lg font-semibold text-gray-800">{activity.activity}</h3>
                      </div>
                      
                      <div className="flex items-center space-x-1 mb-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{activity.location}</span>
                      </div>
                      
                      <p className="text-gray-700 leading-relaxed">{activity.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TravelPlanDisplay;
