import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronLeft, ChevronRight, Clock, Star, ShoppingBag } from "lucide-react";
import { motion } from "motion/react";
import { S3_MEDIA } from "@/lib/media";
import { api } from "@/lib/api";

interface CaseItem {
  id: string;
  caseNumber: string;
  title: string;
  image: string;
  description: string;
  price: number;
  originalPrice: number;
  shippingFee: number;
  stars: number;
  duration: string;
  difficulty: string;
  status: string;
  slug: string;
}

const STORE_CASES: CaseItem[] = [
  {
    id: "001",
    caseNumber: "CASE 001",
    title: "The Last Voicemail",
    image: S3_MEDIA.cases.caseVoicemail,
    description: "A successful businessman found dead in his study. No forced entry. Just a voicemail and a lot of questions.",
    price: 1199,
    originalPrice: 1501,
    shippingFee: 80,
    stars: 5,
    duration: "2–3 HOURS",
    difficulty: "HARD",
    status: "UNSOLVED",
    slug: "/cases/001",
  },
  {
    id: "002",
    caseNumber: "CASE 002",
    title: "The Silent Witness",
    image: S3_MEDIA.cases.caseWitness,
    description: "A reclusive writer found dead in a locked room. A witness that never spoke... but saw everything.",
    price: 1450,
    originalPrice: 1899,
    shippingFee: 0,
    stars: 5,
    duration: "3–6 HOURS",
    difficulty: "HARD",
    status: "COMING SOON",
    slug: "/cases/002",
  },
  {
    id: "003",
    caseNumber: "CASE 003",
    title: "Blood in the Letter",
    image: S3_MEDIA.cases.caseLetter,
    description: "A threatening letter. A missing girl. A trail of blood. The shadows are speaking.",
    price: 1199,
    originalPrice: 1399,
    shippingFee: 0,
    stars: 5,
    duration: "4–5 HOURS",
    difficulty: "MEDIUM",
    status: "COMING SOON",
    slug: "/cases/003",
  },
  {
    id: "004",
    caseNumber: "CASE 004",
    title: "The Vanished One",
    image: S3_MEDIA.cases.caseHeir,
    description: "They were here one day, gone the next. A disappearance that made no noise at all.",
    price: 999,
    originalPrice: 1499,
    shippingFee: 0,
    stars: 5,
    duration: "5–6 HOURS",
    difficulty: "HARD",
    status: "COMING SOON",
    slug: "/cases/004",
  },
  {
    id: "005",
    caseNumber: "CASE 005",
    title: "The Final Experiment",
    image: S3_MEDIA.cases.caseExperiment,
    description: "A scientist's last experiment was never meant to be found. Now the cure is the disease.",
    price: 1299,
    originalPrice: 1499,
    shippingFee: 0,
    stars: 5,
    duration: "4–6 HOURS",
    difficulty: "EXPERT",
    status: "COMING SOON",
    slug: "/cases/005",
  },
  {
    id: "006",
    caseNumber: "CASE 006",
    title: "Shadows of Betrayal",
    image: S3_MEDIA.cases.caseBetrayal,
    description: "A man caught between loyalty and truth. One choice changed everything.",
    price: 1499,
    originalPrice: 1499,
    shippingFee: 0,
    stars: 5,
    duration: "6–8 HOURS",
    difficulty: "EXPERT",
    status: "COMING SOON",
    slug: "/cases/006",
  },
];

export function HomeStoreSection() {
  const [casesList, setCasesList] = useState<CaseItem[]>(STORE_CASES);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    Promise.all([
      api.getCases().catch(() => []),
      api.getProducts().catch(() => []),
    ])
      .then(([casesData, prodsData]: [any[], any[]]) => {
        const prodMap = new Map<string, any>();
        if (prodsData && Array.isArray(prodsData) && prodsData.length > 0) {
          prodsData.forEach((p: any, idx: number) => {
            const skuNum = p.sku
              ? p.sku.replace("DZ-KIT-", "").replace("CASE", "").replace("#", "").trim().padStart(3, "0")
              : `00${idx + 1}`;
            if (skuNum) prodMap.set(skuNum, p);
            if (p.slug) prodMap.set(p.slug.toLowerCase().trim(), p);
            const cleanTitle = p.name ? p.name.split(" — ")[0].split(" - ")[0].toLowerCase().trim() : "";
            if (cleanTitle) prodMap.set(cleanTitle, p);
          });
        }

        if (casesData && Array.isArray(casesData) && casesData.length > 0) {
          const imageMap: Record<string, string> = {
            "001": S3_MEDIA.cases.caseVoicemail,
            "002": S3_MEDIA.cases.caseWitness,
            "003": S3_MEDIA.cases.caseLetter,
            "004": S3_MEDIA.cases.caseHeir,
            "005": S3_MEDIA.cases.caseExperiment,
            "006": S3_MEDIA.cases.caseBetrayal,
          };
          const mapped: CaseItem[] = casesData.map((c: any, idx: number) => {
            const num = c.case_number ? c.case_number.replace(/^CASE\s*#?/i, "").trim().padStart(3, "0") : `00${idx + 1}`;
            const img =
              c.cover_image && !c.cover_image.startsWith("/src")
                ? c.cover_image
                : imageMap[num] || imageMap[c.slug] || S3_MEDIA.cases.caseVoicemail;

            const matchedProd =
              prodMap.get(num) ||
              prodMap.get(c.slug?.toLowerCase().trim()) ||
              prodMap.get(c.title?.toLowerCase().trim());
            const prodRate = matchedProd
              ? matchedProd.sale_price
                ? Number(matchedProd.sale_price)
                : matchedProd.price != null
                ? Number(matchedProd.price)
                : null
              : null;

            const finalPrice = c.price != null ? Number(c.price) : prodRate != null ? prodRate : 999;
            const finalOrigPrice = c.original_price != null ? Number(c.original_price) : 1499;
            const finalShipFee = c.shipping_fee != null ? Number(c.shipping_fee) : 0;

            return {
              id: num,
              caseNumber: c.case_number?.startsWith("CASE") ? c.case_number : `CASE ${c.case_number}`,
              title: c.title,
              image: img,
              description: c.short_description || c.intro_text || "",
              price: finalPrice,
              originalPrice: finalOrigPrice,
              shippingFee: finalShipFee,
              stars: c.rating ? Math.round(Number(c.rating)) : 5,
              duration: c.estimated_duration || "2–3 HOURS",
              difficulty: (c.difficulty?.toUpperCase() as any) || "HARD",
              status: c.status?.toUpperCase() || "UNSOLVED",
              slug: `/cases/${num}`,
            };
          });
          if (mapped.length > 0) {
            mapped.sort((a, b) => a.id.localeCompare(b.id));
            setCasesList(mapped);
          }
        }
      })
      .catch((err) => console.log("Using initial cases fallback:", err));
  }, []);

  const total = casesList.length;

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
  }, [total]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev === total - 1 ? 0 : prev + 1));
  }, [total]);

  // Touch Swipe Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 35) {
      handleNext();
    } else if (diff < -35) {
      handlePrev();
    }
    touchStartX.current = null;
  };

  return (
    <section
      id="store"
      aria-label="Detectives Zone Case Store"
      className="relative w-full overflow-hidden bg-[#020202] text-white pt-8 sm:pt-12 lg:pt-14 pb-16 sm:pb-20 lg:pb-24 select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* ── Background Noir Grid & Subtle Investigative Lines ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(135deg, rgba(211,47,47,0.3) 1px, transparent 1px), linear-gradient(45deg, rgba(211,47,47,0.15) 1px, transparent 1px)",
          backgroundSize: "120px 120px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1600px] px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-6">
          {/* ════════════════════════════════════════════════════
              LEFT SIDE: Intro & Action Area
          ════════════════════════════════════════════════════ */}
          <div className="col-span-1 lg:col-span-4 flex flex-col justify-center pr-0 lg:pr-3">
            {/* Small red uppercase label */}
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-[#D32F2F]">
                STORE
              </span>
            </div>

            {/* Compact bold condensed heading */}
            <h2
              className="mt-3 font-display font-bold uppercase tracking-[-0.01em] text-white"
              style={{
                fontSize: "clamp(28px, 3.2vw, 44px)",
                lineHeight: 0.98,
              }}
            >
              <span className="block text-white">INVESTIGATE.</span>
              <span className="block text-white mt-0.5">SOLVE. UNCOVER.</span>
            </h2>

            {/* Supporting text */}
            <p className="mt-4 max-w-[310px] font-sans text-[12.5px] sm:text-[13px] leading-relaxed text-[#858585]">
              Choose your case file and step into a world of mystery, clues and truth.
            </p>

            {/* Premium Refined Red Outlined CTA Button — Explore Cases Only */}
            <div className="mt-7">
              <Link
                to="/cases"
                className="group relative inline-flex items-center gap-3 overflow-hidden rounded-[8px] border border-[#D32F2F]/80 bg-gradient-to-r from-[#140404] via-[#100303] to-[#0a0a0a] px-6 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-[#FF4545] shadow-[0_0_20px_rgba(211,47,47,0.22)] transition-all duration-300 hover:border-[#D32F2F] hover:text-white hover:shadow-[0_0_32px_rgba(211,47,47,0.45)] hover:scale-[1.02] active:scale-[0.98]"
              >
                <span className="pointer-events-none absolute -inset-full bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-hover:animate-pulse" />
                <span className="relative z-10">Explore Cases</span>
                <ArrowRight className="relative z-10 h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1.5 text-[#D32F2F] group-hover:text-white" />
              </Link>
            </div>
          </div>

          {/* ════════════════════════════════════════════════════
              RIGHT SIDE: 3D Case Carousel with Hardware-Accelerated Smooth Animation
          ════════════════════════════════════════════════════ */}
          <div className="col-span-1 lg:col-span-8 relative flex items-center justify-center min-h-[490px] sm:min-h-[510px] lg:min-h-[530px]">
            {/* Left Circular Navigation Arrow */}
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous Case File"
              className="absolute -left-5 sm:-left-7 lg:-left-10 z-40 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-white/15 bg-[#080808]/85 text-white/50 backdrop-blur-md transition-all duration-200 hover:border-white/40 hover:text-white hover:scale-105 active:scale-95 shadow-[0_4px_16px_rgba(0,0,0,0.8)] cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {/* Right Circular Red-Accented Navigation Arrow */}
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next Case File"
              className="absolute -right-5 sm:-right-7 lg:-right-10 z-40 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-[#D32F2F] bg-[#0c0c0c]/90 text-[#E53935] backdrop-blur-md transition-all duration-200 hover:bg-[#D32F2F]/15 hover:text-white hover:scale-110 active:scale-95 shadow-[0_0_20px_rgba(211,47,47,0.35)] cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            {/* 3D Carousel Stage with GPU Acceleration */}
            <div
              className="relative w-full h-[460px] sm:h-[480px] flex items-center justify-center overflow-visible"
              style={{
                perspective: "1200px",
                transformStyle: "preserve-3d",
                WebkitPerspective: "1200px",
              }}
            >
              {casesList.map((item, idx) => {
                // Circular offset calculation: -2, -1, 0, 1, 2
                let offset = (idx - activeIndex) % total;
                if (offset < -Math.floor(total / 2)) offset += total;
                if (offset > Math.floor(total / 2)) offset -= total;

                const isCenter = offset === 0;
                // Only show 3 cards: Left, Middle Main, Right
                const isVisible = Math.abs(offset) <= 1;

                if (!isVisible) return null;

                // Smooth 3D parameters for 3-card presentation
                const xOffset = offset * 225;
                const scale = isCenter ? 1.0 : 0.86;
                const zIndex = isCenter ? 30 : 15;
                const opacity = isCenter ? 1 : 0.45;
                const rotateY = offset * -12;

                const currentPrice = item.price != null ? Number(item.price) : 999;
                const origPrice = item.originalPrice != null ? Number(item.originalPrice) : 1499;
                const shipFee = item.shippingFee != null ? Number(item.shippingFee) : 0;
                const discountPct =
                  origPrice > currentPrice
                    ? Math.round(((origPrice - currentPrice) / origPrice) * 100)
                    : 0;
                const isPurchasable = item.status !== "COMING SOON";

                return (
                  <motion.div
                    key={item.id}
                    initial={false}
                    animate={{
                      x: xOffset,
                      scale: scale,
                      zIndex: zIndex,
                      opacity: opacity,
                      rotateY: rotateY,
                    }}
                    transition={{
                      duration: 0.45,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    onClick={() => {
                      if (!isCenter) {
                        setActiveIndex(idx);
                      }
                    }}
                    className={`absolute top-0 flex flex-col rounded-lg overflow-hidden cursor-pointer select-none border ${
                      isCenter
                        ? "border-[#1A1A1A] shadow-[0_20px_50px_rgba(0,0,0,0.95),0_0_24px_rgba(179,18,23,0.15)] bg-[#0B0B0B]"
                        : "border-[#1A1A1A]/70 shadow-[0_14px_35px_rgba(0,0,0,0.8)] bg-[#0B0B0B]"
                    }`}
                    style={{
                      width: "min(300px, 78vw)",
                      height: "460px",
                      willChange: "transform, opacity",
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                      transformStyle: "preserve-3d",
                      boxShadow: isCenter ? "inset 0 1px 1px rgba(255, 255, 255, 0.02)" : undefined,
                    }}
                  >
                    {/* Full card darkening overlay on inactive side cards */}
                    {!isCenter && (
                      <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0 z-30 bg-black/45 rounded-lg"
                      />
                    )}

                    {/* Top Crime Scene Image Container */}
                    <div className="relative h-[200px] w-full overflow-hidden bg-neutral-900">
                      <img
                        src={item.image}
                        alt={item.title}
                        loading="eager"
                        className={`h-full w-full object-cover ${
                          isCenter
                            ? "grayscale-0 opacity-100"
                            : "filter grayscale opacity-55"
                        }`}
                        style={{
                          willChange: "opacity",
                        }}
                      />

                      {/* Shadow overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-transparent to-transparent opacity-90 pointer-events-none" />

                      {/* Status Badge */}
                      <span
                        className={`absolute top-3.5 left-3.5 inline-flex items-center gap-1.5 font-mono text-[8px] font-bold tracking-[0.2em] uppercase px-2.5 py-1 rounded-[3px] border shadow-md backdrop-blur-md ${
                          item.status === "UNSOLVED"
                            ? "bg-black/90 text-[#FF4A50] border-[#C81D24]/60 shadow-[0_0_12px_rgba(200,29,36,0.35)]"
                            : item.status === "COMPLETED" || item.status === "SOLVED"
                            ? "bg-black/90 text-emerald-400 border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                            : "bg-black/85 text-neutral-400 border-white/10 shadow-[0_0_8px_rgba(0,0,0,0.6)]"
                        }`}
                      >
                        <span
                          className={`inline-block w-1.5 h-1.5 rounded-full ${
                            item.status === "UNSOLVED"
                              ? "bg-[#C81D24] animate-pulse"
                              : item.status === "COMPLETED" || item.status === "SOLVED"
                              ? "bg-emerald-400"
                              : "bg-neutral-600"
                          }`}
                        />
                        {item.status || "UNSOLVED"}
                      </span>

                      {/* Darkening Scrim on Inactive Cards */}
                      {!isCenter && (
                        <div
                          aria-hidden
                          className="pointer-events-none absolute inset-0 bg-black/60"
                        />
                      )}
                    </div>

                    {/* Content Area — Exact Match with Cases Page Card */}
                    <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <p className="font-mono text-[10px] tracking-[0.16em] text-[#9A9A9A] uppercase mb-1">
                          {item.caseNumber}
                        </p>
                        <h3
                          className="font-display text-[22px] sm:text-[24px] text-white tracking-[0.5px] leading-tight uppercase mb-1"
                          style={{ fontFamily: "Bebas Neue, sans-serif" }}
                        >
                          {item.title}
                        </h3>
                        {item.description && (
                          <p className="font-sans text-[11px] text-white/50 line-clamp-2 leading-relaxed mb-2">
                            {item.description}
                          </p>
                        )}
                      </div>

                      {/* Price & Buy Now Action Row */}
                      <div className="mt-2 flex items-center justify-between border-t border-[#1A1A1A] pt-3">
                        <div className="flex flex-col">
                          <div className="flex items-baseline gap-1.5">
                            <span className="font-mono text-[15px] font-bold text-white tracking-wider">
                              ₹{currentPrice}
                            </span>
                            {origPrice > currentPrice && (
                              <span className="font-mono text-[10px] text-white/35 line-through">
                                ₹{origPrice}
                              </span>
                            )}
                            {discountPct > 0 && (
                              <span className="font-mono text-[8px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1 py-0.2 rounded">
                                {discountPct}% OFF
                              </span>
                            )}
                          </div>
                          <span className="font-mono text-[8px] text-white/40 uppercase tracking-wider mt-0.5">
                            {shipFee === 0 ? "Free Delivery" : `+₹${shipFee} Delivery Charge`}
                          </span>
                        </div>

                        {isPurchasable ? (
                          isCenter ? (
                            <Link
                              to={item.slug}
                              className="inline-flex items-center gap-1.5 rounded-[5px] bg-[#D32F2F] hover:bg-[#B71C1C] text-white px-3 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.16em] shadow-[0_0_12px_rgba(211,47,47,0.35)] transition-colors duration-200"
                            >
                              <ShoppingBag className="w-2.5 h-2.5" />
                              Buy Now
                            </Link>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-[5px] bg-[#D32F2F]/80 text-white px-3 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.16em]">
                              <ShoppingBag className="w-2.5 h-2.5" />
                              Buy Now
                            </span>
                          )
                        ) : (
                          <span className="font-mono text-[8.5px] font-bold uppercase tracking-wider text-white/40">
                            Coming Soon
                          </span>
                        )}
                      </div>

                      {/* Metadata Row */}
                      <div className="border-t border-[#1A1A1A]/60 pt-3 mt-2 flex items-center justify-between text-[11px] font-mono tracking-wider">
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < item.stars
                                  ? "text-[#B31217] fill-[#B31217]"
                                  : "text-neutral-800"
                              }`}
                            />
                          ))}
                        </div>

                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span className="uppercase text-[9px]">{item.duration}</span>
                        </div>

                        <span className="text-[#C21C22] font-semibold text-[9px] uppercase tracking-widest">
                          {item.difficulty}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomeStoreSection;
