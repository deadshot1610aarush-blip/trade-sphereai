import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/lib/products";
import { toast } from "sonner";

type Profile = {
  display_name: string | null;
  handle: string | null;
  bio: string | null;
  location: string | null;
  avatar_url: string | null;
  trust_score: number;
};

type Order = { id: string; amount: number; status: string; created_at: string; product_id: string };

export const Route = createFileRoute("/_authenticated/account")({
  head: () => ({ meta: [{ title: "Your account — TradeSphere AI" }] }),
  component: AccountPage,
});

function AccountPage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      setEmail(u.user.email ?? "");
      const { data: p } = await supabase
        .from("profiles")
        .select("display_name, handle, bio, location, avatar_url, trust_score")
        .eq("id", u.user.id)
        .maybeSingle();
      if (p) setProfile(p);
      const { data: o } = await supabase
        .from("orders")
        .select("id, amount, status, created_at, product_id")
        .order("created_at", { ascending: false });
      setOrders(o ?? []);
    })();
  }, []);

  async function save() {
    if (!profile) return;
    setSaving(true);
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return;
    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: profile.display_name,
        handle: profile.handle,
        bio: profile.bio,
        location: profile.location,
      })
      .eq("id", u.user.id);
    setSaving(false);
    if (error) toast.error(error.message);
    else toast.success("Profile updated");
  }

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-surface">
        <Navbar />
        <div className="max-w-3xl mx-auto px-6 py-20 text-center text-muted-foreground text-sm">Loading account…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface text-ink">
      <Navbar />
      <section className="px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-start justify-between mb-10">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Account</p>
              <h1 className="text-3xl font-semibold tracking-tight">{profile.display_name ?? "Your profile"}</h1>
              <p className="text-sm text-muted-foreground mt-1">{email}</p>
            </div>
            <button onClick={signOut} className="text-xs font-medium text-muted-foreground hover:text-ink transition">
              Sign out
            </button>
          </div>

          <div className="bg-card ring-1 ring-black/5 rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold">Profile</h2>
              <span className="text-xs text-brand font-medium">Trust score · {profile.trust_score}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Display name" value={profile.display_name ?? ""} onChange={(v) => setProfile({ ...profile, display_name: v })} />
              <Field label="Handle" value={profile.handle ?? ""} onChange={(v) => setProfile({ ...profile, handle: v })} />
              <Field label="Location" value={profile.location ?? ""} onChange={(v) => setProfile({ ...profile, location: v })} />
              <Field label="Bio" value={profile.bio ?? ""} onChange={(v) => setProfile({ ...profile, bio: v })} />
            </div>
            <button
              onClick={save}
              disabled={saving}
              className="mt-5 bg-ink text-surface text-sm font-medium py-2 px-5 rounded-full hover:opacity-90 transition disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>

          <div className="bg-card ring-1 ring-black/5 rounded-2xl p-6">
            <h2 className="text-sm font-semibold mb-4">Your orders</h2>
            {orders.length === 0 ? (
              <p className="text-sm text-muted-foreground">No orders yet. Browse the marketplace to reserve an asset.</p>
            ) : (
              <div className="divide-y divide-black/5">
                {orders.map((o) => (
                  <div key={o.id} className="py-3 flex items-center justify-between text-sm">
                    <div>
                      <p className="font-medium">Order #{o.id.slice(0, 8)}</p>
                      <p className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatPrice(Number(o.amount))}</p>
                      <p className="text-xs text-brand uppercase tracking-wider">{o.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full px-3 py-2 rounded-lg bg-surface border border-input text-sm focus:outline-none focus:ring-2 focus:ring-brand/30"
      />
    </label>
  );
}
