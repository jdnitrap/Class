import { Helmet } from '@dr.pogodin/react-helmet';
import { motion } from 'motion/react';
import {
  BookOpen,
  Users,
  PlayCircle,
  Wrench,
  Library,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { resources } from 'virtual:content';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
} as const;

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
} as const;

const site = 'https://homegasifier.com';
const url = `${site}/resources`;

// Ordered icon components matching category order in content
const CATEGORY_ICONS = [BookOpen, Users, PlayCircle, Wrench, Library];

// Tag style variants — UI chrome only
const tagStyle = (tag: string) => {
  if (tag === 'Free PDF' || tag === 'Free Online')
    return 'bg-secondary/15 text-secondary border border-secondary/30';
  if (tag === 'Forum') return 'bg-primary/15 text-primary border border-primary/30';
  if (tag === 'YouTube') return 'bg-destructive/15 text-destructive border border-destructive/30';
  if (tag === 'Wiki' || tag === 'Calculator')
    return 'bg-accent/15 text-accent border border-accent/30';
  return 'bg-muted text-muted-foreground border border-border';
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': `${url}#webpage`,
  name: 'Gasification Resources & References — Home Gasifier',
  url,
  isPartOf: { '@id': `${site}/#website` },
  about: { '@id': `${site}/#organization` },
  description:
    'Curated books, manuals, forums, video channels, and design tools for home gasifier builders.',
};

export default function ResourcesPage() {
  return (
    <>
      <Helmet>
        <title>Gasification Resources & References — Home Gasifier</title>
        <meta
          name="description"
          content="Curated books, free manuals, active forums, YouTube channels, and design tools for home gasifier builders — everything the community has produced in one place."
        />
        <link rel="canonical" href={url} />
        <meta property="og:title" content="Gasification Resources & References — Home Gasifier" />
        <meta
          property="og:description"
          content="The best books, manuals, forums, and tools for home gasifier builders."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={`${site}/og-image.png`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Gasification Resources & References — Home Gasifier" />
        <meta
          name="twitter:description"
          content="The best books, manuals, forums, and tools for home gasifier builders."
        />
        <meta name="twitter:image" content={`${site}/og-image.png`} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <main>
        {/* ── HERO ── */}
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
          <img
            src="/airo-assets/images/pages/resources/hero"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover"
            loading="eager"
            fetchPriority="high"
            width={1920}
            height={1080}
          />
          <div className="absolute inset-0 bg-background/78 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/30 to-background/90 pointer-events-none" />

          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial="hidden" animate="visible" variants={stagger}>
              <motion.p
                variants={fadeUp}
                className="text-primary text-sm font-semibold uppercase tracking-widest mb-4"
              >
                {resources.hero.eyebrow}
              </motion.p>
              <motion.h1
                variants={fadeUp}
                className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground leading-tight mb-6"
              >
                {resources.hero.heading}
              </motion.h1>
              <motion.p
                variants={fadeUp}
                className="text-lg text-muted-foreground max-w-2xl leading-relaxed"
              >
                {resources.hero.subheading}
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* ── QUICK NAV ── */}
        <section className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-16 md:top-20 z-30">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav aria-label="Resource categories" className="flex gap-1 py-3 overflow-x-auto">
              {resources.categories.map((cat, ci) => {
                const Icon = CATEGORY_ICONS[ci] ?? BookOpen;
                return (
                  <a
                    key={cat.id}
                    href={`#${cat.id}`}
                    className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all whitespace-nowrap"
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    {cat.title}
                  </a>
                );
              })}
              <a
                href="#glossary"
                className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all whitespace-nowrap"
              >
                <BookOpen className="w-4 h-4 shrink-0" />
                Glossary
              </a>
            </nav>
          </div>
        </section>

        {/* ── RESOURCE CATEGORIES ── */}
        <section className="py-20 md:py-28 bg-background">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-20">
              {resources.categories.map((cat, ci) => {
                const Icon = CATEGORY_ICONS[ci] ?? BookOpen;
                return (
                  <motion.div
                    key={cat.id}
                    id={cat.id}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-60px' }}
                    variants={stagger}
                  >
                    {/* Category header */}
                    <motion.div variants={fadeUp} className="flex items-start gap-4 mb-8">
                      <div className="w-11 h-11 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-foreground leading-snug">
                          {cat.title}
                        </h2>
                        <p className="text-muted-foreground mt-1">{cat.description}</p>
                      </div>
                    </motion.div>

                    {/* Link cards */}
                    <motion.div
                      variants={stagger}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                      {cat.links.map((link) => (
                        <motion.a
                          key={link.id}
                          variants={fadeUp}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group bg-card border border-border rounded-xl p-5 flex flex-col gap-3 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <h3 className="text-foreground font-bold text-base leading-snug group-hover:text-primary transition-colors">
                              {link.title}
                            </h3>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${tagStyle(link.tag)}`}>
                                {link.tag}
                              </span>
                              <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                            </div>
                          </div>
                          <p className="text-muted-foreground text-sm leading-relaxed">
                            {link.description}
                          </p>
                          <div className="flex items-center gap-1 text-xs text-primary font-medium mt-auto pt-1">
                            <span>Visit resource</span>
                            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                          </div>
                        </motion.a>
                      ))}
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── GLOSSARY ── */}
        <section id="glossary" className="py-20 md:py-28 bg-muted/40 border-t border-border">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
                Terminology
              </motion.p>
              <motion.h2
                variants={fadeUp}
                className="text-3xl md:text-4xl font-bold text-foreground mb-3"
              >
                {resources.glossary.heading}
              </motion.h2>
              <motion.p
                variants={fadeUp}
                className="text-muted-foreground max-w-2xl leading-relaxed mb-12"
              >
                {resources.glossary.intro}
              </motion.p>

              <motion.div
                variants={stagger}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {resources.glossary.terms.map((entry) => (
                  <motion.div
                    key={entry.id}
                    variants={fadeUp}
                    className="bg-card border border-border rounded-xl p-5"
                  >
                    <div className="text-primary font-bold text-sm mb-1.5">{entry.term}</div>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {entry.definition}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
}
