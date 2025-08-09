import React from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Music, Pause, Play } from "lucide-react";

const AUDIO_KEY = "rb_audio_data_url";

const AudioPlayerFloating: React.FC = () => {
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const [source, setSource] = React.useState<string | null>(null);
  const [playing, setPlaying] = React.useState(false);

  React.useEffect(()=>{
    const raw = localStorage.getItem(AUDIO_KEY);
    if (raw) setSource(raw);
  },[]);

  React.useEffect(()=>{
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

  if (!source) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full border bg-card px-3 py-2 shadow-md">
      <Music className="size-4" aria-hidden />
      <Button variant="default" size="sm" onClick={toggle}>
        {playing ? (
          <span className="inline-flex items-center gap-1"><Pause className="size-4"/> Pause</span>
        ) : (
          <span className="inline-flex items-center gap-1"><Play className="size-4"/> Play</span>
        )}
      </Button>
      {/* Hidden audio element */}
      <audio ref={audioRef} src={source ?? undefined} />
    </div>
  );
};

export default AudioPlayerFloating;
