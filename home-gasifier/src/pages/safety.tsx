import { Helmet } from '@dr.pogodin/react-helmet';
import { Link } from 'react-router';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  AlertTriangle,
  Wind,
  Flame,
  Gauge,
  Droplets,
  Layers,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  XCircle,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { safety } from 'virtual:content';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
} as const;

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
} as const;

const site = 'https://homegasifier.com';
const url = `${site}/safety`;

// Ordered icon list matching hazard order in content (wind, flame, gauge, droplets, layers)
const HAZARD_ICONS = [Wind, Flame, Gauge, Droplets, Layers];

const levelStyles: Record<string, { badge: string; border: string; icon: string }> = {
  critical: {
    badge: 'bg-destructive/15 text-destructive border border-destructive/30',
    border: 'border-destructive/40',
    icon: 'text-destructive',
  },
  serious: {
    badge: 'bg-yellow-500/15 text-yellow-600 border border-yellow-500/30',
    border: 'border-yellow-500/40',
    icon: 'text-yellow-600',
  },
  moderate: {
    badge: 'bg-primary/15 text-primary border border-primary/30',
    border: 'border-primary/40',
    icon: 'text-primary',
  },
  low: {
    badge: 'bg-muted text-muted-foreground border border-border',
    border: 'border-border',
    icon: 'text-muted-foreground',
  },
};

const levelLabels: Record<string, string> = {
  critical: 'Critical',
  serious: 'Serious',
  moderate: 'Moderate',
  low: 'Low',
};

export default function SafetyPage() {
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${url}#webpage`,
    name: 'Gasifier Safety & FAQs — Home Gasifier',
    url,
    isPartOf: { '@id': `${site}/#website` },
    about: { '@id': `${site}/#organization` },
    mainEntity: [
      ...safety.faq_featured.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
      ...safety.faq.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    ],
  };

  return (
    <>
      <Helmet>
        <title>Gasifier Safety & FAQs — Home Gasifier</title>
        <meta
          name="description"
          content="Essential safety rules for home gasifier builders — carbon monoxide hazards, fire safety, PPE requirements, common mistakes, and answers to the most frequently asked questions."
        />
        <link rel="canonical" href={url} />
        <meta property="og:title" content="Gasifier Safety & FAQs — Home Gasifier" />
        <meta
          property="og:description"
          content="Safety rules, hazard guides, PPE requirements, and FAQs for home gasifier builders."
        />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={`${site}/og-image.png`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Gasifier Safety & FAQs — Home Gasifier" />
        <meta name="twitter:description" content="Safety rules and FAQs for home gasifier builders." />
        <meta name="twitter:image" content={`${site}/og-image.png`} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <main>
        {/* ── HERO ── */}
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
          <img
            src="/airo-assets/images/pages/safety/hero"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover"
            loading="eager"
            fetchPriority="high"
            width={1920}
            height={1080}
          />
          <div className="absolute inset-0 bg-background/80 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/30 to-background/90 pointer-events-none" />

          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial="hidden" animate="visible" variants={stagger}>
              <motion.p
                variants={fadeUp}
                className="text-primary text-sm font-semibold uppercase tracking-widest mb-4"
              >
                {safety.hero.eyebrow}
              </motion.p>
              <motion.h1
                variants={fadeUp}
                className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground leading-tight mb-6"
              >
                {safety.hero.heading}
              </motion.h1>
              <motion.p
                variants={fadeUp}
                className="text-lg text-muted-foreground max-w-2xl leading-relaxed"
              >
                {safety.hero.subheading}
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* ── WARNING BANNER ── */}
        <section className="bg-destructive/10 border-y border-destructive/30">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' as const }}
              className="flex items-start gap-4"
            >
              <AlertTriangle className="w-6 h-6 text-destructive shrink-0 mt-0.5" />
              <div>
                <p className="text-destructive font-bold text-base mb-1">
                  {safety.warning_banner.headline}
                </p>
                <p className="text-destructive/80 text-sm leading-relaxed">
                  {safety.warning_banner.body}
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── HAZARDS ── */}
        <section className="py-20 md:py-28 bg-background">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={stagger}
              className="mb-14"
            >
              <motion.p
                variants={fadeUp}
                className="text-primary text-sm font-semibold uppercase tracking-widest mb-3"
              >
                Know the risks
              </motion.p>
              <motion.h2
                variants={fadeUp}
                className="text-3xl md:text-4xl font-bold text-foreground"
              >
                Five hazards every builder must understand
              </motion.h2>
            </motion.div>

            <div className="flex flex-col gap-5">
              {safety.hazards.map((haz, i) => {
                const styles = levelStyles[haz.level] ?? levelStyles.low;
                return (
                  <motion.div
                    key={haz.id}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-60px' }}
                    variants={fadeUp}
                    className={`bg-card border-2 rounded-xl overflow-hidden ${styles.border}`}
                  >
                    {/* Header */}
                    <div className="flex items-start gap-4 px-6 pt-6 pb-4">
                      <div className={`w-10 h-10 rounded-full bg-card border-2 ${styles.border} flex items-center justify-center shrink-0`}>
                        {(() => { const Icon = HAZARD_ICONS[i] ?? Layers; return <Icon className={`w-5 h-5 ${styles.icon}`} />; })()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h3 className="text-foreground font-bold text-lg">{haz.title}</h3>
                          <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${styles.badge}`}>
                            {levelLabels[haz.level] ?? haz.level}
                          </span>
                        </div>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {haz.description}
                        </p>
                      </div>
                    </div>

                    {/* Rules */}
                    <div className="px-6 pb-6">
                      <ul className="flex flex-col gap-2 bg-muted/40 rounded-lg p-4">
                        {haz.rules.map((rule, ri) => (
                          <li key={ri} className="flex items-start gap-2 text-sm text-foreground">
                            <ShieldCheck className={`w-4 h-4 shrink-0 mt-0.5 ${styles.icon}`} />
                            <span>{rule}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── PPE + CO DETECTOR ── */}
        <section className="py-20 md:py-28 bg-muted/40">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
              {/* PPE list */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                variants={stagger}
              >
                <motion.p
                  variants={fadeUp}
                  className="text-primary text-sm font-semibold uppercase tracking-widest mb-3"
                >
                  Gear up first
                </motion.p>
                <motion.h2
                  variants={fadeUp}
                  className="text-3xl md:text-4xl font-bold text-foreground mb-8"
                >
                  {safety.ppe.heading}
                </motion.h2>

                <motion.div variants={stagger} className="flex flex-col gap-3">
                  {safety.ppe.items.map((item) => (
                    <motion.div
                      key={item.id}
                      variants={fadeUp}
                      className="flex items-start gap-4 bg-card border border-border rounded-xl px-5 py-4"
                    >
                      <ShieldCheck className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                      <div>
                        <div className="text-sm font-bold text-foreground">{item.item}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{item.when}</div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>

              {/* CO detector image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, ease: 'easeOut' as const }}
                className="relative"
              >
                <div className="rounded-xl overflow-hidden aspect-[4/3] shadow-2xl">
                  <img
                    src="/airo-assets/images/pages/safety/co-detector"
                    alt="Carbon monoxide detector — essential safety equipment for gasifier operation"
                    className="w-full h-full object-cover"
                    loading="lazy"
                    width={800}
                    height={600}
                  />
                </div>
                <div className="absolute -bottom-3 -right-3 w-full h-full rounded-xl border-2 border-destructive/30 -z-10" />
                <div className="absolute bottom-4 left-4 right-4 bg-background/90 backdrop-blur-sm rounded-lg px-4 py-3 border border-destructive/30">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-destructive shrink-0" />
                    <p className="text-xs text-foreground font-semibold">
                      A CO detector is not optional. It is the difference between a close call and a fatality.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── COMMON MISTAKES ── */}
        <section className="py-20 md:py-28 bg-background">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={stagger}
              className="mb-14"
            >
              <motion.p
                variants={fadeUp}
                className="text-primary text-sm font-semibold uppercase tracking-widest mb-3"
              >
                Learn from others
              </motion.p>
              <motion.h2
                variants={fadeUp}
                className="text-3xl md:text-4xl font-bold text-foreground"
              >
                {safety.mistakes.heading}
              </motion.h2>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={stagger}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {safety.mistakes.items.map((item, i) => (
                <motion.div
                  key={item.id}
                  variants={fadeUp}
                  className="bg-card border border-border rounded-xl p-6 flex flex-col gap-3"
                >
                  <div className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-destructive/70 shrink-0 mt-0.5" />
                    <h3 className="text-foreground font-bold text-base leading-snug">{item.title}</h3>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="py-20 md:py-28 bg-muted/40">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={stagger}
              className="mb-14"
            >
              <motion.p
                variants={fadeUp}
                className="text-primary text-sm font-semibold uppercase tracking-widest mb-3"
              >
                Frequently asked questions
              </motion.p>
              <motion.h2
                variants={fadeUp}
                className="text-3xl md:text-4xl font-bold text-foreground mb-4"
              >
                Answers for beginners and advanced builders
              </motion.h2>
              <motion.p variants={fadeUp} className="text-muted-foreground leading-relaxed">
                The four questions below come up most often — and the answers matter before you start building.
              </motion.p>
            </motion.div>

            {/* ── Featured inline Q&As ── */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={stagger}
              className="flex flex-col gap-6 mb-12"
            >
              {safety.faq_featured.map((item) => (
                <motion.div
                  key={item.id}
                  variants={fadeUp}
                  className="bg-card border border-border rounded-xl p-6 md:p-8"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <h3 className="text-foreground font-bold text-base md:text-lg leading-snug">
                      {item.question}
                    </h3>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed pl-8">
                    {item.answer}
                  </p>
                  {item.action_label && item.action_href && (
                    <div className="pl-8 mt-4">
                      <a
                        href={item.action_href}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                      >
                        {item.action_label} <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>

            {/* ── Divider ── */}
            <div className="flex items-center gap-4 mb-10">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-widest whitespace-nowrap">
                More questions
              </span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* ── Accordion for remaining Q&As ── */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={stagger}
              className="flex flex-col gap-2"
            >
              {safety.faq.map((item) => (
                <motion.div
                  key={item.id}
                  variants={fadeUp}
                  className="bg-card border border-border rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === item.id ? null : item.id)}
                    className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left group"
                    aria-expanded={openFaq === item.id}
                  >
                    <span className="text-foreground font-semibold text-base leading-snug group-hover:text-primary transition-colors">
                      {item.question}
                    </span>
                    {openFaq === item.id ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />
                    )}
                  </button>

                  <AnimatePresence initial={false}>
                    {openFaq === item.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: 'easeInOut' as const }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 border-t border-border pt-4">
                          <p className="text-muted-foreground text-sm leading-relaxed">
                            {item.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section className="py-16 md:py-20 bg-background border-t border-border">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-2">
                  Ready to start building?
                </p>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                  You've done the reading. Now pick your design.
                </h2>
              </div>
              <Link
                to="/build-guides"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary text-primary-foreground font-semibold rounded-md hover:bg-primary/90 transition-colors whitespace-nowrap shrink-0"
              >
                Browse Build Guides <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
