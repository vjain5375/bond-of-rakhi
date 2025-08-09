import React from "react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/rakhi-hero.jpg";
import { Music, Pause, Play } from "lucide-react";

const RakhiHero: React.FC<{ onAddSister: () => void; onOpenMusic: () => void }>
= ({ onAddSister, onOpenMusic }) => {
  const sectionRef = React.useRef<HTMLDivElement>(null);

  // Simple WebAudio chime loop (no external files)
  const audioCtxRef = React.useRef<AudioContext | null>(null);
  const loopIdRef = React.useRef<number | null>(null);
  const [playing, setPlaying] = React.useState(false);

  const handlePointerMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = sectionRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty("--pointer-x", `${x}px`);
    el.style.setProperty("--pointer-y", `${y}px`);
  };

  const ringBell = (ctx: AudioContext, freq: number, time: number) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(0.08, time + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 1.6);
    osc.connect(gain).connect(ctx.destination);
    osc.start(time);
    osc.stop(time + 1.7);
  };

  const startMusic = async () => {
    if (playing) return;
    const Ctx = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = audioCtxRef.current ?? new Ctx();
    audioCtxRef.current = ctx;
    const loop = () => {
      const t = ctx.currentTime + 0.05;
      // A gentle, festive chord (C – E – G with a high bell)
      ringBell(ctx, 261.63, t);
      ringBell(ctx, 329.63, t + 0.05);
      ringBell(ctx, 392.0, t + 0.1);
      ringBell(ctx, 1046.5, t + 0.2);
      loopIdRef.current = window.setTimeout(loop, 2800);
    };
    loop();
    setPlaying(true);
  };

  const stopMusic = () => {
    if (loopIdRef.current) {
      clearTimeout(loopIdRef.current);
      loopIdRef.current = null;
    }
    setPlaying(false);
  };

  React.useEffect(()=>()=>{ stopMusic(); },[]);

  return (
    <section
      ref={sectionRef}
      onMouseMove={handlePointerMove}
      className="relative hero-glow overflow-hidden rounded-lg border shadow-sm"
      aria-label="Raksha Bandhan Hero"
    >
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Elegant Rakhi with marigold flowers and diyas"
          className="h-full w-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/60 to-background/30" />
      </div>

      {/* Decorative illustrations inspired by Raksha Bandhan */}
      <img
        src="/lovable-uploads/f44ee9df-5df9-4edc-b026-5bc366906408.png"
        alt="Raksha Bandhan gifts illustration"
        className="pointer-events-none absolute -left-10 -top-6 w-40 opacity-35 rotate-[-6deg] hidden sm:block"
        loading="lazy"
      />
      <img
        src="/lovable-uploads/f38f121b-fe32-4b35-a35d-475ea7ce6b7b.png"
        alt="Sister tying rakhi illustration"
        className="pointer-events-none absolute -right-10 -bottom-10 w-44 opacity-35 rotate-[5deg] hidden sm:block"
        loading="lazy"
      />

      <div className="relative z-10 px-6 py-20 sm:px-10 lg:px-16 text-center">
        <div className="mx-auto max-w-3xl">
          <div className="inline-flex items-center rounded-full border px-3 py-1 text-xs sm:text-sm bg-secondary/60 backdrop-blur">
            Bond of Love • Raksha Bandhan
          </div>
          <h1 className="mt-4 text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
            Raksha Bandhan Tribute
          </h1>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground">
            Celebrate the unbreakable bond with a beautiful gallery of your sisters.
          </p>

          <div className="mt-6 flex items-center justify-center gap-3">
            <Button variant="hero" onClick={playing ? stopMusic : startMusic} aria-label={playing ? "Pause festive music" : "Play festive music"}>
              {playing ? (<span className="inline-flex items-center gap-2"><Pause className="size-4"/><span>Pause Music</span></span>) : (<span className="inline-flex items-center gap-2"><Play className="size-4"/><span>Play Music</span></span>)}
            </Button>
            <Button variant="outline" onClick={onAddSister} className="hidden">Add Sister</Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RakhiHero;
