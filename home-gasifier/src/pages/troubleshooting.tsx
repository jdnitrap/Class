import { Helmet } from '@dr.pogodin/react-helmet';
import { Link } from 'react-router';
import { useState } from 'react';
import { motion } from 'motion/react';
import {
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Wrench,
  Flame,
  Wind,
  Thermometer,
  Layers,
  Fuel,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { troubleshooting } from 'virtual:content';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
} as const;

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
} as const;

const site = 'https://homegasifier.com';
const url = `${site}/troubleshooting`;

// Icons indexed by problem order
const PROBLEM_ICONS = [Layers, Wrench, Flame, Thermometer, Wind, Fuel, Layers];

const severityStyles: Record<string, { badge: string; border: string; dot: string }> = {
  high: {
    badge: 'bg-destructive/15 text-destructive border border-destructive/30',
    border: 'border-destructive/40',
    dot: 'bg-destructive',
  },
  medium: {
    badge: 'bg-yellow-500/15 text-yellow-600 border border-yellow-500/30',
    border: 'border-yellow-500/40',
    dot: 'bg-yellow-500',
  },
  low: {
    badge: 'bg-primary/15 text-primary border border-primary/30',
    border: 'border-primary/40',
    dot: 'bg-primary',
  },
};



export default function TroubleshootingPage() {
  const [openId, setOpenId] = useState<string | null>(null);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    '@id': `${url}#webpage`,
    name: troubleshooting.meta.title,
    url,
    isPartOf: { '@id': `${site}/#website` },
    about: { '@id': `${site}/#organization` },
    datePublished: '2026-08-19',
    dateModified: '2026-08-19',
  };

  return (
    <>
      <Helmet>
        <title>{troubleshooting.meta.title}</title>
        <meta name="description" content={troubleshooting.meta.description} />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={troubleshooting.meta.title} />
        <meta property="og:description" content={troubleshooting.meta.description} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={`${site}/og-image.png`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={troubleshooting.meta.title} />
        <meta name="twitter:description" content={troubleshooting.meta.description} />
        <meta name="twitter:image" content={`${site}/og-image.png`} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <main>
        {/* Hero */}
        <section className="relative min-h-[340px] flex items-end overflow-hidden">
          <img
            src="/airo-assets/images/pages/troubleshooting/hero"
            alt="Workshop tools and engine repair"
            className="absolute inset-0 w-full h-full object-cover"
            loading="eager"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 via-gray-900/60 to-gray-900/85 pointer-events-none" />
          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 pt-32">
            <motion.div initial="hidden" animate="visible" variants={stagger}>
              <motion.p variants={fadeUp} className="text-sm font-medium text-primary uppercase tracking-wide mb-3">
                {troubleshooting.hero.eyebrow}
              </motion.p>
              <motion.h1 variants={fadeUp} className="text-4xl md:text-5xl font-bold text-white mb-4">
                {troubleshooting.hero.title}
              </motion.h1>
              <motion.p variants={fadeUp} className="text-lg text-white/80 max-w-2xl">
                {troubleshooting.hero.subtitle}
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Intro */}
        <section className="bg-card border-b border-border">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="max-w-3xl"
            >
              <motion.h2 variants={fadeUp} className="text-2xl font-bold text-foreground mb-4">
                {troubleshooting.intro.heading}
              </motion.h2>
              {troubleshooting.intro.body.map((p) => (
                <motion.p key={p.id} variants={fadeUp} className="text-muted-foreground mb-3 leading-relaxed">
                  {p.text}
                </motion.p>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Problems accordion */}
        <section className="bg-background py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="text-2xl font-bold text-foreground mb-8"
            >
              Common Problems &amp; Solutions
            </motion.h2>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="flex flex-col gap-4"
            >
              {troubleshooting.problems.map((problem, idx) => {
                const isOpen = openId === problem.id;
                const sev = severityStyles[problem.severity] ?? severityStyles.low;
                const Icon = PROBLEM_ICONS[idx] ?? Wrench;

                return (
                  <motion.div
                    key={problem.id}
                    variants={fadeUp}
                    className={`rounded-xl border bg-card overflow-hidden ${sev.border}`}
                  >
                    <button
                      className="w-full text-left px-6 py-5 flex items-center gap-4"
                      onClick={() => setOpenId(isOpen ? null : problem.id)}
                      aria-expanded={isOpen}
                    >
                      <span className={`shrink-0 p-2 rounded-lg bg-background border ${sev.border}`}>
                        <Icon className="w-5 h-5 text-primary" aria-hidden="true" />
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="block text-xs text-muted-foreground mb-0.5">{problem.category}</span>
                        <span className="block text-base font-semibold text-foreground">{problem.title}</span>
                      </span>
                      <span className={`hidden sm:inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${sev.badge}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${sev.dot}`} />
                        {problem.severity === 'high' ? 'High priority' : problem.severity === 'medium' ? 'Medium priority' : 'Low priority'}
                      </span>
                      {isOpen ? (
                        <ChevronUp className="w-5 h-5 text-muted-foreground shrink-0" aria-hidden="true" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" aria-hidden="true" />
                      )}
                    </button>

                    {isOpen && (
                      <div className="px-6 pb-6 border-t border-border pt-5 grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Symptoms */}
                        <div>
                          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-yellow-500" aria-hidden="true" />
                            Symptoms
                          </h3>
                          <ul className="flex flex-col gap-2">
                            {problem.symptoms.map((s) => (
                              <li key={s.id} className="flex items-start gap-2 text-sm text-muted-foreground">
                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-yellow-500 shrink-0" />
                                <span>{s.text}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Causes */}
                        <div>
                          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                            <Wrench className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
                            Likely Causes
                          </h3>
                          <ul className="flex flex-col gap-2">
                            {problem.causes.map((c) => (
                              <li key={c.id} className="flex items-start gap-2 text-sm text-muted-foreground">
                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-muted-foreground shrink-0" />
                                <span>{c.text}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Solutions */}
                        <div>
                          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-primary" aria-hidden="true" />
                            Solutions
                          </h3>
                          <ol className="flex flex-col gap-2">
                            {problem.solutions.map((sol, solIdx) => (
                              <li key={sol.id} className="flex items-start gap-2 text-sm text-muted-foreground">
                                <span className="mt-0.5 shrink-0 w-5 h-5 rounded-full bg-primary/15 text-primary text-xs font-bold flex items-center justify-center">
                                  {solIdx + 1}
                                </span>
                                <span>{sol.text}</span>
                              </li>
                            ))}
                          </ol>
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* General tips */}
        <section className="bg-card border-t border-border py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
            >
              <motion.h2 variants={fadeUp} className="text-2xl font-bold text-foreground mb-8">
                {troubleshooting.tips.heading}
              </motion.h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {troubleshooting.tips.items.map((tip, idx) => (
                  <motion.div
                    key={tip.id}
                    variants={fadeUp}
                    className="flex items-start gap-3 bg-background rounded-xl border border-border p-5"
                  >
                    <span className="shrink-0 w-7 h-7 rounded-full bg-primary/15 text-primary text-sm font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <p className="text-sm text-muted-foreground leading-relaxed">{tip.text}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-background border-t border-border py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
            >
              <motion.h2 variants={fadeUp} className="text-2xl font-bold text-foreground mb-3">
                {troubleshooting.cta.heading}
              </motion.h2>
              <motion.p variants={fadeUp} className="text-muted-foreground max-w-xl mx-auto mb-8">
                {troubleshooting.cta.body}
              </motion.p>
              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/safety-faqs"
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                >
                  {troubleshooting.cta.link1Label}
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
                <Link
                  to="/resources"
                  className="inline-flex items-center gap-2 border border-border text-foreground px-6 py-3 rounded-lg font-semibold hover:bg-muted transition-colors"
                >
                  {troubleshooting.cta.link2Label}
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
}
