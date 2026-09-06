import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { useCart } from "@/context/CartContext";
import { api } from "@/lib/api";
import {
  Search,
  ShoppingCart,
  Star,
  Lock,
  Award,
  Shield,
  Eye,
  X,
  MapPin,
  Clock,
  Plus,
  Minus,
  ArrowRight,
  ChevronUp,
  ChevronDown,
  Play,
  Boxes,
  Package,
  FlaskConical,
  Gem,
  KeyRound,
  Map,
  ClipboardList,
  FolderOpen,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  CaseKitsEvidence,
  CaseKitCards,
  type KitEvidenceItem,
} from "@/components/templates/CaseKitsEvidence";
import { S3_MEDIA } from "@/lib/media";

const caseVoicemail = S3_MEDIA.cases.caseVoicemail;
const caseWitness = S3_MEDIA.cases.caseWitness;
const caseLetter = S3_MEDIA.cases.caseLetter;
const caseBetrayal = S3_MEDIA.cases.caseBetrayal;
const caseHeir = S3_MEDIA.cases.caseHeir;
const caseExperiment = S3_MEDIA.cases.caseExperiment;
const evidenceRoom = S3_MEDIA.evidenceRoom;
const dz001Kit = S3_MEDIA.caseKits.dz001Kit;
const sigAudio = S3_MEDIA.signature.audio;
const sigCamera = S3_MEDIA.signature.camera;
const sigFiles = S3_MEDIA.signature.files;
const sigMobile = S3_MEDIA.signature.mobile;
const sigPuzzle = S3_MEDIA.signature.puzzle;
const sigTime = S3_MEDIA.signature.time;

export const Route = createFileRoute("/store")({
  component: StorePage,
});

/* ─── data ─── */
interface Product {
  id: string;
  caseNumber: string;
  title: string;
  description: string;
  price: number;
  shippingFee?: number;
  image: string;
  badge: string;
  stars: number;
  reviews: number;
  difficulty: string;
  duration: string;
  type: "physical" | "digital" | "hybrid";
  stock: number;
}

const products: Product[] = [
  {
    id: "p1",
    caseNumber: "CASE 001",
    title: "The Last Voicemail",
    description:
      "A successful businessman found dead in his study. No forced entry. Just a voicemail… and a lot of questions. Every clue leads deeper into a web of secrets no one was meant to uncover.",
    price: 999,
    image: caseVoicemail,
    badge: "IN STOCK · 10 UNITS",
    stars: 5,
    reviews: 124,
    difficulty: "Hard",
    duration: "3–5 hrs",
    type: "hybrid",
    stock: 10,
  },
  {
    id: "p2",
    caseNumber: "CASE 002",
    title: "The Silent Witness",
    description:
      "A reclusive writer found dead in a locked room. A witness that never spoke… but saw everything. The pages of the final manuscript hold the key to a truth buried in silence.",
    price: 999,
    image: caseWitness,
    badge: "OUT OF STOCK",
    stars: 5,
    reviews: 98,
    difficulty: "Hard",
    duration: "3–6 hrs",
    type: "hybrid",
    stock: 0,
  },
  {
    id: "p3",
    caseNumber: "CASE 003",
    title: "Blood in the Letter",
    description:
      "A threatening letter. A missing girl. A trail of blood. The shadows are speaking. Follow the crimson ink before the next message arrives — and the clock runs out.",
    price: 999,
    image: caseLetter,
    badge: "OUT OF STOCK",
    stars: 4,
    reviews: 76,
    difficulty: "Medium",
    duration: "2–4 hrs",
    type: "physical",
    stock: 0,
  },
  {
    id: "p4",
    caseNumber: "CASE 004",
    title: "Shadows of Betrayal",
    description:
      "A man caught between loyalty and truth. One choice changed everything. Trust no one. Deception runs deep, and the betrayer may be closer than you think.",
    price: 999,
    image: caseBetrayal,
    badge: "OUT OF STOCK",
    stars: 5,
    reviews: 64,
    difficulty: "Expert",
    duration: "4–7 hrs",
    type: "hybrid",
    stock: 0,
  },
  {
    id: "p5",
    caseNumber: "CASE 005",
    title: "The Vanished One",
    description:
      "They were here one day, gone the next. A disappearance that made no noise at all. No goodbye, no trace — just an empty room and a question that haunts everyone.",
    price: 999,
    image: caseHeir,
    badge: "OUT OF STOCK",
    stars: 4,
    reviews: 42,
    difficulty: "Medium",
    duration: "3–5 hrs",
    type: "physical",
    stock: 0,
  },
  {
    id: "p6",
    caseNumber: "CASE 006",
    title: "The Final Experiment",
    description:
      "A scientist's last experiment was never meant to be found. Now the cure is the disease. The lab notes tell a story of obsession, and the final formula changes everything.",
    price: 999,
    image: caseExperiment,
    badge: "OUT OF STOCK",
    stars: 5,
    reviews: 83,
    difficulty: "Hard",
    duration: "4–6 hrs",
    type: "hybrid",
    stock: 0,
  },
];

interface KitBoxItem {
  icon: LucideIcon;
  label: string;
  note: string;
}

interface CaseKit {
  id: string;
  name: string;
  tagline: string;
  image: string;
  badge: string;
  price: number;
  originalPrice: number;
  cases: { number: string; title: string; difficulty: string }[];
  box: KitBoxItem[];
}

const caseKits: CaseKit[] = [
  {
    id: "kit2",
    name: "The Signature Collection",
    tagline: "The complete archive. Every flagship case, every clue, one evidence locker.",
    image: evidenceRoom,
    badge: "SAVE 12%",
    price: 3499,
    originalPrice: 3996,
    cases: [
      { number: "CASE 001", title: "The Last Voicemail", difficulty: "Hard" },
      { number: "CASE 002", title: "The Silent Witness", difficulty: "Hard" },
      { number: "CASE 003", title: "Blood in the Letter", difficulty: "Medium" },
      { number: "CASE 004", title: "Shadows of Betrayal", difficulty: "Expert" },
    ],
    box: [
      { icon: Package, label: "Signature Evidence Box", note: "Rigid collector case" },
      { icon: ClipboardList, label: "Complete Case Files", note: "4 full dossiers" },
      { icon: FlaskConical, label: "Evidence Vials", note: "Lab-sealed samples" },
      { icon: Map, label: "Investigation Blueprint", note: "Crime-scene floor plan" },
      { icon: KeyRound, label: "Replica Room Keys", note: "Prop evidence" },
      { icon: Gem, label: "Collector Case Card", note: "Numbered edition" },
    ],
  },
];

interface CartItem {
  product: Product;
  qty: number;
}

/* ─── helper ─── */
const fmt = (n: number) => "₹" + n.toLocaleString("en-IN");

/* ─── scroll reveal component ─── */
function ScrollReveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.05,
        rootMargin: "0px 0px -10% 0px",
      },
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0) scale(1)" : "translateY(50px) scale(0.97)",
        transition: `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

/* ─── component ─── */
function StorePage() {
  const [liveProducts, setLiveProducts] = useState<Product[]>(products);
  const [featuredSettings, setFeaturedSettings] = useState({
    code: "DZ-001",
    title: "The Last Voicemail",
    hover_title: "The Case Is Open.",
    quote: '"A sealed case. A missing voice. Thirty pieces of evidence standing between you and the truth."',
    price: 999,
    duration: "3–4",
    level: "Expert",
    image: dz001Kit,
  });

  const [quickView, setQuickView] = useState<Product | null>(null);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const [cartOpen, setCartOpen] = useState(false);
  const [storeTab, setStoreTab] = useState<"CASES" | "KITS">("CASES");
  const [liveSignatures, setLiveSignatures] = useState<any[]>([]);
  const featuredRef = useRef<HTMLDivElement>(null);
  const [featuredParallax, setFeaturedParallax] = useState(0);
  const [dz001Hovered, setDz001Hovered] = useState(false);

  useEffect(() => {
    Promise.all([
      api.getProducts().catch(() => []),
      api.getCases().catch(() => []),
      api.getSettings().catch(() => ({})),
      api.getSignatures().catch(() => []),
    ]).then(([prods, cases, sets, sigs]: [any[], any[], any, any[]]) => {
      if (sigs && Array.isArray(sigs) && sigs.length > 0) {
        setLiveSignatures(sigs);
      }

      const caseMap: Record<string, any> = {};
      if (cases && Array.isArray(cases) && cases.length > 0) {
        cases.forEach((c: any) => {
          const num = c.case_number ? c.case_number.replace(/^CASE\s*#?/i, "").trim().padStart(3, "0") : "";
          if (num) caseMap[num] = c;
          if (c.slug) caseMap[c.slug.toLowerCase().trim()] = c;
          if (c.title) caseMap[c.title.toLowerCase().trim()] = c;
        });
      }

      if (prods && Array.isArray(prods) && prods.length > 0) {
        const imageMap: Record<string, string> = {
          p1: caseVoicemail,
          p2: caseWitness,
          p3: caseLetter,
          p4: caseBetrayal,
          p5: caseHeir,
          p6: caseExperiment,
        };
        const mapped = prods.map((p: any, idx: number) => {
          const cleanSkuNum = p.sku ? p.sku.replace("DZ-KIT-", "").replace("CASE", "").trim().padStart(3, "0") : `00${idx + 1}`;
          const cleanTitle = (p.name ? p.name.split(" — ")[0].split(" - ")[0] : "").toLowerCase().trim();
          const matchedCase = caseMap[cleanSkuNum] || caseMap[p.slug?.toLowerCase().trim()] || caseMap[cleanTitle];

          let finalPrice = 999;
          if (p.sale_price != null && p.sale_price !== "" && !isNaN(Number(p.sale_price))) {
            finalPrice = Number(p.sale_price);
          } else if (matchedCase?.price != null && Number(matchedCase.price) !== 999) {
            finalPrice = Number(matchedCase.price);
          } else if (p.price != null && Number(p.price) !== 999) {
            finalPrice = Number(p.price);
          } else if (matchedCase?.price != null) {
            finalPrice = Number(matchedCase.price);
          } else if (p.price != null) {
            finalPrice = Number(p.price);
          }

          const rawTitle = p.name ? p.name.split(" — ")[0].split(" - ")[0] : (matchedCase?.title || p.name);

          return {
            id: p.slug || `p${idx + 1}`,
            caseNumber: p.sku ? p.sku.replace("DZ-KIT-", "CASE ") : `CASE 00${idx + 1}`,
            title: rawTitle,
            description: p.short_description || matchedCase?.short_description || "",
            price: finalPrice,
            shippingFee: matchedCase?.shipping_fee != null ? Number(matchedCase.shipping_fee) : (p.shipping_fee != null ? Number(p.shipping_fee) : 0),
            image: (p.cover_image && !p.cover_image.startsWith("/src")) 
              ? p.cover_image 
              : (matchedCase?.cover_image && !matchedCase.cover_image.startsWith("/src")
                ? matchedCase.cover_image
                : (imageMap[p.slug] || imageMap[`p${idx + 1}`] || caseVoicemail)),
            badge: idx === 0 ? "BESTSELLER" : idx === 1 ? "BESTSELLER" : idx === 2 ? "NEW" : idx === 3 ? "COLLECTOR" : idx === 4 ? "CLASSIFIED" : "TOP SECRET",
            stars: matchedCase?.rating ? Math.round(Number(matchedCase.rating)) : 5,
            reviews: 80 + idx * 10,
            difficulty: matchedCase?.difficulty || "Hard",
            duration: matchedCase?.estimated_duration || "3–5 hrs",
            type: "hybrid" as const,
            stock: p.stock_quantity ?? 10,
          };
        });
        setLiveProducts(mapped);
      } else if (cases && Array.isArray(cases) && cases.length > 0) {
        const imageMap: Record<string, string> = {
          "001": caseVoicemail,
          "002": caseWitness,
          "003": caseLetter,
          "004": caseHeir,
          "005": caseExperiment,
          "006": caseBetrayal,
        };
        const mapped = cases.map((c: any, idx: number) => {
          const num = c.case_number ? c.case_number.replace(/^CASE\s*/i, "") : `00${idx + 1}`;
          const img = (c.cover_image && !c.cover_image.startsWith("/src")) 
            ? c.cover_image 
            : (imageMap[num] || imageMap[c.slug] || caseVoicemail);
          return {
            id: `p${idx + 1}`,
            caseNumber: c.case_number?.startsWith("CASE") ? c.case_number : `CASE ${c.case_number}`,
            title: c.title,
            description: c.short_description || c.intro_text || "",
            price: c.price != null ? Number(c.price) : 999,
            image: img,
            badge: idx === 0 ? "BESTSELLER" : idx === 1 ? "BESTSELLER" : idx === 2 ? "NEW" : idx === 3 ? "COLLECTOR" : idx === 4 ? "CLASSIFIED" : "TOP SECRET",
            stars: c.rating ? Math.round(Number(c.rating)) : 5,
            reviews: 80 + idx * 10,
            difficulty: c.difficulty || "Hard",
            duration: c.estimated_duration || "3–5 hrs",
            type: "hybrid" as const,
            stock: 10,
          };
        });
        setLiveProducts(mapped);
      }

      // Safe, robust parsing of featured kit price from settings, product catalog, or case dossiers
      let featPrice = 1199;
      if (sets && sets.featured_kit_price) {
        const cleaned = String(sets.featured_kit_price).replace(/,/g, "").replace(/[^0-9.]/g, "");
        const num = parseFloat(cleaned);
        if (!isNaN(num) && num > 0) {
          featPrice = num;
        }
      } else if (prods && prods.length > 0) {
        const p1 = prods[0];
        if (p1.sale_price != null && !isNaN(Number(p1.sale_price)) && Number(p1.sale_price) > 0) {
          featPrice = Number(p1.sale_price);
        } else if (p1.price != null && !isNaN(Number(p1.price)) && Number(p1.price) > 0) {
          featPrice = Number(p1.price);
        }
      } else if (caseMap["001"]?.price) {
        featPrice = Number(caseMap["001"].price);
      }

      // Also ensure liveProducts[0] has matching synchronized price
      setLiveProducts((current) => {
        if (!current || current.length === 0) return current;
        return current.map((p, idx) => (idx === 0 ? { ...p, price: featPrice } : p));
      });

      if (sets && Object.keys(sets).length > 0) {
        setFeaturedSettings({
          code: sets.featured_kit_code || "DZ-001",
          title: sets.featured_kit_title || "The Last Voicemail",
          hover_title: sets.featured_kit_hover_title || "The Case Is Open.",
          quote: sets.featured_kit_quote || '"A sealed case. A missing voice. Thirty pieces of evidence standing between you and the truth."',
          price: featPrice,
          duration: sets.featured_kit_duration || "3–4",
          level: sets.featured_kit_level || "Expert",
          image: sets.featured_kit_image && !sets.featured_kit_image.startsWith("/src") ? sets.featured_kit_image : dz001Kit,
        });
      } else {
        setFeaturedSettings((prev) => ({
          ...prev,
          price: featPrice,
        }));
      }
    });
  }, []);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = featuredRef.current;
        if (!el || storeTab !== "CASES") return;
        const r = el.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const relativeScroll = (r.top + r.height / 2 - viewportHeight / 2) * 0.08;
        setFeaturedParallax(relativeScroll);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [storeTab]);

  const {
    items,
    addToCart: addGlobalCart,
    removeFromCart,
    updateQuantity,
    totalCount,
    subtotal,
  } = useCart();

  const addToCart = (p: Product) => {
    addGlobalCart({
      id: p.id,
      title: p.title,
      caseNumber: p.caseNumber,
      price: p.price,
      shippingFee: p.shippingFee ?? 0,
      image: p.image,
      type: p.type === "physical" ? "Physical Case Box" : "Hybrid Evidence Package",
    });
    setAddedIds((s) => {
      const n = new Set(s);
      n.add(p.id);
      return n;
    });
    setTimeout(
      () =>
        setAddedIds((s) => {
          const n = new Set(s);
          n.delete(p.id);
          return n;
        }),
      1200,
    );
  };

  const addKitToCart = (kit: CaseKit) => {
    addToCart({
      id: kit.id,
      caseNumber: "CASE KIT",
      title: kit.name,
      description: kit.tagline,
      price: kit.price,
      image: kit.image,
      badge: kit.badge,
      stars: 5,
      reviews: 0,
      difficulty: "Bundle",
      duration: "6–20 hrs",
      type: "physical",
      stock: 20,
    });
  };

  const kitsEvidence: KitEvidenceItem[] = caseKits.map((k) => ({
    id: k.id,
    code: k.id.replace(/kit/i, "KIT-").toUpperCase(),
    name: k.name,
    tagline: k.tagline,
    image: k.image,
    badge: k.badge,
    price: k.price,
    originalPrice: k.originalPrice,
    casesIncluded: k.cases.length,
    itemsInBox: k.box.length,
    save: k.originalPrice - k.price,
    box: k.box,
    cases: k.cases,
  }));

  const displayProducts = liveProducts.length > 0 ? liveProducts : products;

  return (
    <div
      style={{
        background: "#040404",
        minHeight: "100vh",
        paddingTop: 72,
      }}
    >
      {/* ---- Ambient vignette ---- */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%)",
        }}
      />
      {/* ---- Faint red ambient glow ---- */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, rgba(122,15,19,0.06) 0%, transparent 60%)",
        }}
      />

      {/* ---- dust particles ---- */}
      <style>{`
        @keyframes dust-float {
          0%,100%{ transform: translateY(0) translateX(0); opacity:0; }
          10%{ opacity:0.5; }
          50%{ transform: translateY(-180px) translateX(40px); opacity:0.3; }
          90%{ opacity:0; }
        }
        .dust-particle {
          position: fixed;
          width: 2px; height: 2px;
          background: rgba(255,255,255,0.15);
          border-radius: 50%;
          animation: dust-float 12s ease-in-out infinite;
          pointer-events: none;
          z-index: 1;
        }
        @keyframes card-glow {
          0%,100% { box-shadow: 0 0 0 rgba(200,29,36,0); }
          50% { box-shadow: 0 0 20px rgba(200,29,36,0.15); }
        }
        @keyframes fade-up { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        .fade-up { animation: fade-up 0.7s ease-out both; }
        .fade-up-d1 { animation-delay: 0.1s; }
        .fade-up-d2 { animation-delay: 0.2s; }
        .fade-up-d3 { animation-delay: 0.3s; }
        .fade-up-d4 { animation-delay: 0.4s; }
        @keyframes badge-pulse {
          0%,100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }
      `}</style>
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="dust-particle"
          style={{
            left: `${10 + i * 12}%`,
            top: `${30 + (i % 3) * 20}%`,
            animationDelay: `${i * 1.5}s`,
            animationDuration: `${10 + i * 2}s`,
          }}
        />
      ))}

      {/* ═══════ MAIN 2-COL LAYOUT ═══════ */}
      <div
        className="relative z-10 mx-auto flex gap-6 px-4 sm:px-6"
        style={{ maxWidth: 1400, paddingTop: 32 }}
      >
        {/* ┌──────── CENTER CONTENT ────────┐ */}
        <main className="min-w-0 flex-1">
          {/* ──── HERO BANNER ──── */}
          <section
            className="fade-up relative overflow-hidden rounded-2xl border"
            style={{
              height: "clamp(400px, 30vw, 420px)",
              borderColor: "#000",
              background: "linear-gradient(135deg, rgba(9,9,9,1) 0%, rgba(4,4,4,1) 100%)",
            }}
          >
            {/* bg image */}
            <div
              className="absolute inset-0 z-0"
              style={{
                backgroundImage: `url(${evidenceRoom})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                opacity: 0.75,
                filter: "brightness(0.85) contrast(1.1)",
              }}
            />
            {/* gradient overlay */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(90deg, rgba(4,4,4,0.85) 0%, rgba(4,4,4,0.4) 50%, rgba(4,4,4,0.1) 100%)",
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(to top, rgba(4,4,4,1) 0%, transparent 40%)",
              }}
            />

            {/* hero content */}
            <div className="relative z-10 flex h-full flex-col justify-center px-6 sm:px-12">
              <h1
                className="font-display leading-[0.95]"
                style={{ fontSize: "clamp(2.5rem, 9vw, 4.5rem)", letterSpacing: "-0.02em" }}
              >
                <span className="block text-white">CRIME FILES.</span>
                <span className="block text-white">REAL EVIDENCE.</span>
                <span className="block" style={{ color: "#C81D24" }}>
                  YOUR INVESTIGATION.
                </span>
              </h1>
              <div className="mt-7 flex items-center">
                <button
                  onClick={() => {
                    document.getElementById("evidence-locker")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="group relative flex items-center justify-center gap-2 rounded-lg border px-7 py-3.5 font-display text-[12px] tracking-[0.2em] uppercase transition-all duration-500 cursor-pointer"
                  style={{
                    background: "linear-gradient(135deg, #7A0F13 0%, #A11418 100%)",
                    borderColor: "rgba(200,29,36,0.4)",
                    color: "#fff",
                    boxShadow: "0 0 30px rgba(122,15,19,0.3)",
                  }}
                >
                  Explore Cases
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </section>

          {/* ──── STORE TABS ──── */}
          <section className="mt-12 scroll-mt-20" id="evidence-locker">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-[2px] w-8" style={{ background: "#7A0F13" }} />
                <h2
                  className="font-display text-[16px] tracking-[0.25em] uppercase sm:text-[18px]"
                  style={{ color: "#fff" }}
                >
                  The Evidence Locker
                </h2>
              </div>
              <Link
                to="/cases"
                className="group flex items-center gap-2 font-mono text-[10px] tracking-[0.15em] uppercase transition-colors duration-300"
                style={{ color: "#888" }}
              >
                View All Cases
                <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>

            {/* tab bar */}
            <div
              className="mb-8 flex w-fit items-center gap-1 rounded-xl border p-1.5"
              style={{
                background: "rgba(11,11,11,0.9)",
                borderColor: "rgba(255,255,255,0.06)",
              }}
            >
              {(
                [
                  { key: "CASES", label: "All Cases", icon: FolderOpen },
                  { key: "KITS", label: "Case Kits", icon: Boxes },
                ] as const
              ).map(({ key, label, icon: Ic }) => (
                <button
                  key={key}
                  onClick={() => setStoreTab(key)}
                  className="flex items-center gap-2 rounded-lg px-4 py-2.5 font-mono text-[11px] font-semibold tracking-[0.15em] uppercase transition-all duration-500 sm:px-6"
                  style={{
                    background:
                      storeTab === key
                        ? "linear-gradient(135deg, #7A0F13 0%, #A11418 100%)"
                        : "transparent",
                    color: storeTab === key ? "#fff" : "#777",
                    border:
                      storeTab === key ? "1px solid rgba(200,29,36,0.4)" : "1px solid transparent",
                    boxShadow: storeTab === key ? "0 0 20px rgba(122,15,19,0.25)" : "none",
                  }}
                >
                  <Ic className="h-3.5 w-3.5" />
                  {label}
                  <span
                    className="rounded-md px-1.5 py-0.5 font-mono text-[8px]"
                    style={{
                      background:
                        storeTab === key ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.05)",
                      color: storeTab === key ? "#fff" : "#999",
                    }}
                  >
                    {key === "CASES" ? products.length : caseKits.length}
                  </span>
                </button>
              ))}
            </div>

            {/* ──── CASE KITS EVIDENCE VAULT ──── */}
            {storeTab === "KITS" && (
              <>
                <CaseKitsEvidence />

                {/* ═══════ DZ-001 FEATURED CASE KIT PRESENTATION ═══════ */}
                <section className="relative mt-8 overflow-hidden">
                  {/* Ambient scan line animation */}
                  <style>{`
                    @keyframes scan-line {
                      0% { top: -2px; opacity: 0; }
                      10% { opacity: 0.6; }
                      90% { opacity: 0.6; }
                      100% { top: 100%; opacity: 0; }
                    }
                    @keyframes edge-glow {
                      0%, 100% { box-shadow: 0 0 15px rgba(200,29,36,0.15), inset 0 0 15px rgba(200,29,36,0.05); }
                      50% { box-shadow: 0 0 25px rgba(200,29,36,0.3), inset 0 0 25px rgba(200,29,36,0.1); }
                    }
                    .dz-kit-image-wrap:hover .dz-scan-line {
                      animation: scan-line 2.5s ease-in-out infinite;
                    }
                    .dz-kit-image-wrap {
                      animation: edge-glow 4s ease-in-out infinite;
                    }
                  `}</style>

                  <div className="mx-auto max-w-[1400px] px-4 sm:px-8">
                    {/* Section divider */}
                    <div className="flex items-center gap-4 mb-8">
                      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#C81D24]/30 to-transparent" />
                      <span className="font-mono text-[10px] tracking-[0.3em] text-[#C81D24]/60 uppercase">
                        Featured Investigation
                      </span>
                      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#C81D24]/30 to-transparent" />
                    </div>

                    {/* Main DZ-001 Layout: Image Left + Info Right */}
                    <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">
                      {/* LEFT: Large cinematic case kit image */}
                      <div
                        className="dz-kit-image-wrap relative w-full lg:w-[58%] xl:w-[55%] overflow-hidden rounded-[3px] cursor-pointer"
                        style={{
                          border: "1px solid rgba(200,29,36,0.15)",
                        }}
                        onMouseEnter={() => setDz001Hovered(true)}
                        onMouseLeave={() => setDz001Hovered(false)}
                      >
                        {/* Scan line overlay */}
                        <div
                          className="dz-scan-line absolute left-0 right-0 h-[2px] z-20 pointer-events-none"
                          style={{
                            background:
                              "linear-gradient(90deg, transparent 0%, rgba(200,29,36,0.6) 50%, transparent 100%)",
                            top: "-2px",
                            opacity: 0,
                          }}
                        />

                        {/* Film grain overlay */}
                        <div
                          className="absolute inset-0 z-10 pointer-events-none opacity-[0.04]"
                          style={{
                            backgroundImage:
                              "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWx0ZXI9InVybCgjYSkiIG9wYWNpdHk9IjAuMDUiLz48L3N2Zz4=')",
                          }}
                        />

                        <img
                          src={featuredSettings.image}
                          alt={`${featuredSettings.code} ${featuredSettings.title}`}
                          className="w-full h-auto object-contain transition-all duration-[600ms] ease-out"
                          style={{
                            transform: dz001Hovered
                              ? "scale(1.025) translateY(-4px)"
                              : "scale(1) translateY(0)",
                            filter: dz001Hovered
                              ? "brightness(1.05) contrast(1.02)"
                              : "brightness(1) contrast(1)",
                          }}
                        />

                        {/* Bottom fade */}
                        <div
                          className="absolute bottom-0 left-0 right-0 h-16 z-10 pointer-events-none"
                          style={{
                            background: "linear-gradient(to top, #050505 0%, transparent 100%)",
                          }}
                        />
                      </div>

                      {/* RIGHT: Editorial information panel */}
                      <div
                        className="w-full lg:w-[42%] xl:w-[45%] flex flex-col justify-center lg:py-8 transition-all duration-[600ms] ease-out"
                        style={{
                          transform: dz001Hovered ? "translateY(-6px)" : "translateY(0)",
                        }}
                      >
                        {/* Case code */}
                        <div className="flex items-center gap-3 mb-4">
                          <span className="font-mono text-[13px] tracking-[0.3em] text-[#C81D24] font-bold">
                            {featuredSettings.code}
                          </span>
                          <div className="h-px w-8 bg-[#C81D24]/40" />
                          <span className="font-mono text-[9px] tracking-[0.2em] text-[#555] uppercase">
                            Official Investigation
                          </span>
                        </div>

                        {/* Title with hover state */}
                        <h3 className="font-display text-[32px] lg:text-[40px] xl:text-[46px] tracking-[0.04em] uppercase text-white leading-[0.95] transition-all duration-500">
                          {dz001Hovered ? (
                            <span className="text-[#C81D24]">{featuredSettings.hover_title}</span>
                          ) : (
                            <span className="text-white">{featuredSettings.title}</span>
                          )}
                        </h3>

                        {/* Description */}
                        <p
                          className="mt-5 text-[15px] leading-[1.7] text-[#888] font-sans max-w-md"
                          style={{ fontStyle: "italic" }}
                        >
                          {featuredSettings.quote}
                        </p>

                        {/* Metadata chips */}
                        <div className="mt-7 flex flex-wrap gap-6 text-[12px] font-mono text-[#aaa] tracking-[0.15em] uppercase">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[#C81D24] text-[18px] font-bold tracking-normal">
                              01
                            </span>
                            <span className="text-[10px] text-[#555]">Case</span>
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[#C81D24] text-[18px] font-bold tracking-normal">
                              {featuredSettings.duration}
                            </span>
                            <span className="text-[10px] text-[#555]">Hours</span>
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[#C81D24] text-[18px] font-bold tracking-normal">
                              {featuredSettings.level}
                            </span>
                            <span className="text-[10px] text-[#555]">Level</span>
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[#C81D24] text-[18px] font-bold tracking-normal">
                              ₹80
                            </span>
                            <span className="text-[10px] text-[#555]">Delivery Charge</span>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="mt-8 flex items-baseline gap-3">
                          <span className="font-display text-[36px] font-bold text-white">
                            ₹{featuredSettings.price.toLocaleString("en-IN")}<span className="text-[20px] text-[#666]">/-</span>
                          </span>
                        </div>
                        <p className="mt-1 font-mono text-[10px] tracking-[0.2em] text-[#555] uppercase">
                          +₹80 Delivery Charge • Taxes Included
                        </p>

                        {/* CTA */}
                        <button
                          onClick={() => {
                            const featProd = {
                              ...displayProducts[0],
                              price: featuredSettings.price,
                              title: featuredSettings.title || displayProducts[0].title,
                              image: featuredSettings.image || displayProducts[0].image,
                            };
                            addToCart(featProd);
                          }}
                          className="group/cta mt-8 flex items-center gap-3 rounded-[3px] py-3.5 px-7 font-mono text-[12px] font-bold tracking-[0.2em] uppercase transition-all duration-500 cursor-pointer w-fit"
                          style={{
                            background: "linear-gradient(135deg, #7A0F13 0%, #A11418 100%)",
                            border: "1px solid rgba(200,29,36,0.5)",
                            color: "#fff",
                            boxShadow: "0 0 30px rgba(122,15,19,0.2)",
                          }}
                        >
                          Add to Cart
                          <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover/cta:translate-x-1.5" />
                        </button>

                        {/* Evidence list */}
                        <div className="mt-10 border-t border-white/5 pt-6">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6">
                            {[
                              "30+ Authentic Documents",
                              "Exclusive Audio Evidence",
                              "Crime Scene Photographs",
                              "Digital Evidence",
                              "Forensic Analysis",
                              "Hidden Clues & Secret Files",
                            ].map((item) => (
                              <div key={item} className="flex items-center gap-2.5">
                                <div className="h-1 w-1 rounded-full bg-[#C81D24]" />
                                <span className="font-mono text-[10px] tracking-[0.15em] text-[#666] uppercase">
                                  {item}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* ═══════ CASE KIT CARDS — HOVER SHOWCASE ═══════ */}
                <div className="mt-16">
                  <CaseKitCards
                    kits={kitsEvidence}
                    signatures={liveSignatures}
                    images={[sigAudio, sigCamera, sigFiles, sigMobile, sigPuzzle, sigTime, dz001Kit]}
                    onAdd={(kit) => {
                      const orig = caseKits.find((c) => c.id === kit.id);
                      if (orig) addKitToCart(orig);
                    }}
                  />
                </div>
              </>
            )}

            {/* ──── ALL CASES GRID (ASYNCHRONOUS DETECTIVE ARCHIVE LAYOUT) ──── */}
            {storeTab === "CASES" && (
              <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start mt-6">
                {/* Left Column: Large sticky featured card */}
                <div
                  ref={featuredRef}
                  className="w-full lg:w-[42%] xl:w-[38%] lg:sticky lg:top-[96px] z-10 transition-all duration-500"
                >
                  <div
                    className="group relative flex flex-col justify-end overflow-hidden border border-white/5 bg-[#090909] rounded-[4px] h-[460px] lg:h-[530px] p-3.5 lg:p-4"
                    style={{
                      boxShadow: "0 20px 50px rgba(0,0,0,0.8)",
                    }}
                  >
                    {/* Parallax Background Image */}
                    <div className="absolute inset-0 z-0 overflow-hidden">
                      <img
                        src={displayProducts[0].image}
                        alt={displayProducts[0].title}
                        className="h-full w-full object-cover origin-center opacity-45 brightness-75 contrast-125 transition-transform duration-700"
                        style={{
                          transform: `translateY(${featuredParallax}px) scale(1.15)`,
                        }}
                      />
                      {/* Ambient vignette and gradients */}
                      <div
                        className="absolute inset-0"
                        style={{
                          background:
                            "linear-gradient(to top, rgba(9,9,9,1) 0%, rgba(9,9,9,0.8) 30%, transparent 70%)",
                        }}
                      />
                      <div
                        className="absolute inset-0"
                        style={{
                          background:
                            "radial-gradient(ellipse at center, transparent 30%, rgba(5,5,5,0.9) 100%)",
                        }}
                      />
                    </div>

                    {/* Content Overlay */}
                    <div className="relative z-10 flex flex-col h-full justify-between pointer-events-none">
                      {/* Top Row: Case badge & number */}
                      <div className="flex items-center justify-between w-full">
                        {displayProducts[0].stock > 0 ? (
                          <span className="inline-flex items-center gap-1.5 rounded-[3px] px-2.5 py-1 font-mono text-[9px] font-bold tracking-[0.2em] uppercase border border-[#C81D24]/60 bg-black/90 text-[#FF4A50] shadow-[0_0_12px_rgba(200,29,36,0.35)] backdrop-blur-md">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#C81D24] animate-pulse" />
                            IN STOCK · {displayProducts[0].stock} UNITS
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-[3px] px-2.5 py-1 font-mono text-[9px] font-bold tracking-[0.2em] uppercase border border-red-950/60 bg-black/85 text-[#777] shadow-[0_0_8px_rgba(0,0,0,0.6)] backdrop-blur-md">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-900/60" />
                            OUT OF STOCK
                          </span>
                        )}
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setQuickView(displayProducts[0])}
                            className="flex h-7 w-7 items-center justify-center rounded-[3px] transition-all duration-300 hover:bg-white/10 pointer-events-auto cursor-pointer"
                            style={{
                              background: "rgba(0,0,0,0.4)",
                              border: "1px solid rgba(255,255,255,0.1)",
                            }}
                          >
                            <Eye className="h-3.5 w-3.5 text-white" />
                          </button>
                          <span className="font-mono text-[10px] tracking-[0.25em] text-[#555] font-semibold">
                            {displayProducts[0].caseNumber}
                          </span>
                        </div>
                      </div>

                      {/* Bottom section: Title, Description, Meta & Actions */}
                      <div className="pointer-events-auto">
                        <h3 className="font-display text-[18px] lg:text-[22px] tracking-[0.05em] uppercase text-white leading-tight transition-transform duration-500 group-hover:translate-x-1">
                          {displayProducts[0].title}
                        </h3>

                        <p className="mt-1 text-[10.5px] leading-normal text-[#888] font-sans max-w-[260px]">
                          {displayProducts[0].description}
                        </p>

                        {/* Evidence details / status */}
                        <div className="mt-2.5 flex flex-wrap gap-1.5 items-center text-[8.5px] font-mono text-[#666]">
                          <span className="border border-white/5 bg-white/[0.02] px-1.5 py-0.5 uppercase tracking-wider">
                            DIFFICULTY: {displayProducts[0].difficulty}
                          </span>
                          <span className="border border-white/5 bg-white/[0.02] px-1.5 py-0.5 uppercase tracking-wider">
                            TIME: {displayProducts[0].duration}
                          </span>
                        </div>

                        {/* Price & Rating */}
                        <div className="mt-2.5 flex items-center justify-between border-t border-white/5 pt-1.5">
                          <span className="font-display text-[18px] font-bold text-[#C81D24]">
                            {fmt(displayProducts[0].price)}
                          </span>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, si) => (
                              <Star
                                key={si}
                                className="h-3 w-3"
                                style={{
                                  fill: si < displayProducts[0].stars ? "#C81D24" : "transparent",
                                  color: si < displayProducts[0].stars ? "#C81D24" : "#222",
                                }}
                              />
                            ))}
                            <span className="ml-1 font-mono text-[8px] text-[#555] font-semibold">
                              ({displayProducts[0].reviews})
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-3 flex flex-col sm:flex-row gap-3">
                          <button
                            onClick={() => addToCart(displayProducts[0])}
                            className="flex-1 flex items-center justify-center gap-2 rounded-[3px] py-2.5 font-mono text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-300 cursor-pointer"
                            style={{
                              background: addedIds.has(displayProducts[0].id)
                                ? "rgba(20,120,20,0.8)"
                                : "rgba(200,29,36,0.15)",
                              border: addedIds.has(displayProducts[0].id)
                                ? "1px solid rgba(20,120,20,0.4)"
                                : "1px solid rgba(200,29,36,0.4)",
                              color: "#fff",
                            }}
                          >
                            {addedIds.has(displayProducts[0].id) ? (
                              <>
                                <ShoppingCart className="h-3.5 w-3.5" /> Added!
                              </>
                            ) : (
                              <>
                                <ShoppingCart className="h-3.5 w-3.5" /> Add to Cart
                              </>
                            )}
                          </button>

                          <Link
                            to="/cases/$caseId"
                            params={{ caseId: displayProducts[0].caseNumber.replace("CASE ", "") }}
                            className="group/btn flex items-center justify-center gap-2 rounded-[3px] border border-white/10 hover:border-white/20 bg-white/[0.02] hover:bg-white/[0.05] py-2.5 px-3.5 font-mono text-[10px] font-bold tracking-[0.2em] uppercase text-white transition-all duration-300"
                          >
                            <span>View Case</span>
                            <ArrowRight className="h-3.5 w-3.5 transform -translate-x-1 opacity-0 transition-all duration-300 group-hover/btn:translate-x-0 group-hover/btn:opacity-100 group-hover:translate-x-0 group-hover:opacity-100" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Stack of smaller cards */}
                <div className="w-full lg:w-[58%] xl:w-[62%] flex flex-col gap-3 lg:gap-4">
                  {/* Scroll Up Indicator */}
                  <div className="flex justify-center my-1 opacity-60">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/5 bg-[#090909] text-[#C81D24] shadow-md">
                      <ChevronUp className="h-4 w-4" />
                    </div>
                  </div>

                  {displayProducts.slice(1).map((p, idx) => {
                    const heights = ["230px", "265px", "240px", "255px", "245px"];
                    const cardHeight = heights[idx % heights.length];
                    const delay = idx * 0.1;

                    return (
                      <ScrollReveal key={p.id} delay={delay}>
                        <div
                          className="group relative flex flex-col md:flex-row overflow-hidden border border-white/5 bg-[#090909] rounded-[4px] transition-all duration-500 hover:-translate-y-1 hover:border-[#C81D24]/30"
                          style={{
                            height: `min-content`,
                            minHeight: cardHeight,
                            boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
                          }}
                        >
                          {/* Left half: Image & overlay title */}
                          <div className="relative w-full md:w-[48%] overflow-hidden h-[135px] md:h-auto min-h-[135px]">
                            <img
                              src={p.image}
                              alt={p.title}
                              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                            />
                            {/* Image overlay gradients */}
                            <div
                              className="absolute inset-0"
                              style={{
                                background:
                                  "linear-gradient(to top, rgba(9,9,9,0.95) 0%, rgba(9,9,9,0.4) 40%, transparent 80%)",
                              }}
                            />

                            {/* Badge stamp */}
                            {p.stock > 0 ? (
                              <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-[3px] px-2 py-0.5 font-mono text-[8px] font-bold tracking-[0.18em] uppercase border border-[#C81D24]/60 bg-black/90 text-[#FF4A50] shadow-[0_0_12px_rgba(200,29,36,0.35)] backdrop-blur-md z-10">
                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#C81D24] animate-pulse" />
                                IN STOCK · {p.stock} UNITS
                              </span>
                            ) : (
                              <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-[3px] px-2 py-0.5 font-mono text-[8px] font-bold tracking-[0.18em] uppercase border border-red-950/50 bg-black/85 text-[#777] shadow-[0_0_8px_rgba(0,0,0,0.6)] backdrop-blur-md z-10">
                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-900/60" />
                                OUT OF STOCK
                              </span>
                            )}

                            {/* quick view button */}
                            <button
                              onClick={() => setQuickView(p)}
                              className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-[3px] opacity-0 transition-all duration-300 group-hover:opacity-100 cursor-pointer"
                              style={{
                                background: "rgba(0,0,0,0.6)",
                                backdropFilter: "blur(8px)",
                                border: "1px solid rgba(255,255,255,0.1)",
                              }}
                            >
                              <Eye className="h-3 w-3 text-white" />
                            </button>

                            {/* SUPERIMPOSED TITLE AT THE BOTTOM OF THE IMAGE */}
                            <div className="absolute bottom-4 left-4 right-4 pointer-events-none">
                              <span className="font-mono text-[9px] tracking-[0.2em] text-[#555] font-semibold block">
                                {p.caseNumber}
                              </span>
                              <h3 className="mt-0.5 font-display text-[22px] tracking-[0.05em] uppercase text-white leading-tight transition-transform duration-500 group-hover:translate-x-1">
                                {p.title}
                              </h3>
                            </div>
                          </div>

                          {/* Right half: Text details */}
                          <div className="w-full md:w-[52%] flex flex-col justify-between p-3 lg:p-4 border-t md:border-t-0 md:border-l border-white/5 bg-[#0b0b0b]">
                            <div>
                              {/* Case Name at top of description panel */}
                              <div className="mb-2 border-b border-white/5 pb-1.5">
                                <span className="font-mono text-[9.5px] tracking-[0.2em] text-[#C81D24] font-semibold block">
                                  {p.caseNumber}
                                </span>
                                <h4 className="font-display text-[22px] tracking-[0.05em] uppercase text-white leading-tight transition-transform duration-500 group-hover:translate-x-1">
                                  {p.title}
                                </h4>
                              </div>

                              <p className="text-[15px] leading-relaxed text-[#777] font-sans">
                                {p.description}
                              </p>

                              <div className="mt-3 flex flex-wrap gap-1.5 items-center text-[9.5px] font-mono text-[#555]">
                                <span className="border border-white/5 bg-white/[0.01] px-2 py-0.5 uppercase tracking-wider">
                                  DIFFICULTY: {p.difficulty}
                                </span>
                                <span className="border border-white/5 bg-white/[0.01] px-2 py-0.5 uppercase tracking-wider">
                                  TIME: {p.duration}
                                </span>
                              </div>
                            </div>

                            <div className="mt-3">
                              {/* Price & Rating */}
                              <div className="flex items-center justify-between border-t border-white/5 pt-2">
                                <span className="font-display text-[16px] font-bold text-[#C81D24]">
                                  {fmt(p.price)}
                                </span>
                                <div className="flex items-center gap-1">
                                  {[...Array(5)].map((_, si) => (
                                    <Star
                                      key={si}
                                      className="h-2.5 w-2.5"
                                      style={{
                                        fill: si < p.stars ? "#C81D24" : "transparent",
                                        color: si < p.stars ? "#C81D24" : "#222",
                                      }}
                                    />
                                  ))}
                                  <span className="ml-1 font-mono text-[8px] text-[#444] font-semibold">
                                    ({p.reviews})
                                  </span>
                                </div>
                              </div>

                              {/* Buttons */}
                              <div className="mt-3 flex gap-2">
                                {p.stock > 0 ? (
                                  <button
                                    onClick={() => addToCart(p)}
                                    className="flex-1 flex items-center justify-center gap-1.5 rounded-[3px] py-2 font-mono text-[9px] font-semibold tracking-[0.15em] uppercase transition-all duration-300 cursor-pointer"
                                    style={{
                                      background: addedIds.has(p.id)
                                        ? "rgba(20,120,20,0.8)"
                                        : "rgba(255,255,255,0.02)",
                                      border: addedIds.has(p.id)
                                        ? "1px solid rgba(20,120,20,0.4)"
                                        : "1px solid rgba(255,255,255,0.08)",
                                      color: addedIds.has(p.id) ? "#fff" : "#bbb",
                                    }}
                                  >
                                    {addedIds.has(p.id) ? (
                                      <>
                                        <ShoppingCart className="h-3 w-3" /> Added!
                                      </>
                                    ) : (
                                      <>
                                        <ShoppingCart className="h-3 w-3" /> Add to Cart
                                      </>
                                    )}
                                  </button>
                                ) : (
                                  <button
                                    disabled
                                    className="flex-1 flex items-center justify-center gap-1.5 rounded-[3px] py-2 font-mono text-[9px] font-semibold tracking-[0.15em] uppercase border border-white/10 bg-white/[0.02] text-white/40 cursor-not-allowed"
                                  >
                                    <Lock className="h-3 w-3 text-red-500/70" />
                                    <span>Out of Stock</span>
                                  </button>
                                )}

                                <Link
                                  to="/cases/$caseId"
                                  params={{ caseId: p.caseNumber.replace("CASE ", "") }}
                                  className="group/btn flex items-center justify-center gap-1.5 rounded-[3px] border border-white/5 bg-white/[0.01] hover:bg-white/[0.04] py-2 px-3 font-mono text-[9px] font-semibold tracking-[0.15em] uppercase text-[#C81D24] hover:text-white transition-all duration-300"
                                >
                                  <span>Investigate</span>
                                  <ArrowRight className="h-3 w-3 transform -translate-x-1 opacity-0 transition-all duration-300 group-hover/btn:translate-x-0 group-hover/btn:opacity-100 group-hover:translate-x-0 group-hover:opacity-100" />
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </ScrollReveal>
                    );
                  })}

                  {/* Scroll Down Indicator */}
                  <div className="flex justify-center my-1 opacity-60">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/5 bg-[#090909] text-[#C81D24] shadow-md">
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
        </main>
      </div>

      {/* ═══════ FLOATING CART BUTTON ═══════ */}
      {/* ═══════ FLOATING GLOWING CART BUTTON ═══════ */}
      <button
        onClick={() => setCartOpen(true)}
        aria-label="Open Cart"
        className="fixed z-[100] flex items-center justify-center rounded-full transition-all duration-500 hover:scale-110 active:scale-95 cursor-pointer"
        style={{
          bottom: 32,
          right: 32,
          width: 58,
          height: 58,
          background: "linear-gradient(135deg, #8B1116 0%, #C81D24 100%)",
          border: "1px solid rgba(255,255,255,0.2)",
          boxShadow: "0 0 35px rgba(200,29,36,0.5), 0 8px 24px rgba(0,0,0,0.6)",
          color: "#fff",
        }}
      >
        <ShoppingCart className="h-6 w-6" />
        {totalCount > 0 && (
          <span
            className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full font-mono text-[10px] font-bold shadow-lg"
            style={{
              background: "#ffffff",
              color: "#C81D24",
              boxShadow: "0 0 12px rgba(255,255,255,0.8)",
              animation: "badge-pulse 2s ease-in-out infinite",
            }}
          >
            {totalCount}
          </span>
        )}
      </button>

      {/* ═══════ CART DRAWER OVERLAY ═══════ */}
      {cartOpen && (
        <div
          className="fixed inset-0 z-[150]"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}
          onClick={() => setCartOpen(false)}
        />
      )}

      {/* ═══════ CART SLIDE-OUT DRAWER ═══════ */}
      <div
        className="fixed top-0 right-0 z-[160] flex h-full flex-col transition-transform duration-500 ease-out"
        style={{
          width: "min(400px, 100vw)",
          transform: cartOpen ? "translateX(0)" : "translateX(100%)",
          background: "rgba(8,8,8,0.98)",
          borderLeft: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(30px)",
          boxShadow: cartOpen ? "-20px 0 60px rgba(0,0,0,0.8)" : "none",
        }}
      >
        {/* drawer header */}
        <div
          className="flex items-center justify-between border-b px-6 py-5"
          style={{ borderColor: "rgba(255,255,255,0.08)" }}
        >
          <div className="flex items-center gap-3">
            <ShoppingCart className="h-4 w-4 text-blood" />
            <span
              className="font-display text-[14px] tracking-[0.15em] uppercase font-bold text-white"
            >
              Your Cart
            </span>
            <span
              className="flex h-5 w-5 items-center justify-center rounded-full font-mono text-[9px] font-bold bg-blood/20 text-blood"
            >
              {totalCount}
            </span>
          </div>
          <button
            onClick={() => setCartOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-white/60 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* drawer items */}
        <div
          className="flex-1 overflow-y-auto"
          style={{ scrollbarWidth: "thin", scrollbarColor: "#333 transparent" }}
        >
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-20">
              <ShoppingCart className="h-10 w-10 text-white/20" />
              <p className="mt-4 font-mono text-[11px] tracking-[0.1em] text-white/40">
                Your evidence locker is empty
              </p>
              <button
                onClick={() => setCartOpen(false)}
                className="mt-5 rounded-lg border border-white/10 px-5 py-2 font-mono text-[10px] tracking-[0.1em] uppercase text-white/70 hover:text-white hover:border-white/30 transition-colors cursor-pointer"
              >
                Continue Browsing
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 border-b border-white/[0.05] px-6 py-5 items-center"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-16 w-16 shrink-0 rounded-xl object-cover border border-white/10 bg-black"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-[10px] tracking-[0.08em] uppercase text-blood font-bold">
                    {item.caseNumber}
                  </p>
                  <p className="truncate text-[12px] text-white/90 font-medium">
                    {item.title}
                  </p>
                  <div className="mt-2.5 flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="flex h-6 w-6 items-center justify-center rounded-lg border border-white/10 text-white/60 hover:border-blood/40 hover:text-white transition-colors cursor-pointer"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-6 text-center font-mono text-[11px] text-white">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="flex h-6 w-6 items-center justify-center rounded-lg border border-white/10 text-white/60 hover:border-blood/40 hover:text-white transition-colors cursor-pointer"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>
                <div className="flex flex-col items-end justify-between self-stretch">
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="flex h-6 w-6 items-center justify-center rounded-full text-white/40 hover:text-red-400 transition-colors cursor-pointer"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                  <span className="font-display text-[14px] font-bold text-white">
                    {fmt(item.price * item.quantity)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* drawer footer with totals */}
        {items.length > 0 && (() => {
          const drawerShipping = items.reduce((sum, item) => {
            const fee = (item as any).shippingFee !== undefined && (item as any).shippingFee !== null ? Number((item as any).shippingFee) : 0;
            return sum + (fee * item.quantity);
          }, 0);

          return (
            <div className="border-t border-white/10 px-6 py-5 bg-[#0a0a0a]">
              <div className="flex flex-col gap-2 font-mono text-[11px]">
                <div className="flex justify-between text-white/60">
                  <span>Subtotal</span>
                  <span className="text-white">{fmt(subtotal)}</span>
                </div>
                <div className="flex justify-between text-white/60">
                  <span>Shipping</span>
                  <span className="text-emerald-400 font-bold">
                    {drawerShipping === 0 ? "FREE" : `₹${drawerShipping}`}
                  </span>
                </div>
              </div>

              <div className="mt-3.5 flex justify-between border-t border-white/10 pt-3.5 items-center">
                <span className="font-mono text-[11px] tracking-[0.1em] uppercase text-white/70">
                  Total Amount
                </span>
                <span className="font-display text-[22px] font-bold text-blood">
                  {fmt(subtotal + drawerShipping)}
                </span>
              </div>

              <Link
                to="/cart"
                onClick={() => setCartOpen(false)}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 font-display text-[12px] tracking-[0.16em] uppercase text-white bg-blood hover:bg-blood/90 transition-all shadow-[0_0_25px_rgba(179,18,23,0.35)] cursor-pointer"
              >
                <span>View Cart & Checkout</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          );
        })()}
      </div>

      {/* ═══════ QUICK VIEW MODAL ═══════ */}
      {quickView && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)" }}
          onClick={() => setQuickView(null)}
        >
          <div
            className="relative w-full max-w-[640px] max-h-[92vh] overflow-y-auto rounded-2xl border"
            style={{
              background: "#090909",
              borderColor: "rgba(255,255,255,0.08)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setQuickView(null)}
              className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-300"
              style={{
                background: "rgba(255,255,255,0.06)",
                color: "#999",
              }}
            >
              <X className="h-4 w-4" />
            </button>
            <div className="flex flex-col sm:flex-row">
              <div className="relative w-full overflow-hidden sm:w-1/2">
                <img
                  src={quickView.image}
                  alt={quickView.title}
                  className="h-52 w-full object-cover sm:h-full sm:absolute sm:inset-0"
                  style={{ minHeight: "clamp(180px, 40vw, 360px)" }}
                />
                <div
                  className="absolute inset-0 hidden sm:block"
                  style={{
                    background: "linear-gradient(90deg, transparent 60%, rgba(9,9,9,1) 100%)",
                  }}
                />
              </div>
              <div className="flex w-full flex-col justify-center px-6 py-8 sm:w-1/2 sm:px-8 sm:py-8">
                <span className="font-mono text-[9px] tracking-[0.2em]" style={{ color: "#555" }}>
                  {quickView.caseNumber}
                </span>
                <h2
                  className="mt-1 font-display text-[22px] tracking-[0.06em] uppercase"
                  style={{ color: "#fff" }}
                >
                  {quickView.title}
                </h2>
                <p
                  className="mt-3 text-[12px] leading-relaxed"
                  style={{ color: "#888", fontFamily: "Inter" }}
                >
                  {quickView.description}
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <span
                    className="flex items-center gap-1 rounded-md border px-2 py-1 font-mono text-[9px]"
                    style={{ borderColor: "rgba(255,255,255,0.08)", color: "#888" }}
                  >
                    <Clock className="h-3 w-3" /> {quickView.duration}
                  </span>
                  <span
                    className="rounded-md border px-2 py-1 font-mono text-[9px]"
                    style={{ borderColor: "rgba(255,255,255,0.08)", color: "#888" }}
                  >
                    {quickView.difficulty}
                  </span>
                  <span
                    className="rounded-md border px-2 py-1 font-mono text-[9px] uppercase"
                    style={{
                      borderColor: "rgba(255,255,255,0.08)",
                      color: quickView.type === "physical" ? "#C81D24" : "#4ade80",
                    }}
                  >
                    {quickView.type}
                  </span>
                </div>
                <div className="mt-4 flex items-center gap-1">
                  {[...Array(5)].map((_, si) => (
                    <Star
                      key={si}
                      className="h-3.5 w-3.5"
                      style={{
                        fill: si < quickView.stars ? "#C81D24" : "transparent",
                        color: si < quickView.stars ? "#C81D24" : "#444",
                      }}
                    />
                  ))}
                  <span className="ml-2 font-mono text-[10px]" style={{ color: "#777" }}>
                    ({quickView.reviews} reviews)
                  </span>
                </div>
                <div className="mt-5 flex items-center justify-between">
                  <span
                    className="font-display text-[28px] font-bold"
                    style={{ color: "#C81D24", fontFamily: "Space Grotesk, Inter, sans-serif" }}
                  >
                    {fmt(quickView.price)}
                  </span>
                  {quickView.stock <= 10 && (
                    <span className="font-mono text-[9px]" style={{ color: "#C81D24" }}>
                      Only {quickView.stock} left
                    </span>
                  )}
                </div>
                <button
                  onClick={() => {
                    addToCart(quickView);
                    setQuickView(null);
                  }}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 font-display text-[11px] tracking-[0.15em] uppercase transition-all duration-500"
                  style={{
                    background: "linear-gradient(135deg, #7A0F13 0%, #A11418 100%)",
                    color: "#fff",
                    border: "1px solid rgba(200,29,36,0.3)",
                    boxShadow: "0 0 20px rgba(122,15,19,0.3)",
                  }}
                >
                  <ShoppingCart className="h-3.5 w-3.5" />
                  Add to Evidence Locker
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
