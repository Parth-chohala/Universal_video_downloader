import React from 'react';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = ({ theme, onThemeChange }) => {
  return (
    <button
      onClick={() => onThemeChange(theme === 'light' ? 'dark' : 'light')}
      className={`
        fixed top-6 right-6 z-50 p-3 rounded-2xl transition-all duration-300
        ${theme === 'light'
          ? 'bg-white/90 text-gray-800 hover:bg-white shadow-lg'
          : 'bg-gray-800/90 text-white hover:bg-gray-700 shadow-xl'
        }
        backdrop-blur-md border border-white/20 hover:scale-105 focus:outline-none focus:ring-4
        ${theme === 'light' ? 'focus:ring-blue-300' : 'focus:ring-gray-600'}
      `}
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <Moon size={24} className="transition-transform duration-300" />
      ) : (
        <Sun size={24} className="transition-transform duration-300" />
      )}
    </button>
  );
};

export default ThemeToggle;
