import { Helmet } from '@dr.pogodin/react-helmet';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { ArrowRight, Star, CheckCircle2, XCircle, Droplets, Ruler, Zap, MapPin, AlertTriangle, Package } from 'lucide-react';
import { fuel_types } from 'virtual:content';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
} as const;

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
} as const;

const site = 'https://homegasifier.com';
const url = `${site}/fuel-types`;

const statusStyles: Record<string, string> = {
  ideal: 'bg-secondary/15 text-secondary border border-secondary/30',
  good: 'bg-primary/15 text-primary border border-primary/30',
  marginal: 'bg-yellow-500/15 text-yellow-600 border border-yellow-500/30',
  bad: 'bg-destructive/15 text-destructive border border-destructive/30',
};

function statusLabel(s: string) {
  if (s === 'ideal') return 'Ideal';
  if (s === 'good') return 'Good';
  if (s === 'marginal') return 'Marginal';
  return 'Avoid';
}
export default function FuelTypesPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    '@id': `${url}#webpage`,
    name: 'Gasifier Fuel Types & Efficiency — Home Gasifier',
    url,
    isPartOf: { '@id': `${site}/#website` },
    about: { '@id': `${site}/#organization` },
    description:
      'A complete guide to biomass fuels for home gasifiers — hardwood, softwood, pellets, charcoal, and agricultural residues. Covers moisture content, sizing, and efficiency tips.',
  };

  return (
    <>
      <Helmet>
        <title>Gasifier Fuel Types & Efficiency — Home Gasifier</title>
        <meta
          name="description"
          content="Which biomass fuels work best in a home gasifier? Covers hardwood, softwood, pellets, charcoal, and crop residues — with moisture targets, sizing guides, and efficiency tips."
        />
        <link rel="canonical" href={url} />
        <meta property="og:title" content="Gasifier Fuel Types & Efficiency — Home Gasifier" />
        <meta
          property="og:description"
          content="Pick the right fuel for your gasifier. Moisture targets, sizing guides, and efficiency tips for every biomass type."
        />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={`${site}/og-image.png`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Gasifier Fuel Types & Efficiency — Home Gasifier" />
        <meta
          name="twitter:description"
          content="Pick the right fuel for your gasifier."
        />
        <meta name="twitter:image" content={`${site}/og-image.png`} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <main>
        {/* ── HERO ── */}
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
          <img
            src="/airo-assets/images/pages/fuel-types/hero"
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
                {fuel_types.hero.eyebrow}
              </motion.p>
              <motion.h1
                variants={fadeUp}
                className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground leading-tight mb-6"
              >
                {fuel_types.hero.heading}
              </motion.h1>
              <motion.p
                variants={fadeUp}
                className="text-lg text-muted-foreground max-w-2xl leading-relaxed"
              >
                {fuel_types.hero.subheading}
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
              <motion.h2 variants={fadeUp} className="text-2xl md:text-3xl font-bold text-foreground mb-5">
                {fuel_types.intro.heading}
              </motion.h2>
              <motion.p variants={fadeUp} className="text-muted-foreground text-lg leading-relaxed">
                {fuel_types.intro.body}
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* ── FUEL TYPE CARDS ── */}
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
                Feedstock comparison
              </motion.p>
              <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold text-foreground">
                Five fuel types, ranked
              </motion.h2>
            </motion.div>

            <div className="flex flex-col gap-6">
              {fuel_types.fuels.map((fuel, i) => (
                <motion.div
                  key={fuel.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-60px' }}
                  variants={fadeUp}
                  className="bg-card border border-border rounded-xl overflow-hidden"
                >
                  {/* Card header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 pt-6 pb-4 border-b border-border">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary/15 text-primary flex items-center justify-center text-sm font-bold shrink-0">
                        {i + 1}
                      </div>
                      <div>
                        <h3 className="text-foreground font-bold text-lg leading-tight">{fuel.name}</h3>
                        <p className="text-muted-foreground text-sm">{fuel.bestFor}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 sm:shrink-0">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <Star
                            key={n}
                            className={`w-4 h-4 ${n <= fuel.rating ? 'text-primary fill-primary' : 'text-border'}`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">{fuel.rating}/5</span>
                    </div>
                  </div>

                  {/* Card body */}
                  <div className="p-6 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6">
                    <div>
                      <p className="text-muted-foreground leading-relaxed mb-5">{fuel.description}</p>

                      {/* Pros / Cons */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-semibold text-secondary uppercase tracking-wide mb-2">Advantages</p>
                          <ul className="flex flex-col gap-1.5">
                            {fuel.pros.map((pro, pi) => (
                              <li key={pi} className="flex items-start gap-2 text-sm text-muted-foreground">
                                <CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                                <span>{pro}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-destructive/70 uppercase tracking-wide mb-2">Drawbacks</p>
                          <ul className="flex flex-col gap-1.5">
                            {fuel.cons.map((con, ci) => (
                              <li key={ci} className="flex items-start gap-2 text-sm text-muted-foreground">
                                <XCircle className="w-4 h-4 text-destructive/60 shrink-0 mt-0.5" />
                                <span>{con}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Notes */}
                      <p className="mt-5 text-sm text-muted-foreground/80 border-l-2 border-primary/30 pl-4 italic">
                        {fuel.notes}
                      </p>
                    </div>

                    {/* Specs sidebar */}
                    <div className="flex sm:flex-col gap-3 md:gap-4 md:min-w-[160px]">
                      <div className="bg-muted rounded-lg px-4 py-3 flex-1 md:flex-none">
                        <div className="flex items-center gap-1.5 mb-1">
                          <Droplets className="w-3.5 h-3.5 text-primary" />
                          <span className="text-xs text-muted-foreground font-medium">Moisture target</span>
                        </div>
                        <div className="text-sm font-bold text-foreground">{fuel.moistureTarget}</div>
                      </div>
                      <div className="bg-muted rounded-lg px-4 py-3 flex-1 md:flex-none">
                        <div className="flex items-center gap-1.5 mb-1">
                          <Ruler className="w-3.5 h-3.5 text-primary" />
                          <span className="text-xs text-muted-foreground font-medium">Size target</span>
                        </div>
                        <div className="text-sm font-bold text-foreground">{fuel.sizeTarget}</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── MOISTURE CONTENT ── */}
        <section className="py-20 md:py-28 bg-muted/40">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
              {/* Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, ease: 'easeOut' as const }}
                className="relative"
              >
                <div className="rounded-xl overflow-hidden aspect-[4/3] shadow-2xl">
                  <img
                    src="/airo-assets/images/pages/fuel-types/moisture"
                    alt="Testing wood moisture content with a digital meter"
                    className="w-full h-full object-cover"
                    loading="lazy"
                    width={800}
                    height={600}
                  />
                </div>
                <div className="absolute -bottom-3 -left-3 w-full h-full rounded-xl border-2 border-primary/30 -z-10" />
              </motion.div>

              {/* Text */}
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
                  The single biggest variable
                </motion.p>
                <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold text-foreground mb-5">
                  {fuel_types.moisture.heading}
                </motion.h2>
                <motion.p variants={fadeUp} className="text-muted-foreground leading-relaxed mb-8">
                  {fuel_types.moisture.body}
                </motion.p>

                {/* Moisture targets */}
                <motion.div variants={stagger} className="flex flex-col gap-2 mb-8">
                  {fuel_types.moisture.targets.map((t) => (
                    <motion.div
                      key={t.id}
                      variants={fadeUp}
                      className="flex items-center justify-between gap-3 bg-card border border-border rounded-lg px-4 py-3"
                    >
                      <span className="text-sm text-foreground font-medium">{t.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-foreground">{t.range}</span>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusStyles[t.status]}`}>
                          {statusLabel(t.status)}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Tips */}
                <motion.div variants={stagger} className="flex flex-col gap-3">
                  {fuel_types.moisture.tips.map((t) => (
                    <motion.div key={t.id} variants={fadeUp} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                      <span>{t.tip}</span>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── SIZING TABLE ── */}
        <section className="py-20 md:py-28 bg-background">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={stagger}
              className="mb-12"
            >
              <motion.p
                variants={fadeUp}
                className="text-primary text-sm font-semibold uppercase tracking-widest mb-3"
              >
                Particle size by design
              </motion.p>
              <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                {fuel_types.sizing.heading}
              </motion.h2>
              <motion.p variants={fadeUp} className="text-muted-foreground max-w-2xl leading-relaxed">
                {fuel_types.sizing.body}
              </motion.p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, ease: 'easeOut' as const }}
              className="rounded-xl overflow-hidden border border-border"
            >
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/60 border-b border-border">
                    <th className="text-left px-5 py-4 text-muted-foreground font-semibold">Gasifier type</th>
                    <th className="text-left px-5 py-4 text-muted-foreground font-semibold">Ideal size</th>
                    <th className="text-left px-5 py-4 text-muted-foreground font-semibold hidden sm:table-cell">Avoid</th>
                  </tr>
                </thead>
                <tbody>
                  {fuel_types.sizing.table.map((row, i) => (
                    <tr key={row.id} className={`border-b border-border last:border-0 ${i % 2 === 0 ? '' : 'bg-muted/20'}`}>
                      <td className="px-5 py-4 text-foreground font-medium">{row.gasifier}</td>
                      <td className="px-5 py-4 text-secondary font-semibold">{row.idealSize}</td>
                      <td className="px-5 py-4 text-muted-foreground hidden sm:table-cell">{row.avoid}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          </div>
        </section>

        {/* ── EFFICIENCY TIPS ── */}
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
                Getting the most from your fuel
              </motion.p>
              <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold text-foreground">
                {fuel_types.efficiency.heading}
              </motion.h2>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={stagger}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {fuel_types.efficiency.items.map((item, i) => (
                <motion.div
                  key={item.id}
                  variants={fadeUp}
                  className="bg-card border border-border rounded-xl p-6 flex flex-col gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                      <Zap className="w-4 h-4 text-primary" />
                    </div>
                    <h3 className="text-foreground font-bold text-base leading-snug">{item.title}</h3>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── FUEL SOURCING ── */}
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
                Finding your fuel
              </motion.p>
              <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                {fuel_types.sourcing.heading}
              </motion.h2>
              <motion.p variants={fadeUp} className="text-muted-foreground max-w-2xl leading-relaxed">
                {fuel_types.sourcing.intro}
              </motion.p>
            </motion.div>

            {/* Source cards */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={stagger}
              className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12"
            >
              {fuel_types.sourcing.sources.map((src) => (
                <motion.div
                  key={src.id}
                  variants={fadeUp}
                  className="bg-card border border-border rounded-xl p-6 flex flex-col gap-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary shrink-0" />
                      <h3 className="text-foreground font-bold text-base">{src.title}</h3>
                    </div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ${
                      src.quality === 'Excellent'
                        ? 'bg-secondary/15 text-secondary border border-secondary/30'
                        : src.quality === 'Good'
                        ? 'bg-primary/15 text-primary border border-primary/30'
                        : 'bg-yellow-500/15 text-yellow-600 border border-yellow-500/30'
                    }`}>
                      {src.quality}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">{src.notes}</p>
                  <div className="flex items-start gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-3 py-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-yellow-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-yellow-700 dark:text-yellow-500 leading-relaxed">{src.watch_out}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* What to avoid */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={stagger}
              className="mb-12"
            >
              <motion.h3 variants={fadeUp} className="text-xl font-bold text-foreground mb-5 flex items-center gap-2">
                <XCircle className="w-5 h-5 text-destructive" />
                {fuel_types.sourcing.avoid.heading}
              </motion.h3>
              <motion.div variants={stagger} className="flex flex-col gap-2.5">
                {fuel_types.sourcing.avoid.items.map((item) => (
                  <motion.div
                    key={item.id}
                    variants={fadeUp}
                    className="flex items-start gap-3 bg-destructive/5 border border-destructive/20 rounded-lg px-4 py-3"
                  >
                    <XCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                    <p className="text-sm text-foreground leading-relaxed">{item.text}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Storage tips */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={stagger}
            >
              <motion.h3 variants={fadeUp} className="text-xl font-bold text-foreground mb-5 flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                {fuel_types.sourcing.storage.heading}
              </motion.h3>
              <motion.div
                variants={stagger}
                className="grid grid-cols-1 sm:grid-cols-2 gap-3"
              >
                {fuel_types.sourcing.storage.tips.map((tip) => (
                  <motion.div
                    key={tip.id}
                    variants={fadeUp}
                    className="flex items-start gap-3 bg-card border border-border rounded-lg px-4 py-3"
                  >
                    <CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground leading-relaxed">{tip.tip}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ── NEXT STEP CTA ── */}
        <section className="py-16 md:py-20 bg-background border-t border-border">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-2">
                  One more thing
                </p>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                  Before your first fire — read the safety guide.
                </h2>
              </div>
              <Link
                to="/safety"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary text-primary-foreground font-semibold rounded-md hover:bg-primary/90 transition-colors whitespace-nowrap shrink-0"
              >
                Safety & FAQs <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
