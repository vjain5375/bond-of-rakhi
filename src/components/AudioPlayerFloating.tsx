import React from "react";
import { Button } from "@/components/ui/button";
import { Music, Pause, Play } from "lucide-react";
import { useMusicContext } from "@/contexts/MusicContext";

const AudioPlayerFloating: React.FC = () => {
  const { playing, toggle } = useMusicContext();

  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full border bg-card px-3 py-2 shadow-lg hover:shadow-xl transition-shadow">
      <Music className="size-4" aria-hidden />
      
      <Button variant="default" size="sm" onClick={toggle}>
        {playing ? (
          <span className="inline-flex items-center gap-1">
            <Pause className="size-4"/> Pause
          </span>
        ) : (
          <span className="inline-flex items-center gap-1">
            <Play className="size-4"/> Play
          </span>
        )}
      </Button>
      
    </div>
  );
};

export default AudioPlayerFloating;