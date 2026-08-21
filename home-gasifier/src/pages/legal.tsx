import { Helmet } from '@dr.pogodin/react-helmet';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { Scale, ClipboardList, Map, Shield, Wind, ArrowRight, CheckCircle2, AlertTriangle } from 'lucide-react';
import { legal } from 'virtual:content';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
} as const;

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
} as const;

const site = 'https://homegasifier.com';
const url = `${site}/legal-regulatory`;

// Icons indexed to match sections order
const SECTION_ICONS = [Scale, ClipboardList, Map, Shield, Wind];

export default function LegalPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    name: legal.meta.title,
    url,
    isPartOf: { '@id': `${site}/#website` },
    about: { '@id': `${site}/#organization` },
    datePublished: '2026-08-19',
    dateModified: '2026-08-19',
  };

  return (
    <>
      <Helmet>
        <title>{legal.meta.title}</title>
        <meta name="description" content={legal.meta.description} />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={legal.meta.title} />
        <meta property="og:description" content={legal.meta.description} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={`${site}/og-image.png`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={legal.meta.title} />
        <meta name="twitter:description" content={legal.meta.description} />
        <meta name="twitter:image" content={`${site}/og-image.png`} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <main>
        {/* Hero */}
        <section className="relative min-h-[340px] flex items-end overflow-hidden">
          <img
            src="/airo-assets/images/pages/legal/hero"
            alt="Legal documents and permit paperwork"
            className="absolute inset-0 w-full h-full object-cover"
            loading="eager"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 via-gray-900/60 to-gray-900/85 pointer-events-none" />
          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 pt-32">
            <motion.div initial="hidden" animate="visible" variants={stagger}>
              <motion.p variants={fadeUp} className="text-sm font-medium text-primary uppercase tracking-wide mb-3">
                {legal.hero.eyebrow}
              </motion.p>
              <motion.h1 variants={fadeUp} className="text-4xl md:text-5xl font-bold text-white mb-4">
                {legal.hero.title}
              </motion.h1>
              <motion.p variants={fadeUp} className="text-lg text-white/80 max-w-2xl">
                {legal.hero.subtitle}
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Intro */}
        <section className="bg-card border-b border-border py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="max-w-3xl"
            >
              <motion.h2 variants={fadeUp} className="text-2xl font-bold text-foreground mb-5">
                {legal.intro.heading}
              </motion.h2>
              {legal.intro.body.map((p) => (
                <motion.p key={p.id} variants={fadeUp} className="text-muted-foreground leading-relaxed mb-4">
                  {p.text}
                </motion.p>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Sections */}
        <section className="bg-background py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-10">
            {legal.sections.map((sec, idx) => {
              const Icon = SECTION_ICONS[idx] ?? Scale;
              return (
                <motion.div
                  key={sec.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={stagger}
                  className="bg-card rounded-xl border border-border overflow-hidden"
                >
                  {/* Section header */}
                  <div className="flex items-center gap-4 px-6 py-5 border-b border-border bg-muted/30">
                    <span className="shrink-0 p-2 rounded-lg bg-primary/10 border border-primary/20">
                      <Icon className="w-5 h-5 text-primary" aria-hidden="true" />
                    </span>
                    <motion.h2 variants={fadeUp} className="text-lg font-bold text-foreground">
                      {sec.title}
                    </motion.h2>
                  </div>

                  <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Body text */}
                    <div>
                      {sec.body.map((p) => (
                        <motion.p key={p.id} variants={fadeUp} className="text-muted-foreground leading-relaxed mb-3 text-sm">
                          {p.text}
                        </motion.p>
                      ))}
                    </div>

                    {/* Checklist */}
                    <div>
                      <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary" aria-hidden="true" />
                        Action checklist
                      </h3>
                      <ul className="flex flex-col gap-2">
                        {sec.checklist.map((item) => (
                          <motion.li key={item.id} variants={fadeUp} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                            <span>{item.text}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* How to check your jurisdiction */}
        <section className="bg-card border-t border-border py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
            >
              <motion.h2 variants={fadeUp} className="text-2xl font-bold text-foreground mb-8">
                {legal.howToCheck.heading}
              </motion.h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {legal.howToCheck.steps.map((step) => (
                  <motion.div
                    key={step.id}
                    variants={fadeUp}
                    className="bg-background rounded-xl border border-border p-5 flex items-start gap-4"
                  >
                    <span className="shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                      {step.step}
                    </span>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground mb-1">{step.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{step.body}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Legal disclaimer */}
        <section className="bg-background py-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="bg-muted/50 border border-border rounded-xl p-6 max-w-3xl flex items-start gap-4"
            >
              <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <h2 className="text-base font-semibold text-foreground mb-2">{legal.disclaimer.heading}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{legal.disclaimer.body}</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-card border-t border-border py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
            >
              <motion.h2 variants={fadeUp} className="text-2xl font-bold text-foreground mb-3">
                {legal.cta.heading}
              </motion.h2>
              <motion.p variants={fadeUp} className="text-muted-foreground max-w-xl mx-auto mb-8">
                {legal.cta.body}
              </motion.p>
              <motion.div variants={fadeUp}>
                <Link
                  to="/build-guides"
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                >
                  {legal.cta.linkLabel}
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
