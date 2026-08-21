import { useState, useEffect } from 'react';
import { X, Cookie } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const CONSENT_KEY = 'c2_analytics_consent';

function hasConsented(): boolean {
  if (typeof localStorage === 'undefined') return false;
  return localStorage.getItem(CONSENT_KEY) !== null;
}

function saveConsent(analytics: boolean): void {
  localStorage.setItem(
    CONSENT_KEY,
    JSON.stringify({ analytics, timestamp: Date.now() })
  );
  window.dispatchEvent(
    new CustomEvent('cookie-consent-changed', { detail: { consented: analytics } })
  );
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only show if the visitor hasn't responded yet
    if (!hasConsented()) {
      // Small delay so it doesn't flash on first paint
      const t = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  function accept() {
    saveConsent(true);
    setVisible(false);
  }

  function decline() {
    saveConsent(false);
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' as const }}
          role="dialog"
          aria-label="Cookie notice"
          aria-live="polite"
          className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6"
        >
          <div className="max-w-3xl mx-auto bg-card border border-border rounded-xl shadow-2xl p-5 sm:p-6">
            <div className="flex items-start gap-4">
              <div className="shrink-0 mt-0.5">
                <Cookie className="w-5 h-5 text-primary" aria-hidden="true" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-foreground font-semibold text-sm mb-1">
                  What this site collects — and why
                </p>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  This site uses basic analytics (page views and general traffic data) to understand
                  which content is useful. It does <strong className="text-foreground">not</strong>{' '}
                  collect personal information, track you across other sites, or sell any data. If
                  you sign up for the newsletter, your email address is stored only to send you
                  updates — nothing else. You can opt out any time.
                </p>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={accept}
                    className="inline-flex items-center justify-center px-5 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-md hover:bg-primary/90 transition-colors"
                  >
                    That's fine
                  </button>
                  <button
                    onClick={decline}
                    className="inline-flex items-center justify-center px-5 py-2 border border-border text-foreground text-sm font-semibold rounded-md hover:bg-muted transition-colors"
                  >
                    No analytics please
                  </button>
                </div>
              </div>

              <button
                onClick={decline}
                aria-label="Dismiss cookie notice"
                className="shrink-0 text-muted-foreground hover:text-foreground transition-colors mt-0.5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
