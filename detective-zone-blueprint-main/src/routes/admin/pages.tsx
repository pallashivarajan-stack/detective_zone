import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  FolderOpen,
  Save,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Film,
  Plus,
  Trash2,
  Layers,
  MapPin,
  Quote,
  Shield,
  Clock,
  Sparkles,
  Info,
  Upload,
  Loader2
} from "lucide-react";
import { api } from "@/lib/api";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ImageUploadField } from "@/components/admin/ImageUploadField";

export const Route = createFileRoute("/admin/pages")({
  component: AdminCasePagesCMS,
});

interface EvidencePinItem {
  id: string;
  x: number;
  y: number;
  label: string;
  note: string;
  image_url: string;
}

interface InvestigationModuleItem {
  icon?: string;
  heading: string;
  body: string;
  pct?: number;
}

export const PRESET_MODULE_ICONS = [
  { label: "Crime Scene", url: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/icons/crime_scene.jpeg" },
  { label: "Autopsy Report", url: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/icons/autospy.jpeg" },
  { label: "Witness Statements", url: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/icons/witness.jpeg" },
  { label: "Digital Evidence", url: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/icons/digital+evidence.jpeg" },
  { label: "Documents", url: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/icons/documents.jpeg" },
  { label: "Evidence Photos", url: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/icons/evidence.jpeg" },
  { label: "Investigative Tools", url: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/icons/tools.jpeg" },
  { label: "Detective Notes", url: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/icons/detective_notes.jpeg" },
];

const DEFAULT_8_MODULES: InvestigationModuleItem[] = [
  { icon: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/icons/crime_scene.jpeg", heading: "Crime Scene", body: "We provide a secure Drive link inside the kit containing full crime scene video files and authentic audio recordings to explore the scene.", pct: 75 },
  { icon: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/icons/autospy.jpeg", heading: "Autopsy Report", body: "We provide official sealed coroner reports, toxicological blood panels, and trauma anatomical diagrams to establish time and cause of death.", pct: 60 },
  { icon: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/icons/witness.jpeg", heading: "Witness Statements", body: "We provide verbatim police interrogation transcripts, signed eyewitness affidavits, and suspect alibi logs to detect lies and contradictions.", pct: 45 },
  { icon: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/icons/digital+evidence.jpeg", heading: "Digital Evidence", body: "We provide extracted suspect phone records, encrypted chat histories, cell tower triangulation logs, and surveillance CCTV footage.", pct: 30 },
  { icon: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/icons/documents.jpeg", heading: "Documents", body: "We provide confidential forensic dossier files, authentic bank statements, search warrants, and original handwritten correspondence.", pct: 40 },
  { icon: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/icons/evidence.jpeg", heading: "Evidence Photos", body: "We provide high-resolution glossy crime scene polaroids, macro fingerprint lifts, ballistics captures, and suspect surveillance photographs.", pct: 50 },
  { icon: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/icons/tools.jpeg", heading: "Tools Given", body: "We provide authentic physical investigative tools including optical inspection magnifiers, fingerprint cards, and forensic loupes inside the kit.", pct: 35 },
  { icon: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/icons/detective_notes.jpeg", heading: "Detective Notes", body: "We provide official investigator casebook worksheets, suspect motive matrices, and step-by-step procedural deduction logs to crack the case.", pct: 20 },
];

function isRealImageUrl(url: any): boolean {
  if (typeof url !== "string") return false;
  const trimmed = url.trim();
  return (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("/") ||
    trimmed.startsWith("data:")
  );
}

function ensure8Modules(rawModules: any): InvestigationModuleItem[] {
  let list = rawModules;
  if (typeof list === "string") {
    try {
      list = JSON.parse(list);
    } catch {
      list = [];
    }
  }
  if (!Array.isArray(list)) {
    list = [];
  }

  return DEFAULT_8_MODULES.map((defaultMod, idx) => {
    const existing = list[idx] || {};
    const icon = isRealImageUrl(existing.icon) ? existing.icon : defaultMod.icon;
    return {
      icon: icon || defaultMod.icon || "",
      heading: existing.heading || defaultMod.heading || "",
      body: existing.body || defaultMod.body || "",
      pct: typeof existing.pct === "number" && !isNaN(existing.pct) ? existing.pct : (defaultMod.pct ?? 50),
    };
  });
}

function AdminCasePagesCMS() {
  const [casesList, setCasesList] = useState<any[]>([]);
  const [selectedCaseNum, setSelectedCaseNum] = useState<string>("001");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);

  // Active Case Form State
  const [caseForm, setCaseForm] = useState<{
    id?: number;
    case_number: string;
    title: string;
    tagline: string;
    short_description: string;
    status: string;
    difficulty: string;
    estimated_duration: string;
    cover_image: string;
  }>({
    case_number: "001",
    title: "",
    tagline: "",
    short_description: "",
    status: "UNSOLVED",
    difficulty: "HARD",
    estimated_duration: "3–5 Hours",
    cover_image: "",
  });

  // Active Case Page Content State
  const [pageContent, setPageContent] = useState<{
    hero_video_url: string;
    hero_subtitle: string;
    hero_badge_text: string;
    case_type: string;
    date_of_incident: string;
    location: string;
    evidence_wall_bg_url: string;
    evidence_pins: EvidencePinItem[];
    investigation_modules: InvestigationModuleItem[];
    quote_text: string;
    quote_author: string;
  }>({
    hero_video_url: "",
    hero_subtitle: "",
    hero_badge_text: "Case Introduction Video",
    case_type: "Homicide",
    date_of_incident: "15 July 2027",
    location: "Varma Residence",
    evidence_wall_bg_url: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/evidence/corkboard.jpg",
    evidence_pins: [],
    investigation_modules: DEFAULT_8_MODULES,
    quote_text: "",
    quote_author: "",
  });

  useEffect(() => {
    loadAllCases();
  }, []);

  useEffect(() => {
    if (selectedCaseNum && casesList.length > 0) {
      loadSpecificCase(selectedCaseNum);
    }
  }, [selectedCaseNum, casesList]);

  const loadAllCases = async () => {
    try {
      setLoading(true);
      const data = await api.getAllCasesAdmin();
      setCasesList(data || []);
    } catch (err: any) {
      setError(err.message || "Failed to load cases");
    } finally {
      setLoading(false);
    }
  };

  const loadSpecificCase = async (cNum: string) => {
    setError(null);
    const foundCase = casesList.find((c) => c.case_number === cNum || c.slug === cNum);
    if (!foundCase) return;

    setCaseForm({
      id: foundCase.id,
      case_number: foundCase.case_number,
      title: foundCase.title || "",
      tagline: foundCase.tagline || "",
      short_description: foundCase.short_description || foundCase.intro_text || "",
      status: foundCase.status || "UNSOLVED",
      difficulty: foundCase.difficulty || "HARD",
      estimated_duration: foundCase.estimated_duration || "3–5 Hours",
      cover_image: foundCase.cover_image || "",
    });

    try {
      const pageData = await api.getCasePage(foundCase.id);
      const loadedModules = ensure8Modules(pageData?.investigation_modules);

      if (pageData) {
        setPageContent({
          hero_video_url: pageData.hero_video_url || "",
          hero_subtitle: pageData.hero_subtitle || foundCase.short_description || "",
          hero_badge_text: pageData.hero_badge_text || "Case Introduction Video",
          case_type: pageData.case_type || "Homicide",
          date_of_incident: pageData.date_of_incident || "15 July 2027",
          location: pageData.location || "Varma Residence",
          evidence_wall_bg_url: pageData.evidence_wall_bg_url || "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/evidence/corkboard.jpg",
          evidence_pins: pageData.evidence_pins || [],
          investigation_modules: loadedModules,
          quote_text: pageData.quote_text || "",
          quote_author: pageData.quote_author || "",
        });
      } else {
        setPageContent((prev) => ({ ...prev, investigation_modules: DEFAULT_8_MODULES }));
      }
    } catch (err: any) {
      setPageContent((prev) => ({ ...prev, investigation_modules: DEFAULT_8_MODULES }));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!caseForm.id) return;
    setSaving(true);
    setSuccess(false);
    setError(null);

    try {
      // 1. Update core case details
      await api.updateCase(caseForm.id, {
        title: caseForm.title,
        tagline: caseForm.tagline,
        short_description: caseForm.short_description,
        status: caseForm.status,
        difficulty: caseForm.difficulty,
        estimated_duration: caseForm.estimated_duration,
        cover_image: caseForm.cover_image,
      });

      // 2. Update page content in MySQL
      await api.updateCasePage(caseForm.id, pageContent);

      // 3. Refresh list
      await loadAllCases();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3500);
    } catch (err: any) {
      setError(err.message || "Failed to update case page in MySQL");
    } finally {
      setSaving(false);
    }
  };

  // Pins helper handlers
  const handleAddPin = () => {
    const newId = `pin_${Date.now()}`;
    setPageContent((prev) => ({
      ...prev,
      evidence_pins: [
        ...prev.evidence_pins,
        {
          id: newId,
          x: 50,
          y: 50,
          label: "New Clue Item",
          note: "Enter field observation note...",
          image_url: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/evidence/e-01.jpg",
        },
      ],
    }));
  };

  const handleUpdatePin = (index: number, field: keyof EvidencePinItem, value: any) => {
    setPageContent((prev) => {
      const updated = [...prev.evidence_pins];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, evidence_pins: updated };
    });
  };

  const handleDeletePin = (index: number) => {
    setPageContent((prev) => ({
      ...prev,
      evidence_pins: prev.evidence_pins.filter((_, i) => i !== index),
    }));
  };

  // Module helper handler
  const handleUpdateModule = (index: number, field: keyof InvestigationModuleItem, value: any) => {
    setPageContent((prev) => {
      const updated = ensure8Modules(prev.investigation_modules);
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, investigation_modules: updated };
    });
  };

  const handleUploadIcon = async (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingIdx(idx);
    try {
      const res = await api.uploadMedia(file, "icons");
      if (res && res.file_url) {
        handleUpdateModule(idx, "icon", res.file_url);
      }
    } catch (err: any) {
      alert(err.message || "Failed to upload icon");
    } finally {
      setUploadingIdx(null);
      e.target.value = "";
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Case Pages CMS">
        <div className="py-20 text-center font-mono text-xs uppercase tracking-widest text-white/40">
          Loading Case Pages from MySQL...
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Case Pages CMS Studio"
      subtitle="Edit the complete public page for every case (Videos, Evidence Wall, Pins, Modules, Quotes)"
      action={
        <a
          href={`/cases/${selectedCaseNum}`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 rounded-lg border border-blood/40 bg-blood/15 px-3.5 py-2 font-mono text-[11px] uppercase tracking-wider text-white hover:bg-blood/25"
        >
          <span>View Live Case {selectedCaseNum}</span>
          <ExternalLink className="h-3.5 w-3.5 text-blood" />
        </a>
      }
    >
      {success && (
        <div className="mb-6 rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-3.5 font-mono text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>Case {selectedCaseNum} page updated in MySQL! Changes are live on the website immediately.</span>
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-lg border border-blood/40 bg-blood/10 p-3.5 font-mono text-xs text-red-300 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-blood" />
          <span>{error}</span>
        </div>
      )}

      {/* Case Selector Tabs (Case 001 - Case 006) */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-4 overflow-x-auto font-mono text-xs uppercase tracking-wider">
        {casesList.map((c) => (
          <button
            key={c.case_number}
            onClick={() => setSelectedCaseNum(c.case_number)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 transition-all cursor-pointer ${
              selectedCaseNum === c.case_number
                ? "bg-blood text-white font-bold shadow-[0_0_15px_rgba(211,47,47,0.4)]"
                : "bg-white/[0.03] text-white/50 hover:text-white border border-white/[0.06]"
            }`}
          >
            <FolderOpen className="h-4 w-4" />
            <span>Case {c.case_number}</span>
            <span
              className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                c.status === "UNSOLVED"
                  ? "bg-emerald-500/20 text-emerald-300"
                  : "bg-white/10 text-white/60"
              }`}
            >
              {c.status}
            </span>
          </button>
        ))}
      </div>

      <form onSubmit={handleSave} className="mt-8 space-y-8 max-w-5xl">
        {/* ================= 1. CASE IDENTITY & METADATA ================= */}
        <div className="rounded-xl border border-white/[0.08] bg-[#070707] p-6 space-y-5">
          <h3 className="font-display text-base font-bold uppercase tracking-wider text-white border-b border-white/10 pb-3 flex items-center gap-2">
            <Info className="h-4 w-4 text-blood" />
            <span>1. Case Identity & Header Information</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-white/60 mb-1">Case Title</label>
              <input
                type="text"
                value={caseForm.title}
                onChange={(e) => setCaseForm({ ...caseForm, title: e.target.value })}
                placeholder="The Last Voicemail"
                className="w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood text-sm font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase text-white/60 mb-1">Tagline / Sub-heading</label>
              <input
                type="text"
                value={caseForm.tagline}
                onChange={(e) => setCaseForm({ ...caseForm, tagline: e.target.value })}
                placeholder="Evidence wall — connect the dots"
                className="w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood text-sm"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-mono uppercase text-white/60 mb-1">
                Case Description / Narrative Briefing
              </label>
              <textarea
                rows={2}
                value={caseForm.short_description}
                onChange={(e) => setCaseForm({ ...caseForm, short_description: e.target.value })}
                placeholder="A successful businessman found dead in his study. No forced entry. No clear motive..."
                className="w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood text-xs leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-white/60 mb-1">Case Status</label>
              <select
                value={caseForm.status}
                onChange={(e) => setCaseForm({ ...caseForm, status: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood text-xs font-mono"
              >
                <option value="UNSOLVED">UNSOLVED (Playable)</option>
                <option value="SOLVED">SOLVED (Archive)</option>
                <option value="COMING SOON">COMING SOON</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-white/60 mb-1">Difficulty Level</label>
              <select
                value={caseForm.difficulty}
                onChange={(e) => setCaseForm({ ...caseForm, difficulty: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood text-xs font-mono"
              >
                <option value="EASY">EASY</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HARD">HARD</option>
                <option value="EXPERT">EXPERT</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-white/60 mb-1">Investigation Time</label>
              <input
                type="text"
                value={caseForm.estimated_duration}
                onChange={(e) => setCaseForm({ ...caseForm, estimated_duration: e.target.value })}
                placeholder="3–5 Hours"
                className="w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-white/60 mb-1">Case Type</label>
              <input
                type="text"
                value={pageContent.case_type}
                onChange={(e) => setPageContent({ ...pageContent, case_type: e.target.value })}
                placeholder="Homicide / Locked Room"
                className="w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-white/60 mb-1">Date of Incident</label>
              <input
                type="text"
                value={pageContent.date_of_incident}
                onChange={(e) => setPageContent({ ...pageContent, date_of_incident: e.target.value })}
                placeholder="15 July 2027"
                className="w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-white/60 mb-1">Crime Scene Location</label>
              <input
                type="text"
                value={pageContent.location}
                onChange={(e) => setPageContent({ ...pageContent, location: e.target.value })}
                placeholder="Varma Residence"
                className="w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood text-xs"
              />
            </div>

            <div className="md:col-span-2">
              <ImageUploadField
                label="Cover Poster Image (S3 URL or File Upload)"
                value={caseForm.cover_image}
                onChange={(val) => setCaseForm({ ...caseForm, cover_image: val })}
                folder="cases"
                placeholder="https://bucket.s3.amazonaws.com/cases/poster.jpg or upload below"
              />
            </div>
          </div>
        </div>

        {/* ================= 2. HERO VIDEO & SCRUBBING ================= */}
        <div className="rounded-xl border border-white/[0.08] bg-[#070707] p-6 space-y-5">
          <h3 className="font-display text-base font-bold uppercase tracking-wider text-white border-b border-white/10 pb-3 flex items-center gap-2">
            <Film className="h-4 w-4 text-blood" />
            <span>2. Case Introduction Video & Interactive Scrub</span>
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase text-white/60 mb-1">Video Badge Label</label>
              <input
                type="text"
                value={pageContent.hero_badge_text}
                onChange={(e) => setPageContent({ ...pageContent, hero_badge_text: e.target.value })}
                placeholder="Case Introduction Video"
                className="w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood text-xs"
              />
            </div>
            <div>
              <ImageUploadField
                label="Hero Video File / S3 URL (Interactive Scrub)"
                value={pageContent.hero_video_url}
                onChange={(val) => setPageContent({ ...pageContent, hero_video_url: val })}
                folder="cases"
                placeholder="https://bucket.s3.amazonaws.com/videos/hero.mp4 or /src/assets/detective-scrub-fast.mp4"
                helperText="Supports S3 bucket MP4 video URL or direct video upload for mouse/touch frame scrubbing."
              />
            </div>
          </div>
        </div>

        {/* ================= 3. EVIDENCE WALL & PINS ================= */}
        <div className="rounded-xl border border-white/[0.08] bg-[#070707] p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="font-display text-base font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <MapPin className="h-4 w-4 text-blood" />
              <span>3. Evidence Wall & Interactive Clue Pins ({pageContent.evidence_pins.length})</span>
            </h3>
            <button
              type="button"
              onClick={handleAddPin}
              className="flex items-center gap-1.5 rounded-lg border border-blood/50 bg-blood/15 px-3 py-1.5 font-mono text-xs text-white hover:bg-blood/30 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Evidence Pin</span>
            </button>
          </div>

          <div>
            <ImageUploadField
              label="Corkboard Background Texture (S3 URL or Upload)"
              value={pageContent.evidence_wall_bg_url}
              onChange={(val) => setPageContent({ ...pageContent, evidence_wall_bg_url: val })}
              folder="evidence"
              placeholder="/src/assets/evidencce/corkboard.jpg or S3 URL"
            />
          </div>

          <div className="space-y-4 pt-2">
            {pageContent.evidence_pins.map((pin, idx) => (
              <div
                key={pin.id || idx}
                className="rounded-xl border border-white/10 bg-black/40 p-4 space-y-3 relative group"
              >
                <div className="flex items-center justify-between font-mono text-xs text-white/60 border-b border-white/[0.06] pb-2">
                  <span className="text-blood font-bold">Pin #{idx + 1} — {pin.label || "Untitled Pin"}</span>
                  <button
                    type="button"
                    onClick={() => handleDeletePin(idx)}
                    className="text-red-400 hover:text-red-300 flex items-center gap-1 font-mono text-[11px] cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Remove Pin</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-mono uppercase text-white/50 mb-1">Clue Label</label>
                    <input
                      type="text"
                      value={pin.label}
                      onChange={(e) => handleUpdatePin(idx, "label", e.target.value)}
                      placeholder="Voicemail / Door Key"
                      className="w-full rounded-lg border border-white/10 bg-black/70 p-2 text-white outline-none focus:border-blood text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase text-white/50 mb-1">X Position (%)</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={pin.x}
                      onChange={(e) => handleUpdatePin(idx, "x", parseFloat(e.target.value) || 0)}
                      className="w-full rounded-lg border border-white/10 bg-black/70 p-2 text-white outline-none focus:border-blood font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase text-white/50 mb-1">Y Position (%)</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={pin.y}
                      onChange={(e) => handleUpdatePin(idx, "y", parseFloat(e.target.value) || 0)}
                      className="w-full rounded-lg border border-white/10 bg-black/70 p-2 text-white outline-none focus:border-blood font-mono text-xs"
                    />
                  </div>

                  <div className="sm:col-span-2 md:col-span-4">
                    <ImageUploadField
                      label={`Evidence Photo for Pin #${idx + 1}`}
                      value={pin.image_url}
                      onChange={(val) => handleUpdatePin(idx, "image_url", val)}
                      folder="evidence"
                      placeholder="/src/assets/evidencce/e-01.jpg or https://bucket.s3.amazonaws.com/evidence/clue.jpg"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase text-white/50 mb-1">X Position (%)</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={pin.x}
                      onChange={(e) => handleUpdatePin(idx, "x", parseFloat(e.target.value) || 0)}
                      className="w-full rounded-lg border border-white/10 bg-black/70 p-2 text-white outline-none focus:border-blood font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase text-white/50 mb-1">Y Position (%)</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={pin.y}
                      onChange={(e) => handleUpdatePin(idx, "y", parseFloat(e.target.value) || 0)}
                      className="w-full rounded-lg border border-white/10 bg-black/70 p-2 text-white outline-none focus:border-blood font-mono text-xs"
                    />
                  </div>

                  <div className="sm:col-span-2 md:col-span-4">
                    <label className="block text-[10px] font-mono uppercase text-white/50 mb-1">Field Clue Note</label>
                    <input
                      type="text"
                      value={pin.note}
                      onChange={(e) => handleUpdatePin(idx, "note", e.target.value)}
                      placeholder="3:47 AM. It is already done. Don't look for me."
                      className="w-full rounded-lg border border-white/10 bg-black/70 p-2 text-white outline-none focus:border-blood text-xs"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================= 4. INVESTIGATION MODULES (8 Cards) ================= */}
        <div className="rounded-xl border border-white/[0.08] bg-[#070707] p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="font-display text-base font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Layers className="h-4 w-4 text-blood" />
              <span>4. Investigation Modules Suite (8 Modules)</span>
            </h3>
            <button
              type="button"
              onClick={() => setPageContent((prev) => ({ ...prev, investigation_modules: DEFAULT_8_MODULES }))}
              className="font-mono text-xs text-white/50 hover:text-white underline cursor-pointer"
            >
              Reset to Standard 8 Modules
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ensure8Modules(pageContent.investigation_modules).map((mod, idx) => {
              const currentIconUrl = mod.icon || DEFAULT_8_MODULES[idx]?.icon || "";
              return (
                <div key={idx} className="rounded-xl border border-white/10 bg-black/40 p-4 space-y-3.5">
                  <div className="flex items-center justify-between font-mono text-xs text-white/60 pb-2 border-b border-white/5">
                    <span className="text-blood font-bold tracking-wider">Module 0{idx + 1}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-white/40 uppercase">Depth:</span>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={mod.pct ?? 50}
                        onChange={(e) => handleUpdateModule(idx, "pct", parseInt(e.target.value) || 0)}
                        className="w-14 rounded border border-white/10 bg-black/80 px-1.5 py-0.5 text-right font-mono text-xs text-emerald-400 outline-none focus:border-blood"
                      />
                      <span className="text-[10px] text-emerald-400 font-mono">%</span>
                    </div>
                  </div>

                  {/* Icon Selector & Preview */}
                  <div className="space-y-2">
                    <label className="block text-[10px] font-mono uppercase text-white/60">
                      Module Icon
                    </label>
                    <div className="flex items-start gap-3">
                      {/* Icon Preview Thumbnail */}
                      <div className="h-14 w-14 shrink-0 rounded-xl border border-white/10 bg-[#141414] p-2 flex items-center justify-center overflow-hidden shadow-inner">
                        {currentIconUrl ? (
                          <img
                            src={currentIconUrl}
                            alt="Module Icon"
                            className="h-full w-full object-contain filter drop-shadow select-none"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = "none";
                            }}
                          />
                        ) : (
                          <Layers className="h-5 w-5 text-white/30" />
                        )}
                      </div>

                      {/* Icon Selection & URL */}
                      <div className="flex-1 space-y-2">
                        <select
                          value={PRESET_MODULE_ICONS.some((p) => p.url === currentIconUrl) ? currentIconUrl : "custom"}
                          onChange={(e) => {
                            if (e.target.value !== "custom") {
                              handleUpdateModule(idx, "icon", e.target.value);
                            }
                          }}
                          className="w-full rounded-lg border border-white/10 bg-[#0F0F0F] px-2.5 py-1.5 text-xs text-white outline-none focus:border-blood cursor-pointer"
                        >
                          <option value="custom">-- Custom Icon URL / Upload Below --</option>
                          {PRESET_MODULE_ICONS.map((p) => (
                            <option key={p.url} value={p.url}>
                              Preset: {p.label}
                            </option>
                          ))}
                        </select>

                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={mod.icon || ""}
                            onChange={(e) => handleUpdateModule(idx, "icon", e.target.value)}
                            placeholder="https://... or select preset above"
                            className="flex-1 rounded-lg border border-white/10 bg-[#0A0A0A] px-2.5 py-1.5 text-[11px] text-white/90 font-mono outline-none focus:border-blood"
                          />
                          <label className="flex items-center gap-1.5 shrink-0 rounded-lg border border-white/10 bg-[#1A1A1A] hover:bg-[#252525] px-3 py-1.5 text-xs font-mono text-white/80 cursor-pointer transition-colors">
                            {uploadingIdx === idx ? (
                              <Loader2 className="h-3.5 w-3.5 text-blood animate-spin" />
                            ) : (
                              <Upload className="h-3.5 w-3.5 text-blood" />
                            )}
                            <span>{uploadingIdx === idx ? "Uploading..." : "Upload"}</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              disabled={uploadingIdx === idx}
                              onChange={(e) => handleUploadIcon(idx, e)}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Module Title */}
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-white/60 mb-1">
                      Module Title
                    </label>
                    <input
                      type="text"
                      value={mod.heading}
                      onChange={(e) => handleUpdateModule(idx, "heading", e.target.value)}
                      placeholder="e.g. Crime Scene / Autopsy Report"
                      className="w-full rounded-lg border border-white/10 bg-black/70 p-2 text-white outline-none focus:border-blood text-xs font-semibold"
                    />
                  </div>

                  {/* Module Description Textarea */}
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-white/60 mb-1">
                      Module Description
                    </label>
                    <textarea
                      rows={3}
                      value={mod.body}
                      onChange={(e) => handleUpdateModule(idx, "body", e.target.value)}
                      placeholder="Enter detailed description of what evidence / tools are included..."
                      className="w-full rounded-lg border border-white/10 bg-black/70 p-2 text-white/90 outline-none focus:border-blood text-xs font-sans leading-relaxed"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ================= 5. NOIR DETECTIVE QUOTE BANNER ================= */}
        <div className="rounded-xl border border-white/[0.08] bg-[#070707] p-6 space-y-5">
          <h3 className="font-display text-base font-bold uppercase tracking-wider text-white border-b border-white/10 pb-3 flex items-center gap-2">
            <Quote className="h-4 w-4 text-blood" />
            <span>5. Detective Quote Banner</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-white/60 mb-1">Atmospheric Noir Quote</label>
              <textarea
                rows={2}
                value={pageContent.quote_text}
                onChange={(e) => setPageContent({ ...pageContent, quote_text: e.target.value })}
                placeholder="The voicemail wasn't a confession. It was a warning."
                className="w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase text-white/60 mb-1">Author / Investigator Attribution</label>
              <input
                type="text"
                value={pageContent.quote_author}
                onChange={(e) => setPageContent({ ...pageContent, quote_author: e.target.value })}
                placeholder="Detective Varma · Lead Investigator"
                className="w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood text-xs"
              />
            </div>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t border-white/10">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-blood px-8 py-3.5 font-display text-sm font-bold uppercase tracking-widest text-white hover:bg-blood/90 disabled:opacity-50 shadow-[0_0_30px_rgba(211,47,47,0.4)] cursor-pointer"
          >
            <Save className="h-4 w-4" />
            <span>{saving ? `Saving Case ${selectedCaseNum}...` : `Save Case ${selectedCaseNum} Page to MySQL`}</span>
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
