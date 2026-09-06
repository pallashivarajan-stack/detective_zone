import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState, useMemo } from "react";
import { SkiperTextRevealH } from "@/components/v1/skiper72";
import { Swiper, SwiperSlide, type SwiperRef } from "swiper/react";
import { EffectCoverflow, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import {
  Search,
  ShoppingCart,
  Bell,
  Star,
  Clock,
  Lock,
  Gift,
  AlertTriangle,
  Award,
  Shield,
  Package,
  Headset,
  ChevronLeft,
  ChevronRight,
  Check,
  FolderOpen,
  Eye,
  SearchCheck,
  Zap,
  ShoppingBag,
} from "lucide-react";

import { S3_MEDIA } from "@/lib/media";

const caseVoicemail = S3_MEDIA.cases.caseVoicemail;
const caseWitness = S3_MEDIA.cases.caseWitness;
const caseLetter = S3_MEDIA.cases.caseLetter;
const caseHeir = S3_MEDIA.cases.caseHeir;
const caseExperiment = S3_MEDIA.cases.caseExperiment;
const caseBetrayal = S3_MEDIA.cases.caseBetrayal;

export const Route = createFileRoute("/cases/")({
  component: CasesDashboard,
});

const initialCases = [
  {
    id: "001",
    title: "The Last Voicemail",
    number: "CASE 001",
    status: "UNSOLVED",
    image: caseVoicemail,
    description: "A successful businessman found dead in his study. No forced entry. Just a voicemail and a lot of questions.",
    stars: 5,
    duration: "3–5 HOURS",
    difficulty: "HARD",
    rating: 5,
    price: 1199,
    originalPrice: 1501,
    shippingFee: 80,
    dateAdded: 1690000000000,
  },
  {
    id: "002",
    title: "The Silent Witness",
    number: "CASE 002",
    status: "COMING SOON",
    image: caseWitness,
    description: "A reclusive writer found dead in a locked room. A witness that never spoke... but saw everything.",
    stars: 5,
    duration: "3–6 HOURS",
    difficulty: "HARD",
    rating: 4.9,
    price: 1450,
    originalPrice: 1899,
    shippingFee: 0,
    dateAdded: 1691000000000,
  },
  {
    id: "003",
    title: "Blood in the Letter",
    number: "CASE 003",
    status: "COMING SOON",
    image: caseLetter,
    description: "A threatening letter. A missing girl. A trail of blood. The shadows are speaking.",
    stars: 5,
    duration: "4–5 HOURS",
    difficulty: "MEDIUM",
    rating: 4.8,
    price: 1199,
    originalPrice: 1399,
    shippingFee: 0,
    dateAdded: 1692000000000,
  },
  {
    id: "004",
    title: "The Vanished One",
    number: "CASE 004",
    status: "COMING SOON",
    image: caseHeir,
    description: "They were here one day, gone the next. A disappearance that made no noise at all.",
    stars: 5,
    duration: "5–6 HOURS",
    difficulty: "HARD",
    rating: 4.9,
    price: 999,
    originalPrice: 1499,
    shippingFee: 0,
    dateAdded: 1693000000000,
  },
  {
    id: "005",
    title: "The Final Experiment",
    number: "CASE 005",
    status: "COMING SOON",
    image: caseExperiment,
    description: "A scientist's last experiment was never meant to be found. Now the cure is the disease.",
    stars: 5,
    duration: "4–6 HOURS",
    difficulty: "EXPERT",
    rating: 5,
    price: 1299,
    originalPrice: 1499,
    shippingFee: 0,
    dateAdded: 1694000000000,
  },
  {
    id: "006",
    title: "Shadows of Betrayal",
    number: "CASE 006",
    status: "COMING SOON",
    image: caseBetrayal,
    description: "A man caught between loyalty and truth. One choice changed everything.",
    stars: 5,
    duration: "6–8 HOURS",
    difficulty: "EXPERT",
    rating: 4.9,
    price: 1499,
    originalPrice: 1499,
    shippingFee: 0,
    dateAdded: 1695000000000,
  },
];

import { api } from "@/lib/api";
import { useEffect } from "react";

function CasesDashboard() {
  const [activeTab, setActiveTab] = useState<"ALL" | "UNSOLVED" | "COMING SOON">("ALL");
  const [liveCases, setLiveCases] = useState<any[]>(initialCases);
  const [siteSettings, setSiteSettings] = useState<Record<string, string>>({});
  const swiperRef = useRef<SwiperRef | null>(null);
  const prevBtn = useRef<HTMLButtonElement | null>(null);
  const nextBtn = useRef<HTMLButtonElement | null>(null);

  // Live fetch from FastAPI backend
  useEffect(() => {
    Promise.all([
      api.getCases().catch(() => []),
      api.getProducts().catch(() => []),
      api.getSettings().catch(() => ({})),
    ]).then(([casesData, prodsData, settingsData]: [any[], any[], any]) => {
      if (settingsData && typeof settingsData === "object") {
        setSiteSettings(settingsData);
      }
      const prodMap = new Map<string, any>();
      if (prodsData && Array.isArray(prodsData) && prodsData.length > 0) {
        prodsData.forEach((p: any, idx: number) => {
          const skuNum = p.sku ? p.sku.replace("DZ-KIT-", "").replace("CASE", "").replace("#", "").trim().padStart(3, "0") : `00${idx + 1}`;
          if (skuNum) prodMap.set(skuNum, p);
          if (p.slug) prodMap.set(p.slug.toLowerCase().trim(), p);
          const cleanTitle = p.name ? p.name.split(" — ")[0].split(" - ")[0].toLowerCase().trim() : "";
          if (cleanTitle) prodMap.set(cleanTitle, p);
        });
      }

      if (casesData && Array.isArray(casesData) && casesData.length > 0) {
        const imageMap: Record<string, string> = {
          "001": caseVoicemail,
          "002": caseWitness,
          "003": caseLetter,
          "004": caseHeir,
          "005": caseExperiment,
          "006": caseBetrayal,
        };
        const mapped = casesData.map((c: any, idx: number) => {
          const num = c.case_number ? c.case_number.replace(/^CASE\s*#?/i, "").trim().padStart(3, "0") : `00${idx + 1}`;
          const img = (c.cover_image && !c.cover_image.startsWith("/src")) 
            ? c.cover_image 
            : (imageMap[num] || imageMap[c.slug] || caseVoicemail);

          const matchedProd = prodMap.get(num) || prodMap.get(c.slug?.toLowerCase().trim()) || prodMap.get(c.title?.toLowerCase().trim());
          const prodRate = matchedProd ? (matchedProd.sale_price ? Number(matchedProd.sale_price) : (matchedProd.price != null ? Number(matchedProd.price) : null)) : null;

          const finalPrice = c.price != null ? Number(c.price) : (prodRate != null ? prodRate : 999);
          const finalOrigPrice = c.original_price != null ? Number(c.original_price) : 1499;
          const finalShipFee = c.shipping_fee != null ? Number(c.shipping_fee) : 0;

          return {
            id: num,
            dbId: c.id,
            title: c.title,
            number: c.case_number.startsWith("CASE") ? c.case_number : `CASE ${c.case_number}`,
            status: c.status || "UNSOLVED",
            image: img,
            description: c.short_description || c.intro_text || "",
            stars: c.rating ? Math.round(c.rating) : 5,
            duration: c.estimated_duration || "3–5 HOURS",
            difficulty: c.difficulty || "HARD",
            rating: c.rating || 5,
            price: finalPrice,
            originalPrice: finalOrigPrice,
            shippingFee: finalShipFee,
            dateAdded: new Date(c.created_at || Date.now()).getTime(),
          };
        });
        setLiveCases(mapped);
      }
    }).catch((err) => console.log("Using initial cases fallback:", err));
  }, []);

  const filteredCases = useMemo(() => {
    let result = [...liveCases];
    if (activeTab !== "ALL") {
      result = result.filter((c) => c.status === activeTab);
    }
    result.sort((a, b) => a.id.localeCompare(b.id));
    return result;
  }, [activeTab, liveCases]);

  return (
    <div className="min-h-screen bg-[#000000] text-[#C7C7C7] font-sans pt-[72px] relative overflow-hidden">
      <div className="relative z-10 mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-8">
        
        {/* PAGE HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end pb-7 mb-10 gap-4">
          <div>
            <h1 className="font-display text-[clamp(3.5rem,12vw,6.5rem)] font-bold text-white tracking-[2px] leading-none uppercase" style={{ fontFamily: "Bebas Neue, sans-serif" }}>
              Case <span className="text-[#B31217]">Files</span>
            </h1>
            <p className="text-[19px] text-[#A0A0A0] font-mono tracking-[1.5px] uppercase mt-3">
              Choose your next investigation
            </p>
          </div>
          <div className="font-mono text-[10px] tracking-[2px] text-muted-foreground uppercase">
            <Link to="/" className="hover:text-white transition-colors duration-300">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-[#B31217]">Cases</span>
          </div>
        </header>

        {/* FILTER BAR */}
        <section className="flex items-center w-fit bg-[#0B0B0B] border border-[#1A1A1A] rounded-lg px-6 py-3 mb-8">
          <div className="flex flex-wrap items-center gap-8">
            {(["ALL", "UNSOLVED", "COMING SOON"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`group relative inline-flex py-2 font-mono text-[11px] tracking-[0.2em] uppercase transition-colors duration-300 cursor-pointer ${
                  (tab === "ALL" && activeTab === "ALL") || activeTab === tab
                    ? "text-[#B31217] font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="relative">
                  {tab === "ALL" ? "All Cases" : tab.replace("_", " ")}
                  <span
                    className={`absolute -bottom-1 left-0 h-[2px] bg-blood transition-all duration-500 ease-out ${
                      activeTab === tab || (tab === "ALL" && activeTab === "ALL")
                        ? "w-full opacity-100"
                        : "w-0 opacity-0 group-hover:w-full group-hover:opacity-100"
                    }`}
                  />
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* COVERFLOW CAROUSEL — FULL WIDTH */}
        <main>
          <div className="relative overflow-hidden px-2 sm:px-16 mt-10">
              <Swiper
                key={activeTab}
                modules={[EffectCoverflow, Pagination]}
                effect="coverflow"
                coverflowEffect={{ rotate: 35, depth: 120, modifier: 1.2, slideShadows: true }}
                grabCursor
                centeredSlides
                loop
                slidesPerView="auto"
                speed={800}
                spaceBetween={-48}
                pagination={{ el: ".cases-pagination", clickable: true }}
                ref={swiperRef}
                onSlideChange={(swiper) => {
                  const real = swiper.realIndex;
                  const first = real === 0;
                  const last = real === filteredCases.length - 1;
                  prevBtn.current?.style.setProperty("opacity", first ? "0.25" : "1");
                  nextBtn.current?.style.setProperty("opacity", last ? "0.25" : "1");
                }}
                className="cases-coverflow"
              >
                {filteredCases.map((c) => (
                  <SwiperSlide key={c.id} className="cases-coverflow-slide">
                    <Link
                      to="/cases/$caseId"
                      params={{ caseId: c.id }}
                      className="group flex h-full flex-col overflow-hidden rounded-lg border border-[#1A1A1A] bg-[#0B0B0B] transition-all duration-300 hover:border-[#B31217]/50 hover:shadow-[0_20px_40px_rgba(179,18,23,0.12)]"
                      style={{ boxShadow: "inset 0 1px 1px rgba(255, 255, 255, 0.02)" }}
                    >
                      {/* Top Image */}
                      <div className="relative h-[210px] w-full overflow-hidden bg-neutral-900">
                        <img
                          src={c.image}
                          alt={c.title}
                          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 filter grayscale group-hover:grayscale-0"
                        />
                        {/* Shadow overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-transparent to-transparent opacity-90" />

                        {/* Status Badge */}
                        <span
                          className={`absolute top-4 left-4 inline-flex items-center gap-1.5 font-mono text-[8px] font-bold tracking-[0.2em] uppercase px-2.5 py-1 rounded-[3px] border shadow-md backdrop-blur-md transition-all duration-300 ${
                            c.status === "UNSOLVED"
                              ? "bg-black/90 text-[#FF4A50] border-[#C81D24]/60 shadow-[0_0_12px_rgba(200,29,36,0.35)]"
                              : c.status === "COMPLETED" || c.status === "SOLVED"
                              ? "bg-black/90 text-emerald-400 border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                              : "bg-black/85 text-neutral-400 border-white/10 shadow-[0_0_8px_rgba(0,0,0,0.6)]"
                          }`}
                        >
                          <span
                            className={`inline-block w-1.5 h-1.5 rounded-full ${
                              c.status === "UNSOLVED" 
                                ? "bg-[#C81D24] animate-pulse" 
                                : c.status === "COMPLETED" || c.status === "SOLVED"
                                ? "bg-emerald-400"
                                : "bg-neutral-600"
                            }`}
                          />
                          {c.status || "UNSOLVED"}
                        </span>
                      </div>

                      {/* Content Area */}
                      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <p className="font-mono text-[10px] tracking-[0.16em] text-[#9A9A9A] uppercase mb-1">
                            {c.number}
                          </p>
                          <h3
                            className="font-display text-[24px] sm:text-[26px] text-white tracking-[0.5px] leading-tight uppercase group-hover:text-[#B31217] transition-colors duration-300 mb-1"
                            style={{ fontFamily: "Bebas Neue, sans-serif" }}
                          >
                            {c.title}
                          </h3>
                          {c.description && (
                            <p className="font-sans text-[11.5px] text-white/50 line-clamp-2 leading-relaxed mb-2">
                              {c.description}
                            </p>
                          )}
                        </div>

                        {/* Price & Buy Now Action Row */}
                        {(() => {
                          const currentPrice = c.price != null ? Number(c.price) : 999;
                          const origPrice = c.originalPrice != null ? Number(c.originalPrice) : (c.original_price != null ? Number(c.original_price) : 1499);
                          const shipFee = c.shippingFee != null ? Number(c.shippingFee) : (c.shipping_fee != null ? Number(c.shipping_fee) : 0);
                          const discountPct = origPrice > currentPrice ? Math.round(((origPrice - currentPrice) / origPrice) * 100) : 0;
                          const isPurchasable = c.status !== "COMING SOON";

                          return (
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
                                <span className="inline-flex items-center gap-1.5 rounded-[5px] bg-[#D32F2F] group-hover:bg-[#B71C1C] text-white px-3 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.16em] shadow-[0_0_12px_rgba(211,47,47,0.35)] transition-all duration-300">
                                  <ShoppingBag className="w-2.5 h-2.5" />
                                  Buy Now
                                </span>
                              ) : (
                                <span className="font-mono text-[8.5px] font-bold uppercase tracking-wider text-white/40">
                                  Coming Soon
                                </span>
                              )}
                            </div>
                          );
                        })()}

                        {/* Metadata Row */}
                        <div className="border-t border-[#1A1A1A]/60 pt-3 mt-2 flex items-center justify-between text-[11px] font-mono tracking-wider">
                          <div className="flex gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${
                                  i < c.stars ? "text-[#B31217] fill-[#B31217]" : "text-neutral-800"
                                }`}
                              />
                            ))}
                          </div>

                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span className="uppercase text-[9px]">{c.duration}</span>
                          </div>

                          <span className="text-[#C21C22] font-semibold text-[9px] uppercase tracking-widest">
                            {c.difficulty}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </SwiperSlide>
                ))}
              </Swiper>

              <button
                ref={prevBtn}
                type="button"
                aria-label="Previous case"
                onClick={() => swiperRef.current?.swiper.slidePrev()}
                className="cases-arrow left-0"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                ref={nextBtn}
                type="button"
                aria-label="Next case"
                onClick={() => swiperRef.current?.swiper.slideNext()}
                className="cases-arrow right-0"
              >
                <ChevronRight className="h-5 w-5" />
              </button>

              <div className="cases-pagination mt-4 flex justify-center gap-2" />
            </div>

            <style>{`
              .cases-coverflow {
                width: 100%;
                padding: 16px 0 12px;
                overflow: visible;
              }
              .cases-coverflow .swiper-slide {
                width: 320px;
                height: 440px;
                transition: opacity 0.4s ease;
                transform-style: preserve-3d;
              }
              .cases-coverflow .swiper-slide-prev,
              .cases-coverflow .swiper-slide-next {
                opacity: 0.55;
              }
              .cases-coverflow .swiper-slide-shadow-coverflow {
                background: rgba(0, 0, 0, 0.55) !important;
                border-radius: 8px;
              }
              .cases-coverflow .swiper-pagination-bullet {
                width: 0.375rem;
                height: 0.375rem;
                border-radius: 9999px;
                background: rgba(255, 255, 255, 0.22);
                opacity: 1;
                transition: all 0.3s ease;
              }
              .cases-coverflow .swiper-pagination-bullet-active {
                width: 1.5rem;
                background: #b31217;
              }
              .cases-arrow {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                z-index: 30;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 2.5rem;
                height: 2.5rem;
                border-radius: 9999px;
                border: 1px solid #1a1a1a;
                background: #0b0b0b;
                color: #b31217;
                cursor: pointer;
                transition: border-color 0.3s, background 0.3s, opacity 0.3s;
              }
              .cases-arrow:hover {
                border-color: rgba(179, 18, 23, 0.6);
                background: rgba(179, 18, 23, 0.15);
              }
            `}</style>
          </main>

        {/* HOW IT WORKS + CASE STATISTICS */}
        <section className="mt-16 sm:mt-24 lg:mt-32 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-8 sm:mb-10">
              <span className="h-4 w-1 bg-[#B31217]" />
              <h3 className="font-display text-[15px] font-bold text-white tracking-[1.5px] uppercase" style={{ fontFamily: "Bebas Neue, sans-serif" }}>
                How it works
              </h3>
            </div>

            <div className="flex flex-col gap-8 sm:gap-12">
              {[
                { step: "01", title: "Purchase a Case", desc: "Choose a case and get your evidence box delivered." },
                { step: "02", title: "Examine Evidence", desc: "Analyze documents, photos, audio and other clues." },
                { step: "03", title: "Connect the Dots", desc: "Use logic and deduction to uncover the truth." },
                { step: "04", title: "Submit Your Report", desc: "Submit your conclusions and unlock the truth." },
              ].map((s) => (
                <div key={s.step} className="flex flex-col gap-1.5 sm:gap-2">
                  <SkiperTextRevealH
                    className="font-mono text-[12px] sm:text-[13px] tracking-[0.3em] text-[#B31217] uppercase"
                  >
                    Step {s.step}
                  </SkiperTextRevealH>
                  <SkiperTextRevealH
                    className="font-display text-[clamp(1.75rem,6.5vw,3.5rem)] font-bold uppercase leading-[1.05] tracking-wide text-white"
                    style={{ fontFamily: "Bebas Neue, sans-serif" }}
                  >
                    {s.title}
                  </SkiperTextRevealH>
                  <SkiperTextRevealH className="text-[13px] sm:text-[14px] text-[#888] leading-relaxed max-w-2xl">
                    {s.desc}
                  </SkiperTextRevealH>
                </div>
              ))}
            </div>
          </div>

          {/* Case Statistics */}
          <aside className="lg:sticky lg:top-[96px] mt-4 lg:mt-0">
            <section className="bg-[#0B0B0B] border border-[#1A1A1A] rounded-xl p-5 sm:p-9 relative overflow-hidden" style={{ boxShadow: "inset 0 1px 1px rgba(255, 255, 255, 0.02)" }}>
              <div className="flex items-center gap-3 mb-6 sm:mb-8">
                <span className="h-5 w-1 bg-[#B31217]" />
                <h3 className="font-display text-[16px] sm:text-[18px] font-bold text-white tracking-[1.5px] uppercase" style={{ fontFamily: "Bebas Neue, sans-serif" }}>
                  Case Statistics
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:gap-5">
                <div className="p-4 sm:p-8 bg-neutral-950/60 border border-white/5 rounded-lg flex flex-col items-center text-center">
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full border border-white/5 bg-[#0B0B0B] flex items-center justify-center mb-3 sm:mb-4">
                    <FolderOpen className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground" />
                  </div>
                  <span className="font-display text-[36px] sm:text-[48px] font-bold text-white leading-none" style={{ fontFamily: "Bebas Neue, sans-serif" }}>
                    {siteSettings.stats_total_cases || String(liveCases.length).padStart(2, "0")}
                  </span>
                  <span className="text-[10px] sm:text-[11px] text-[#A0A0A0] tracking-widest uppercase mt-2 sm:mt-3">
                    {siteSettings.stats_total_cases_label || "Total Cases"}
                  </span>
                </div>
                <div className="p-4 sm:p-8 bg-neutral-950/60 border border-white/5 rounded-lg flex flex-col items-center text-center">
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full border border-white/5 bg-[#0B0B0B] flex items-center justify-center mb-3 sm:mb-4">
                    <Eye className="h-5 w-5 sm:h-6 sm:w-6 text-[#B31217]" />
                  </div>
                  <span className="font-display text-[36px] sm:text-[48px] font-bold text-white leading-none" style={{ fontFamily: "Bebas Neue, sans-serif" }}>
                    {siteSettings.stats_unsolved_cases || String(liveCases.filter((c) => c.status === "UNSOLVED").length).padStart(2, "0")}
                  </span>
                  <span className="text-[10px] sm:text-[11px] text-[#A0A0A0] tracking-widest uppercase mt-2 sm:mt-3">
                    {siteSettings.stats_unsolved_cases_label || "Unsolved"}
                  </span>
                </div>
                <div className="p-4 sm:p-8 bg-neutral-950/60 border border-white/5 rounded-lg flex flex-col items-center text-center">
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full border border-white/5 bg-[#0B0B0B] flex items-center justify-center mb-3 sm:mb-4">
                    <SearchCheck className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground" />
                  </div>
                  <span className="font-display text-[36px] sm:text-[48px] font-bold text-white leading-none" style={{ fontFamily: "Bebas Neue, sans-serif" }}>
                    {siteSettings.stats_completed_cases || String(liveCases.filter((c) => c.status === "COMPLETED" || c.status === "SOLVED").length).padStart(2, "0")}
                  </span>
                  <span className="text-[10px] sm:text-[11px] text-[#A0A0A0] tracking-widest uppercase mt-2 sm:mt-3">
                    {siteSettings.stats_completed_cases_label || "Completed"}
                  </span>
                </div>
                <div className="p-4 sm:p-8 bg-neutral-950/60 border border-white/5 rounded-lg flex flex-col items-center text-center">
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full border border-white/5 bg-[#0B0B0B] flex items-center justify-center mb-3 sm:mb-4">
                    <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground" />
                  </div>
                  <span className="font-display text-[36px] sm:text-[48px] font-bold text-white leading-none" style={{ fontFamily: "Bebas Neue, sans-serif" }}>
                    {siteSettings.stats_detectives_count || "10K+"}
                  </span>
                  <span className="text-[10px] sm:text-[11px] text-[#A0A0A0] tracking-widest uppercase mt-2 sm:mt-3">
                    {siteSettings.stats_detectives_label || "Detectives"}
                  </span>
                </div>
              </div>
            </section>
          </aside>
        </section>

      </div>
    </div>
  );
}
