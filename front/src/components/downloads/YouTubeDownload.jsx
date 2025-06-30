import React, { useState, useEffect } from 'react';
import { Download, Search, AlertCircle, Play, FileVideo, Headphones, Music } from 'lucide-react';
import axios from 'axios';

const YouTubeDownload = ({ theme }) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [videoData, setVideoData] = useState(null);
  const [error, setError] = useState(null);
  const [videoFormats, setVideoFormats] = useState([]);
  const [audioFormats, setAudioFormats] = useState([]);
  const [mp4formats, setMp4Formats] = useState([]);
  const [showPasted, setShowPasted] = useState(false);

  // (6247691 / (1024 * 1024)).toFixed(2)

  document.addEventListener('focus', readFromClipboard, true);

  async function readFromClipboard() {
    try {
      const text = await navigator.clipboard.readText();
      if (text && /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)/.test(text)) {
        setUrl(text.trim());
        setShowPasted(true);
        setTimeout(() => setShowPasted(false), 2000); // Show for 2 seconds
        // fetchInfo();

        // console.warn("No valid URL found in clipboard");
        return;
      }

    } catch (err) {
      console.error("Failed to read clipboard: ", err);
    }
  }


  function filterAndPickLargestByFormatNote(formats) {
    // console.log("Filtering formats:", formats);
    const formatMap = {};

    for (const f of formats) {
      const note = f.format_note;

      if (!formatMap[note] || f.filesize > formatMap[note].filesize) {
        formatMap[note] = f;
      }
    }
    const formatMapArray = Object.values(formatMap);
    setVideoFormats(formatMapArray.filter(f => f.format_note !== 'low' && f.resolution != 'audio only' && f.format_note !== 'medium' && f.format_note !== 'high' && f.format_note !== 'audio only' && f.format_note !== 'audio only (m4a)' && f.format_note !== 'audio only (opus)' && f.format_note !== 'high').reverse());
    setAudioFormats(formatMapArray.filter(f => f.resolution === 'audio only' && !f.format_note.includes('DRC')).reverse());
    setMp4Formats(formats.filter(f => f.ext === 'mp4' && f.filesize && f.acodec != 'none'));
    // Step 3: Return only the highest-file ones

    // console.log("Filtered formats:", formatMapArray);
    // console.log("Video formats:", videoFormats);
    // console.log("Audio formats:", audioFormats);
    // console.log("MP4 formats:", mp4formats);

    return Object.values(formatMap);
  }

  const fetchInfo = async () => {
    setLoading(true);
    setError(null);
    setVideoData(null);
    if (!url.trim() || !url.trim().match(/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/)) {
      setError("Please enter a valid YouTube video URL.");
      setLoading(false);
      return;
    }
    // console.log("Fetching video info for URL:", url.trim());
    try {
      const res = await axios.post("http://localhost:5000/get-info/youtube", { url: url.trim() });
      await setVideoData({ ...res.data, availableFormats: filterAndPickLargestByFormatNote(res.data.availableFormats) });
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError("Error fetching video info");
      alert("Error fetching video info");
    }
  };

  const getQualityColor = (quality) => {
    const q = parseInt(quality);
    if (q >= 1080) return 'from-green-500 to-green-600';
    if (q >= 720) return 'from-blue-500 to-blue-600';
    if (q >= 480) return 'from-yellow-500 to-yellow-600';
    return 'from-gray-500 to-gray-600';
  };

  const bgColor = theme === 'dark'
    ? 'bg-gradient-to-br from-red-900/30 to-red-800/30'
    : 'bg-gradient-to-br from-red-50 to-red-100';

  const inputBgClass = theme === 'dark'
    ? 'bg-gray-800/80 border-gray-600 text-white placeholder-gray-400'
    : 'bg-white/80 border-gray-200 text-gray-900 placeholder-gray-400';

  const loadingTextClass = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';
  const errorBgClass = theme === 'dark'
    ? 'bg-red-900/50 border-red-700/50 text-red-300'
    : 'bg-red-50 border-red-200 text-red-700';

  const containerClass = theme === 'dark'
    ? 'bg-gray-800/90 border-gray-700/50'
    : 'bg-white/90 border-white/30';

  const textClass = theme === 'dark' ? 'text-white' : 'text-gray-800';
  const subtextClass = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';
  function formatTime(seconds) {
    seconds = Number(seconds);

    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    const padded = (num) => String(num).padStart(2, '0');

    if (hrs > 0) {
      return `${padded(hrs)}:${padded(mins)}:${padded(secs)}`;
    } else if (mins > 0) {
      return `${padded(mins)}:${padded(secs)}`;
    } else {
      return `${padded(secs)}`;
    }
  }

  useEffect(() => {
    return () => {
      setUrl('');
      setVideoData(null);
      setError(null);
    };
  }, []);

  return (
    <div className={`${bgColor} rounded-3xl p-8 shadow-2xl border ${theme === 'dark' ? 'border-gray-700/50' : 'border-white/30'} backdrop-blur-sm transition-all duration-500`}>
      <div className="max-w-2xl mx-auto">
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter YouTube video URL (e.g., https://youtube.com/watch?v=...)"
              className={`w-full px-6 py-4 rounded-2xl border-2 focus:border-blue-500 focus:outline-none text-lg backdrop-blur-sm transition-all duration-300 ${inputBgClass}`}
              onKeyPress={(e) => e.key === 'Enter' && fetchInfo()}
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
          {showPasted && (
            <div className="flex items-center space-x-1 text-green-600 text-sm font-semibold animate-fadeInOut ml-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>

              <span>Pasted</span>
            </div>
          )}
        </div>

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
        ) }

        {videoData ? (
          <div className={`${containerClass} backdrop-blur-md rounded-3xl p-6 shadow-xl border transition-all duration-300 animate-fadeIn`}>
            <div className="flex flex-col lg:flex-row gap-6 mb-6">
              <div className="relative group cursor-pointer">
                <img
                  src={videoData.thumbnail}
                  alt={videoData.title}
                  className="w-full lg:w-80 h-48 object-cover rounded-2xl shadow-lg transition-transform duration-300 group-hover:scale-105"
                />

                <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded-lg text-sm font-medium">
                  {formatTime(videoData.duration)}
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-center">
                <h3 className={`text-2xl font-bold ${textClass} mb-2 leading-tight`}>
                  {videoData.title}
                </h3>
                <p className={`${subtextClass} mb-4 text-lg`}>
                  Ready for download • {formatTime(videoData.duration)}
                </p>
                <div className="flex items-center space-x-2 text-green-600">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-medium">Available for download</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h4 className={`text-xl font-semibold ${textClass} mb-4`}>Download Options</h4>
              {mp4formats.length > 0 && (
                <div className="mb-6">
                  <h5 className={`text-lg font-medium ${textClass} mb-3 flex items-center space-x-2`}>
                    <FileVideo size={20} />
                    <span>Mp4 (Audio + Video)</span>
                  </h5>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {mp4formats?.map((format, index) => (
                      <a
                        href={`${format.url}`}
                        target='_blank'
                        key={index}
                        className={`
                        p-4 rounded-2xl bg-gradient-to-r ${getQualityColor(format.format_note)}
                        text-white hover:shadow-lg transform hover:scale-105 transition-all duration-300
                        focus:outline-none focus:ring-4 focus:ring-blue-300 text-center
                      `}
                      >
                        <div className="font-bold text-lg">{format.format_note}</div>
                        {/* <div className="text-white/70 text-xs mt-1">{(format.filesize / (1024 * 1024)).toFixed(2)} MB</div> */}
                      </a>
                    ))}
                  </div>
                </div>
              )}
              {/* Video Quality Tiles */}
              <div className="mb-6">
                <h5 className={`text-lg font-medium ${textClass} mb-3 flex items-center space-x-2`}>
                  <FileVideo size={20} />
                  <span>Video only</span>
                </h5>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {videoFormats?.map((format, index) => (
                    <a
                      href={`${format.url}`}
                      target='_blank'
                      key={index}
                      className={`
                        p-4 rounded-2xl bg-gradient-to-r ${getQualityColor(format.format_note)}
                        text-white hover:shadow-lg transform hover:scale-105 transition-all duration-300
                        focus:outline-none focus:ring-4 focus:ring-blue-300 text-center
                      `}
                    >
                      <div className="font-bold text-lg">{format.format_note}</div>
                      <div className="text-white/70 text-xs mt-1">{(format.filesize / (1024 * 1024)).toFixed(2)} MB</div>
                    </a>
                  ))}
                </div>
              </div>

              {/* Audio Quality Options */}
              <div>
                <h5 className={`text-lg font-medium ${textClass} mb-3 flex items-center space-x-2`}>
                  <Headphones size={20} />
                  <span>Audio Only</span>
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {audioFormats.map((format, index) => (
                    <a
                      href={`${format.url}`}
                      target='_blank'
                      key={index}
                      className={`
                        flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r
                        ${format.format_note === 'high' || format.format_note === 'medium' || format.format_note === 'low' ? 'from-purple-500 to-purple-600' : 'from-indigo-500 to-indigo-600'}
                        text-white hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300
                        focus:outline-none focus:ring-4 focus:ring-purple-300

                      `}
                    >
                      <div className="flex items-center space-x-4">
                        <Music size={24} />
                        <div className="text-left">
                          <div className="font-semibold text-lg capitalize">{format.format_note == 'low' ? "low" : "high"} Quality</div>
                          <div className="text-white/80 text-sm">{(format.filesize / (1024 * 1024)).toFixed(2)} MB</div>
                        </div>
                      </div>
                      <Download size={20} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className={`${subtextClass} text-lg`}>
              Enter a valid Youtube video URL to get started.
            </p>
          </div>

        )}
      </div>
    </div>
  );
};

export default YouTubeDownload;
