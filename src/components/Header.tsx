
import React from 'react';
import { Plane, Users, MapPin } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-orange-500 rounded-lg">
              <Plane className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-800">TravelFlow</span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#plan" className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
              <MapPin className="h-4 w-4" />
              <span>여행 계획</span>
            </a>
            <a href="#collaborate" className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
              <Users className="h-4 w-4" />
              <span>협업 보드</span>
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
