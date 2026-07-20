import { Outlet, Link, useLocation } from 'react-router-dom';
import { Scissors, CalendarClock, LayoutDashboard, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../../utils';

export function RootLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsMobileMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMobileMenuOpen(false);

  const navLinks = [
    { name: 'Início', path: '/' },
    { name: 'Agendar', path: '/agendar' },
    { name: 'Fila ao Vivo', path: '/fila', icon: <CalendarClock className="w-4 h-4 mr-2" /> },
    { name: 'Admin', path: '/admin', icon: <LayoutDashboard className="w-4 h-4 mr-2" /> },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans flex flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group" onClick={closeMenu}>
              <div className="w-8 h-8 rounded bg-amber-500 flex items-center justify-center text-zinc-950 group-hover:bg-amber-400 transition-colors">
                <Scissors className="w-5 h-5" />
              </div>
              <span className="font-display font-bold text-2xl tracking-tight uppercase">Ironbeard</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "flex items-center text-sm font-medium transition-colors hover:text-amber-500",
                    location.pathname === link.path ? "text-amber-500" : "text-zinc-400"
                  )}
                >
                  {link.icon}
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 text-zinc-400 hover:text-amber-500"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMobileMenuOpen && (
          <nav className="md:hidden border-t border-zinc-800 bg-zinc-900 px-4 pt-2 pb-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={closeMenu}
                className={cn(
                  "flex items-center w-full px-3 py-3 rounded-md text-base font-medium",
                  location.pathname === link.path 
                    ? "bg-amber-500/10 text-amber-500" 
                    : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
                )}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
          </nav>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-zinc-500 text-sm">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Scissors className="w-4 h-4" />
            <span className="font-display font-bold tracking-widest uppercase">Ironbeard</span>
          </div>
          <p>© {new Date().getFullYear()} Demonstração SaaS de Barbearia. Produto Fictício.</p>
        </div>
      </footer>
    </div>
  );
}
