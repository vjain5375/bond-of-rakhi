import React, { createContext, useContext, useRef, useState } from 'react';
import { getAssetUrl } from '@/utils/assets';

interface MusicContextType {
  playing: boolean;
  toggle: () => Promise<void>;
  audioRef: React.RefObject<HTMLAudioElement>;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const useMusicContext = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusicContext must be used within a MusicProvider');
  }
  return context;
};

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  const toggle = async () => {
    if (!audioRef.current) return;
    
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      try {
        await audioRef.current.play();
        setPlaying(true);
      } catch (error) {
        console.error("Unable to play audio:", error);
      }
    }
  };

  return (
    <MusicContext.Provider value={{ playing, toggle, audioRef }}>
      {children}
      {/* Global audio element */}
      <audio 
        ref={audioRef} 
        src={getAssetUrl("music/rakhi-song.mp3")} 
        loop 
        preload="metadata"
      />
    </MusicContext.Provider>
  );
};
