import { Helmet } from '@dr.pogodin/react-helmet';
import { Link } from 'react-router';
import { useState } from 'react';
import { motion } from 'motion/react';
import { BookOpen, ArrowRight, Search } from 'lucide-react';
import { glossary } from 'virtual:content';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
} as const;

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
} as const;

const site = 'https://homegasifier.com';
const url = `${site}/glossary`;

// Category color accents by index
const CAT_COLORS = [
  'border-primary/50 bg-primary/5',
  'border-secondary/50 bg-secondary/5',
  'border-accent/50 bg-accent/5',
  'border-yellow-500/50 bg-yellow-500/5',
  'border-destructive/50 bg-destructive/5',
];

export default function GlossaryPage() {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const lowerQuery = query.toLowerCase();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    '@id': `${url}#webpage`,
    name: glossary.meta.title,
    url,
    isPartOf: { '@id': `${site}/#website` },
    about: { '@id': `${site}/#organization` },
    datePublished: '2026-08-19',
    dateModified: '2026-08-19',
  };

  return (
    <>
      <Helmet>
        <title>{glossary.meta.title}</title>
        <meta name="description" content={glossary.meta.description} />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={glossary.meta.title} />
        <meta property="og:description" content={glossary.meta.description} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={`${site}/og-image.png`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={glossary.meta.title} />
        <meta name="twitter:description" content={glossary.meta.description} />
        <meta name="twitter:image" content={`${site}/og-image.png`} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <main>
        {/* Hero */}
        <section className="relative min-h-[320px] flex items-end overflow-hidden">
          <img
            src="/airo-assets/images/pages/glossary/hero"
            alt="Open reference book with warm light"
            className="absolute inset-0 w-full h-full object-cover"
            loading="eager"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 via-gray-900/60 to-gray-900/85 pointer-events-none" />
          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 pt-32">
            <motion.div initial="hidden" animate="visible" variants={stagger}>
              <motion.p variants={fadeUp} className="text-sm font-medium text-primary uppercase tracking-wide mb-3">
                {glossary.hero.eyebrow}
              </motion.p>
              <motion.h1 variants={fadeUp} className="text-4xl md:text-5xl font-bold text-white mb-4">
                {glossary.hero.title}
              </motion.h1>
              <motion.p variants={fadeUp} className="text-lg text-white/80 max-w-2xl">
                {glossary.hero.subtitle}
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Search + filter bar */}
        <section className="bg-card border-b border-border sticky top-16 md:top-20 z-30">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" aria-hidden="true" />
              <input
                type="search"
                placeholder="Search terms…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                aria-label="Search glossary terms"
              />
            </div>

            {/* Category filter */}
            <nav aria-label="Filter by category" className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  activeCategory === 'all'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary'
                }`}
              >
                All
              </button>
              {glossary.categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    activeCategory === cat.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </nav>
          </div>
        </section>

        {/* Intro */}
        <section className="bg-background pt-10 pb-4">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-muted-foreground max-w-2xl">{glossary.intro.body}</p>
          </div>
        </section>

        {/* Terms by category */}
        <section className="bg-background py-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-14">
            {glossary.categories.map((cat, catIdx) => {
              // Filter by active category
              const catVisible = activeCategory === 'all' || activeCategory === cat.id;
              if (!catVisible) return null;

              // Filter terms by search query
              const visibleTerms = cat.terms.filter(
                (t) =>
                  lowerQuery === '' ||
                  t.term.toLowerCase().includes(lowerQuery) ||
                  t.definition.toLowerCase().includes(lowerQuery)
              );

              if (visibleTerms.length === 0) return null;

              const colorClass = CAT_COLORS[catIdx % CAT_COLORS.length];

              return (
                <motion.div
                  key={cat.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={stagger}
                >
                  <motion.div variants={fadeUp} className="flex items-center gap-3 mb-6">
                    <BookOpen className="w-5 h-5 text-primary shrink-0" aria-hidden="true" />
                    <h2 className="text-xl font-bold text-foreground">{cat.name}</h2>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                      {visibleTerms.length} {visibleTerms.length === 1 ? 'term' : 'terms'}
                    </span>
                  </motion.div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {visibleTerms.map((t) => (
                      <motion.div
                        key={t.id}
                        variants={fadeUp}
                        className={`rounded-xl border p-5 ${colorClass}`}
                      >
                        <dt className="text-base font-semibold text-foreground mb-2">{t.term}</dt>
                        <dd className="text-sm text-muted-foreground leading-relaxed">{t.definition}</dd>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              );
            })}

            {/* Empty state */}
            {query !== '' &&
              glossary.categories.every(
                (cat) =>
                  !cat.terms.some(
                    (t) =>
                      t.term.toLowerCase().includes(lowerQuery) ||
                      t.definition.toLowerCase().includes(lowerQuery)
                  )
              ) && (
                <div className="text-center py-16">
                  <p className="text-muted-foreground text-lg mb-2">No terms found for "{query}"</p>
                  <button
                    onClick={() => setQuery('')}
                    className="text-primary text-sm hover:underline"
                  >
                    Clear search
                  </button>
                </div>
              )}
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
                {glossary.cta.heading}
              </motion.h2>
              <motion.p variants={fadeUp} className="text-muted-foreground max-w-xl mx-auto mb-8">
                {glossary.cta.body}
              </motion.p>
              <motion.div variants={fadeUp}>
                <Link
                  to="/resources"
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                >
                  {glossary.cta.linkLabel}
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
