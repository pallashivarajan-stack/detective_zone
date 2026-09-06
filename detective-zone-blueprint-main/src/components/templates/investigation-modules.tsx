"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";

import { S3_MEDIA } from "@/lib/media";

const {
  crimeScene: crimeSceneIcon,
  autopsyReport: autopsyReportIcon,
  witnessStatements: witnessStatementsIcon,
  digitalEvidence: digitalEvidenceIcon,
  documents: documentsIcon,
  evidencePhotos: evidencePhotosIcon,
  toolsGiven: investigativeToolsIcon,
  detectiveNotes: detectiveNotesIcon,
} = S3_MEDIA.moduleIcons;

// ─────────────────────────────────────────────────────────────────────────────
// BESPOKE INTERACTIVE FORENSIC ICONS (Large, tactile, high-contrast)
// ─────────────────────────────────────────────────────────────────────────────

function IconCrimeScene({ className, active }: { className?: string; active?: boolean }) {
  return (
    <img
      src={crimeSceneIcon}
      alt="Crime Scene"
      className={cn(
        "w-full h-full object-cover transition-transform duration-500 select-none",
        className,
        active && "scale-105"
      )}
    />
  );
}

function IconAutopsy({ className, active }: { className?: string; active?: boolean }) {
  return (
    <img
      src={autopsyReportIcon}
      alt="Autopsy Report"
      className={cn(
        "w-full h-full object-cover transition-transform duration-500 select-none",
        className,
        active && "scale-105"
      )}
    />
  );
}

function IconWitness({ className, active }: { className?: string; active?: boolean }) {
  return (
    <img
      src={witnessStatementsIcon}
      alt="Witness Statements"
      className={cn(
        "w-full h-full object-cover transition-transform duration-500 select-none",
        className,
        active && "scale-105"
      )}
    />
  );
}

function IconDigital({ className, active }: { className?: string; active?: boolean }) {
  return (
    <img
      src={digitalEvidenceIcon}
      alt="Digital Evidence"
      className={cn(
        "w-full h-full object-cover transition-transform duration-500 select-none",
        className,
        active && "scale-105"
      )}
    />
  );
}

function IconDocuments({ className, active }: { className?: string; active?: boolean }) {
  return (
    <img
      src={documentsIcon}
      alt="Documents"
      className={cn(
        "w-full h-full object-cover transition-transform duration-500 select-none",
        className,
        active && "scale-105"
      )}
    />
  );
}

function IconPhotos({ className, active }: { className?: string; active?: boolean }) {
  return (
    <img
      src={evidencePhotosIcon}
      alt="Evidence Photos"
      className={cn(
        "w-full h-full object-cover transition-transform duration-500 select-none",
        className,
        active && "scale-105"
      )}
    />
  );
}

function IconTools({ className, active }: { className?: string; active?: boolean }) {
  return (
    <img
      src={investigativeToolsIcon}
      alt="Tools Given"
      className={cn(
        "w-full h-full object-cover transition-transform duration-500 select-none",
        className,
        active && "scale-105"
      )}
    />
  );
}

// Alias for backwards compatibility
const IconTimeline = IconTools;

function IconNotes({ className, active }: { className?: string; active?: boolean }) {
  return (
    <img
      src={detectiveNotesIcon}
      alt="Detective Notes"
      className={cn(
        "w-full h-full object-cover transition-transform duration-500 select-none",
        className,
        active && "scale-105"
      )}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DATA & ICON REGISTRY
// ─────────────────────────────────────────────────────────────────────────────

const DEFAULT_MODULES = [
  {
    n: 1,
    num: "01",
    title: "Crime Scene",
    desc: "We provide a secure Drive link inside the kit containing full crime scene video files and authentic audio recordings to explore the scene.",
    pct: 75,
    icon: IconCrimeScene,
  },
  {
    n: 2,
    num: "02",
    title: "Autopsy Report",
    desc: "We provide official sealed coroner reports, toxicological blood panels, and trauma anatomical diagrams to establish time and cause of death.",
    pct: 60,
    icon: IconAutopsy,
  },
  {
    n: 3,
    num: "03",
    title: "Witness Statements",
    desc: "We provide verbatim police interrogation transcripts, signed eyewitness affidavits, and suspect alibi logs to detect lies and contradictions.",
    pct: 45,
    icon: IconWitness,
  },
  {
    n: 4,
    num: "04",
    title: "Digital Evidence",
    desc: "We provide extracted suspect phone records, encrypted chat histories, cell tower triangulation logs, and surveillance CCTV footage.",
    pct: 30,
    icon: IconDigital,
  },
  {
    n: 5,
    num: "05",
    title: "Documents",
    desc: "We provide confidential forensic dossier files, authentic bank statements, search warrants, and original handwritten correspondence.",
    pct: 40,
    icon: IconDocuments,
  },
  {
    n: 6,
    num: "06",
    title: "Evidence Photos",
    desc: "We provide high-resolution glossy crime scene polaroids, macro fingerprint lifts, ballistics captures, and suspect surveillance photographs.",
    pct: 50,
    icon: IconPhotos,
  },
  {
    n: 7,
    num: "07",
    title: "Tools Given",
    desc: "We provide authentic physical investigative tools including optical inspection magnifiers, fingerprint cards, and forensic loupes inside the kit.",
    pct: 35,
    icon: IconTools,
  },
  {
    n: 8,
    num: "08",
    title: "Detective Notes",
    desc: "We provide official investigator casebook worksheets, suspect motive matrices, and step-by-step procedural deduction logs to crack the case.",
    pct: 20,
    icon: IconNotes,
  },
];

export interface ModuleItem {
  n?: number;
  num?: string;
  code?: string;
  icon?: any;
  title: string;
  desc: string;
  pct?: number;
}

export interface InvestigationModulesProps {
  modules?: ModuleItem[];
  className?: string;
}

function renderCardIcon(IconComp: any, title: string, active: boolean) {
  if (typeof IconComp === "function") {
    return <IconComp className="h-full w-full object-cover" active={active} />;
  }
  if (typeof IconComp === "string" && IconComp.trim()) {
    return (
      <img
        src={IconComp}
        alt={title || "Module Icon"}
        className={cn(
          "h-full w-full object-cover transition-transform duration-500 select-none",
          active && "scale-105"
        )}
      />
    );
  }
  return null;
}

/**
 * Evidence Photo Dialog - High-definition forensic exhibit lightbox
 */
function EvidencePhotoDialog({
  item,
  items,
  onClose,
  onSelectIndex,
}: {
  item: {
    n: number;
    num: string;
    title: string;
    desc: string;
    pct: number;
    icon: any;
    imageUrl: string;
    index: number;
  };
  items: any[];
  onClose: () => void;
  onSelectIndex: (idx: number) => void;
}) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") {
        onSelectIndex((item.index - 1 + items.length) % items.length);
      }
      if (e.key === "ArrowRight") {
        onSelectIndex((item.index + 1) % items.length);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    const origOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = origOverflow;
    };
  }, [item.index, items.length, onClose, onSelectIndex]);

  const prevItem = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectIndex((item.index - 1 + items.length) % items.length);
  };

  const nextItem = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectIndex((item.index + 1) % items.length);
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 md:p-8 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[92vh] bg-[#070707] border border-[#B31217]/60 rounded-2xl shadow-[0_0_60px_rgba(179,18,23,0.35)] overflow-hidden flex flex-col pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* TOP BAR */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-[#0A0A0A]">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded font-mono text-[9px] font-bold uppercase tracking-[0.2em] bg-[#B31217]/20 border border-[#B31217]/60 text-[#FF4A50]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#B31217] animate-pulse" />
              EXHIBIT REF #{item.num}
            </span>
            <span className="font-display text-[20px] sm:text-[24px] uppercase text-white tracking-wide font-black">
              {item.title}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline font-mono text-[10px] text-neutral-400 bg-white/5 px-2.5 py-1 rounded border border-white/10">
              {item.index + 1} of {items.length} EXHIBITS
            </span>
            <button
              onClick={onClose}
              aria-label="Close dialog"
              className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-white/5 hover:bg-[#B31217] text-neutral-300 hover:text-white flex items-center justify-center border border-white/10 transition-colors cursor-pointer"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
        </div>

        {/* CENTER IMAGE VIEWPORT */}
        <div className="relative flex-1 bg-black/95 flex items-center justify-center overflow-hidden min-h-[300px] sm:min-h-[420px] p-2 sm:p-4 group">
          <img
            src={item.imageUrl}
            alt={item.title}
            className="max-h-[58vh] w-auto max-w-full object-contain rounded-lg shadow-2xl transition-transform duration-300 select-none"
          />

          {/* Navigation Arrows */}
          <button
            onClick={prevItem}
            aria-label="Previous exhibit"
            className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-black/70 hover:bg-[#B31217] text-white border border-white/20 hover:border-[#B31217] flex items-center justify-center transition-all backdrop-blur-md shadow-xl cursor-pointer"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            onClick={nextItem}
            aria-label="Next exhibit"
            className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-black/70 hover:bg-[#B31217] text-white border border-white/20 hover:border-[#B31217] flex items-center justify-center transition-all backdrop-blur-md shadow-xl cursor-pointer"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>

        {/* BOTTOM METADATA BAR */}
        <div className="px-5 py-4 border-t border-white/10 bg-[#0A0A0A] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex-1">
            <p className="text-[13px] text-neutral-300 font-sans leading-relaxed">
              {item.desc}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="font-mono text-[10px] font-bold text-neutral-300 bg-neutral-900 border border-neutral-800 px-3 py-1 rounded">
              {item.pct}% FORENSIC DEPTH
            </span>
            <span className="font-mono text-[10px] text-neutral-500">
              Use <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white text-[9px]">←</kbd> <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white text-[9px]">→</kbd> or <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white text-[9px]">ESC</kbd>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

const MODULE_IMAGE_URLS: Record<string, string> = {
  "Crime Scene": crimeSceneIcon,
  "Autopsy Report": autopsyReportIcon,
  "Witness Statements": witnessStatementsIcon,
  "Digital Evidence": digitalEvidenceIcon,
  Documents: documentsIcon,
  "Evidence Photos": evidencePhotosIcon,
  "Tools Given": investigativeToolsIcon,
  "Detective Notes": detectiveNotesIcon,
};

function getModuleImageUrl(item: any, index: number): string {
  if (typeof item.icon === "string" && (item.icon.startsWith("http") || item.icon.startsWith("/"))) {
    return item.icon;
  }
  if (item.title && MODULE_IMAGE_URLS[item.title]) {
    return MODULE_IMAGE_URLS[item.title];
  }
  const defaultList = [
    crimeSceneIcon,
    autopsyReportIcon,
    witnessStatementsIcon,
    digitalEvidenceIcon,
    documentsIcon,
    evidencePhotosIcon,
    investigativeToolsIcon,
    detectiveNotesIcon,
  ];
  return defaultList[index % defaultList.length];
}

/**
 * HoverExpandModules - Clean Industrial Brutalist expanding cards with large, clear evidence photos & Dialog Box
 */
function HoverExpandModules({
  items,
}: {
  items: {
    n: number;
    num: string;
    title: string;
    desc: string;
    pct: number;
    icon: any;
  }[];
}) {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [selectedModalIndex, setSelectedModalIndex] = useState<number | null>(null);

  const currentModalItem = selectedModalIndex !== null && items[selectedModalIndex] ? {
    ...items[selectedModalIndex],
    imageUrl: getModuleImageUrl(items[selectedModalIndex], selectedModalIndex),
    index: selectedModalIndex,
  } : null;

  return (
    <div className="w-full relative">
      {/* Scrollbar killer style tag */}
      <style>{`
        .hide-modules-scrollbar::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
        }
        .hide-modules-scrollbar {
          -ms-overflow-style: none !important;
          scrollbar-width: none !important;
        }
      `}</style>

      {/* Horizontal flex container with completely hidden scrollbar */}
      <div
        className="flex w-full items-center justify-start lg:justify-center gap-2 sm:gap-3 overflow-x-auto pb-4 pt-1 hide-modules-scrollbar no-scrollbar snap-x"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {items.map((m, index) => {
          const isActive = activeIndex === index;
          const IconComponent = m.icon;

          return (
            <motion.div
              key={m.n}
              className={cn(
                "relative cursor-pointer overflow-hidden rounded-2xl border transition-colors duration-200 shrink-0 snap-center select-none",
                isActive
                  ? "border-[#B31217] bg-[#000000]"
                  : "border-[#1C1C1C] bg-[#070707] hover:border-[#2C2C2C] hover:bg-[#0A0A0A]"
              )}
              initial={{ width: "4.8rem", height: "28rem" }}
              animate={{
                width: isActive ? "25.5rem" : "4.8rem",
                height: "28rem",
              }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => setActiveIndex(index)}
            >
              {/* COLLAPSED STATE (Slim vertical bar with prominent clear photo thumbnail) */}
              <AnimatePresence>
                {!isActive && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="absolute inset-0 flex flex-col items-center justify-between py-5 px-1 pointer-events-none"
                  >
                    {/* Top Number */}
                    <span className="font-mono text-[11px] font-bold text-[#B31217] tracking-wider">
                      {m.num}
                    </span>

                    {/* Middle Interactive Icon - Clear, bounded photo thumbnail */}
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedModalIndex(index);
                      }}
                      className="h-14 w-14 sm:h-16 sm:w-16 rounded-xl overflow-hidden border border-white/25 bg-neutral-900 shadow-md flex items-center justify-center p-0.5 cursor-zoom-in hover:border-[#B31217] pointer-events-auto transition-colors"
                      title="Click to view full-size exhibit"
                    >
                      {renderCardIcon(IconComponent, m.title, false)}
                    </div>

                    {/* Vertical Rotated Title */}
                    <div
                      style={{ writingMode: "vertical-rl" }}
                      className="rotate-180 font-mono text-[11px] font-bold tracking-[0.22em] uppercase text-neutral-300 whitespace-nowrap"
                    >
                      {m.title}
                    </div>

                    {/* Bottom Percentage */}
                    <span className="font-mono text-[10px] font-semibold text-neutral-500 tabular-nums">
                      {m.pct}%
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* EXPANDED STATE (Full text & LARGE CLEAR MODULE EXHIBIT PHOTO) */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    transition={{ duration: 0.22, delay: 0.05 }}
                    className="absolute inset-0 flex flex-col justify-between p-5 sm:p-6 pointer-events-none bg-[#020202]"
                  >
                    {/* Top Row: Module Number & Depth Badge */}
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[11px] font-bold tracking-wider text-white bg-[#B31217] px-3 py-1 rounded">
                        {m.num}
                      </span>

                      <span className="font-mono text-[10px] font-bold tracking-wider text-neutral-300 bg-[#0E0E0E] border border-[#222222] px-3 py-1 rounded">
                        {m.pct}% FORENSIC DEPTH
                      </span>
                    </div>

                    {/* Center Content: LARGE CLEAR MODULE IMAGE & Details */}
                    <div className="my-auto py-1 flex flex-col items-start w-full">
                      {/* Big Clear Exhibit Image Container with Click-to-Zoom */}
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedModalIndex(index);
                        }}
                        className="relative w-full h-44 sm:h-50 rounded-xl overflow-hidden border border-white/20 bg-neutral-950 shadow-[0_8px_25px_rgba(0,0,0,0.85)] mb-3 group cursor-zoom-in pointer-events-auto hover:border-[#B31217]/70 transition-colors"
                        title="Click to view full-size exhibit in high resolution"
                      >
                        {renderCardIcon(IconComponent, m.title, true)}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                        
                        <span className="absolute bottom-2.5 left-2.5 font-mono text-[9px] uppercase tracking-widest text-neutral-200 bg-black/85 backdrop-blur-md px-2.5 py-0.5 rounded border border-white/15">
                          {m.title}
                        </span>

                        <span className="absolute top-2.5 right-2.5 font-mono text-[9px] font-bold uppercase tracking-wider text-white bg-[#B31217]/90 backdrop-blur-sm px-2.5 py-1 rounded flex items-center gap-1.5 shadow-lg opacity-90 group-hover:opacity-100 transition-opacity">
                          <Maximize2 className="h-3 w-3" />
                          <span>EXPAND EXHIBIT</span>
                        </span>
                      </div>

                      {/* Title */}
                      <h3
                        className="font-display text-[26px] sm:text-[30px] font-black uppercase tracking-wide text-white leading-tight"
                        style={{ fontFamily: "Bebas Neue, sans-serif" }}
                      >
                        {m.title}
                      </h3>

                      {/* Description */}
                      <p className="mt-1 text-[12.5px] sm:text-[13px] leading-relaxed text-neutral-300 font-sans line-clamp-3">
                        {m.desc}
                      </p>
                    </div>

                    {/* Bottom: Solid Progress Bar */}
                    <div className="pt-3 border-t border-[#161616]">
                      <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 uppercase tracking-widest mb-1.5">
                        <span>Forensic Depth</span>
                        <span className="text-[#B31217] font-bold">{m.pct}%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-[#121212] overflow-hidden">
                        <motion.div
                          className="h-full bg-[#B31217]"
                          initial={{ width: 0 }}
                          animate={{ width: `${m.pct}%` }}
                          transition={{ duration: 0.5, delay: 0.15 }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* FULL-SCREEN EVIDENCE PHOTO DIALOG / LIGHTBOX */}
      {currentModalItem && (
        <EvidencePhotoDialog
          item={currentModalItem}
          items={items}
          onClose={() => setSelectedModalIndex(null)}
          onSelectIndex={(idx) => setSelectedModalIndex(idx)}
        />
      )}
    </div>
  );
}

const ICON_KEY_MAP: Record<string, any> = {
  crimeScene: IconCrimeScene,
  "crime-scene": IconCrimeScene,
  "Crime Scene": IconCrimeScene,
  "Harbor Scene": IconCrimeScene,
  "Villa Search": IconCrimeScene,
  "Lab Vault": IconCrimeScene,
  "Metro Platform": IconCrimeScene,
  PersonStanding: IconCrimeScene,

  autopsyReport: IconAutopsy,
  "autopsy-report": IconAutopsy,
  "Autopsy Report": IconAutopsy,
  "Forensic Analysis": IconAutopsy,
  FileText: IconAutopsy,

  witnessStatements: IconWitness,
  "witness-statements": IconWitness,
  "Witness Statements": IconWitness,
  "Informant Tips": IconWitness,
  MessagesSquare: IconWitness,

  digitalEvidence: IconDigital,
  "digital-evidence": IconDigital,
  "Digital Evidence": IconDigital,
  "Server Logs": IconDigital,
  "Magnifying Glass": IconDigital,
  Monitor: IconDigital,

  documents: IconDocuments,
  Documents: IconDocuments,
  "Bank Statements": IconDocuments,
  Folder: IconDocuments,

  evidencePhotos: IconPhotos,
  "evidence-photos": IconPhotos,
  "Evidence Photos": IconPhotos,
  "Surveillance Stills": IconPhotos,
  Camera: IconPhotos,

  toolsGiven: IconTools,
  "tools-given": IconTools,
  "Tools Given": IconTools,
  Timeline: IconTools,
  "Suspect Network": IconTools,
  Wrench: IconTools,
  Share2: IconTools,

  detectiveNotes: IconNotes,
  "detective-notes": IconNotes,
  "Detective Notes": IconNotes,
  Notebook: IconNotes,
};

function resolveModuleIcon(iconVal: any, defaultIcon: any, title?: string) {
  if (!iconVal) {
    if (title && ICON_KEY_MAP[title]) return ICON_KEY_MAP[title];
    return defaultIcon;
  }
  if (typeof iconVal === "function") return iconVal;
  if (typeof iconVal === "string") {
    const trimmed = iconVal.trim();

    // Map old icon filenames to new unified components
    if (trimmed.includes("crime-scene-clapper") || trimmed.includes("crime_scene")) return IconCrimeScene;
    if (trimmed.includes("autopsy-report") || trimmed.includes("autospy")) return IconAutopsy;
    if (trimmed.includes("witness-statements") || trimmed.includes("witness")) return IconWitness;
    if (trimmed.includes("digital-evidence") || trimmed.includes("digital+evidence") || trimmed.includes("digital%20evidence")) return IconDigital;
    if (trimmed.includes("documents-icon") || trimmed.includes("documents.jpeg")) return IconDocuments;
    if (trimmed.includes("evidence-photos") || trimmed.includes("evidence.jpeg")) return IconPhotos;
    if (trimmed.includes("investigative-tools") || trimmed.includes("tools.jpeg")) return IconTools;
    if (trimmed.includes("detective-notes") || trimmed.includes("detective_notes")) return IconNotes;

    if (ICON_KEY_MAP[trimmed]) {
      return ICON_KEY_MAP[trimmed];
    }

    if (
      trimmed.startsWith("http://") ||
      trimmed.startsWith("https://") ||
      trimmed.startsWith("/") ||
      trimmed.startsWith("data:")
    ) {
      return ({ className, active }: { className?: string; active?: boolean }) => (
        <img
          src={trimmed}
          alt={title || "Module Icon"}
          className={cn(
            "object-contain transition-transform duration-300 select-none",
            className,
            active && "scale-105"
          )}
        />
      );
    }

    if (title && ICON_KEY_MAP[title]) {
      return ICON_KEY_MAP[title];
    }
  }
  return defaultIcon;
}

/**
 * Main InvestigationModules Component
 */
export function InvestigationModules({ modules, className }: InvestigationModulesProps) {
  const displayModules = modules && modules.length > 0
    ? modules.map((m, idx) => {
        const defaultM = DEFAULT_MODULES[idx % DEFAULT_MODULES.length];
        const isTimeline = m.title === "Timeline" || m.title === "Timeline Reconstruction";
        const title = (idx === 6 && isTimeline) ? defaultM.title : (m.title || defaultM.title);
        const desc = m.desc && m.desc.trim() ? m.desc : defaultM.desc;
        const icon = resolveModuleIcon(m.icon, defaultM.icon, title);

        return {
          n: m.n || idx + 1,
          num: m.num || String(m.n || idx + 1).padStart(2, "0"),
          title,
          desc,
          pct: m.pct !== undefined ? m.pct : defaultM.pct,
          icon,
        };
      })
    : DEFAULT_MODULES;

  return (
    <section className={cn("rounded-2xl border border-[#181818] bg-[#020202] p-5 sm:p-8 relative overflow-hidden", className)}>
      {/* Header section (Tagline removed) */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-5 border-b border-[#161616]">
        <div>
          <h2 
            className="font-display text-[28px] sm:text-[36px] font-black uppercase text-white tracking-tight leading-none"
            style={{ fontFamily: "Bebas Neue, sans-serif" }}
          >
            MODULES WE PROVIDE
          </h2>
          <p className="mt-2 text-[13px] sm:text-[14px] text-neutral-400 font-sans leading-relaxed">
            Explore all investigative sections, forensic logs, and deduction tools included in the case.
          </p>
        </div>
        <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-neutral-400 font-semibold shrink-0 bg-[#0A0A0A] border border-[#1E1E1E] px-3 py-1.5 rounded">
          {displayModules.length} Modules Available
        </span>
      </div>

      {/* Interactive Expandable Hover Cards (Big Icon centerpieces, True Black layout) */}
      <div className="relative z-10 mt-6">
        <HoverExpandModules items={displayModules} />
      </div>
    </section>
  );
}

/**
 * Backwards compatibility exports
 */
export const HoverExpand_001 = HoverExpandModules;
export const Skiper52 = () => <InvestigationModules />;
