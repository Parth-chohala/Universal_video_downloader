import React, { useState } from 'react';
import { Download } from 'lucide-react';
// import { Platform, Theme } from './types';
import Toolbar from './components/Toolbar';
import BackgroundLogo from './components/BackgroundLogo';
import YouTubeDownload from './components/downloads/YouTubeDownload';
import InstagramDownload from './components/downloads/InstagramDownloader';
import ThemeToggle from './components/ThemeToggle';
import XDownload from './components/downloads/XDownloader';

function App() {
  const [selectedPlatform, setSelectedPlatform] = useState('youtube');
  const [theme, setTheme] = useState('light');

  const getBgGradient = () => {
    const baseGradients = {
      youtube: theme === 'dark'
        ? 'bg-gradient-to-br from-gray-900 via-red-900/20 to-gray-900'
        : 'bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50',
      instagram: theme === 'dark'
        ? 'bg-gradient-to-br from-gray-900 via-pink-900/20 to-gray-900'
        : 'bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50',
      x: theme === 'dark'
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
        : 'bg-gradient-to-br from-gray-50 via-slate-50 to-blue-50',
    };

    return baseGradients[selectedPlatform];
  };

  const textClass = theme === 'dark' ? 'text-white' : 'text-gray-800';
  const subtextClass = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';
  const footerTextClass = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';

  const renderDownloadSection = () => {
    if (selectedPlatform === 'youtube') {
      return <YouTubeDownload theme={theme} />;
    } else if (selectedPlatform === 'instagram') {
      return <InstagramDownload platform={selectedPlatform} theme={theme} />;
    } else if (selectedPlatform === 'x') {
      return <XDownload platform={selectedPlatform} theme={theme} />;
    }
  };

  return (
    <div id='#app' className={`min-h-screen transition-all duration-700 ${getBgGradient()} relative overflow-hidden`}>
      <BackgroundLogo platform={selectedPlatform} theme={theme} />
      <ThemeToggle theme={theme} onThemeChange={setTheme} />

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl">
              <Download className="text-white" size={32} />
            </div>
            <h1 className={`text-4xl md:text-5xl font-bold bg-gradient-to-r ${theme === 'dark' ? 'from-white to-gray-300' : 'from-gray-800 to-gray-600'} bg-clip-text text-transparent`}>
              Video Downloader
            </h1>
          </div>
          <p className={`text-xl ${subtextClass} max-w-2xl mx-auto`}>
            Download videos from YouTube, Instagram, and X (Twitter) with ease.
            High-quality downloads in multiple formats.
          </p>
        </div>

        {/* Platform Toolbar */}
        <Toolbar
          selectedPlatform={selectedPlatform}
          onPlatformChange={setSelectedPlatform}
          theme={theme}
        />

        {/* Download Section */}
        <div className="max-w-6xl mx-auto">
          {renderDownloadSection()}
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className={`text-sm ${footerTextClass}`}>
            © 2025 Video Downloader Tool. Made with ❤️ for seamless video downloads.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;