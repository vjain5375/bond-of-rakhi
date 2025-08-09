import React from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Music, Pause, Play } from "lucide-react";
import { getAssetUrl } from "@/utils/assets";

// Your uploaded Raksha Bandhan music file
const MUSIC_FILE = getAssetUrl("music/rakhi-song.mp3");

const AudioPlayerFloating: React.FC = () => {
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = React.useState(false);

  React.useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = true;
    }
  }, []);

  const toggle = async () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      try {
        await audioRef.current.play();
        setPlaying(true);
      } catch {
        toast.error("Unable to play audio.");
      }
    }
  };

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
      
      {/* Hidden audio element */}
      <audio ref={audioRef} src={MUSIC_FILE} />
    </div>
  );
};

export default AudioPlayerFloating;