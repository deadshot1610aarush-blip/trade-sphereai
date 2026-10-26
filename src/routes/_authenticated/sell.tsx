import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { LISTING_CATEGORIES, LISTING_CONDITIONS } from "@/lib/listings";

export const Route = createFileRoute("/_authenticated/sell")({
  head: () => ({
    meta: [
      { title: "List an item — TradeSphere AI" },
      { name: "description", content: "Add your own product to the TradeSphere AI marketplace." },
      { name: "robots", content: "noindex" },
    ],
  }),
  // Listing is owner-only: the backend rejects non-admin inserts, and
  // non-admins are bounced to their account page here.
  beforeLoad: async () => {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) throw redirect({ to: "/auth" });
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", u.user.id)
      .eq("role", "admin");
    if (!data || data.length === 0) throw redirect({ to: "/account" });
  },
  component: SellPage,
});

const inputCls =
  "mt-1 w-full px-3 py-2 rounded-lg bg-surface border border-input text-sm focus:outline-none focus:ring-2 focus:ring-brand/30";

function SellPage() {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    brand: "",
    category: LISTING_CATEGORIES[0] as string,
    condition: LISTING_CONDITIONS[1] as string,
    price: "",
    description: "",
    accepts_trade: true,
  });
  const set = (k: keyof typeof form, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  function pickFile(f: File | null) {
    if (f && f.size > 5 * 1024 * 1024) {
      toast.error("Photo must be under 5 MB");
      return;
    }
    setFile(f);
    setPreview(f ? URL.createObjectURL(f) : null);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const price = Number(form.price);
    if (form.title.trim().length < 3) return toast.error("Add a title (at least 3 characters)");
    if (!Number.isFinite(price) || price <= 0) return toast.error("Enter a valid price");
    if (!file) return toast.error("Add a photo of your item");

    setSaving(true);
    try {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) throw new Error("Please sign in again");
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${u.user.id}/${crypto.randomUUID()}.${ext}`;
      const up = await supabase.storage.from("product-images").upload(path, file, { contentType: file.type });
      if (up.error) throw up.error;
      const signed = await supabase.storage
        .from("product-images")
        .createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
      if (signed.error) throw signed.error;

      const { data, error } = await supabase
        .from("products")
        .insert({
          seller_id: u.user.id,
          title: form.title.trim(),
          brand: form.brand.trim() || null,
          category: form.category,
          condition: form.condition,
          price,
          ai_valuation: price,
          description: form.description.trim(),
          accepts_trade: form.accepts_trade,
          image_url: signed.data.signedUrl,
        })
        .select("id")
        .single();
      if (error) throw error;
      toast.success("Your item is live!");
      navigate({ to: "/product/$id", params: { id: data.id } });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not publish listing");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-surface text-ink">
      <Navbar />
      <section className="px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Sell</p>
          <h1 className="text-3xl font-semibold tracking-tight mb-8">List a new item</h1>
          <form onSubmit={submit} className="bg-card ring-1 ring-black/5 rounded-2xl p-6 grid gap-4 sm:grid-cols-2">
            <label className="sm:col-span-2 block">
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Photo</span>
              <div className="mt-1 flex items-center gap-4">
                <div className="size-24 rounded-xl bg-muted overflow-hidden ring-1 ring-black/5 shrink-0">
                  {preview && <img src={preview} alt="Preview" className="size-full object-cover" />}
                </div>
                <input type="file" accept="image/*" onChange={(e) => pickFile(e.target.files?.[0] ?? null)} className="text-sm" />
              </div>
            </label>
            <label className="sm:col-span-2 block">
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Title</span>
              <input required maxLength={120} value={form.title} onChange={(e) => set("title", e.target.value)} className={inputCls} placeholder="e.g. Sony A7 IV with 28-70mm lens" />
            </label>
            <label className="block">
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Brand</span>
              <input maxLength={60} value={form.brand} onChange={(e) => set("brand", e.target.value)} className={inputCls} />
            </label>
            <label className="block">
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Price (USD)</span>
              <input required type="number" min="1" step="0.01" value={form.price} onChange={(e) => set("price", e.target.value)} className={inputCls} />
            </label>
            <label className="block">
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Category</span>
              <select value={form.category} onChange={(e) => set("category", e.target.value)} className={inputCls}>
                {LISTING_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Condition</span>
              <select value={form.condition} onChange={(e) => set("condition", e.target.value)} className={inputCls}>
                {LISTING_CONDITIONS.map((c) => <option key={c}>{c}</option>)}
              </select>
            </label>
            <label className="sm:col-span-2 block">
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Description</span>
              <textarea rows={5} maxLength={2000} value={form.description} onChange={(e) => set("description", e.target.value)} className={inputCls} />
            </label>
            <label className="sm:col-span-2 flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.accepts_trade} onChange={(e) => set("accepts_trade", e.target.checked)} />
              Open to trade offers
            </label>
            <button disabled={saving} className="sm:col-span-2 bg-ink text-surface text-sm font-medium py-3 rounded-full hover:opacity-90 transition disabled:opacity-50">
              {saving ? "Publishing…" : "Publish listing"}
            </button>
          </form>
        </div>
      </section>
      <Footer />
    </div>
  );
}
