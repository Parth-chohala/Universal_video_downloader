import React from 'react';
import { Play, Download, Music, Video, FileVideo, Headphones } from 'lucide-react';

const VideoPreview = ({ videoData, platform, theme }) => {
  const getDownloadOptions = () => {
    if (platform === 'youtube' && videoData.formats.videoFormats && videoData.formats.audioFormats) {
      return {
        videoFormats: videoData.formats.videoFormats,
        audioFormats: videoData.formats.audioFormats,
      };
    }

    const options = [];
    if (videoData.formats.video) {
      options.push({
        type: 'Video',
        icon: Video,
        color: 'from-blue-500 to-blue-600',
        description: 'Download video file',
      });
    }
    if (videoData.formats.audio) {
      options.push({
        type: 'Audio',
        icon: Music,
        color: 'from-purple-500 to-purple-600',
        description: 'Extract audio only',
      });
    }

    return { genericOptions: options };
  };

  const downloadData = getDownloadOptions();

  const getQualityColor = (quality) => {
    const q = parseInt(quality);
    if (q >= 1080) return 'from-green-500 to-green-600';
    if (q >= 720) return 'from-blue-500 to-blue-600';
    if (q >= 480) return 'from-yellow-500 to-yellow-600';
    return 'from-gray-500 to-gray-600';
  };

  const containerClass =
    theme === 'dark' ? 'bg-gray-800/90 border-gray-700/50' : 'bg-white/90 border-white/30';
  const textClass = theme === 'dark' ? 'text-white' : 'text-gray-800';
  const subtextClass = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';

  return (
    <div
      className={`${containerClass} backdrop-blur-md rounded-3xl p-6 shadow-xl border transition-all duration-300 animate-fadeIn`}
    >
      {/* Video Info */}
      <div className="flex flex-col lg:flex-row gap-6 mb-6">
        <div className="relative group cursor-pointer">
          <img
            src={videoData.thumbnail}
            alt={videoData.title}
            className="w-full lg:w-80 h-48 object-cover rounded-2xl shadow-lg transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/30 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Play className="text-white" size={48} />
          </div>
          <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded-lg text-sm font-medium">
            {videoData.duration}
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <h3 className={`text-2xl font-bold ${textClass} mb-2 leading-tight`}>
            {videoData.title}
          </h3>
          <p className={`${subtextClass} mb-4 text-lg`}>
            Ready for download • {videoData.duration}
          </p>
          <div className="flex items-center space-x-2 text-green-600">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="font-medium">Available for download</span>
          </div>
        </div>
      </div>

      {/* Download Options */}
      <div className="space-y-6">
        <h4 className={`text-xl font-semibold ${textClass} mb-4`}>Download Options</h4>

        {platform === 'youtube' && downloadData.videoFormats && downloadData.audioFormats ? (
          <>
            <div className="mb-6">
              <h5 className={`text-lg font-medium ${textClass} mb-3 flex items-center space-x-2`}>
                <FileVideo size={20} />
                <span>Video Quality</span>
              </h5>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {downloadData.videoFormats.map((format, index) => (
                  <button
                    key={index}
                    disabled={!format.available}
                    className={`
                      p-4 rounded-2xl bg-gradient-to-r ${getQualityColor(format.quality)}
                      text-white hover:shadow-lg transform hover:scale-105 transition-all duration-300
                      focus:outline-none focus:ring-4 focus:ring-blue-300 text-center
                      ${!format.available ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                  >
                    <div className="font-bold text-lg">{format.quality}p</div>
                    <div className="text-white/80 text-sm">{format.format}</div>
                    {format.size && (
                      <div className="text-white/70 text-xs mt-1">{format.size}</div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h5 className={`text-lg font-medium ${textClass} mb-3 flex items-center space-x-2`}>
                <Headphones size={20} />
                <span>Audio Quality</span>
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {downloadData.audioFormats.map((format, index) => (
                  <button
                    key={index}
                    disabled={!format.available}
                    className={`
                      flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r
                      ${format.quality === 'high' ? 'from-purple-500 to-purple-600' : 'from-indigo-500 to-indigo-600'}
                      text-white hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300
                      focus:outline-none focus:ring-4 focus:ring-purple-300
                      ${!format.available ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                  >
                    <div className="flex items-center space-x-4">
                      <Music size={24} />
                      <div className="text-left">
                        <div className="font-semibold text-lg capitalize">{format.quality} Quality</div>
                        <div className="text-white/80 text-sm">
                          {format.bitrate} • {format.format}
                        </div>
                      </div>
                    </div>
                    <Download size={20} />
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="grid gap-3">
            {downloadData.genericOptions?.map((option, index) => {
              const Icon = option.icon;
              return (
                <button
                  key={index}
                  className={`
                    flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r ${option.color}
                    text-white hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300
                    focus:outline-none focus:ring-4 focus:ring-blue-300
                  `}
                >
                  <div className="flex items-center space-x-4">
                    <Icon size={24} />
                    <div className="text-left">
                      <div className="font-semibold text-lg">{option.type}</div>
                      <div className="text-white/80 text-sm">{option.description}</div>
                    </div>
                  </div>
                  <Download size={20} />
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPreview;
