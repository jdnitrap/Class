import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router';
import { ChevronDown } from 'lucide-react';

const primaryLinks = [
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'Build Guides', href: '/build-guides' },
  { label: 'Fuel Types', href: '/fuel-types' },
  { label: 'Safety & FAQs', href: '/safety' },
];

const moreLinks = [
  { label: 'Troubleshooting', href: '/troubleshooting' },
  { label: 'Maintenance', href: '/maintenance' },
  { label: 'Real Builds', href: '/real-builds' },
  { label: 'Simulator', href: '/simulator' },
  { label: 'Glossary', href: '/glossary' },
  { label: 'Resources', href: '/resources' },
  { label: 'Legal & Regulatory', href: '/legal-regulatory' },
  { label: 'About', href: '/about' },
];

const allLinks = [...primaryLinks, ...moreLinks];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setMoreOpen(false);
  }, [location.pathname]);

  // Close "More" dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const isMoreActive = moreLinks.some((l) => l.href === location.pathname);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-background/95 backdrop-blur-sm shadow-lg border-b border-border'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0 min-w-0">
            <img
              src="/airo-assets/images/logo/horizontal"
              alt="Home Gasifier"
              className="block h-auto max-h-10 md:max-h-12 w-auto max-w-full object-contain self-center"
            />
          </Link>

          {/* Desktop Nav */}
          <nav aria-label="Main navigation" className="hidden md:flex items-center gap-1">
            {primaryLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  location.pathname === link.href
                    ? 'text-primary bg-primary/10'
                    : 'text-foreground/80 hover:text-primary hover:bg-primary/10'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* More dropdown */}
            <div ref={moreRef} className="relative">
              <button
                onClick={() => setMoreOpen(!moreOpen)}
                aria-expanded={moreOpen}
                aria-haspopup="true"
                className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isMoreActive
                    ? 'text-primary bg-primary/10'
                    : 'text-foreground/80 hover:text-primary hover:bg-primary/10'
                }`}
              >
                More
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${moreOpen ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                />
              </button>

              {moreOpen && (
                <div className="absolute right-0 top-full mt-1 w-52 bg-background border border-border rounded-xl shadow-xl py-1 z-50">
                  {moreLinks.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      className={`block px-4 py-2.5 text-sm font-medium transition-colors ${
                        location.pathname === link.href
                          ? 'text-primary bg-primary/10'
                          : 'text-foreground/80 hover:text-primary hover:bg-primary/5'
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md text-foreground/80 hover:text-primary transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span className="block w-5 h-0.5 bg-current mb-1" />
            <span className="block w-5 h-0.5 bg-current mb-1" />
            <span className="block w-5 h-0.5 bg-current" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-background/98 border-t border-border">
          <nav aria-label="Mobile navigation" className="px-4 py-4 flex flex-col gap-1">
            {allLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === link.href
                    ? 'text-primary bg-primary/10'
                    : 'text-foreground/80 hover:text-primary hover:bg-primary/10'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
