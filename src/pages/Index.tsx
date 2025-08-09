import React from "react";
import RakhiHero from "@/components/RakhiHero";
import SistersGrid from "@/components/SistersGrid";
import AudioPlayerFloating from "@/components/AudioPlayerFloating";
import { MusicProvider } from "@/contexts/MusicContext";

const Index = () => {
  const heroRef = React.useRef<HTMLDivElement>(null);

  const scrollToAdd = () => {
    document.getElementById("add-sister-anchor")?.scrollIntoView({ behavior: "smooth" });
  };

  const openMusic = () => {
    // Focus the floating widget area visually by brief ring
    heroRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    document.title = "Raksha Bandhan Tribute | Bond of Rakhi";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Celebrate Raksha Bandhan with a heartfelt gallery of sisters and background music.");
    
    // Clear all existing sister data for fresh start
    localStorage.removeItem("rb_sisters");
  }, []);

  // JSON-LD structured data (basic CollectionPage)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Raksha Bandhan Tribute",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: ((): any[] => {
        try {
          const raw = localStorage.getItem("rb_sisters");
          const arr = raw ? JSON.parse(raw) as { name: string }[] : [];
          return arr.map((s, i) => ({ "@type": "Person", name: s.name, position: i + 1 }));
        } catch {
          return [];
        }
      })(),
    },
  };

  return (
    <MusicProvider>
      <div ref={heroRef}>
        <header className="container mx-auto py-6">
          <nav className="flex items-center justify-between">
            <a href="#" className="text-lg font-semibold">
              Bond of Rakhi
            </a>
            <a href="#gallery" className="text-sm underline-offset-4 hover:underline">Gallery</a>
          </nav>
        </header>

        <main id="main" className="container mx-auto px-4 md:px-6">
          <RakhiHero onAddSister={scrollToAdd} onOpenMusic={openMusic} />
          

          
          <div id="add-sister-anchor" />
          <section id="gallery" aria-label="Sisters Gallery">
            <SistersGrid />
          </section>
        </main>

        <AudioPlayerFloating />

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </div>
    </MusicProvider>
  );
};

export default Index;
