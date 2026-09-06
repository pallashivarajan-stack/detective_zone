import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const TEAM_MEDIA = [
  {
    url: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/team/0.jpeg",
    alt: "Detectives Zone gameplay playtest session",
    caption: "Live gameplay testing session with real mystery enthusiasts and detectives"
  },
  {
    url: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/team/2.jpeg",
    alt: "Crime scene evidence and forensic markers",
    caption: "Real-world forensic markers, crime scene diagrams, and physical evidence"
  },
  {
    url: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/team/6.jpeg",
    alt: "Investigative debrief and breakthrough deduction",
    caption: "Interactive case debrief, suspect interrogation, and forensic deduction"
  },
  {
    url: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/team/WhatsApp+Image+2026-09-02+at+3.49.13+PM.jpeg",
    alt: "The Detectives Zone Core Team",
    caption: "The writers, forensic researchers, and narrative designers behind Detectives Zone"
  }
];

export function AboutTeamSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % TEAM_MEDIA.length);
  }, []);

  const prevSlide = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + TEAM_MEDIA.length) % TEAM_MEDIA.length);
  }, []);

  // Auto-slide every 5.5s unless hovered
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 5500);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  return (
    <section 
      id="about-team" 
      className="shell mt-20 sm:mt-28 lg:mt-32 scroll-mt-[72px]"
      aria-label="About Detectives Zone Team and Forensic Experience"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* LEFT COLUMN: BRAND STORY & TRUST METRICS */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          
          {/* Header Tag */}
          <div>
            <div className="inline-flex items-center gap-2 mb-3">
              {/* Red Fingerprint Icon */}
              <svg 
                className="w-4 h-4 text-[#D32F2F] shrink-0" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4" />
                <path d="M14 13.12c0 2.38 0 6.38-1 8.88" />
                <path d="M17.29 21.02c.12-.6.43-2.3.5-3.02" />
                <path d="M2 12a10 10 0 0 1 18-6" />
                <path d="M2 16h.01" />
                <path d="M21.8 16c.2-2 .131-5.354 0-6" />
                <path d="M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2" />
                <path d="M8.65 22c.21-.66.45-1.32.57-2" />
                <path d="M9 6.8a6 6 0 0 1 9 5.2v2" />
              </svg>
              <span className="font-mono text-[11px] sm:text-[12px] font-bold uppercase tracking-[0.25em] text-[#D32F2F]">
                ABOUT US
              </span>
            </div>

            <h2 className="font-display text-[34px] sm:text-[44px] lg:text-[50px] font-black uppercase leading-[1.02] text-white tracking-tight">
              Crafted By Real
              <br />
              <span className="text-[#D32F2F]">Forensics &amp; Storytellers</span>
            </h2>

            <p className="mt-3.5 text-[14px] sm:text-[15px] leading-relaxed text-neutral-400 max-w-xl font-sans">
              Backed by authentic investigative procedures, forensic research, and hundreds of hours of immersive storytelling.
            </p>
          </div>

          {/* Three Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
            
            {/* Card 1: 25+ PLAYTEST SESSIONS */}
            <div className="group rounded-2xl border border-white/10 bg-[#0B0B0B] p-4 flex flex-col items-center text-center transition-all duration-300 hover:border-white/20 hover:bg-[#111111]">
              {/* Playtest / Calendar Badge Icon */}
              <div className="h-12 w-12 rounded-xl bg-white/[0.04] border border-white/5 flex items-center justify-center relative overflow-hidden shadow-inner">
                <div className="absolute top-0 inset-x-0 h-2 bg-[#D32F2F]" />
                <div className="mt-1 flex flex-col items-center">
                  <span className="font-mono text-[14px] font-black text-white tracking-tight leading-none">25</span>
                  <div className="mt-0.5 flex gap-1">
                    <span className="h-0.5 w-1 bg-neutral-500 rounded-full" />
                    <span className="h-0.5 w-1 bg-neutral-500 rounded-full" />
                  </div>
                </div>
              </div>

              <div className="mt-3.5">
                <p className="font-display text-[26px] leading-none text-[#D32F2F] font-bold tracking-tight">
                  25+
                </p>
                <p className="font-mono text-[11px] font-bold text-white tracking-wider uppercase mt-1">
                  PLAYTESTS
                </p>
                <p className="text-[11px] text-neutral-400 font-sans mt-0.5 leading-tight">
                  Live sessions with players
                </p>
              </div>
            </div>

            {/* Card 2: 6+ PHYSICAL ARTIFACTS */}
            <div className="group rounded-2xl border border-white/10 bg-[#0B0B0B] p-4 flex flex-col items-center text-center transition-all duration-300 hover:border-white/20 hover:bg-[#111111]">
              {/* Fedora + Glass Icon */}
              <div className="h-12 w-12 rounded-xl bg-white/[0.04] border border-white/5 flex items-center justify-center relative shadow-inner">
                <svg className="w-6 h-6 text-neutral-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  {/* Hat Crown */}
                  <path d="M6 14l1.5-7h9L18 14" />
                  {/* Hat Brim */}
                  <path d="M3 14h18" />
                  {/* Red Hat Ribbon */}
                  <path d="M7 11.5h10" stroke="#D32F2F" strokeWidth="2" />
                  {/* Magnifying Glass */}
                  <circle cx="16.5" cy="16.5" r="3" stroke="#D32F2F" strokeWidth="1.8" />
                  <path d="M19 19l2.5 2.5" stroke="#D32F2F" strokeWidth="1.8" />
                </svg>
              </div>

              <div className="mt-3.5">
                <p className="font-display text-[26px] leading-none text-[#D32F2F] font-bold tracking-tight">
                  6+
                </p>
                <p className="font-mono text-[11px] font-bold text-white tracking-wider uppercase mt-1">
                  ARTIFACTS
                </p>
                <p className="text-[11px] text-neutral-400 font-sans mt-0.5 leading-tight">
                  Physical clues per kit
                </p>
              </div>
            </div>

            {/* Card 3: 100% ORIGINAL MYSTERIES */}
            <div className="group rounded-2xl border border-white/10 bg-[#0B0B0B] p-4 flex flex-col items-center text-center transition-all duration-300 hover:border-white/20 hover:bg-[#111111]">
              {/* Red Folder Icon */}
              <div className="h-12 w-12 rounded-xl bg-white/[0.04] border border-white/5 flex items-center justify-center relative shadow-inner">
                <svg className="w-6 h-6 text-[#D32F2F]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 8 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" fill="rgba(211,47,47,0.15)" />
                  <path d="M7 11h10" stroke="white" strokeWidth="1.5" />
                  <path d="M7 15h6" stroke="white" strokeWidth="1.5" />
                </svg>
              </div>

              <div className="mt-3.5">
                <p className="font-display text-[26px] leading-none text-[#D32F2F] font-bold tracking-tight">
                  100%
                </p>
                <p className="font-mono text-[11px] font-bold text-white tracking-wider uppercase mt-1">
                  ORIGINAL
                </p>
                <p className="text-[11px] text-neutral-400 font-sans mt-0.5 leading-tight">
                  Handcrafted mysteries
                </p>
              </div>
            </div>

          </div>

          {/* Wide Commitment Box */}
          <div className="rounded-2xl border border-white/10 bg-[#0B0B0B] p-5 flex items-start sm:items-center gap-4 transition-all duration-300 hover:border-white/20">
            {/* Shield + Fingerprint Icon */}
            <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-[#D32F2F]/10 border border-[#D32F2F]/30 flex items-center justify-center shrink-0">
              <svg className="w-7 h-7 text-[#D32F2F]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M12 8a2 2 0 0 0-2 2c0 1.2-.1 2.2-.3 3" strokeWidth="1.5" />
                <path d="M12 14c.5 1.5 0 3-1 4" strokeWidth="1.5" />
                <path d="M14.5 11c0 2 0 4-.5 5.5" strokeWidth="1.5" />
              </svg>
            </div>

            <div>
              <h3 className="font-mono text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.16em] text-white">
                OUR COMMITMENT
              </h3>
              <p className="text-[12px] sm:text-[13px] leading-relaxed text-neutral-300 font-sans mt-1">
                We combine real-world forensic methods with immersive storytelling to create a gaming experience that&apos;s as authentic as it is thrilling.
              </p>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: INTERACTIVE GALLERY & CAROUSEL */}
        <div 
          className="lg:col-span-6 flex flex-col space-y-4"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Main Large Image Container */}
          <div className="relative aspect-[16/10] sm:aspect-[16/10.5] w-full rounded-2xl sm:rounded-3xl border border-white/15 bg-black/60 overflow-hidden shadow-2xl group">
            
            {/* Image Slider */}
            {TEAM_MEDIA.map((item, index) => (
              <div
                key={item.url}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  index === activeIndex ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                }`}
              >
                <img
                  src={item.url}
                  alt={item.alt}
                  className="w-full h-full object-cover object-center"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                
                {/* Subtle caption badge */}
                <div className="absolute bottom-3.5 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
                  <span className="font-mono text-[10px] sm:text-[11px] tracking-wider text-neutral-200 bg-black/70 backdrop-blur-md px-3 py-1 rounded border border-white/10">
                    {item.caption}
                  </span>
                  <span className="font-mono text-[10px] text-[#D32F2F] font-bold bg-black/70 backdrop-blur-md px-2 py-1 rounded border border-[#D32F2F]/30 shrink-0 ml-2">
                    0{index + 1} / 0{TEAM_MEDIA.length}
                  </span>
                </div>
              </div>
            ))}

            {/* Navigation Buttons */}
            <button
              onClick={prevSlide}
              aria-label="Previous slide"
              className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-20 h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-black/60 hover:bg-[#D32F2F] text-white border border-white/20 hover:border-[#D32F2F] flex items-center justify-center transition-all duration-200 backdrop-blur-sm shadow-lg cursor-pointer"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              onClick={nextSlide}
              aria-label="Next slide"
              className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-20 h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-black/60 hover:bg-[#D32F2F] text-white border border-white/20 hover:border-[#D32F2F] flex items-center justify-center transition-all duration-200 backdrop-blur-sm shadow-lg cursor-pointer"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Thumbnails Row */}
          <div className="grid grid-cols-4 gap-2 sm:gap-3">
            {TEAM_MEDIA.map((item, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={item.url}
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Jump to image ${index + 1}`}
                  className={`relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ${
                    isActive
                      ? "ring-2 ring-[#D32F2F] ring-offset-2 ring-offset-[#080808] scale-[1.02]"
                      : "opacity-60 hover:opacity-100 border border-white/10 hover:border-white/30"
                  }`}
                >
                  <img
                    src={item.url}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {isActive && (
                    <div className="absolute inset-0 bg-[#D32F2F]/10 pointer-events-none" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Dots Indicator */}
          <div className="flex items-center justify-center gap-1.5 pt-1">
            {TEAM_MEDIA.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                aria-label={`Select slide ${index + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  index === activeIndex
                    ? "w-6 bg-[#D32F2F]"
                    : "w-1.5 bg-white/20 hover:bg-white/40"
                }`}
              />
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
