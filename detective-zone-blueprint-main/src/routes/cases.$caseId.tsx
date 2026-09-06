import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { 
  ArrowLeft, 
  ArrowRight, 
  Star, 
  Lock, 
  ShoppingBag, 
  Truck, 
  ShieldCheck, 
  Clock, 
  MessageSquare, 
  CheckCircle2,
  PackageCheck
} from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useCart } from "@/context/CartContext";

import { S3_MEDIA } from "@/lib/media";

const caseVoicemail = S3_MEDIA.cases.caseVoicemail;
const caseWitness = S3_MEDIA.cases.caseWitness;
const caseLetter = S3_MEDIA.cases.caseLetter;
const caseHeir = S3_MEDIA.cases.caseHeir;
const caseExperiment = S3_MEDIA.cases.caseExperiment;
const caseBetrayal = S3_MEDIA.cases.caseBetrayal;
const corkboard = S3_MEDIA.evidence.corkboard;
const e01 = S3_MEDIA.evidence.e01;
const e02 = S3_MEDIA.evidence.e02;
const e03 = S3_MEDIA.evidence.e03;
const e04 = S3_MEDIA.evidence.e04;
const e05 = S3_MEDIA.evidence.e05;
const e06 = S3_MEDIA.evidence.e06;
const e07 = S3_MEDIA.evidence.e07;
const e08 = S3_MEDIA.evidence.e08;
const e09 = S3_MEDIA.evidence.e09;
const e10 = S3_MEDIA.evidence.e10;
const e11 = S3_MEDIA.evidence.e11;
const e12 = S3_MEDIA.evidence.e12;
import { EvidenceWall, type EvidencePin } from "@/components/templates/evidence-wall";
import { HeroVideoCard } from "@/components/templates/hero-video-card";
import { InvestigationModules } from "@/components/templates/investigation-modules";
import { QuoteBanner } from "@/components/templates/quote-banner";
const case001Video = S3_MEDIA.case001Video;

export const Route = createFileRoute("/cases/$caseId")({
  component: CaseDetailPage,
  notFoundComponent: CaseNotFound,
});

type CaseFile = {
  id: string;
  title: string;
  status: "UNSOLVED" | "COMPLETED" | "COMING SOON";
  image: string;
  description: string;
  stars: number;
  duration: string;
  difficulty: string;
  caseType: string;
  dateOfIncident: string;
  location: string;
  price?: number;
  originalPrice?: number;
  shippingFee?: number;
  pins: EvidencePin[];
  links: [number, number][];
};

const caseFiles: Record<string, CaseFile> = {
  "001": {
    id: "001",
    title: "The Last Voicemail",
    status: "UNSOLVED",
    image: caseVoicemail,
    description:
      "A successful businessman found dead in his study. No forced entry. No clear motive. Just a voicemail… and a lot of questions.",
    stars: 5,
    duration: "3–5 HOURS",
    difficulty: "HARD",
    caseType: "Homicide",
    dateOfIncident: "15 July 2027",
    location: "Varma Residence",
    price: 1199,
    originalPrice: 1501,
    shippingFee: 80,
    pins: [
      {
        id: "vm",
        x: 14,
        y: 22,
        label: "Voicemail",
        note: "3:47 AM. \"It's already done. Don't look for me.\"",
        image: e01,
      },
      {
        id: "card",
        x: 45,
        y: 24,
        label: "Business Card",
        note: "Found under the desk. Dated the night before.",
        image: e02,
      },
      {
        id: "receipt",
        x: 78,
        y: 24,
        label: "Receipt",
        note: "Dinner for two. Not his wife's handwriting.",
        image: e03,
      },
      {
        id: "key",
        x: 16,
        y: 68,
        label: "Door Key",
        note: "Unmatched to any lock in the house.",
        image: e04,
      },
      {
        id: "photo",
        x: 48,
        y: 72,
        label: "Photograph",
        note: "Torn in half. A face cut away with scissors.",
        image: e05,
      },
      {
        id: "note",
        x: 82,
        y: 66,
        label: "Handwritten Note",
        note: '"The hand that writes points there."',
        image: e06,
      },
    ],
    links: [
      [0, 1],
      [1, 2],
      [0, 3],
      [3, 4],
      [4, 5],
      [2, 5],
    ],
  },
  "002": {
    id: "002",
    title: "The Silent Witness",
    status: "UNSOLVED",
    image: caseWitness,
    description:
      "A reclusive writer found dead in a locked room. A witness that never spoke... but saw everything.",
    stars: 4,
    duration: "3–6 HOURS",
    difficulty: "HARD",
    caseType: "Locked Room",
    dateOfIncident: "22 June 2027",
    location: "Morrow House",
    price: 1450,
    originalPrice: 1899,
    shippingFee: 0,
    pins: [
      {
        id: "mss",
        x: 14,
        y: 20,
        label: "Manuscript",
        note: "Final chapter rewritten eleven times.",
        image: e07,
      },
      {
        id: "lamp",
        x: 44,
        y: 14,
        label: "Desk Lamp",
        note: "Bulb still warm. Nobody in the room.",
        image: e08,
      },
      {
        id: "lock",
        x: 72,
        y: 30,
        label: "Locked Door",
        note: "Bolt thrown from the inside.",
        image: e09,
      },
      {
        id: "glass",
        x: 30,
        y: 62,
        label: "Glass Shard",
        note: "Three fingerprints. Two of them his.",
        image: e10,
      },
      {
        id: "book",
        x: 60,
        y: 70,
        label: "Open Diary",
        note: 'Last entry: "They know I saw."',
        image: e11,
      },
      {
        id: "phone",
        x: 86,
        y: 58,
        label: "Phone",
        note: "One call out. To a number that doesn't exist.",
        image: e12,
      },
    ],
    links: [
      [0, 1],
      [1, 2],
      [0, 3],
      [3, 4],
      [4, 5],
      [2, 5],
    ],
  },
  "003": {
    id: "003",
    title: "Blood in the Letter",
    status: "COMING SOON",
    image: caseLetter,
    description:
      "A threatening letter. A missing girl. A trail of blood. The shadows are speaking.",
    stars: 0,
    duration: "COMING SOON",
    difficulty: "MEDIUM",
    caseType: "Classified",
    dateOfIncident: "TBD",
    location: "Redacted",
    price: 899,
    originalPrice: 1399,
    shippingFee: 0,
    pins: [
      {
        id: "letter",
        x: 16,
        y: 22,
        label: "Letter",
        note: "Typed. Postmark from a town that burned down.",
      },
      {
        id: "stamp",
        x: 44,
        y: 14,
        label: "Blood Stain",
        note: "Dried on the fold. Dated before the threat.",
      },
      {
        id: "photo",
        x: 72,
        y: 30,
        label: "Photo",
        note: "A girl in a yellow coat. Face circled in red.",
      },
      {
        id: "map",
        x: 30,
        y: 62,
        label: "Map",
        note: "A route marked in pencil. Ends at the river.",
      },
      { id: "shoe", x: 60, y: 70, label: "Shoe Print", note: "Left behind. Size too small." },
      { id: "note", x: 86, y: 58, label: "Note", note: '"The shadows are speaking."' },
    ],
    links: [
      [0, 1],
      [1, 2],
      [0, 3],
      [3, 4],
      [4, 5],
      [2, 5],
    ],
  },
  "004": {
    id: "004",
    title: "The Vanished One",
    status: "COMING SOON",
    image: caseHeir,
    description:
      "They were here one day, gone the next. A disappearance that made no noise at all.",
    stars: 0,
    duration: "COMING SOON",
    difficulty: "MEDIUM",
    caseType: "Classified",
    dateOfIncident: "TBD",
    location: "Redacted",
    price: 999,
    originalPrice: 1499,
    shippingFee: 0,
    pins: [
      { id: "bed", x: 16, y: 22, label: "Bed", note: "Unmade. Clothes still in the wardrobe." },
      { id: "keys", x: 44, y: 14, label: "Car Keys", note: "Left on the table. Engine cold." },
      { id: "wallet", x: 72, y: 30, label: "Wallet", note: "Cash untouched. Cards all there." },
      { id: "journal", x: 30, y: 62, label: "Journal", note: "Pages torn from the last week." },
      { id: "phone", x: 60, y: 70, label: "Phone", note: "Dead. Last message never sent." },
      { id: "coat", x: 86, y: 58, label: "Coat", note: "Hanging by the door. Still damp." },
    ],
    links: [
      [0, 1],
      [1, 2],
      [0, 3],
      [3, 4],
      [4, 5],
      [2, 5],
    ],
  },
  "005": {
    id: "005",
    title: "The Final Experiment",
    status: "COMING SOON",
    image: caseExperiment,
    description:
      "A scientist's last experiment was never meant to be found. Now the cure is the disease.",
    stars: 0,
    duration: "COMING SOON",
    difficulty: "HARD",
    caseType: "Classified",
    dateOfIncident: "TBD",
    location: "Redacted",
    price: 999,
    originalPrice: 1499,
    shippingFee: 0,
    pins: [
      { id: "vial", x: 16, y: 22, label: "Vial", note: "Label torn. A drop missing." },
      { id: "log", x: 44, y: 14, label: "Lab Log", note: "Stops mid-sentence. Ink smudged." },
      { id: "camera", x: 72, y: 30, label: "Camera", note: "Footage ends 11:47 PM." },
      { id: "stamp", x: 30, y: 62, label: "Stamp", note: "Classified. Redacted twice." },
      { id: "note", x: 60, y: 70, label: "Note", note: '"Now the cure is the disease."' },
      { id: "keycard", x: 86, y: 58, label: "Keycard", note: "Level 4 access. Used at 11:48 PM." },
    ],
    links: [
      [0, 1],
      [1, 2],
      [0, 3],
      [3, 4],
      [4, 5],
      [2, 5],
    ],
  },
  "006": {
    id: "006",
    title: "Shadows of Betrayal",
    status: "COMING SOON",
    image: caseBetrayal,
    description: "A man caught between loyalty and truth. One choice changed everything.",
    stars: 0,
    duration: "COMING SOON",
    difficulty: "HARD",
    caseType: "Classified",
    dateOfIncident: "TBD",
    location: "Redacted",
    price: 999,
    originalPrice: 1499,
    shippingFee: 0,
    pins: [
      { id: "letter", x: 16, y: 22, label: "Letter", note: "Unsigned. A name crossed out." },
      {
        id: "watch",
        x: 44,
        y: 14,
        label: "Watch",
        note: "Stopped at 11:47 PM. Second hand missing.",
      },
      { id: "receipt", x: 72, y: 30, label: "Receipt", note: "Two tickets. One name." },
      { id: "photo", x: 30, y: 62, label: "Photo", note: "Two men shaking hands. Faces blurred." },
      { id: "key", x: 60, y: 70, label: "Key", note: "Opens a drawer that shouldn't exist." },
      { id: "note", x: 86, y: 58, label: "Note", note: '"Trust no one."' },
    ],
    links: [
      [0, 1],
      [1, 2],
      [0, 3],
      [3, 4],
      [4, 5],
      [2, 5],
    ],
  },
};

function CaseDetailPage() {
  const { caseId } = Route.useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const initialFile = caseFiles[caseId] || caseFiles["001"];
  const [file, setFile] = useState<CaseFile>(initialFile);
  const [caseData, setCaseData] = useState<any>(null);
  const [pageData, setPageData] = useState<any>(null);

  const handleBuyNow = () => {
    addToCart({
      id: file.id,
      title: file.title,
      caseNumber: `CASE ${file.id}`,
      price: file.price ?? 999,
      shippingFee: file.shippingFee ?? 0,
      image: file.image,
      type: "Official Case Dossier Box",
    });
    navigate({ to: "/cart" });
  };

  useEffect(() => {
    const cleanNum = caseId.replace(/^CASE\s*#?/i, "").trim();
    const prodSlug = cleanNum.startsWith("p") ? cleanNum : `p${parseInt(cleanNum) || 1}`;

    Promise.all([
      api.getCase(caseId).catch(() => null),
      api.getCasePage(caseId).catch(() => null),
      api.getProduct(prodSlug).catch(() => null),
    ]).then(([cData, pData, prodData]) => {
      if (cData || prodData) {
        const activePrice = cData?.price != null 
          ? Number(cData.price) 
          : (prodData?.sale_price ? Number(prodData.sale_price) : (prodData?.price != null ? Number(prodData.price) : null));

        if (cData) setCaseData(cData);
        setFile((prev) => ({
          ...prev,
          title: cData?.title || (prodData?.name ? prodData.name.split(" — ")[0].split(" - ")[0] : prev.title),
          description: cData?.short_description || cData?.intro_text || prodData?.short_description || prev.description,
          status: (cData?.status as any) || prev.status,
          difficulty: cData?.difficulty || prev.difficulty,
          duration: cData?.estimated_duration || prev.duration,
          stars: cData?.rating ? Math.round(cData.rating) : prev.stars,
          image: (cData?.cover_image && !cData.cover_image.startsWith("/src")) 
            ? cData.cover_image 
            : (prodData?.cover_image && !prodData.cover_image.startsWith("/src") ? prodData.cover_image : prev.image),
          price: activePrice != null ? activePrice : prev.price,
          originalPrice: cData?.original_price != null ? Number(cData.original_price) : prev.originalPrice,
          shippingFee: cData?.shipping_fee != null ? Number(cData.shipping_fee) : prev.shippingFee,
        }));
      }

      if (pData) {
        setPageData(pData);
        setFile((prev) => {
          // If custom pins are configured in CMS, map them to EvidencePin objects
          let customPins: EvidencePin[] = prev.pins;
          if (pData.evidence_pins && pData.evidence_pins.length > 0) {
            const fallbackImages = [e01, e02, e03, e04, e05, e06, e07, e08, e09, e10, e11, e12];
            customPins = pData.evidence_pins.map((p: any, idx: number) => ({
              id: p.id || `pin_${idx}`,
              x: p.x,
              y: p.y,
              label: p.label,
              note: p.note,
              image: p.image_url || fallbackImages[idx % fallbackImages.length],
            }));
          }

          return {
            ...prev,
            caseType: pData.case_type || prev.caseType,
            dateOfIncident: pData.date_of_incident || prev.dateOfIncident,
            location: pData.location || prev.location,
            pins: customPins,
            description: pData.hero_subtitle || prev.description,
          };
        });
      }
    });
  }, [caseId]);

  if (!file) {
    return <CaseNotFound />;
  }

  const unlocked = file.status === "UNSOLVED";

  const titleCase = (s: string) =>
    s
      .toLowerCase()
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  const metaRows = [
    { label: "Case Status", value: titleCase(file.status) },
    { label: "Difficulty", value: titleCase(file.difficulty) },
    { label: "Investigation Time", value: titleCase(file.duration) },
    { label: "Case Type", value: file.caseType },
    { label: "Date of Incident", value: file.dateOfIncident },
    { label: "Location", value: file.location },
  ];

  // Dynamic Video: CMS configured URL or default video for 001
  const activeHeroVideo =
    file.id === "001"
      ? (pageData?.hero_video_url && !pageData.hero_video_url.includes("detective-scrub-fast")
          ? pageData.hero_video_url
          : case001Video)
      : (pageData?.hero_video_url || undefined);

  // Dynamic modules mapping
  const activeModules = pageData?.investigation_modules && pageData.investigation_modules.length > 0
    ? pageData.investigation_modules.map((m: any, idx: number) => ({
        n: idx + 1,
        icon: m.icon,
        title: m.heading,
        desc: m.body,
        pct: m.pct !== undefined ? m.pct : [75, 60, 45, 30, 40, 50, 35, 20][idx % 8],
      }))
    : undefined;

  return (
    <div className="min-h-screen bg-[#000000] text-[#C7C7C7] font-sans pt-[72px] relative overflow-hidden">
      <div className="relative z-10 mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-8">
        {/* PAGE HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end pb-7 mb-8 gap-4">
          <div className="font-mono text-[10px] tracking-[2px] text-muted-foreground uppercase">
            <Link to="/" className="hover:text-white transition-colors duration-300">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link to="/cases" className="hover:text-white transition-colors duration-300">
              Cases
            </Link>
            <span className="mx-2">/</span>
            <span className="text-[#B31217]">Case {file.id}</span>
          </div>
        </header>

        {/* CASE INTRO */}
        <section className="grid grid-cols-12 gap-8 mb-10 items-start">
          <div className="col-span-12 lg:col-span-5">
            <div className="relative rounded-lg overflow-hidden border border-[#1A1A1A]">
              <img src={file.image} alt={file.title} className="w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-transparent to-transparent opacity-80" />
            </div>
          </div>
          <div className="col-span-12 lg:col-span-7">
            <div className="flex items-center gap-3 mb-3">
              <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#B31217]">
                Case {file.id}
              </span>
              <span
                className={`px-2.5 py-1 font-mono text-[8px] font-bold tracking-[0.2em] uppercase rounded-sm ${
                  file.status === "UNSOLVED"
                    ? "bg-[#B31217] text-white"
                    : "bg-neutral-800 text-muted-foreground"
                }`}
              >
                {file.status}
              </span>
            </div>
            <h1
              className="font-display text-[clamp(2.25rem,8vw,3rem)] font-bold text-white tracking-[2px] leading-none uppercase mb-1"
              style={{ fontFamily: "Bebas Neue, sans-serif" }}
            >
              {file.title}
            </h1>
            <p className="text-[12px] text-[#A0A0A0] font-mono tracking-[1.5px] uppercase mb-4">
              Evidence wall — connect the dots
            </p>

            {/* Left-Aligned Premium Rate & Buy Now Action */}
            {(() => {
              const currentPrice = file.price ?? 999;
              const origPrice = file.originalPrice ?? 1499;
              const discountPct = Math.max(0, Math.round(((origPrice - currentPrice) / origPrice) * 100));

              return (
                <div className="space-y-4 my-6">
                  <div className="flex flex-wrap items-center justify-between gap-4 p-4 sm:p-5 rounded-xl border border-white/10 bg-gradient-to-r from-[#120505] via-[#0d0707] to-[#080808] shadow-[0_8px_30px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.06)]">
                    <div className="flex flex-col">
                      <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-[#9A9A9A]">Official Case Dossier Box</span>
                      <div className="flex items-baseline gap-2.5 mt-0.5">
                        <span className="font-mono text-[24px] sm:text-[26px] font-bold text-white tracking-wider">₹{currentPrice}</span>
                        <span className="font-mono text-[13px] text-white/35 line-through">₹{origPrice}</span>
                        {discountPct > 0 && (
                          <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-[#4ade80] bg-[#4ade80]/10 border border-[#4ade80]/20 px-2 py-0.5 rounded-[4px]">
                            {discountPct}% OFF
                          </span>
                        )}
                      </div>
                      <span className="font-mono text-[9px] text-[#4ade80] flex items-center gap-1 mt-1">
                        <CheckCircle2 className="h-3 w-3 inline shrink-0" />
                        In Stock • Dispatches Within 24 Hours
                      </span>
                    </div>

                    <button
                      onClick={handleBuyNow}
                      className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-[6px] border border-[#D32F2F] bg-gradient-to-r from-[#D32F2F] via-[#C62828] to-[#9A0007] px-6 py-3 font-mono text-[12px] font-bold uppercase tracking-[0.22em] text-white shadow-[0_0_24px_rgba(211,47,47,0.45),inset_0_1px_1px_rgba(255,255,255,0.35)] transition-all duration-300 hover:shadow-[0_0_36px_rgba(211,47,47,0.7)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                    >
                      <ShoppingBag className="relative z-10 h-4 w-4" />
                      <span className="relative z-10 font-bold">Order Case {file.id} — ₹{currentPrice}</span>
                      <ArrowRight className="relative z-10 h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                    </button>
                  </div>

                  {/* Practical Trust Guarantee Bar */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                    <div className="flex items-center gap-2 rounded border border-white/5 bg-[#0a0a0a] px-3 py-2">
                      <Truck className="h-3.5 w-3.5 text-[#D32F2F] shrink-0" />
                      <div>
                        <p className="font-mono text-[9.5px] font-semibold text-white uppercase tracking-wider">
                          {file.shippingFee && file.shippingFee > 0 ? `₹${file.shippingFee} Delivery Charge` : "Free Delivery"}
                        </p>
                        <p className="font-mono text-[8px] text-neutral-400">Pan-India (3–5 Days)</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 rounded border border-white/5 bg-[#0a0a0a] px-3 py-2">
                      <ShieldCheck className="h-3.5 w-3.5 text-[#D32F2F] shrink-0" />
                      <div>
                        <p className="font-mono text-[9.5px] font-semibold text-white uppercase tracking-wider">COD Available</p>
                        <p className="font-mono text-[8px] text-neutral-400">Pay cash upon delivery</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 rounded border border-white/5 bg-[#0a0a0a] px-3 py-2">
                      <PackageCheck className="h-3.5 w-3.5 text-[#D32F2F] shrink-0" />
                      <div>
                        <p className="font-mono text-[9.5px] font-semibold text-white uppercase tracking-wider">Evidence Sealed</p>
                        <p className="font-mono text-[8px] text-neutral-400">Tamper-proof guarantee</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 rounded border border-white/5 bg-[#0a0a0a] px-3 py-2">
                      <MessageSquare className="h-3.5 w-3.5 text-[#D32F2F] shrink-0" />
                      <div>
                        <p className="font-mono text-[9.5px] font-semibold text-white uppercase tracking-wider">Case Support</p>
                        <p className="font-mono text-[8px] text-neutral-400">+91 63057 29867</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            <div className="flex items-center gap-2 mb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < file.stars ? "text-[#B31217] fill-[#B31217]" : "text-neutral-800"}`}
                />
              ))}
            </div>
            <p className="text-[15px] leading-relaxed text-[#B5B5B5] max-w-2xl">
              {file.description}
            </p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5 border border-[#1A1A1A] bg-[#0B0B0B] rounded-lg p-6">
              {metaRows.map((row) => (
                <div key={row.label}>
                  <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-muted-foreground">
                    {row.label}
                  </p>
                  <p
                    className="mt-1 font-display text-[16px] text-white uppercase tracking-[1px]"
                    style={{ fontFamily: "Bebas Neue, sans-serif" }}
                  >
                    {row.value}
                  </p>
                </div>
              ))}
            </div>



            <Link
              to="/cases"
              className="mt-8 inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] uppercase text-muted-foreground hover:text-white transition-colors duration-300"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Case Files
            </Link>
          </div>
        </section>

        {/* INVESTIGATION MODULES */}
        <section className="mb-10">
          <InvestigationModules modules={activeModules} />
        </section>

        {/* CASE INTRO VIDEO */}
        <HeroVideoCard videoSrc={activeHeroVideo} />

        {/* EVIDENCE WALL */}
        <section className="border-t border-[#1A1A1A]/80 pt-8 sm:pt-10">
          <div className="mb-6 sm:mb-8">
            {/* Mobile Header (Matching Reference Image) */}
            <div className="block md:hidden">
              <div className="flex items-center gap-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#D32F2F] shadow-[0_0_10px_#D32F2F]" />
                <h2
                  className="font-display text-[26px] font-bold text-white tracking-[2px] uppercase leading-none"
                  style={{ fontFamily: "Bebas Neue, sans-serif" }}
                >
                  CASE KIT
                </h2>
              </div>
              <p className="text-[13px] text-[#A0A0A0] mt-2">
                Explore the evidence. Connect the dots.
              </p>
            </div>

            {/* Desktop Header */}
            <div className="hidden md:flex items-center gap-3">
              <span className="h-8 w-1 bg-[#B31217]" />
              <div>
                <h2
                  className="font-display text-[36px] font-bold text-white tracking-[2px] uppercase leading-none"
                  style={{ fontFamily: "Bebas Neue, sans-serif" }}
                >
                  Evidence Wall
                </h2>
                <p className="text-[12px] text-[#A0A0A0] font-mono tracking-[1.5px] uppercase mt-2">
                  {unlocked
                    ? "Hover the pins to inspect each piece. Follow the red string."
                    : "Locked until the case is released."}
                </p>
              </div>
            </div>
          </div>
          {unlocked ? (
            <EvidenceWall
              pins={file.pins}
              links={file.links}
              image={pageData?.evidence_wall_bg_url || corkboard}
              imageAlt="Corkboard evidence board"
              height="min(560px, 130vw)"
              accent="#D32F2F"
              background="#090909"
              imageOpacity={0.45}
            />
          ) : (
            <div
              className="flex flex-col items-center justify-center rounded-2xl border border-[#1A1A1A] bg-[#0B0B0B] text-center"
              style={{ height: "min(560px, 130vw)" }}
            >
              <Lock className="h-10 w-10 text-muted-foreground mb-4" />
              <p
                className="font-display text-[24px] text-white uppercase tracking-[1.5px]"
                style={{ fontFamily: "Bebas Neue, sans-serif" }}
              >
                Case Classified
              </p>
              <p className="mt-2 max-w-sm font-mono text-[11px] leading-relaxed text-muted-foreground uppercase tracking-[0.12em]">
                This case file is sealed. Return when the investigation is released.
              </p>
            </div>
          )}
        </section>

        {/* BOARD DETAIL STRIP */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
          {[
            { t: "Room 104", s: "Hotel Key — serial legible" },
            { t: "11:47 PM", s: "Pocket Watch — stopped" },
            { t: "No. 404", s: "Sticky note — ask about the key" },
          ].map((c) => (
            <div
              key={c.t}
              className="p-5 bg-[#0B0B0B] border border-[#1A1A1A] rounded-lg"
              style={{ boxShadow: "inset 0 1px 1px rgba(255,255,255,0.02)" }}
            >
              <p
                className="font-display text-[28px] text-[#B31217] leading-none"
                style={{ fontFamily: "Bebas Neue, sans-serif" }}
              >
                {c.t}
              </p>
              <p className="mt-2 font-mono text-[9px] tracking-[0.15em] uppercase text-muted-foreground">
                {c.s}
              </p>
            </div>
          ))}
        </section>



        {/* QUOTE BANNER */}
        <section className="mt-8">
          <QuoteBanner quote={pageData?.quote_text} author={pageData?.quote_author} />
        </section>
      </div>
    </div>
  );
}

function CaseNotFound() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#C7C7C7] font-sans pt-[72px] flex items-center justify-center">
      <div className="text-center px-8">
        <p
          className="font-display text-[48px] text-[#B31217] leading-none"
          style={{ fontFamily: "Bebas Neue, sans-serif" }}
        >
          404
        </p>
        <p className="mt-3 font-mono text-[11px] tracking-[0.2em] uppercase text-muted-foreground">
          Case file not found
        </p>
        <Link
          to="/cases"
          className="mt-8 inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] uppercase text-[#B31217] hover:text-white transition-colors duration-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Case Files
        </Link>
      </div>
    </div>
  );
}
