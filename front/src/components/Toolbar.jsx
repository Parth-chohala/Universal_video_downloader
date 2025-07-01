import React from 'react';
import { Youtube, Instagram, Twitter,Linkedin } from 'lucide-react';

const Toolbar = ({ selectedPlatform, onPlatformChange, theme }) => {
  const platforms = [
    { id: 'youtube', name: 'YouTube', icon: Youtube, color: 'hover:bg-red-50 hover:text-red-600' },
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'hover:bg-pink-50 hover:text-pink-600' },
    { id: 'x', name: 'X (Twitter)', icon: Twitter, color: 'hover:bg-gray-800 hover:text-white' },
    { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'hover:bg-blue-50 hover:text-blue-600' },
  ];

  const toolbarBgClass = theme === 'dark'
    ? 'bg-gray-800/90 border-gray-700/20'
    : 'bg-white/90 border-white/20';

  const getButtonClass = (platform, isSelected) => {
    if (isSelected) {
      return 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105';
    }

    if (theme === 'dark') {
      return 'text-gray-300 hover:bg-gray-700 hover:text-white';
    }

    return `text-gray-600 ${platform.color}`;
  };

  return (
    <div className="flex justify-center mb-8">
      <div className={`${toolbarBgClass} backdrop-blur-md rounded-2xl p-2 shadow-xl border transition-all duration-300`}>
        <div className="flex space-x-2">
          {platforms.map((platform) => {
            const Icon = platform.icon;
            const isSelected = selectedPlatform === platform.id;

            return (
              <button
                key={platform.id}
                onClick={() => onPlatformChange(platform.id)}
                className={`
                  flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300
                  ${getButtonClass(platform, isSelected)}
                `}
              >
                <Icon size={20} />
                <span className="hidden sm:block">{platform.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
