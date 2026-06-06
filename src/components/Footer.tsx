export function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-black/5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-6">
          <span className="text-sm font-semibold">TradeSphere AI</span>
          <p className="text-xs text-muted-foreground">© 2026 TradeSphere Systems Inc.</p>
        </div>
        <div className="flex items-center gap-8">
          <a href="#" className="text-xs font-medium text-muted-foreground hover:text-ink transition-colors">
            Terms
          </a>
          <a href="#" className="text-xs font-medium text-muted-foreground hover:text-ink transition-colors">
            Privacy
          </a>
          <a href="#" className="text-xs font-medium text-muted-foreground hover:text-ink transition-colors">
            Institutional
          </a>
        </div>
      </div>
    </footer>
  );
}
