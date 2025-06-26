export type Platform = 'youtube' | 'instagram' | 'x';
export type Theme = 'light' | 'dark';

export interface VideoFormat {
  quality: string;
  format: string;
  size?: string;
  available: boolean;
}

export interface AudioFormat {
  quality: 'high' | 'low';
  bitrate: string;
  format: string;
  available: boolean;
}

export interface VideoData {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  available: boolean;
  availableFormats: (VideoFormat | AudioFormat)[];
  formats: {
    // YouTube specific
    videoFormats?: VideoFormat[];
    audioFormats?: AudioFormat[];
    // Instagram/X generic
    video?: boolean;
    audio?: boolean;
  };
}

export interface PlatformConfig {
  name: string;
  placeholder: string;
  bgColor: string;
  gradientFrom: string;
  gradientTo: string;
  logoColor: string;
}