import { Helmet } from '@dr.pogodin/react-helmet';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle2, XCircle } from 'lucide-react';
import { how_it_works } from 'virtual:content';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
} as const;

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
} as const;

const site = 'https://homegasifier.com';
const url = `${site}/how-it-works`;

export default function HowItWorksPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    '@id': `${url}#webpage`,
    name: 'How Gasification Works — Home Gasifier',
    url,
    isPartOf: { '@id': `${site}/#website` },
    about: { '@id': `${site}/#organization` },
    description:
      'A complete guide to how home gasification works — the four reaction zones, syngas composition, system components, and gasifier types.',
  };

  return (
    <>
      <Helmet>
        <title>How Gasification Works — Home Gasifier</title>
        <meta
          name="description"
          content="Learn how a home gasifier converts wood into syngas. Covers the four reaction zones, syngas composition, system components, and gasifier types."
        />
        <link rel="canonical" href={url} />
        <meta property="og:title" content="How Gasification Works — Home Gasifier" />
        <meta
          property="og:description"
          content="A complete guide to the science of wood gasification — zones, syngas, components, and types."
        />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={`${site}/og-image.png`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="How Gasification Works — Home Gasifier" />
        <meta
          name="twitter:description"
          content="A complete guide to the science of wood gasification."
        />
        <meta name="twitter:image" content={`${site}/og-image.png`} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <main>
        {/* ── HERO ── */}
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
          <img
            src="/airo-assets/images/pages/how-it-works/hero"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover"
            loading="eager"
            fetchPriority="high"
            width={1920}
            height={1080}
          />
          <div className="absolute inset-0 bg-background/75 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/30 to-background/90 pointer-events-none" />

          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial="hidden" animate="visible" variants={stagger}>
              <motion.p
                variants={fadeUp}
                className="text-primary text-sm font-semibold uppercase tracking-widest mb-4"
              >
                {how_it_works.hero.eyebrow}
              </motion.p>
              <motion.h1
                variants={fadeUp}
                className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground leading-tight mb-6"
              >
                {how_it_works.hero.heading}
              </motion.h1>
              <motion.p
                variants={fadeUp}
                className="text-lg text-muted-foreground max-w-2xl leading-relaxed"
              >
                {how_it_works.hero.subheading}
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* ── INTRO ── */}
        <section className="py-16 md:py-20 bg-background border-b border-border">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={stagger}
            >
              <motion.h2
                variants={fadeUp}
                className="text-2xl md:text-3xl font-bold text-foreground mb-5"
              >
                {how_it_works.intro.heading}
              </motion.h2>
              <motion.p
                variants={fadeUp}
                className="text-muted-foreground text-lg leading-relaxed"
              >
                {how_it_works.intro.body}
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* ── FOUR ZONES ── */}
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
                Inside the reactor
              </motion.p>
              <motion.h2
                variants={fadeUp}
                className="text-3xl md:text-4xl font-bold text-foreground"
              >
                The four reaction zones
              </motion.h2>
            </motion.div>

            {/* Zone cards — alternating layout */}
            <div className="flex flex-col gap-8">
              {how_it_works.zones.map((zone, i) => (
                <motion.div
                  key={zone.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-60px' }}
                  variants={fadeUp}
                  className={`grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 md:gap-10 items-start bg-card border border-border rounded-xl p-6 md:p-8`}
                >
                  {/* Zone number + temp */}
                  <div className="flex md:flex-col items-center md:items-start gap-4 md:gap-2 md:min-w-[120px]">
                    <div className="text-5xl md:text-6xl font-bold text-primary/20 leading-none font-mono">
                      {zone.number}
                    </div>
                    <div className="bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
                      {zone.temp}
                    </div>
                  </div>

                  {/* Content */}
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-3">{zone.name}</h3>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      {zone.description}
                    </p>
                    <p className="text-muted-foreground/75 text-sm leading-relaxed border-l-2 border-primary/30 pl-4 italic">
                      {zone.detail}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SYNGAS COMPOSITION ── */}
        <section className="py-20 md:py-28 bg-muted/40">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
              {/* Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, ease: 'easeOut' as const }}
                className="relative order-2 md:order-1"
              >
                <div className="rounded-xl overflow-hidden aspect-[4/3] shadow-2xl">
                  <img
                    src="/airo-assets/images/pages/how-it-works/syngas"
                    alt="Clean burning syngas flame"
                    className="w-full h-full object-cover"
                    loading="lazy"
                    width={800}
                    height={600}
                  />
                </div>
                <div className="absolute -bottom-3 -left-3 w-full h-full rounded-xl border-2 border-primary/30 -z-10" />
              </motion.div>

              {/* Text + table */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                variants={stagger}
                className="order-1 md:order-2"
              >
                <motion.p
                  variants={fadeUp}
                  className="text-primary text-sm font-semibold uppercase tracking-widest mb-3"
                >
                  The output
                </motion.p>
                <motion.h2
                  variants={fadeUp}
                  className="text-3xl md:text-4xl font-bold text-foreground mb-5"
                >
                  {how_it_works.syngas.heading}
                </motion.h2>
                <motion.p
                  variants={fadeUp}
                  className="text-muted-foreground leading-relaxed mb-8"
                >
                  {how_it_works.syngas.body}
                </motion.p>

                {/* Composition table */}
                <motion.div variants={fadeUp} className="rounded-xl overflow-hidden border border-border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted/60 border-b border-border">
                        <th className="text-left px-4 py-3 text-muted-foreground font-semibold">
                          Gas
                        </th>
                        <th className="text-right px-4 py-3 text-muted-foreground font-semibold">
                          Typical %
                        </th>
                        <th className="text-right px-4 py-3 text-muted-foreground font-semibold hidden sm:table-cell">
                          Role
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {how_it_works.syngas.composition.map((row, i) => (
                        <tr
                          key={row.id}
                          className={`border-b border-border last:border-0 ${i % 2 === 0 ? '' : 'bg-muted/20'}`}
                        >
                          <td className="px-4 py-3 text-foreground font-medium">{row.gas}</td>
                          <td className="px-4 py-3 text-primary font-bold text-right">
                            {row.percent}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground text-right hidden sm:table-cell">
                            {row.note}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── SYSTEM COMPONENTS ── */}
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
                The full system
              </motion.p>
              <motion.h2
                variants={fadeUp}
                className="text-3xl md:text-4xl font-bold text-foreground mb-4"
              >
                Key components explained
              </motion.h2>
              <motion.p variants={fadeUp} className="text-muted-foreground max-w-2xl">
                A complete gasifier system is more than just the reactor. Here's what each part
                does and why it matters.
              </motion.p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={stagger}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {how_it_works.components.map((comp, i) => (
                <motion.div
                  key={comp.id}
                  variants={fadeUp}
                  className="bg-card border border-border rounded-xl p-6 flex flex-col gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center text-primary text-sm font-bold">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <h3 className="text-foreground font-bold text-lg">{comp.name}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {comp.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── GASIFIER TYPES ── */}
        <section className="py-20 md:py-28 bg-muted/40">
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
                Which design is right for you?
              </motion.p>
              <motion.h2
                variants={fadeUp}
                className="text-3xl md:text-4xl font-bold text-foreground"
              >
                Types of gasifiers
              </motion.h2>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={stagger}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {how_it_works.types.map((type) => (
                <motion.div
                  key={type.id}
                  variants={fadeUp}
                  className={`bg-card rounded-xl border-2 p-7 flex flex-col gap-4 relative ${
                    type.recommended ? 'border-primary' : 'border-border'
                  }`}
                >
                  {type.recommended && (
                    <div className="absolute -top-3 left-6 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                      Recommended for beginners
                    </div>
                  )}
                  <h3 className="text-foreground font-bold text-lg leading-snug pt-1">
                    {type.name}
                  </h3>
                  <div className="text-xs text-primary font-semibold uppercase tracking-wide">
                    Best for: {type.best}
                  </div>
                  <div className="flex flex-col gap-2 mt-1">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{type.pros}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-destructive/70 shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{type.cons}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="py-20 md:py-28 bg-background">
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
                Common questions
              </motion.p>
              <motion.h2
                variants={fadeUp}
                className="text-3xl md:text-4xl font-bold text-foreground"
              >
                Quick answers
              </motion.h2>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={stagger}
              className="flex flex-col gap-6"
            >
              {how_it_works.faq.map((item) => (
                <motion.div
                  key={item.id}
                  variants={fadeUp}
                  className="border-b border-border pb-6 last:border-0"
                >
                  <h3 className="text-foreground font-bold text-lg mb-3">{item.question}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.answer}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── NEXT STEP CTA ── */}
        <section className="py-16 md:py-20 bg-muted/40 border-t border-border">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-2">
                  Ready to build?
                </p>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                  Now that you understand the science, let's build one.
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
