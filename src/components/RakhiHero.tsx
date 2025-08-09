import React from "react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/rakhi-hero.jpg";
import { Music, Pause, Play } from "lucide-react";
import { useMusicContext } from "@/contexts/MusicContext";

const RakhiHero: React.FC<{ onAddSister: () => void; onOpenMusic: () => void }>
= ({ onAddSister, onOpenMusic }) => {
  const sectionRef = React.useRef<HTMLDivElement>(null);
  const { playing, toggle } = useMusicContext();

  const handlePointerMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = sectionRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty("--pointer-x", `${x}px`);
    el.style.setProperty("--pointer-y", `${y}px`);
  };

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

          <div className="mt-6 flex items-center justify-center">
            <Button 
              onClick={toggle} 
              aria-label={playing ? "Pause Rakhi music" : "Play Rakhi music"}
              className="bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-6 py-3 rounded-lg font-semibold"
            >
              {playing ? (
                <span className="inline-flex items-center gap-2">
                  <Pause className="size-4"/>
                  <span>Pause Music</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-2">
                  <Play className="size-4"/>
                  <span>Play Music</span>
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RakhiHero;