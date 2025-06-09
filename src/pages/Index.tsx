
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { TrendingUp, PieChart, BarChart3, Calendar } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="flex justify-center items-center space-x-3 mb-8">
            <TrendingUp className="h-12 w-12 text-blue-600" />
            <h1 className="text-5xl font-bold text-gray-900">ExpenseTracker</h1>
          </div>
          
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Take control of your finances with our comprehensive expense tracking solution. 
            Monitor your spending patterns, analyze trends, and make informed financial decisions.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <PieChart className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Visual Insights</h3>
              <p className="text-gray-600">Beautiful charts and graphs to visualize your spending patterns</p>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <BarChart3 className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Detailed Analytics</h3>
              <p className="text-gray-600">Deep dive into your expenses with comprehensive analytics</p>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <Calendar className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Multi-Period Views</h3>
              <p className="text-gray-600">Track expenses daily, weekly, and monthly</p>
            </div>
          </div>

          <div className="space-x-4">
            <Link to="/login">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
