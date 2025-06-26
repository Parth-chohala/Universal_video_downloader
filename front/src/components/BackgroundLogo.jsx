import React from 'react';
import { Youtube, Instagram, Twitter } from 'lucide-react';

const BackgroundLogo = ({ platform, theme }) => {
  const getLogoConfig = () => {
    const baseOpacity = theme === 'dark' ? '15' : '10';

    switch (platform) {
      case 'youtube':
        return {
          Icon: Youtube,
          color: theme === 'dark' ? `text-red-400/${baseOpacity}` : `text-red-500/${baseOpacity}`,
          size: 400
        };
      case 'instagram':
        return {
          Icon: Instagram,
          color: theme === 'dark' ? `text-pink-400/${baseOpacity}` : `text-pink-500/${baseOpacity}`,
          size: 350
        };
      case 'x':
        return {
          Icon: Twitter,
          color: theme === 'dark' ? `text-gray-400/${baseOpacity}` : `text-gray-800/${baseOpacity}`,
          size: 300
        };
      default:
        return {
          Icon: Youtube,
          color: theme === 'dark' ? `text-red-400/${baseOpacity}` : `text-red-500/${baseOpacity}`,
          size: 400
        };
    }
  };

  const { Icon, color, size } = getLogoConfig();

  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
      <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2 rotate-12">
        <Icon size={size * 0.8} className={`${color} transition-all duration-700`} />
      </div>
      <div className="absolute bottom-1/4 right-1/4 transform translate-x-1/2 translate-y-1/2 -rotate-12">
        <Icon size={size * 0.6} className={`${color} transition-all duration-700`} />
      </div>
      <div className="absolute top-1/2 right-1/3 transform translate-x-1/2 -translate-y-1/2 rotate-45">
        <Icon size={size * 0.4} className={`${color} transition-all duration-700`} />
      </div>
    </div>
  );
};

export default BackgroundLogo;
