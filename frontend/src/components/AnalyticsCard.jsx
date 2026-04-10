import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

/**
 * ANALYTICS CARD COMPONENT
 * Displays a single metric in a styled card
 */
const AnalyticsCard = ({ 
  title, 
  value, 
  icon: Icon, 
  color = 'blue',
  subtext = '',
  isLoading = false 
}) => {
  const colorStyles = {
    blue: {
      bg: 'from-blue-500/20 to-blue-600/20',
      border: 'border-blue-400/30 hover:border-blue-400/60',
      icon: 'text-blue-400',
      text: 'text-blue-300',
    },
    green: {
      bg: 'from-green-500/20 to-green-600/20',
      border: 'border-green-400/30 hover:border-green-400/60',
      icon: 'text-green-400',
      text: 'text-green-300',
    },
    purple: {
      bg: 'from-purple-500/20 to-purple-600/20',
      border: 'border-purple-400/30 hover:border-purple-400/60',
      icon: 'text-purple-400',
      text: 'text-purple-300',
    },
    orange: {
      bg: 'from-orange-500/20 to-orange-600/20',
      border: 'border-orange-400/30 hover:border-orange-400/60',
      icon: 'text-orange-400',
      text: 'text-orange-300',
    },
    pink: {
      bg: 'from-pink-500/20 to-pink-600/20',
      border: 'border-pink-400/30 hover:border-pink-400/60',
      icon: 'text-pink-400',
      text: 'text-pink-300',
    },
    indigo: {
      bg: 'from-indigo-500/20 to-indigo-600/20',
      border: 'border-indigo-400/30 hover:border-indigo-400/60',
      icon: 'text-indigo-400',
      text: 'text-indigo-300',
    },
  };

  const style = colorStyles[color] || colorStyles.blue;

  return (
    <div className={`bg-gradient-to-br ${style.bg} border ${style.border} rounded-lg p-6 transition-all duration-300 hover:shadow-lg`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`${style.text} text-sm font-semibold uppercase tracking-wider`}>
            {title}
          </p>
          {isLoading ? (
            <div className="h-10 bg-gray-700 rounded mt-2 w-24 animate-pulse"></div>
          ) : (
            <>
              <p className="text-4xl font-bold text-white mt-2">{value}</p>
              {subtext && (
                <p className="text-gray-400 text-xs mt-1">{subtext}</p>
              )}
            </>
          )}
        </div>
        {Icon && (
          <div className={`${style.icon} opacity-50`}>
            <Icon className="w-12 h-12" />
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsCard;
