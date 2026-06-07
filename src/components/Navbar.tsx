import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

export function Navbar() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-black/5 bg-surface/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <span className="size-6 rounded-md bg-ink grid place-items-center">
              <span className="size-2 rounded-full bg-brand" />
            </span>
            <span className="text-[15px] font-semibold tracking-tight">TradeSphere AI</span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/marketplace"
              className="text-sm font-medium text-muted-foreground hover:text-ink transition-colors"
              activeProps={{ className: "text-ink" }}
            >
              Browse
            </Link>
            <a href="/#sell" className="text-sm font-medium text-muted-foreground hover:text-ink transition-colors">Sell</a>
            <a href="/#trade" className="text-sm font-medium text-muted-foreground hover:text-ink transition-colors">Trade</a>
            <a href="/#how" className="text-sm font-medium text-muted-foreground hover:text-ink transition-colors">How it works</a>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {loading ? null : user ? (
            <>
              <Link
                to="/account"
                className="hidden sm:inline-flex text-sm font-medium text-muted-foreground hover:text-ink transition-colors"
              >
                Account
              </Link>
              <button
                onClick={signOut}
                className="bg-ink text-surface text-sm font-medium py-2 px-4 rounded-full ring-1 ring-ink hover:opacity-90 transition-opacity"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/auth"
                className="hidden sm:inline-flex text-sm font-medium text-muted-foreground hover:text-ink transition-colors"
              >
                Sign in
              </Link>
              <Link
                to="/auth"
                className="bg-ink text-surface text-sm font-medium py-2 px-4 rounded-full ring-1 ring-ink hover:opacity-90 transition-opacity"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
