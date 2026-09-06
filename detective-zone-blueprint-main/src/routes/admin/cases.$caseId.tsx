import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  FileText,
  Lock,
  Unlock,
  KeyRound,
  Image as ImageIcon,
  Film,
  Mic,
  File,
  StickyNote,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Layers,
  Upload,
  Loader2,
} from "lucide-react";
import { api } from "@/lib/api";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ImageUploadField } from "@/components/admin/ImageUploadField";

const PRESET_MODULE_ICONS = [
  { label: "Crime Scene", url: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/icons/crime_scene.jpeg" },
  { label: "Autopsy Report", url: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/icons/autospy.jpeg" },
  { label: "Witness Statements", url: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/icons/witness.jpeg" },
  { label: "Digital Evidence", url: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/icons/digital+evidence.jpeg" },
  { label: "Documents", url: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/icons/documents.jpeg" },
  { label: "Evidence Photos", url: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/icons/evidence.jpeg" },
  { label: "Investigative Tools", url: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/icons/tools.jpeg" },
  { label: "Detective Notes", url: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/icons/detective_notes.jpeg" },
];

const DEFAULT_8_MODULES = [
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

function ensure8Modules(rawModules: any) {
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

export const Route = createFileRoute("/admin/cases/$caseId")({
  component: AdminCaseDetail,
});

function AdminCaseDetail() {
  const { caseId } = useParams({ from: "/admin/cases/$caseId" });
  const [caseData, setCaseData] = useState<any>(null);
  const [pageContent, setPageContent] = useState<any>({
    hero_video_url: "",
    hero_subtitle: "",
    hero_badge_text: "Case File",
    evidence_wall_bg_url: "",
    case_type: "Homicide",
    date_of_incident: "15 July 2027",
    location: "Varma Residence",
    quote_text: "The voicemail wasn't a confession. It was a warning.",
    quote_author: "Detective Varma · Lead Investigator",
    evidence_pins: [],
    investigation_modules: DEFAULT_8_MODULES,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"page_cms" | "overview" | "sections" | "evidence" | "clues">("page_cms");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadingModuleIdx, setUploadingModuleIdx] = useState<number | null>(null);

  // New Pin form
  const [newPin, setNewPin] = useState({
    id: "",
    label: "",
    note: "",
    x: 50,
    y: 50,
    image_url: "",
  });

  // New item sub-forms
  const [newSection, setNewSection] = useState({ title: "", section_type: "briefing", content_markdown: "" });
  const [newEvidence, setNewEvidence] = useState({ title: "", type: "image", file_url: "", description: "", date_recorded: "", is_locked: false });
  const [newClue, setNewClue] = useState({ title: "", description: "", correct_answer: "", hint: "" });
  const [newNote, setNewNote] = useState({ title: "", body: "", highlight_color: "blood", is_confidential: true });

  useEffect(() => {
    loadCase();
  }, [caseId]);

  const loadCase = async () => {
    try {
      setLoading(true);
      const [cData, pData] = await Promise.all([
        api.getCase(caseId),
        api.getCasePage(caseId).catch(() => null)
      ]);
      setCaseData(cData);
      if (pData) {
        setPageContent({
          hero_video_url: pData.hero_video_url ?? cData.hero_video ?? "",
          hero_subtitle: pData.hero_subtitle ?? cData.subtitle ?? "",
          hero_badge_text: pData.hero_badge_text ?? "Case File",
          evidence_wall_bg_url: pData.evidence_wall_bg_url ?? "",
          case_type: pData.case_type ?? "Homicide",
          date_of_incident: pData.date_of_incident ?? "15 July 2027",
          location: pData.location ?? "Varma Residence",
          quote_text: pData.quote_text ?? "",
          quote_author: pData.quote_author ?? "",
          evidence_pins: pData.evidence_pins ?? [],
          investigation_modules: ensure8Modules(pData.investigation_modules),
        });
      }
    } catch (err: any) {
      setError(err.message || "Failed to load case data");
    } finally {
      setLoading(false);
    }
  };

  const handleSavePageContent = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaveSuccess(false);
    try {
      const updated = await api.updateCasePage(caseData.id, pageContent);
      setPageContent({
        ...updated,
        investigation_modules: ensure8Modules(updated.investigation_modules),
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to save page CMS content");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateModule = (index: number, field: string, value: any) => {
    setPageContent((prev: any) => {
      const updated = ensure8Modules(prev.investigation_modules);
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, investigation_modules: updated };
    });
  };

  const handleUploadModuleIcon = async (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingModuleIdx(idx);
    try {
      const res = await api.uploadMedia(file, "icons");
      if (res && res.file_url) {
        handleUpdateModule(idx, "icon", res.file_url);
      }
    } catch (err: any) {
      alert(err.message || "Failed to upload icon");
    } finally {
      setUploadingModuleIdx(null);
      e.target.value = "";
    }
  };

  const handleSaveOverview = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaveSuccess(false);
    try {
      const updated = await api.updateCase(caseData.id, {
        title: caseData.title,
        subtitle: caseData.subtitle,
        tagline: caseData.tagline,
        intro_text: caseData.intro_text,
        short_description: caseData.short_description,
        cover_image: caseData.cover_image,
        hero_image: caseData.hero_image,
        hero_video: caseData.hero_video,
        difficulty: caseData.difficulty,
        estimated_duration: caseData.estimated_duration,
        price: isNaN(Number(caseData.price)) ? 999 : Number(caseData.price),
        original_price: isNaN(Number(caseData.original_price)) ? 1499 : Number(caseData.original_price),
        shipping_fee: isNaN(Number(caseData.shipping_fee)) ? 0 : Number(caseData.shipping_fee),
        status: caseData.status,
        featured: caseData.featured,
        is_published: caseData.is_published,
      });
      setCaseData({ ...caseData, ...updated });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  // Section Handlers
  const handleAddSection = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const item = await api.addCaseSection(caseData.id, newSection);
      setCaseData({ ...caseData, sections: [...(caseData.sections || []), item] });
      setNewSection({ title: "", section_type: "briefing", content_markdown: "" });
    } catch (err: any) {
      alert(err.message || "Failed to add section");
    }
  };

  const handleDeleteSection = async (id: number) => {
    if (!window.confirm("Delete this story section?")) return;
    try {
      await api.deleteCaseSection(id);
      setCaseData({ ...caseData, sections: caseData.sections.filter((s: any) => s.id !== id) });
    } catch (err: any) {
      alert(err.message || "Failed to delete section");
    }
  };

  // Evidence Handlers
  const handleAddEvidence = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const item = await api.addCaseEvidence(caseData.id, newEvidence);
      setCaseData({ ...caseData, evidence: [...(caseData.evidence || []), item] });
      setNewEvidence({ title: "", type: "image", file_url: "", description: "", date_recorded: "", is_locked: false });
    } catch (err: any) {
      alert(err.message || "Failed to add evidence");
    }
  };

  const handleDeleteEvidence = async (id: number) => {
    if (!window.confirm("Delete this evidence piece?")) return;
    try {
      await api.deleteCaseEvidence(id);
      setCaseData({ ...caseData, evidence: caseData.evidence.filter((e: any) => e.id !== id) });
    } catch (err: any) {
      alert(err.message || "Failed to delete evidence");
    }
  };

  // Clue Handlers
  const handleAddClue = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const item = await api.addCaseClue(caseData.id, newClue);
      setCaseData({ ...caseData, clues: [...(caseData.clues || []), item] });
      setNewClue({ title: "", description: "", correct_answer: "", hint: "" });
    } catch (err: any) {
      alert(err.message || "Failed to add clue");
    }
  };

  const handleDeleteClue = async (id: number) => {
    if (!window.confirm("Delete this clue challenge?")) return;
    try {
      await api.deleteCaseClue(id);
      setCaseData({ ...caseData, clues: caseData.clues.filter((c: any) => c.id !== id) });
    } catch (err: any) {
      alert(err.message || "Failed to delete clue");
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Case CMS Editor">
        <div className="py-20 text-center font-mono text-xs uppercase tracking-widest text-white/40">
          Decrypting Dossier CMS Files...
        </div>
      </AdminLayout>
    );
  }

  if (!caseData) {
    return (
      <AdminLayout title="Case Not Found">
        <div className="p-8 text-center text-white/60">
          Case could not be found.{" "}
          <Link to="/admin/cases" className="text-blood underline">
            Back to cases
          </Link>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title={`Case #${caseData.case_number}: ${caseData.title}`}
      subtitle={`CMS Controls · Status: ${caseData.status} · ${caseData.difficulty}`}
      action={
        <div className="flex items-center gap-3">
          <Link
            to="/admin/cases"
            className="flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/[0.03] px-3.5 py-2 font-mono text-[11px] uppercase tracking-wider text-white/70 hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back</span>
          </Link>
          <Link
            to={`/cases/${caseData.slug || caseData.case_number}`}
            target="_blank"
            className="flex items-center gap-1.5 rounded-lg border border-blood/40 bg-blood/15 px-3.5 py-2 font-mono text-[11px] uppercase tracking-wider text-white hover:bg-blood/25"
          >
            <span>Live Case</span>
            <ExternalLink className="h-3.5 w-3.5 text-blood" />
          </Link>
        </div>
      }
    >
      {saveSuccess && (
        <div className="mb-6 rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-3.5 font-mono text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>Case dossier updated successfully! Changes are live immediately.</span>
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-lg border border-blood/40 bg-blood/10 p-3.5 font-mono text-xs text-red-300 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-blood" />
          <span>{error}</span>
        </div>
      )}

      {/* CMS Tabs Header */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-4 overflow-x-auto font-mono text-xs uppercase tracking-wider">
        {[
          { id: "page_cms", label: "Public Page CMS", count: pageContent.evidence_pins?.length ? `${pageContent.evidence_pins.length} Pins` : "Ready" },
          { id: "overview", label: "General & Hero", count: null },
          { id: "sections", label: "Story & Briefings", count: caseData.sections?.length },
          { id: "evidence", label: "Evidence Locker", count: caseData.evidence?.length },
          { id: "clues", label: "Clues & Verification", count: caseData.clues?.length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 transition-colors cursor-pointer ${
              activeTab === tab.id
                ? "bg-blood text-white font-bold"
                : "bg-white/[0.03] text-white/50 hover:text-white"
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== null && tab.count !== undefined && (
              <span className="rounded-full bg-black/40 px-2 py-0.5 text-[10px] text-white/80">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* TAB 0: PUBLIC PAGE CMS (VIDEO, EVIDENCE WALL, MODULES, QUOTE) */}
      {activeTab === "page_cms" && (
        <form onSubmit={handleSavePageContent} className="mt-8 space-y-10 max-w-5xl">
          {/* Section 1: Hero & Video */}
          <div className="rounded-2xl border border-white/10 bg-[#070707] p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="font-display text-lg font-bold uppercase tracking-wider text-white flex items-center gap-2">
                  <Film className="h-5 w-5 text-blood" />
                  <span>Hero Section & Scrub Video</span>
                </h3>
                <p className="font-sans text-xs text-white/50 mt-1">
                  Control the video, badges, and headline metadata on the public case page.
                </p>
              </div>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 rounded-lg bg-blood px-4 py-2 font-display text-xs font-semibold uppercase tracking-wider text-white hover:bg-blood/90 disabled:opacity-50 cursor-pointer"
              >
                <Save className="h-4 w-4" />
                <span>{saving ? "Saving..." : "Save Page"}</span>
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <ImageUploadField
                  label="Hero Video File / S3 URL (Interactive Scrub)"
                  value={pageContent.hero_video_url || ""}
                  onChange={(val) => setPageContent({ ...pageContent, hero_video_url: val })}
                  folder="cases"
                  placeholder="/src/assets/Untitled design (5).mp4 or https://bucket.s3.amazonaws.com/hero.mp4"
                />
              </div>

              <div>
                <label className="block font-mono text-xs uppercase tracking-wider text-white/60 mb-2">
                  Hero Badge Text
                </label>
                <input
                  type="text"
                  value={pageContent.hero_badge_text || ""}
                  onChange={(e) => setPageContent({ ...pageContent, hero_badge_text: e.target.value })}
                  placeholder="e.g. Case File, Classified Dossier"
                  className="w-full rounded-lg border border-white/10 bg-black/60 p-3 text-white font-sans text-sm focus:border-blood outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-mono text-xs uppercase tracking-wider text-white/60 mb-2">
                  Hero Subtitle / Dossier Hook
                </label>
                <textarea
                  rows={2}
                  value={pageContent.hero_subtitle || ""}
                  onChange={(e) => setPageContent({ ...pageContent, hero_subtitle: e.target.value })}
                  placeholder="e.g. A successful businessman found dead in his study. No forced entry. Just a voicemail…"
                  className="w-full rounded-lg border border-white/10 bg-black/60 p-3 text-white font-sans text-sm focus:border-blood outline-none"
                />
              </div>
            </div>

            {/* Case Meta info displayed in hero tags */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/[0.06]">
              <div>
                <label className="block font-mono text-xs uppercase tracking-wider text-white/60 mb-1">
                  Case Type
                </label>
                <input
                  type="text"
                  value={pageContent.case_type || ""}
                  onChange={(e) => setPageContent({ ...pageContent, case_type: e.target.value })}
                  placeholder="e.g. Homicide, Kidnapping"
                  className="w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white font-sans text-xs focus:border-blood outline-none"
                />
              </div>
              <div>
                <label className="block font-mono text-xs uppercase tracking-wider text-white/60 mb-1">
                  Date of Incident
                </label>
                <input
                  type="text"
                  value={pageContent.date_of_incident || ""}
                  onChange={(e) => setPageContent({ ...pageContent, date_of_incident: e.target.value })}
                  placeholder="e.g. 15 July 2027"
                  className="w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white font-sans text-xs focus:border-blood outline-none"
                />
              </div>
              <div>
                <label className="block font-mono text-xs uppercase tracking-wider text-white/60 mb-1">
                  Crime Scene Location
                </label>
                <input
                  type="text"
                  value={pageContent.location || ""}
                  onChange={(e) => setPageContent({ ...pageContent, location: e.target.value })}
                  placeholder="e.g. Varma Residence, Study Room"
                  className="w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white font-sans text-xs focus:border-blood outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Interactive Evidence Wall Pins */}
          <div className="rounded-2xl border border-white/10 bg-[#070707] p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="font-display text-lg font-bold uppercase tracking-wider text-white flex items-center gap-2">
                  <ImageIcon className="h-5 w-5 text-blood" />
                  <span>Interactive Evidence Wall Pins ({pageContent.evidence_pins?.length || 0})</span>
                </h3>
                <p className="font-sans text-xs text-white/50 mt-1">
                  Configure pins on the corkboard canvas with coordinates, evidence photos, and notes.
                </p>
              </div>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 rounded-lg bg-blood px-4 py-2 font-display text-xs font-semibold uppercase tracking-wider text-white hover:bg-blood/90 disabled:opacity-50 cursor-pointer"
              >
                <Save className="h-4 w-4" />
                <span>Save Pins</span>
              </button>
            </div>

            <div>
              <ImageUploadField
                label="Corkboard Background Texture (S3 URL or Upload)"
                value={pageContent.evidence_wall_bg_url || ""}
                onChange={(val) => setPageContent({ ...pageContent, evidence_wall_bg_url: val })}
                folder="evidence"
                placeholder="/src/assets/evidencce/corkboard.jpg or S3 URL"
              />
            </div>

            {/* Existing Pins List */}
            <div className="space-y-4">
              <h4 className="font-mono text-xs uppercase tracking-wider text-white/80">Active Evidence Pins:</h4>
              {pageContent.evidence_pins?.map((pin: any, index: number) => (
                <div key={pin.id || index} className="rounded-xl border border-white/[0.08] bg-black/40 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-blood font-bold uppercase">
                      Pin #{index + 1}: {pin.label || "Untitled Pin"}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = [...pageContent.evidence_pins];
                        updated.splice(index, 1);
                        setPageContent({ ...pageContent, evidence_pins: updated });
                      }}
                      className="text-white/40 hover:text-blood transition-colors cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-[10px] font-mono uppercase text-white/50 mb-1">Label</label>
                      <input
                        type="text"
                        value={pin.label || ""}
                        onChange={(e) => {
                          const updated = [...pageContent.evidence_pins];
                          updated[index].label = e.target.value;
                          setPageContent({ ...pageContent, evidence_pins: updated });
                        }}
                        className="w-full rounded border border-white/10 bg-black p-2 text-xs text-white outline-none focus:border-blood"
                      />
                    </div>
                    <div className="sm:col-span-2 md:col-span-4">
                      <ImageUploadField
                        label={`Evidence Photo for Pin #${index + 1}`}
                        value={pin.image_url || ""}
                        onChange={(val) => {
                          const updated = [...pageContent.evidence_pins];
                          updated[index].image_url = val;
                          setPageContent({ ...pageContent, evidence_pins: updated });
                        }}
                        folder="evidence"
                        placeholder="/src/assets/evidencce/e-01.jpg or S3 URL"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono uppercase text-white/50 mb-1">
                        X Position: {pin.x}%
                      </label>
                      <input
                        type="range"
                        min="5"
                        max="95"
                        value={pin.x || 50}
                        onChange={(e) => {
                          const updated = [...pageContent.evidence_pins];
                          updated[index].x = parseFloat(e.target.value);
                          setPageContent({ ...pageContent, evidence_pins: updated });
                        }}
                        className="w-full accent-blood"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono uppercase text-white/50 mb-1">
                        Y Position: {pin.y}%
                      </label>
                      <input
                        type="range"
                        min="10"
                        max="90"
                        value={pin.y || 50}
                        onChange={(e) => {
                          const updated = [...pageContent.evidence_pins];
                          updated[index].y = parseFloat(e.target.value);
                          setPageContent({ ...pageContent, evidence_pins: updated });
                        }}
                        className="w-full accent-blood"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase text-white/50 mb-1">Clue Note Description</label>
                    <input
                      type="text"
                      value={pin.note || ""}
                      onChange={(e) => {
                        const updated = [...pageContent.evidence_pins];
                        updated[index].note = e.target.value;
                        setPageContent({ ...pageContent, evidence_pins: updated });
                      }}
                      placeholder="e.g. 3:47 AM. 'It's already done. Don't look for me.'"
                      className="w-full rounded border border-white/10 bg-black p-2 text-xs text-white outline-none focus:border-blood"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Add New Pin Sub-form */}
            <div className="rounded-xl border border-dashed border-white/20 bg-white/[0.02] p-5 space-y-4">
              <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-white/90 flex items-center gap-2">
                <Plus className="h-4 w-4 text-blood" />
                <span>Add Evidence Pin to Board</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-white/50 mb-1">Pin ID (Slug)</label>
                  <input
                    type="text"
                    value={newPin.id}
                    onChange={(e) => setNewPin({ ...newPin, id: e.target.value })}
                    placeholder="e.g. voicemail_tape"
                    className="w-full rounded-lg border border-white/10 bg-black p-2.5 text-xs text-white outline-none focus:border-blood"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase text-white/50 mb-1">Label</label>
                  <input
                    type="text"
                    value={newPin.label}
                    onChange={(e) => setNewPin({ ...newPin, label: e.target.value })}
                    placeholder="e.g. Audio Tape"
                    className="w-full rounded-lg border border-white/10 bg-black p-2.5 text-xs text-white outline-none focus:border-blood"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase text-white/50 mb-1">X Coord ({newPin.x}%)</label>
                  <input
                    type="range"
                    min="5"
                    max="95"
                    value={newPin.x}
                    onChange={(e) => setNewPin({ ...newPin, x: parseFloat(e.target.value) })}
                    className="w-full accent-blood mt-2"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase text-white/50 mb-1">Y Coord ({newPin.y}%)</label>
                  <input
                    type="range"
                    min="10"
                    max="90"
                    value={newPin.y}
                    onChange={(e) => setNewPin({ ...newPin, y: parseFloat(e.target.value) })}
                    className="w-full accent-blood mt-2"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <ImageUploadField
                    label="Pin Evidence Photo (S3 URL or Upload)"
                    value={newPin.image_url}
                    onChange={(val) => setNewPin({ ...newPin, image_url: val })}
                    folder="evidence"
                    placeholder="/src/assets/evidencce/e-01.jpg or S3 URL"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase text-white/50 mb-1">Note Text</label>
                  <input
                    type="text"
                    value={newPin.note}
                    onChange={(e) => setNewPin({ ...newPin, note: e.target.value })}
                    placeholder="Clue or forensic observation description"
                    className="w-full rounded-lg border border-white/10 bg-black p-2.5 text-xs text-white outline-none focus:border-blood"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (!newPin.label) {
                    alert("Please provide at least a label for the pin");
                    return;
                  }
                  const pinToAdd = {
                    id: newPin.id || `pin_${Date.now()}`,
                    label: newPin.label,
                    note: newPin.note,
                    x: newPin.x,
                    y: newPin.y,
                    image_url: newPin.image_url,
                    links: []
                  };
                  setPageContent({
                    ...pageContent,
                    evidence_pins: [...(pageContent.evidence_pins || []), pinToAdd]
                  });
                  setNewPin({ id: "", label: "", note: "", x: 50, y: 50, image_url: "" });
                }}
                className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 font-mono text-xs uppercase text-white hover:bg-blood hover:text-white transition-colors cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Place Pin on Evidence Wall</span>
              </button>
            </div>
          </div>

          {/* Section 3: Investigation Modules Suite (8 Modules) */}
          <div className="rounded-2xl border border-white/10 bg-[#070707] p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="font-display text-lg font-bold uppercase tracking-wider text-white flex items-center gap-2">
                  <Layers className="h-5 w-5 text-blood" />
                  <span>Investigation Modules Suite ({pageContent.investigation_modules?.length || 8} Modules)</span>
                </h3>
                <p className="font-sans text-xs text-white/50 mt-1">
                  Configure the 8 bespoke evidence modules, icons, descriptions, and forensic depth meters.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setPageContent({ ...pageContent, investigation_modules: DEFAULT_8_MODULES })}
                  className="font-mono text-xs text-white/50 hover:text-white underline cursor-pointer"
                >
                  Reset to Standard 8
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 rounded-lg bg-blood px-4 py-2 font-display text-xs font-semibold uppercase tracking-wider text-white hover:bg-blood/90 disabled:opacity-50 cursor-pointer"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Modules</span>
                </button>
              </div>
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
                      <label className="block text-[10px] font-mono uppercase text-white/60">Module Icon</label>
                      <div className="flex items-start gap-3">
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
                              {uploadingModuleIdx === idx ? (
                                <Loader2 className="h-3.5 w-3.5 text-blood animate-spin" />
                              ) : (
                                <Upload className="h-3.5 w-3.5 text-blood" />
                              )}
                              <span>{uploadingModuleIdx === idx ? "Uploading..." : "Upload"}</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                disabled={uploadingModuleIdx === idx}
                                onChange={(e) => handleUploadModuleIcon(idx, e)}
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Module Title */}
                    <div>
                      <label className="block text-[10px] font-mono uppercase text-white/60 mb-1">Module Title</label>
                      <input
                        type="text"
                        value={mod.heading || ""}
                        onChange={(e) => handleUpdateModule(idx, "heading", e.target.value)}
                        placeholder="e.g. Crime Scene / Autopsy Report"
                        className="w-full rounded-lg border border-white/10 bg-black/70 p-2 text-white outline-none focus:border-blood text-xs font-semibold"
                      />
                    </div>

                    {/* Module Description */}
                    <div>
                      <label className="block text-[10px] font-mono uppercase text-white/60 mb-1">Module Description</label>
                      <textarea
                        rows={3}
                        value={mod.body || ""}
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

          {/* Section 4: Quote Banner */}
          <div className="rounded-2xl border border-white/10 bg-[#070707] p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="font-display text-lg font-bold uppercase tracking-wider text-white flex items-center gap-2">
                  <StickyNote className="h-5 w-5 text-blood" />
                  <span>Detective Quote Banner</span>
                </h3>
                <p className="font-sans text-xs text-white/50 mt-1">
                  The atmospheric noir quote banner across the bottom of the case page.
                </p>
              </div>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 rounded-lg bg-blood px-4 py-2 font-display text-xs font-semibold uppercase tracking-wider text-white hover:bg-blood/90 disabled:opacity-50 cursor-pointer"
              >
                <Save className="h-4 w-4" />
                <span>Save Quote</span>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block font-mono text-xs uppercase tracking-wider text-white/60 mb-2">
                  Quote Text
                </label>
                <textarea
                  rows={2}
                  value={pageContent.quote_text || ""}
                  onChange={(e) => setPageContent({ ...pageContent, quote_text: e.target.value })}
                  placeholder='e.g. "The voicemail wasn&apos;t a confession. It was a warning."'
                  className="w-full rounded-lg border border-white/10 bg-black/60 p-3 text-white font-sans text-sm focus:border-blood outline-none"
                />
              </div>
              <div>
                <label className="block font-mono text-xs uppercase tracking-wider text-white/60 mb-2">
                  Author / Detective Attribution
                </label>
                <input
                  type="text"
                  value={pageContent.quote_author || ""}
                  onChange={(e) => setPageContent({ ...pageContent, quote_author: e.target.value })}
                  placeholder="e.g. Detective Varma · Lead Investigator"
                  className="w-full rounded-lg border border-white/10 bg-black/60 p-3 text-white font-sans text-sm focus:border-blood outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 pt-4 border-t border-white/10">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-lg bg-blood px-8 py-3.5 font-display text-sm font-bold uppercase tracking-widest text-white hover:bg-blood/90 disabled:opacity-50 shadow-[0_0_30px_rgba(211,47,47,0.4)] cursor-pointer"
            >
              <Save className="h-4 w-4" />
              <span>{saving ? "Saving All Changes..." : "Save Public Case Page"}</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 1: OVERVIEW */}
      {activeTab === "overview" && (
        <form onSubmit={handleSaveOverview} className="mt-8 space-y-6 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-white/60 mb-2">
                Case Title
              </label>
              <input
                type="text"
                value={caseData.title || ""}
                onChange={(e) => setCaseData({ ...caseData, title: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-[#070707] p-3 text-white font-sans text-sm focus:border-blood outline-none"
              />
            </div>
            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-white/60 mb-2">
                Subtitle
              </label>
              <input
                type="text"
                value={caseData.subtitle || ""}
                onChange={(e) => setCaseData({ ...caseData, subtitle: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-[#070707] p-3 text-white font-sans text-sm focus:border-blood outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 rounded-xl border border-blood/20 bg-blood/[0.04] p-4">
            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-blood font-bold mb-2">
                Sale Price (₹) *
              </label>
              <input
                type="number"
                value={caseData.price ?? ""}
                onChange={(e) => setCaseData({ ...caseData, price: e.target.value === "" ? "" : Number(e.target.value) })}
                placeholder="999"
                className="w-full rounded-lg border border-blood/30 bg-black p-3 text-white font-bold text-sm focus:border-blood outline-none"
              />
            </div>
            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-white/60 mb-2">
                Original Price (₹)
              </label>
              <input
                type="number"
                value={caseData.original_price ?? ""}
                onChange={(e) => setCaseData({ ...caseData, original_price: e.target.value === "" ? "" : Number(e.target.value) })}
                placeholder="1499"
                className="w-full rounded-lg border border-white/10 bg-black p-3 text-white/70 text-sm focus:border-blood outline-none"
              />
            </div>
            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-white/60 mb-2">
                Shipping Fee (₹)
              </label>
              <input
                type="number"
                value={caseData.shipping_fee ?? ""}
                onChange={(e) => setCaseData({ ...caseData, shipping_fee: e.target.value === "" ? "" : Number(e.target.value) })}
                placeholder="0 for Free Delivery"
                className="w-full rounded-lg border border-white/10 bg-black p-3 text-white/70 text-sm focus:border-blood outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono text-xs uppercase tracking-wider text-white/60 mb-2">
              Dramatic Tagline
            </label>
            <input
              type="text"
              value={caseData.tagline || ""}
              onChange={(e) => setCaseData({ ...caseData, tagline: e.target.value })}
              placeholder="Some voices never truly fade into the background."
              className="w-full rounded-lg border border-white/10 bg-[#070707] p-3 text-white font-sans text-sm focus:border-blood outline-none"
            />
          </div>

          <div>
            <label className="block font-mono text-xs uppercase tracking-wider text-white/60 mb-2">
              Introductory Narrative
            </label>
            <textarea
              rows={4}
              value={caseData.intro_text || ""}
              onChange={(e) => setCaseData({ ...caseData, intro_text: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-[#070707] p-3 text-white font-sans text-sm focus:border-blood outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <ImageUploadField
                label="Case Cover Poster Image (S3 URL or Upload)"
                value={caseData.cover_image || ""}
                onChange={(val) => setCaseData({ ...caseData, cover_image: val, hero_image: val })}
                folder="cases"
                placeholder="https://bucket.s3.amazonaws.com/cases/cover.jpg or /src/assets/..."
              />
            </div>
            <div>
              <ImageUploadField
                label="Hero Banner Image (S3 URL or Upload)"
                value={caseData.hero_image || ""}
                onChange={(val) => setCaseData({ ...caseData, hero_image: val })}
                folder="cases"
                placeholder="https://bucket.s3.amazonaws.com/cases/hero.jpg or /src/assets/..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 font-mono text-xs">
            <div>
              <label className="block uppercase tracking-wider text-white/60 mb-2">
                Difficulty Level
              </label>
              <select
                value={caseData.difficulty || "HARD"}
                onChange={(e) => setCaseData({ ...caseData, difficulty: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-[#070707] p-3 text-white focus:border-blood outline-none"
              >
                <option value="EASY">EASY</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HARD">HARD</option>
                <option value="EXPERT">EXPERT</option>
              </select>
            </div>
            <div>
              <label className="block uppercase tracking-wider text-white/60 mb-2">
                Duration Estimate
              </label>
              <input
                type="text"
                value={caseData.estimated_duration || ""}
                onChange={(e) => setCaseData({ ...caseData, estimated_duration: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-[#070707] p-3 text-white focus:border-blood outline-none"
              />
            </div>
            <div>
              <label className="block uppercase tracking-wider text-white/60 mb-2">
                Investigation Status
              </label>
              <select
                value={caseData.status || "UNSOLVED"}
                onChange={(e) => setCaseData({ ...caseData, status: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-[#070707] p-3 text-white focus:border-blood outline-none"
              >
                <option value="UNSOLVED">UNSOLVED</option>
                <option value="COMING SOON">COMING SOON</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="ACTIVE">ACTIVE</option>
                <option value="SOLVED">SOLVED</option>
                <option value="CLASSIFIED">CLASSIFIED</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-6 pt-4 font-mono text-xs">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={caseData.featured || false}
                onChange={(e) => setCaseData({ ...caseData, featured: e.target.checked })}
                className="rounded border-white/20 bg-black text-blood focus:ring-blood"
              />
              <span className="uppercase tracking-wider text-white/80">Feature On Homepage</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={caseData.is_published || false}
                onChange={(e) => setCaseData({ ...caseData, is_published: e.target.checked })}
                className="rounded border-white/20 bg-black text-blood focus:ring-blood"
              />
              <span className="uppercase tracking-wider text-white/80">Publish Status</span>
            </label>
          </div>

          <div className="pt-6 border-t border-white/10">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-blood px-6 py-3 font-display text-xs font-semibold uppercase tracking-[0.2em] text-white hover:bg-blood/90 transition-all shadow-[0_0_24px_rgba(179,18,23,0.4)] disabled:opacity-50 cursor-pointer"
            >
              <Save className="h-4 w-4" />
              <span>{saving ? "Saving Changes..." : "Save Overview Changes"}</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: SECTIONS */}
      {activeTab === "sections" && (
        <div className="mt-8 space-y-8 max-w-4xl">
          {/* Add section card */}
          <div className="rounded-xl border border-white/10 bg-[#070707] p-6">
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white mb-4">
              Add New Story Section / Briefing
            </h3>
            <form onSubmit={handleAddSection} className="space-y-4 font-mono text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase tracking-wider text-white/60 mb-1">Section Title</label>
                  <input
                    type="text"
                    required
                    value={newSection.title}
                    onChange={(e) => setNewSection({ ...newSection, title: e.target.value })}
                    placeholder="e.g. Incident Overview or Autopsy Report"
                    className="w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood"
                  />
                </div>
                <div>
                  <label className="block uppercase tracking-wider text-white/60 mb-1">Section Type</label>
                  <select
                    value={newSection.section_type}
                    onChange={(e) => setNewSection({ ...newSection, section_type: e.target.value })}
                    className="w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood"
                  >
                    <option value="briefing">Briefing</option>
                    <option value="timeline">Timeline</option>
                    <option value="suspects">Suspect Dossier</option>
                    <option value="forensics">Forensics Report</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block uppercase tracking-wider text-white/60 mb-1">Content (Markdown supported)</label>
                <textarea
                  rows={4}
                  required
                  value={newSection.content_markdown}
                  onChange={(e) => setNewSection({ ...newSection, content_markdown: e.target.value })}
                  placeholder="Enter detailed narrative briefing notes..."
                  className="w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white font-sans text-xs outline-none focus:border-blood"
                />
              </div>
              <button
                type="submit"
                className="flex items-center gap-2 rounded-lg bg-blood px-4 py-2 font-display text-xs font-semibold uppercase tracking-wider text-white hover:bg-blood/90"
              >
                <Plus className="h-4 w-4" />
                <span>Add Section</span>
              </button>
            </form>
          </div>

          {/* List existing sections */}
          <div className="space-y-4">
            <h4 className="font-mono text-xs uppercase tracking-wider text-white/50">
              Existing Story Sections ({caseData.sections?.length || 0})
            </h4>
            {caseData.sections?.length === 0 ? (
              <p className="font-mono text-xs text-white/40">No custom story sections added yet.</p>
            ) : (
              caseData.sections?.map((sec: any) => (
                <div key={sec.id} className="rounded-xl border border-white/[0.08] bg-[#070707] p-5">
                  <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blood" />
                      <span className="font-display text-sm font-bold uppercase text-white">{sec.title}</span>
                      <span className="rounded bg-white/10 px-2 py-0.5 font-mono text-[9px] uppercase text-white/60">
                        {sec.section_type}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDeleteSection(sec.id)}
                      className="text-white/40 hover:text-blood transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="mt-3 font-sans text-xs text-white/70 whitespace-pre-line">
                    {sec.content_markdown}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 3: EVIDENCE */}
      {activeTab === "evidence" && (
        <div className="mt-8 space-y-8 max-w-4xl">
          {/* Add evidence card */}
          <div className="rounded-xl border border-white/10 bg-[#070707] p-6">
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white mb-4">
              Catalog New Evidence Item
            </h3>
            <form onSubmit={handleAddEvidence} className="space-y-4 font-mono text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase tracking-wider text-white/60 mb-1">Evidence Title</label>
                  <input
                    type="text"
                    required
                    value={newEvidence.title}
                    onChange={(e) => setNewEvidence({ ...newEvidence, title: e.target.value })}
                    placeholder="e.g. Spent Cartridge 9mm"
                    className="w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood"
                  />
                </div>
                <div>
                  <label className="block uppercase tracking-wider text-white/60 mb-1">Evidence Type</label>
                  <select
                    value={newEvidence.type}
                    onChange={(e) => setNewEvidence({ ...newEvidence, type: e.target.value })}
                    className="w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood"
                  >
                    <option value="image">Photo / Document</option>
                    <option value="audio">Audio Wiretap / Voicemail</option>
                    <option value="video">CCTV Surveillance Footage</option>
                    <option value="cctv">CCTV Stills</option>
                    <option value="note">Cryptic Note</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <ImageUploadField
                    label="Media File / Photo / Video (S3 URL or Upload)"
                    value={newEvidence.file_url}
                    onChange={(val) => setNewEvidence({ ...newEvidence, file_url: val })}
                    folder="evidence"
                    placeholder="https://bucket.s3.amazonaws.com/evidence/... or /src/assets/..."
                  />
                </div>
                <div>
                  <label className="block uppercase tracking-wider text-white/60 mb-1">Timestamp / Date Recorded</label>
                  <input
                    type="text"
                    value={newEvidence.date_recorded}
                    onChange={(e) => setNewEvidence({ ...newEvidence, date_recorded: e.target.value })}
                    placeholder="Oct 14, 11:42 PM"
                    className="w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood"
                  />
                </div>
              </div>

              <div>
                <label className="block uppercase tracking-wider text-white/60 mb-1">Forensic Description</label>
                <textarea
                  rows={2}
                  value={newEvidence.description}
                  onChange={(e) => setNewEvidence({ ...newEvidence, description: e.target.value })}
                  placeholder="Details regarding location discovered and fingerprint analysis..."
                  className="w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood"
                />
              </div>

              <button
                type="submit"
                className="flex items-center gap-2 rounded-lg bg-blood px-4 py-2 font-display text-xs font-semibold uppercase tracking-wider text-white hover:bg-blood/90"
              >
                <Plus className="h-4 w-4" />
                <span>Log Evidence</span>
              </button>
            </form>
          </div>

          {/* Existing evidence items */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {caseData.evidence?.map((ev: any) => (
              <div key={ev.id} className="rounded-xl border border-white/[0.08] bg-[#070707] p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                    <span className="font-display text-xs font-bold uppercase text-white truncate">{ev.title}</span>
                    <span className="rounded bg-blood/20 text-blood font-mono text-[9px] uppercase px-2 py-0.5">
                      {ev.type}
                    </span>
                  </div>
                  {ev.file_url && ev.type === "image" && (
                    <img src={ev.file_url} alt={ev.title} className="mt-3 h-28 w-full object-cover rounded-lg" />
                  )}
                  <p className="mt-3 font-sans text-xs text-white/60">{ev.description || "No notes."}</p>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-3 font-mono text-[10px] text-white/40">
                  <span>{ev.date_recorded || "Unknown Time"}</span>
                  <button
                    onClick={() => handleDeleteEvidence(ev.id)}
                    className="text-white/40 hover:text-blood transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: CLUES */}
      {activeTab === "clues" && (
        <div className="mt-8 space-y-8 max-w-4xl">
          {/* Add clue card */}
          <div className="rounded-xl border border-white/10 bg-[#070707] p-6">
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white mb-4">
              Add Riddle / Clue Verification Challenge
            </h3>
            <form onSubmit={handleAddClue} className="space-y-4 font-mono text-xs">
              <div>
                <label className="block uppercase tracking-wider text-white/60 mb-1">Clue Title / Riddle Name</label>
                <input
                  type="text"
                  required
                  value={newClue.title}
                  onChange={(e) => setNewClue({ ...newClue, title: e.target.value })}
                  placeholder="e.g. The Timekeeper's Riddle"
                  className="w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider text-white/60 mb-1">Question / Prompt</label>
                <textarea
                  rows={2}
                  required
                  value={newClue.description}
                  onChange={(e) => setNewClue({ ...newClue, description: e.target.value })}
                  placeholder="What object was found inside the victim's coat pocket?"
                  className="w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase tracking-wider text-white/60 mb-1">
                    Accepted Answers (comma separated)
                  </label>
                  <input
                    type="text"
                    required
                    value={newClue.correct_answer}
                    onChange={(e) => setNewClue({ ...newClue, correct_answer: e.target.value })}
                    placeholder="watch, pocket watch, pocketwatch"
                    className="w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood"
                  />
                </div>
                <div>
                  <label className="block uppercase tracking-wider text-white/60 mb-1">Hint (Optional)</label>
                  <input
                    type="text"
                    value={newClue.hint}
                    onChange={(e) => setNewClue({ ...newClue, hint: e.target.value })}
                    placeholder="It measures seconds it can never hold..."
                    className="w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="flex items-center gap-2 rounded-lg bg-blood px-4 py-2 font-display text-xs font-semibold uppercase tracking-wider text-white hover:bg-blood/90"
              >
                <Plus className="h-4 w-4" />
                <span>Create Clue Challenge</span>
              </button>
            </form>
          </div>

          {/* List Clues */}
          <div className="space-y-4">
            {caseData.clues?.map((clue: any) => (
              <div key={clue.id} className="rounded-xl border border-white/[0.08] bg-[#070707] p-5">
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                  <div className="flex items-center gap-2">
                    <KeyRound className="h-4 w-4 text-blood" />
                    <span className="font-display text-sm font-bold uppercase text-white">{clue.title}</span>
                  </div>
                  <button
                    onClick={() => handleDeleteClue(clue.id)}
                    className="text-white/40 hover:text-blood transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <p className="mt-3 font-sans text-xs text-white/80">{clue.description}</p>
                <div className="mt-3 flex flex-wrap items-center gap-4 font-mono text-[11px]">
                  <span className="text-emerald-400">
                    <strong className="text-white/40">Accepted:</strong> {clue.correct_answer}
                  </span>
                  {clue.hint && (
                    <span className="text-white/40">
                      <strong>Hint:</strong> {clue.hint}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
