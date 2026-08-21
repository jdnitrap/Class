import { Helmet } from '@dr.pogodin/react-helmet';
import { Link } from 'react-router';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Clock,
  DollarSign,
  Wrench,
  CheckCircle2,
  Lightbulb,
  Package,
} from 'lucide-react';
import { build_guides } from 'virtual:content';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
} as const;

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
} as const;

const site = 'https://homegasifier.com';
const url = `${site}/build-guides`;

const tagStyles: Record<string, string> = {
  green: 'bg-secondary/15 text-secondary border border-secondary/30',
  amber: 'bg-primary/15 text-primary border border-primary/30',
  red: 'bg-destructive/15 text-destructive border border-destructive/30',
};

// Ordered slot URLs matching guide order in content
const guideSlotUrls = [
  '/airo-assets/images/pages/build-guides/fema',
  '/airo-assets/images/pages/build-guides/downdraft',
  '/airo-assets/images/pages/build-guides/updraft',
];

export default function BuildGuidesPage() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({ steps: true });

  const toggleSection = (key: string) =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    '@id': `${url}#webpage`,
    name: 'How to Build a Home Gasifier — DIY Build Guides',
    url,
    isPartOf: { '@id': `${site}/#website` },
    about: { '@id': `${site}/#organization` },
    description:
      'Step-by-step DIY build guides for three gasifier designs: FEMA emergency gasifier, downdraft Imbert gasifier, and updraft gasifier.',
  };

  return (
    <>
      <Helmet>
        <title>DIY Gasifier Build Guides — Home Gasifier</title>
        <meta
          name="description"
          content="Step-by-step build guides for three gasifier designs: FEMA emergency, downdraft Imbert, and updraft. Materials lists, tools, and first-fire tips included."
        />
        <link rel="canonical" href={url} />
        <meta property="og:title" content="DIY Gasifier Build Guides — Home Gasifier" />
        <meta
          property="og:description"
          content="Build your own gasifier with our step-by-step guides. Three designs from beginner to advanced."
        />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={`${site}/og-image.png`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="DIY Gasifier Build Guides — Home Gasifier" />
        <meta
          name="twitter:description"
          content="Step-by-step build guides for three gasifier designs."
        />
        <meta name="twitter:image" content={`${site}/og-image.png`} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <main>
        {/* ── HERO ── */}
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
          <img
            src="/airo-assets/images/pages/build-guides/hero"
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
                {build_guides.hero.eyebrow}
              </motion.p>
              <motion.h1
                variants={fadeUp}
                className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground leading-tight mb-6"
              >
                {build_guides.hero.heading}
              </motion.h1>
              <motion.p
                variants={fadeUp}
                className="text-lg text-muted-foreground max-w-2xl leading-relaxed"
              >
                {build_guides.hero.subheading}
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* ── GUIDE SELECTOR TABS ── */}
        <section className="sticky top-16 md:top-20 z-30 bg-background/95 backdrop-blur-sm border-b border-border">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-1 py-3 overflow-x-auto">
              {build_guides.guides.map((g, i) => (
                <button
                  key={g.id}
                  onClick={() => {
                    setActiveIdx(i);
                    setOpenSections({ steps: true });
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold whitespace-nowrap transition-all ${
                    activeIdx === i
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                      activeIdx === i
                        ? 'bg-primary-foreground/20 text-primary-foreground'
                        : tagStyles[g.tagColor]
                    }`}
                  >
                    {g.tag}
                  </span>
                  {g.title}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ── ALL GUIDES — CSS visibility driven by activeIdx ── */}
        {build_guides.guides.map((guide, gi) => (
          <div key={guide.id} className={activeIdx === gi ? 'block' : 'hidden'}>
            {/* Guide header */}
            <section className="py-14 md:py-20 bg-background">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">
                  {/* Text */}
                  <div>
                    <span
                      className={`inline-block text-xs font-bold px-3 py-1 rounded-full mb-4 ${tagStyles[guide.tagColor]}`}
                    >
                      {guide.difficulty}
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3 leading-snug">
                      {guide.title}
                    </h2>
                    <p className="text-primary font-medium mb-5">{guide.subtitle}</p>
                    <p className="text-muted-foreground leading-relaxed mb-8">{guide.description}</p>

                    {/* Meta chips */}
                    <div className="flex flex-wrap gap-3">
                      <div className="flex items-center gap-2 bg-muted rounded-lg px-4 py-2.5">
                        <Clock className="w-4 h-4 text-primary shrink-0" />
                        <div>
                          <div className="text-xs text-muted-foreground">Build time</div>
                          <div className="text-sm font-semibold text-foreground">
                            {guide.timeEstimate}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 bg-muted rounded-lg px-4 py-2.5">
                        <DollarSign className="w-4 h-4 text-primary shrink-0" />
                        <div>
                          <div className="text-xs text-muted-foreground">Estimated cost</div>
                          <div className="text-sm font-semibold text-foreground">
                            {guide.costEstimate}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 bg-muted rounded-lg px-4 py-2.5">
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                        <div>
                          <div className="text-xs text-muted-foreground">Best for</div>
                          <div className="text-sm font-semibold text-foreground">
                            {guide.bestFor}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Image */}
                  <div className="relative">
                    <div className="rounded-xl overflow-hidden aspect-[4/3] shadow-2xl">
                      <img
                        src={guideSlotUrls[gi]}
                        alt={guide.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        width={800}
                        height={600}
                      />
                    </div>
                    <div className="absolute -bottom-3 -right-3 w-full h-full rounded-xl border-2 border-primary/30 -z-10" />
                  </div>
                </div>
              </div>
            </section>

            {/* ── MATERIALS ── */}
            <section className="border-t border-border">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <button
                  onClick={() => toggleSection('materials')}
                  className="w-full flex items-center justify-between py-5 text-left group"
                  aria-expanded={!!openSections['materials']}
                >
                  <div className="flex items-center gap-3">
                    <Package className="w-5 h-5 text-primary" />
                    <span className="text-lg font-bold text-foreground">Materials list</span>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                      {guide.materials.length} items
                    </span>
                  </div>
                  {openSections['materials'] ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  )}
                </button>

                <AnimatePresence initial={false}>
                  {openSections['materials'] && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' as const }}
                      className="overflow-hidden"
                    >
                      <div className="pb-8">
                        <div className="rounded-xl overflow-hidden border border-border">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="bg-muted/60 border-b border-border">
                                <th className="text-left px-4 py-3 text-muted-foreground font-semibold">
                                  Item
                                </th>
                                <th className="text-right px-4 py-3 text-muted-foreground font-semibold">
                                  Qty
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {guide.materials.map((mat, i) => (
                                <tr
                                  key={mat.id}
                                  className={`border-b border-border last:border-0 ${i % 2 === 0 ? '' : 'bg-muted/20'}`}
                                >
                                  <td className="px-4 py-3 text-foreground">{mat.item}</td>
                                  <td className="px-4 py-3 text-muted-foreground text-right font-medium">
                                    {mat.qty}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </section>

            {/* ── TOOLS ── */}
            <section className="border-t border-border bg-muted/20">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <button
                  onClick={() => toggleSection('tools')}
                  className="w-full flex items-center justify-between py-5 text-left group"
                  aria-expanded={!!openSections['tools']}
                >
                  <div className="flex items-center gap-3">
                    <Wrench className="w-5 h-5 text-primary" />
                    <span className="text-lg font-bold text-foreground">Tools required</span>
                  </div>
                  {openSections['tools'] ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  )}
                </button>

                <AnimatePresence initial={false}>
                  {openSections['tools'] && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' as const }}
                      className="overflow-hidden"
                    >
                      <div className="pb-8">
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {guide.tools.map((tool, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                              {tool}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </section>

            {/* ── STEPS ── */}
            <section className="border-t border-border">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <button
                  onClick={() => toggleSection('steps')}
                  className="w-full flex items-center justify-between py-5 text-left group"
                  aria-expanded={!!openSections['steps']}
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <span className="text-lg font-bold text-foreground">
                      Step-by-step instructions
                    </span>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                      {guide.steps.length} steps
                    </span>
                  </div>
                  {openSections['steps'] ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  )}
                </button>

                <AnimatePresence initial={false}>
                  {openSections['steps'] && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' as const }}
                      className="overflow-hidden"
                    >
                      <div className="pb-10">
                        <div className="flex flex-col gap-0">
                          {guide.steps.map((step, si) => (
                            <div key={step.id} className="flex gap-5 md:gap-8">
                              {/* Step number + connector */}
                              <div className="flex flex-col items-center shrink-0">
                                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0">
                                  {step.step}
                                </div>
                                {si < guide.steps.length - 1 && (
                                  <div className="w-0.5 flex-1 bg-border my-1" />
                                )}
                              </div>
                              {/* Content */}
                              <div className="pb-8">
                                <h3 className="text-foreground font-bold text-base mb-2 pt-2">
                                  {step.title}
                                </h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                  {step.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </section>

            {/* ── TIPS ── */}
            <section className="border-t border-border bg-primary/5">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center gap-3 mb-5">
                  <Lightbulb className="w-5 h-5 text-primary" />
                  <span className="text-lg font-bold text-foreground">Builder tips</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {guide.tips.map((t) => (
                    <div key={t.id} className="bg-card border border-border rounded-xl p-5">
                      <p className="text-sm text-muted-foreground leading-relaxed">{t.tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        ))}

        {/* ── TOOLS OVERVIEW ── */}
        <section className="py-16 md:py-20 bg-muted/40 border-t border-border">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={stagger}
            >
              <motion.h2 variants={fadeUp} className="text-2xl font-bold text-foreground mb-8">
                {build_guides.tools_overview.heading}
              </motion.h2>
              <motion.div
                variants={stagger}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {build_guides.tools_overview.items.map((item) => (
                  <motion.div
                    key={item.id}
                    variants={fadeUp}
                    className="flex items-start gap-3 bg-card border border-border rounded-xl p-4"
                  >
                    <Wrench className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <div className="text-sm font-semibold text-foreground">{item.name}</div>
                      <div className="text-xs text-muted-foreground">{item.note}</div>
                    </div>
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
                  Before you build
                </p>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                  Know your fuel — it makes or breaks the build.
                </h2>
              </div>
              <Link
                to="/fuel-types"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary text-primary-foreground font-semibold rounded-md hover:bg-primary/90 transition-colors whitespace-nowrap shrink-0"
              >
                Fuel Types & Efficiency <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
