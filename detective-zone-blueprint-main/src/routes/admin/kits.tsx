import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Package,
  Plus,
  Trash2,
  Edit,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  X,
  Upload,
  Save,
  Sparkles,
  Eye,
  ImageIcon,
  Layers,
} from "lucide-react";
import { api } from "@/lib/api";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { S3_MEDIA } from "@/lib/media";

const dz001Kit = S3_MEDIA.caseKits.dz001Kit;

export const Route = createFileRoute("/admin/kits")({
  component: AdminKits,
});

function AdminKits() {
  const [signatures, setSignatures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSigModal, setShowSigModal] = useState(false);
  const [editingSig, setEditingSig] = useState<any | null>(null);
  const [uploadingFeaturedImage, setUploadingFeaturedImage] = useState(false);
  const [uploadingSigModalImage, setUploadingSigModalImage] = useState(false);
  const [savingFeatured, setSavingFeatured] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // BOX 1: Featured Investigation State (DZ-001)
  const [featuredKit, setFeaturedKit] = useState({
    code: "DZ-001",
    title: "The Last Voicemail",
    hover_title: "The Case Is Open.",
    quote: "A sealed case. A missing voice. Thirty pieces of evidence standing between you and the truth.",
    price: "999",
    duration: "3–4",
    level: "Expert",
    image: dz001Kit,
  });

  // Signature Evidence Clue Form
  const [sigForm, setSigForm] = useState({
    label: "",
    image_url: "",
    description: "",
    authenticity_note: "Verified Authentic Field Clue",
  });

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [sigData, settingsData] = await Promise.all([
        api.getSignatures().catch(() => []),
        api.getSettings().catch(() => ({})),
      ]);
      setSignatures(sigData);

      if (settingsData && Object.keys(settingsData).length > 0) {
        // Featured Investigation
        const cleanPrice = settingsData.featured_kit_price
          ? String(settingsData.featured_kit_price).replace(/,/g, "").replace(/[^0-9.]/g, "")
          : "1199";
        setFeaturedKit({
          code: settingsData.featured_kit_code || "DZ-001",
          title: settingsData.featured_kit_title || "The Last Voicemail",
          hover_title: settingsData.featured_kit_hover_title || "The Case Is Open.",
          quote: settingsData.featured_kit_quote || "A sealed case. A missing voice. Thirty pieces of evidence standing between you and the truth.",
          price: cleanPrice || "1199",
          duration: settingsData.featured_kit_duration || "2–3",
          level: settingsData.featured_kit_level || "Expert",
          image: settingsData.featured_kit_image || dz001Kit,
        });
      }
    } catch (err: any) {
      console.log("Error loading kits:", err);
    } finally {
      setLoading(false);
    }
  };

  // Save Box 1 (Featured Investigation)
  const handleSaveFeatured = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingFeatured(true);
    try {
      const cleanPrice = String(featuredKit.price).replace(/,/g, "").replace(/[^0-9.]/g, "") || "1199";
      await api.updateSettings({
        featured_kit_code: featuredKit.code,
        featured_kit_title: featuredKit.title,
        featured_kit_hover_title: featuredKit.hover_title,
        featured_kit_quote: featuredKit.quote,
        featured_kit_price: cleanPrice,
        featured_kit_duration: featuredKit.duration,
        featured_kit_level: featuredKit.level,
        featured_kit_image: featuredKit.image,
      });

      // Synchronize with Product 1 and Case 1 so all CMS views stay in unison
      const numPrice = parseFloat(cleanPrice);
      if (!isNaN(numPrice) && numPrice > 0) {
        api.updateProduct(1, { price: numPrice, sale_price: numPrice }).catch(() => {});
        api.updateCase(1, { price: numPrice }).catch(() => {});
      }

      setFeaturedKit((prev) => ({ ...prev, price: cleanPrice }));
      showToast("Featured Investigation updated live");
    } catch (err: any) {
      alert(err.message || "Failed to update Featured Investigation");
    } finally {
      setSavingFeatured(false);
    }
  };

  const handleFeaturedImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingFeaturedImage(true);
      const media = await api.uploadMedia(file, "kits");
      setFeaturedKit((prev) => ({ ...prev, image: media.url }));
      showToast("Featured kit image uploaded");
    } catch (err: any) {
      alert(err.message || "Image upload failed");
    } finally {
      setUploadingFeaturedImage(false);
    }
  };

  const handleUploadSigModalImage = async (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingSigModalImage(true);
      const media = await api.uploadMedia(file, "signatures");
      if (isEdit && editingSig) {
        setEditingSig((prev: any) => ({ ...prev, image_url: media.url }));
      } else {
        setSigForm((prev) => ({ ...prev, image_url: media.url }));
      }
      showToast("Signature image uploaded");
    } catch (err: any) {
      alert(err.message || "Failed to upload image");
    } finally {
      setUploadingSigModalImage(false);
    }
  };

  const handleCreateSig = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await api.createSignature(sigForm);
      setSignatures([...signatures, created]);
      setShowSigModal(false);
      setSigForm({ label: "", image_url: "", description: "", authenticity_note: "Verified Authentic Field Clue" });
      showToast("Signature clue added");
    } catch (err: any) {
      alert(err.message || "Failed to add signature clue");
    }
  };

  const handleUpdateSig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSig) return;
    try {
      const updated = await api.updateSignature(editingSig.id, {
        label: editingSig.label,
        image_url: editingSig.image_url,
        description: editingSig.description,
        authenticity_note: editingSig.authenticity_note,
      });
      setSignatures(signatures.map((s) => (s.id === editingSig.id ? updated : s)));
      setEditingSig(null);
      showToast("Signature clue updated");
    } catch (err: any) {
      alert(err.message || "Failed to update signature clue");
    }
  };

  const handleDeleteSig = async (id: number) => {
    if (!window.confirm("Delete signature evidence item?")) return;
    try {
      await api.deleteSignature(id);
      setSignatures(signatures.filter((s) => s.id !== id));
      showToast("Signature item deleted");
    } catch (err: any) {
      alert(err.message || "Failed to delete signature");
    }
  };

  return (
    <AdminLayout
      title="Case Kits CMS"
      subtitle="Manage the Featured Investigation Case Box & Forensic Signature Evidence Artifacts"
      action={
        <button
          onClick={() => setShowSigModal(true)}
          className="flex items-center gap-2 rounded-lg border border-white/20 bg-white/[0.04] px-3.5 py-2 font-display text-[11px] font-semibold uppercase tracking-[0.16em] text-white hover:bg-white/[0.08] transition-all cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Signature Clue</span>
        </button>
      }
    >
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl border border-emerald-500/40 bg-[#080808]/95 px-5 py-3 font-mono text-xs text-emerald-400 shadow-[0_12px_40px_rgba(0,0,0,0.8)] backdrop-blur-md animate-in fade-in">
          <CheckCircle2 className="h-4 w-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          BOX 1: FEATURED INVESTIGATION (DZ-001)
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="mb-10 rounded-2xl border border-blood/30 bg-gradient-to-b from-blood/[0.08] to-transparent p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blood/20 text-blood border border-blood/40">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-bold uppercase text-blood tracking-wider bg-blood/10 px-2 py-0.5 rounded border border-blood/20">
                  Case Box 1
                </span>
                <h2 className="font-display text-lg font-bold uppercase tracking-wider text-white">
                  Featured Investigation (DZ-001)
                </h2>
              </div>
              <p className="font-mono text-[10px] text-white/50 uppercase tracking-wider mt-0.5">
                Primary Showcase Box — Hero Presentation & Direct Case File
              </p>
            </div>
          </div>
          <span className="self-start sm:self-auto rounded bg-blood/20 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-blood border border-blood/40">
            {featuredKit.code} Live
          </span>
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Box 1 Form */}
          <form onSubmit={handleSaveFeatured} className="lg:col-span-8 space-y-5 font-mono text-xs">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block uppercase text-white/60 mb-1.5">Case Code</label>
                <input
                  type="text"
                  required
                  value={featuredKit.code}
                  onChange={(e) => setFeaturedKit({ ...featuredKit, code: e.target.value })}
                  placeholder="DZ-001"
                  className="w-full rounded-lg border border-white/10 bg-black/70 p-2.5 text-white outline-none focus:border-blood"
                />
              </div>
              <div>
                <label className="block uppercase text-white/60 mb-1.5">Main Title</label>
                <input
                  type="text"
                  required
                  value={featuredKit.title}
                  onChange={(e) => setFeaturedKit({ ...featuredKit, title: e.target.value })}
                  placeholder="The Last Voicemail"
                  className="w-full rounded-lg border border-white/10 bg-black/70 p-2.5 text-white outline-none focus:border-blood"
                />
              </div>
              <div>
                <label className="block uppercase text-white/60 mb-1.5">Hover State Headline</label>
                <input
                  type="text"
                  required
                  value={featuredKit.hover_title}
                  onChange={(e) => setFeaturedKit({ ...featuredKit, hover_title: e.target.value })}
                  placeholder="The Case Is Open."
                  className="w-full rounded-lg border border-white/10 bg-black/70 p-2.5 text-white outline-none focus:border-blood"
                />
              </div>
            </div>

            <div>
              <label className="block uppercase text-white/60 mb-1.5">Dramatic Quote / Synopsis</label>
              <textarea
                rows={2}
                required
                value={featuredKit.quote}
                onChange={(e) => setFeaturedKit({ ...featuredKit, quote: e.target.value })}
                placeholder='"A sealed case. A missing voice. Thirty pieces of evidence standing between you and the truth."'
                className="w-full rounded-lg border border-white/10 bg-black/70 p-2.5 text-white outline-none focus:border-blood resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="block uppercase text-white/60 mb-1.5">Price (₹ INR)</label>
                <input
                  type="text"
                  required
                  value={featuredKit.price}
                  onChange={(e) => setFeaturedKit({ ...featuredKit, price: e.target.value })}
                  placeholder="999"
                  className="w-full rounded-lg border border-white/10 bg-black/70 p-2.5 text-white outline-none focus:border-blood"
                />
              </div>
              <div>
                <label className="block uppercase text-white/60 mb-1.5">Investigation Time</label>
                <input
                  type="text"
                  required
                  value={featuredKit.duration}
                  onChange={(e) => setFeaturedKit({ ...featuredKit, duration: e.target.value })}
                  placeholder="3–4"
                  className="w-full rounded-lg border border-white/10 bg-black/70 p-2.5 text-white outline-none focus:border-blood"
                />
              </div>
              <div>
                <label className="block uppercase text-white/60 mb-1.5">Difficulty Level</label>
                <input
                  type="text"
                  required
                  value={featuredKit.level}
                  onChange={(e) => setFeaturedKit({ ...featuredKit, level: e.target.value })}
                  placeholder="Expert"
                  className="w-full rounded-lg border border-white/10 bg-black/70 p-2.5 text-white outline-none focus:border-blood"
                />
              </div>
            </div>

            <div>
              <ImageUploadField
                label="Cinematic Box Image (S3 URL or Upload)"
                value={featuredKit.image}
                onChange={(val) => setFeaturedKit({ ...featuredKit, image: val })}
                folder="kits"
                placeholder="/src/assets/case kits/image.png or https://bucket.s3.amazonaws.com/kits/box.png"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={savingFeatured}
                className="flex items-center gap-2 rounded-lg bg-blood px-6 py-2.5 font-display text-[12px] font-semibold uppercase tracking-wider text-white hover:bg-blood/90 transition-all shadow-[0_0_20px_rgba(179,18,23,0.35)] cursor-pointer"
              >
                <Save className="h-4 w-4" />
                <span>{savingFeatured ? "Saving..." : "Save Box 1 (Featured Investigation)"}</span>
              </button>
            </div>
          </form>

          {/* Box 1 Live Preview */}
          <div className="lg:col-span-4 rounded-xl border border-white/10 bg-black/80 p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="font-mono text-[10px] uppercase tracking-widest text-white/50 flex items-center gap-1.5">
                <Eye className="h-3.5 w-3.5 text-blood" />
                <span>Store Preview (Box 1)</span>
              </span>
              <span className="font-mono text-[10px] text-blood font-bold">{featuredKit.code}</span>
            </div>

            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-white/10 bg-[#050505] flex items-center justify-center">
              {featuredKit.image ? (
                <img
                  src={featuredKit.image.startsWith("/src") ? dz001Kit : featuredKit.image}
                  alt={featuredKit.title}
                  className="h-full w-full object-contain p-2 hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-white/30">
                  <ImageIcon className="h-8 w-8" />
                  <span className="font-mono text-[10px]">No image selected</span>
                </div>
              )}
            </div>

            <div className="pt-2">
              <h4 className="font-display text-sm font-bold uppercase text-white tracking-wider truncate">
                {featuredKit.title}
              </h4>
              <p className="mt-1 font-mono text-[10px] text-white/50 line-clamp-2 italic">
                "{featuredKit.quote}"
              </p>
              <div className="mt-3 flex items-center justify-between pt-2 border-t border-white/[0.06] font-mono text-xs">
                <span className="font-bold text-emerald-400">₹{featuredKit.price}</span>
                <span className="text-white/40">{featuredKit.duration} hrs • {featuredKit.level}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 2: SIGNATURE EVIDENCE CLUES & PROP ARTIFACTS
      ═══════════════════════════════════════════════════════════════════ */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-display text-base font-bold uppercase tracking-wider text-white">
              Signature Clues & Prop Artifacts ({signatures.length})
            </h3>
            <p className="font-mono text-[10px] text-white/50 uppercase tracking-wider">
              Forensic photos & physical clues displayed in The Signature Collection and Store
            </p>
          </div>
          <button
            onClick={() => setShowSigModal(true)}
            className="flex items-center gap-2 rounded-lg bg-blood/20 border border-blood/40 px-3 py-1.5 font-display text-[11px] font-semibold uppercase tracking-wider text-blood hover:bg-blood hover:text-white transition-all cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Clue</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {signatures.map((s) => (
            <div key={s.id} className="flex items-center justify-between rounded-xl border border-white/[0.08] bg-[#070707] p-4 transition-all hover:border-white/20">
              <div className="flex items-center gap-3.5 min-w-0">
                {s.image_url ? (
                  <img src={s.image_url} alt={s.label} className="h-14 w-14 rounded-lg object-cover border border-white/10 bg-black shrink-0" />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-white/5 text-white/20 border border-white/10 shrink-0">
                    <ShieldCheck className="h-6 w-6 text-blood" />
                  </div>
                )}
                <div className="min-w-0">
                  <h5 className="font-display text-xs uppercase font-bold text-white tracking-wide truncate">{s.label}</h5>
                  <p className="font-mono text-[9px] text-blood tracking-wider">{s.authenticity_note || "Verified Field Clue"}</p>
                  {s.description && (
                    <p className="font-mono text-[9px] text-white/40 line-clamp-1 mt-0.5">{s.description}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0 ml-2">
                <button
                  onClick={() => setEditingSig(s)}
                  title="Edit signature clue"
                  className="p-1.5 text-white/40 hover:text-white transition-colors cursor-pointer"
                >
                  <Edit className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => handleDeleteSig(s.id)}
                  title="Delete signature clue"
                  className="p-1.5 text-white/30 hover:text-red-400 transition-colors cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL: ADD SIGNATURE CLUE */}
      {showSigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg max-h-[88vh] overflow-y-auto rounded-2xl border border-white/15 bg-[#0a0a0a] p-6 shadow-2xl my-auto">
            <div className="sticky top-0 z-10 -mx-6 -mt-6 mb-4 flex items-center justify-between border-b border-white/10 bg-[#0a0a0a]/95 px-6 py-4 backdrop-blur-md">
              <h3 className="font-display text-lg font-bold uppercase tracking-wider text-white">Add Signature Clue</h3>
              <button onClick={() => setShowSigModal(false)} className="rounded-lg p-1.5 text-white/50 hover:bg-white/10 hover:text-white cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCreateSig} className="space-y-4 font-mono text-xs">
              <div>
                <label className="block uppercase text-white/60 mb-1">Clue Label *</label>
                <input
                  type="text"
                  required
                  value={sigForm.label}
                  onChange={(e) => setSigForm({ ...sigForm, label: e.target.value })}
                  placeholder="Cipher Puzzle Disc"
                  className="w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood"
                />
              </div>

              <div>
                <ImageUploadField
                  label="Signature Clue Image (S3 URL or Upload)"
                  value={sigForm.image_url}
                  onChange={(val) => setSigForm({ ...sigForm, image_url: val })}
                  folder="signatures"
                  placeholder="/src/assets/signature/puzzle.png or https://bucket.s3.amazonaws.com/signatures/puzzle.png"
                />
              </div>

              <div>
                <label className="block uppercase text-white/60 mb-1">Authenticity Tagline</label>
                <input
                  type="text"
                  value={sigForm.authenticity_note}
                  onChange={(e) => setSigForm({ ...sigForm, authenticity_note: e.target.value })}
                  placeholder="Verified Authentic Field Clue"
                  className="w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood"
                />
              </div>

              <div>
                <label className="block uppercase text-white/60 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={sigForm.description}
                  onChange={(e) => setSigForm({ ...sigForm, description: e.target.value })}
                  placeholder="Details of the clue and forensic significance..."
                  className="w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                <button type="button" onClick={() => setShowSigModal(false)} className="rounded-lg px-4 py-2 uppercase text-white/60 hover:text-white cursor-pointer">Cancel</button>
                <button type="submit" className="rounded-lg bg-blood px-5 py-2 font-display text-[11px] font-semibold uppercase tracking-wider text-white hover:bg-blood/90 cursor-pointer">Add Clue</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT SIGNATURE CLUE */}
      {editingSig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg max-h-[88vh] overflow-y-auto rounded-2xl border border-white/15 bg-[#0a0a0a] p-6 shadow-2xl my-auto">
            <div className="sticky top-0 z-10 -mx-6 -mt-6 mb-4 flex items-center justify-between border-b border-white/10 bg-[#0a0a0a]/95 px-6 py-4 backdrop-blur-md">
              <h3 className="font-display text-lg font-bold uppercase tracking-wider text-white">Edit Signature Clue</h3>
              <button onClick={() => setEditingSig(null)} className="rounded-lg p-1.5 text-white/50 hover:bg-white/10 hover:text-white cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleUpdateSig} className="space-y-4 font-mono text-xs">
              <div>
                <label className="block uppercase text-white/60 mb-1">Clue Label *</label>
                <input
                  type="text"
                  required
                  value={editingSig.label}
                  onChange={(e) => setEditingSig({ ...editingSig, label: e.target.value })}
                  placeholder="Cipher Puzzle Disc"
                  className="w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood"
                />
              </div>

              <div>
                <label className="block uppercase text-white/60 mb-1">Image URL or Upload</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editingSig.image_url || ""}
                    onChange={(e) => setEditingSig({ ...editingSig, image_url: e.target.value })}
                    placeholder="/src/assets/signature/puzzle.png or https://..."
                    className="flex-1 rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood"
                  />
                  <label className="flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/[0.05] px-3.5 py-2.5 font-display text-[11px] uppercase tracking-wider text-white hover:bg-blood/20 hover:border-blood/40 transition-colors cursor-pointer">
                    <Upload className="h-3.5 w-3.5 text-blood" />
                    <span>{uploadingSigModalImage ? "Uploading..." : "Upload File"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleUploadSigModalImage(e, true)}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Dialog Live Image Preview */}
                {editingSig.image_url && (
                  <div className="mt-2.5 flex items-center gap-3.5 rounded-xl border border-white/10 bg-black/80 p-3">
                    <div className="relative h-14 w-14 overflow-hidden rounded-lg border border-white/10 bg-[#070707] shrink-0">
                      <img
                        src={editingSig.image_url}
                        alt="Clue Preview"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <span className="inline-block rounded bg-emerald-500/20 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-emerald-400 border border-emerald-500/30 mb-0.5">
                        Clue Image Preview
                      </span>
                      <p className="font-mono text-[10px] text-white/50 truncate max-w-sm">
                        {editingSig.image_url}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block uppercase text-white/60 mb-1">Authenticity Tagline</label>
                <input
                  type="text"
                  value={editingSig.authenticity_note || ""}
                  onChange={(e) => setEditingSig({ ...editingSig, authenticity_note: e.target.value })}
                  placeholder="Verified Authentic Field Clue"
                  className="w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood"
                />
              </div>

              <div>
                <label className="block uppercase text-white/60 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingSig.description || ""}
                  onChange={(e) => setEditingSig({ ...editingSig, description: e.target.value })}
                  placeholder="Details of the clue and forensic significance..."
                  className="w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                <button type="button" onClick={() => setEditingSig(null)} className="rounded-lg px-4 py-2 uppercase text-white/60 hover:text-white cursor-pointer">Cancel</button>
                <button type="submit" className="rounded-lg bg-blood px-5 py-2 font-display text-[11px] font-semibold uppercase tracking-wider text-white hover:bg-blood/90 cursor-pointer">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
