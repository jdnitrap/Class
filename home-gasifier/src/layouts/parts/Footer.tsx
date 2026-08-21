import { Link } from 'react-router';
import { Flame } from 'lucide-react';

const footerLinks = [
  {
    heading: 'Learn',
    links: [
      { label: 'How It Works', href: '/how-it-works' },
      { label: 'Build Guides', href: '/build-guides' },
      { label: 'Fuel Types & Efficiency', href: '/fuel-types' },
      { label: 'Safety & FAQs', href: '/safety' },
    ],
  },
  {
    heading: 'Resources',
    links: [
      { label: 'Manuals & References', href: '/resources' },
      { label: 'Community Forums', href: '/resources#cat-forums' },
      { label: 'Video Channels', href: '/resources#cat-video' },
      { label: 'Glossary', href: '/resources#glossary' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img
                src="/airo-assets/images/logo/horizontal"
                alt="Home Gasifier"
                className="block h-auto max-h-9 w-auto max-w-full object-contain self-center"
              />
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              Your friendly guide to wood gas energy — from first spark to full system. One person's
              research, shared openly.
            </p>
          </div>

          {/* Links */}
          {footerLinks.map((group) => (
            <div key={group.heading}>
              <h3 className="text-xs font-semibold text-primary uppercase tracking-wider mb-4">
                {group.heading}
              </h3>
              <ul className="flex flex-col gap-2">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Home Gasifier. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Flame className="w-3.5 h-3.5 text-primary" />
            <span>Powered by wood gas</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
