import { Helmet } from '@dr.pogodin/react-helmet';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { ShieldCheck, BookOpen, Wrench, Eye, ArrowRight } from 'lucide-react';
import { about } from 'virtual:content';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
} as const;

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
} as const;

const site = 'https://homegasifier.com';
const url = `${site}/about`;

// Icons indexed to match principles order
const PRINCIPLE_ICONS = [ShieldCheck, Eye, BookOpen, Wrench];

export default function AboutPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    '@id': `${url}#webpage`,
    name: about.meta.title,
    url,
    isPartOf: { '@id': `${site}/#website` },
    about: { '@id': `${site}/#organization` },
    datePublished: '2026-08-19',
    dateModified: '2026-08-19',
  };

  return (
    <>
      <Helmet>
        <title>{about.meta.title}</title>
        <meta name="description" content={about.meta.description} />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={about.meta.title} />
        <meta property="og:description" content={about.meta.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={`${site}/og-image.png`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={about.meta.title} />
        <meta name="twitter:description" content={about.meta.description} />
        <meta name="twitter:image" content={`${site}/og-image.png`} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <main>
        {/* Hero */}
        <section className="relative min-h-[340px] flex items-end overflow-hidden">
          <img
            src="/airo-assets/images/pages/about/hero"
            alt="Off-grid builder working outdoors"
            className="absolute inset-0 w-full h-full object-cover"
            loading="eager"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 via-gray-900/60 to-gray-900/85 pointer-events-none" />
          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 pt-32">
            <motion.div initial="hidden" animate="visible" variants={stagger}>
              <motion.p variants={fadeUp} className="text-sm font-medium text-primary uppercase tracking-wide mb-3">
                {about.hero.eyebrow}
              </motion.p>
              <motion.h1 variants={fadeUp} className="text-4xl md:text-5xl font-bold text-white mb-4">
                {about.hero.title}
              </motion.h1>
              <motion.p variants={fadeUp} className="text-lg text-white/80 max-w-2xl">
                {about.hero.subtitle}
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Mission */}
        <section className="bg-background py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={stagger}
              >
                <motion.h2 variants={fadeUp} className="text-3xl font-bold text-foreground mb-6">
                  {about.mission.heading}
                </motion.h2>
                {about.mission.body.map((p) => (
                  <motion.p key={p.id} variants={fadeUp} className="text-muted-foreground leading-relaxed mb-4">
                    {p.text}
                  </motion.p>
                ))}
              </motion.div>

              {/* Principles */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={stagger}
                className="flex flex-col gap-4"
              >
                {about.principles.map((pr, idx) => {
                  const Icon = PRINCIPLE_ICONS[idx] ?? ShieldCheck;
                  return (
                    <motion.div
                      key={pr.id}
                      variants={fadeUp}
                      className="flex items-start gap-4 bg-card rounded-xl border border-border p-5"
                    >
                      <span className="shrink-0 p-2 rounded-lg bg-primary/10 border border-primary/20">
                        <Icon className="w-5 h-5 text-primary" aria-hidden="true" />
                      </span>
                      <div>
                        <h3 className="text-sm font-semibold text-foreground mb-1">{pr.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{pr.body}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Approach */}
        <section className="bg-card border-t border-b border-border py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="max-w-3xl"
            >
              <motion.h2 variants={fadeUp} className="text-2xl font-bold text-foreground mb-6">
                {about.approach.heading}
              </motion.h2>
              {about.approach.body.map((p) => (
                <motion.p key={p.id} variants={fadeUp} className="text-muted-foreground leading-relaxed mb-4">
                  {p.text}
                </motion.p>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="bg-background py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="bg-muted/50 border border-border rounded-xl p-6 max-w-3xl"
            >
              <h2 className="text-base font-semibold text-foreground mb-2">{about.disclaimer.heading}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{about.disclaimer.body}</p>
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
                {about.cta.heading}
              </motion.h2>
              <motion.p variants={fadeUp} className="text-muted-foreground max-w-xl mx-auto mb-8">
                {about.cta.body}
              </motion.p>
              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/how-it-works"
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                >
                  {about.cta.link1Label}
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
                <Link
                  to="/build-guides"
                  className="inline-flex items-center gap-2 border border-border text-foreground px-6 py-3 rounded-lg font-semibold hover:bg-muted transition-colors"
                >
                  {about.cta.link2Label}
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
