import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { Compass, History, Info } from "lucide-react";

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-sage/10 sticky top-0 z-50">
        <nav className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-sage hover:text-sage-dark transition-colors"
          >
            <Compass className="w-6 h-6" />
            <span className="font-semibold text-lg">Gentle Disagree</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              to="/history"
              className="text-text-muted hover:text-sage transition-colors"
              aria-label="View history"
            >
              <History className="w-5 h-5" />
            </Link>
            <Link
              to="/about"
              className="text-text-muted hover:text-sage transition-colors"
              aria-label="About"
            >
              <Info className="w-5 h-5" />
            </Link>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-6">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-sand/50 border-t border-sage/10 py-4">
        <div className="max-w-md mx-auto px-4 text-center text-text-muted text-sm">
          <p>Your conversations stay private on this device.</p>
        </div>
      </footer>
    </div>
  );
}
