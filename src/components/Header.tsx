import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Plane, Calendar, Users, MapPin, Star } from 'lucide-react';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div 
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <div className="p-2 bg-gradient-to-r from-blue-500 to-orange-500 rounded-lg">
              <Plane className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-800">TravelFlow</span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => navigate('/')}
              className={`flex items-center space-x-2 transition-colors ${
                isActive('/') 
                  ? 'text-blue-600 font-semibold' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              <MapPin className="h-4 w-4" />
              <span>홈</span>
            </button>
            
            <button
              onClick={() => navigate('/travel-plan')}
              className={`flex items-center space-x-2 transition-colors ${
                isActive('/travel-plan') 
                  ? 'text-blue-600 font-semibold' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              <Calendar className="h-4 w-4" />
              <span>여행 계획</span>
            </button>

            <button
              onClick={() => navigate('/user-recommendations')}
              className={`flex items-center space-x-2 transition-colors ${
                isActive('/user-recommendations') 
                  ? 'text-blue-600 font-semibold' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              <Star className="h-4 w-4" />
              <span>추천 일정</span>
            </button>
            
            <button
              onClick={() => navigate('/collaboration')}
              className={`flex items-center space-x-2 transition-colors ${
                isActive('/collaboration') 
                  ? 'text-blue-600 font-semibold' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              <Users className="h-4 w-4" />
              <span>협업 보드</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
