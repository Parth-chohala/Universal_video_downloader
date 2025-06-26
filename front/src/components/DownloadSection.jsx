import React, { useState } from 'react';
import { Download, Search, AlertCircle } from 'lucide-react';
import VideoPreview from './VideoPreview';
import axios from 'axios';

const DownloadSection = ({ platform, theme }) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [videoData, setVideoData] = useState(null);
  const [error, setError] = useState(null);

  const fetchInfo = async () => {
    console.log("Fetching video info for URL:", url.trim());
    try {
      const res = await axios.post("http://localhost:5000/get-info", { url: url.trim() });
      console.log("Video info:", res.data);
      setVideoData(res.data);
    } catch (err) {
      alert("Error fetching video info");
    }
  };

  const platformConfig = {
    youtube: {
      placeholder: 'Enter YouTube video URL (e.g., https://youtube.com/watch?v=...)',
      bgColor: theme === 'dark'
        ? 'bg-gradient-to-br from-red-900/30 to-red-800/30'
        : 'bg-gradient-to-br from-red-50 to-red-100',
    },
    instagram: {
      placeholder: 'Enter Instagram video URL (e.g., https://instagram.com/p/...)',
      bgColor: theme === 'dark'
        ? 'bg-gradient-to-br from-pink-900/30 to-purple-900/30'
        : 'bg-gradient-to-br from-pink-50 to-purple-100',
    },
    x: {
      placeholder: 'Enter X (Twitter) video URL (e.g., https://x.com/user/status/...)',
      bgColor: theme === 'dark'
        ? 'bg-gradient-to-br from-gray-900/30 to-gray-800/30'
        : 'bg-gradient-to-br from-gray-50 to-gray-100',
    },
  };

  const getDummyData = () => {
    const dummyData = {
      youtube: {
        id: 'dQw4w9WgXcQ',
        title: 'Rick Astley - Never Gonna Give You Up (Official Video)',
        thumbnail: 'https://images.pexels.com/photos/3756766/pexels-photo-3756766.jpeg?auto=compress&cs=tinysrgb&w=400',
        duration: '3:33',
        available: true,
        formats: {
          videoFormats: [
            { quality: '2160', format: 'MP4', size: '1.2GB', available: true },
            { quality: '1440', format: 'MP4', size: '800MB', available: true },
            { quality: '1080', format: 'MP4', size: '450MB', available: true },
            { quality: '720', format: 'MP4', size: '250MB', available: true },
            { quality: '480', format: 'MP4', size: '150MB', available: true },
            { quality: '360', format: 'MP4', size: '100MB', available: true },
            { quality: '240', format: 'MP4', size: '60MB', available: true },
            { quality: '144', format: 'MP4', size: '30MB', available: false },
          ],
          audioFormats: [
            { quality: 'high', bitrate: '320kbps', format: 'MP3', available: true },
            { quality: 'low', bitrate: '128kbps', format: 'MP3', available: true },
          ],
        },
      },
      instagram: {
        id: 'B1234567890',
        title: 'Amazing sunset timelapse from the mountains',
        thumbnail: 'https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg?auto=compress&cs=tinysrgb&w=400',
        duration: '1:24',
        available: true,
        formats: { video: true, audio: true },
      },
      x: {
        id: '1234567890123456789',
        title: 'Breaking: Major tech announcement revealed',
        thumbnail: 'https://images.pexels.com/photos/355948/pexels-photo-355948.jpeg?auto=compress&cs=tinysrgb&w=400',
        duration: '0:45',
        available: true,
        formats: { video: true, audio: true },
      },
    };

    return dummyData[platform];
  };

  const handleDownload = async () => {
    if (!url.trim()) return;

    setLoading(true);
    setError(null);
    setVideoData(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const isSuccess = Math.random() > 0.3;

      if (isSuccess) {
        setVideoData(getDummyData());
      } else {
        setError('Video not found or unavailable for download');
      }
    } catch (err) {
      setError('An error occurred while fetching video data');
    } finally {
      setLoading(false);
    }
  };

  const config = platformConfig[platform];
  const inputBgClass = theme === 'dark'
    ? 'bg-gray-800/80 border-gray-600 text-white placeholder-gray-400'
    : 'bg-white/80 border-gray-200 text-gray-900 placeholder-gray-400';

  const loadingTextClass = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';
  const errorBgClass = theme === 'dark'
    ? 'bg-red-900/50 border-red-700/50 text-red-300'
    : 'bg-red-50 border-red-200 text-red-700';

  return (
    <div className={`${config.bgColor} rounded-3xl p-8 shadow-2xl border ${theme === 'dark' ? 'border-gray-700/50' : 'border-white/30'} backdrop-blur-sm transition-all duration-500`}>
      <div className="max-w-2xl mx-auto">
        {/* Input Section */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={config.placeholder}
              className={`w-full px-6 py-4 rounded-2xl border-2 focus:border-blue-500 focus:outline-none text-lg backdrop-blur-sm transition-all duration-300 ${inputBgClass}`}
              onKeyPress={(e) => e.key === 'Enter' && handleDownload()}
            />
          </div>
          <button
            onClick={fetchInfo}
            disabled={loading || !url.trim()}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-2xl hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 min-w-[140px]"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            ) : (
              <>
                <Download size={20} />
                <span>Download</span>
              </>
            )}
          </button>
        </div>

        {/* Results Section */}
        {loading && (
          <div className="text-center py-12">
            <div className={`inline-flex items-center space-x-3 ${loadingTextClass}`}>
              <Search className="animate-pulse" size={24} />
              <span className="text-lg">Fetching video information...</span>
            </div>
          </div>
        )}

        {error && (
          <div className={`${errorBgClass} border-2 rounded-2xl p-6 flex items-center space-x-3`}>
            <AlertCircle size={24} />
            <span className="text-lg">{error}</span>
          </div>
        )}

        {videoData && <VideoPreview videoData={videoData} platform={platform} theme={theme} />}
      </div>
    </div>
  );
};

export default DownloadSection;
