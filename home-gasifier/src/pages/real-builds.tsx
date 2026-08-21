import { Helmet } from '@dr.pogodin/react-helmet';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { useState } from 'react';
import {
  ArrowRight,
  MapPin,
  Clock,
  DollarSign,
  Target,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Mail,
} from 'lucide-react';
import { real_builds } from 'virtual:content';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
} as const;

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
} as const;

const site = 'https://homegasifier.com';
const url = `${site}/real-builds`;

const TAG_COLORS: Record<string, string> = {
  primary: 'bg-primary/15 text-primary border border-primary/30',
  secondary: 'bg-secondary/15 text-secondary border border-secondary/30',
  accent: 'bg-accent/15 text-accent border border-accent/30',
};

export default function RealBuildsPage() {
  const [expandedBuild, setExpandedBuild] = useState<string | null>(null);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${url}#webpage`,
    name: 'Real Home Gasifier Builds — Home Gasifier',
    url,
    isPartOf: { '@id': `${site}/#website` },
    about: { '@id': `${site}/#organization` },
    description:
      'Real home gasifier builds from DIY builders — FEMA, downdraft, updraft, charcoal, and hybrid designs with builder stories and lessons learned.',
  };

  return (
    <>
      <Helmet>
        <title>Real Home Gasifier Builds — Home Gasifier</title>
        <meta
          name="description"
          content="Five real home gasifier builds — FEMA emergency, downdraft Imbert, updraft heat, charcoal, and hybrid designs. Builder stories, costs, lessons learned, and what they'd do differently."
        />
        <link rel="canonical" href={url} />
        <meta property="og:title" content="Real Home Gasifier Builds — Home Gasifier" />
        <meta
          property="og:description"
          content="Real home gasifier builds from DIY builders — builder stories, costs, and lessons learned."
        />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={`${site}/og-image.png`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Real Home Gasifier Builds — Home Gasifier" />
        <meta name="twitter:description" content="Real home gasifier builds — builder stories, costs, and lessons learned." />
        <meta name="twitter:image" content={`${site}/og-image.png`} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <main>
        {/* ── HERO ── */}
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-background">
          <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-background to-background pointer-events-none" />
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial="hidden" animate="visible" variants={stagger}>
              <motion.p
                variants={fadeUp}
                className="text-primary text-sm font-semibold uppercase tracking-widest mb-4"
              >
                {real_builds.hero.eyebrow}
              </motion.p>
              <motion.h1
                variants={fadeUp}
                className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground leading-tight mb-6"
              >
                {real_builds.hero.heading}
              </motion.h1>
              <motion.p
                variants={fadeUp}
                className="text-lg text-muted-foreground max-w-2xl leading-relaxed"
              >
                {real_builds.hero.subheading}
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* ── INTRO ── */}
        <section className="py-14 md:py-16 bg-muted/40 border-y border-border">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={stagger}
            >
              <motion.h2 variants={fadeUp} className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                {real_builds.intro.heading}
              </motion.h2>
              <motion.p variants={fadeUp} className="text-muted-foreground leading-relaxed">
                {real_builds.intro.body}
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* ── BUILDS ── */}
        <section className="py-20 md:py-28 bg-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-8">
              {real_builds.builds.map((build, idx) => {
                const isOpen = expandedBuild === build.id;
                const tagStyle = TAG_COLORS[build.tagColor] ?? TAG_COLORS.primary;
                return (
                  <motion.article
                    key={build.id}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-60px' }}
                    variants={fadeUp}
                    className="bg-card border border-border rounded-xl overflow-hidden"
                  >
                    {/* Card header */}
                    <div className="px-6 pt-6 pb-4">
                      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                        <div>
                          <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${tagStyle}`}>
                            {build.type}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground font-medium">
                          Build #{idx + 1}
                        </span>
                      </div>

                      <h2 className="text-xl md:text-2xl font-bold text-foreground mb-1">
                        {build.builder}
                      </h2>
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        <span>{build.location}</span>
                      </div>

                      {/* Stats row */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                        <div className="flex items-center gap-2 bg-muted/40 rounded-lg px-3 py-2.5">
                          <Clock className="w-4 h-4 text-primary shrink-0" />
                          <div>
                            <div className="text-xs text-muted-foreground">Time to build</div>
                            <div className="text-sm font-semibold text-foreground">{build.timeToComplete}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 bg-muted/40 rounded-lg px-3 py-2.5">
                          <DollarSign className="w-4 h-4 text-secondary shrink-0" />
                          <div>
                            <div className="text-xs text-muted-foreground">Total cost</div>
                            <div className="text-sm font-semibold text-foreground">{build.totalCost}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 bg-muted/40 rounded-lg px-3 py-2.5">
                          <Target className="w-4 h-4 text-accent shrink-0" />
                          <div>
                            <div className="text-xs text-muted-foreground">Purpose</div>
                            <div className="text-sm font-semibold text-foreground">{build.purpose}</div>
                          </div>
                        </div>
                      </div>

                      <p className="text-muted-foreground text-sm leading-relaxed">{build.summary}</p>
                    </div>

                    {/* Expand toggle */}
                    <button
                      onClick={() => setExpandedBuild(isOpen ? null : build.id)}
                      className="w-full flex items-center justify-between gap-3 px-6 py-3.5 border-t border-border bg-muted/20 hover:bg-muted/40 transition-colors text-left group"
                      aria-expanded={isOpen}
                    >
                      <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                        {isOpen ? 'Hide full story' : 'Read full story & lessons learned'}
                      </span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                      )}
                    </button>

                    {/* Expanded content */}
                    {isOpen && (
                      <div className="px-6 py-6 border-t border-border flex flex-col gap-6">
                        {/* Story */}
                        <div>
                          <h3 className="text-base font-bold text-foreground mb-3">In their own words</h3>
                          <div className="flex flex-col gap-3 pl-4 border-l-2 border-primary/30">
                            {build.story.map((p) => (
                              <p key={p.id} className="text-muted-foreground text-sm leading-relaxed italic">
                                "{p.text}"
                              </p>
                            ))}
                          </div>
                        </div>

                        {/* Performance */}
                        <div className="bg-secondary/10 border border-secondary/20 rounded-lg px-4 py-3">
                          <div className="text-xs font-bold text-secondary uppercase tracking-wide mb-1">Performance</div>
                          <p className="text-sm text-foreground">{build.performance}</p>
                        </div>

                        {/* Lessons */}
                        <div>
                          <h3 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
                            <Lightbulb className="w-4 h-4 text-primary" />
                            Lessons learned
                          </h3>
                          <ul className="flex flex-col gap-2.5">
                            {build.lessons.map((lesson) => (
                              <li key={lesson.id} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                                <span className="w-5 h-5 rounded-full bg-primary/15 text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                                  {build.lessons.indexOf(lesson) + 1}
                                </span>
                                <span>{lesson.text}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Would do differently */}
                        <div className="bg-muted/40 rounded-lg px-4 py-3">
                          <div className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-1">What I'd do differently</div>
                          <p className="text-sm text-foreground">{build.would_do_differently}</p>
                        </div>
                      </div>
                    )}
                  </motion.article>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── SUBMIT CTA ── */}
        <section className="py-16 md:py-20 bg-muted/40 border-t border-border">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={stagger}
              className="bg-card border border-border rounded-xl p-6 md:p-10 text-center"
            >
              <motion.div variants={fadeUp} className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center mx-auto mb-5">
                <Mail className="w-6 h-6 text-primary" />
              </motion.div>
              <motion.h2 variants={fadeUp} className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                {real_builds.submit_cta.heading}
              </motion.h2>
              <motion.p variants={fadeUp} className="text-muted-foreground mb-6 max-w-lg mx-auto leading-relaxed">
                {real_builds.submit_cta.body}
              </motion.p>
              <motion.a
                variants={fadeUp}
                href={`mailto:${real_builds.submit_cta.email}`}
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary text-primary-foreground font-semibold rounded-md hover:bg-primary/90 transition-colors"
              >
                <Mail className="w-4 h-4" />
                {real_builds.submit_cta.email}
              </motion.a>
            </motion.div>
          </div>
        </section>

        {/* ── BOTTOM CTA ── */}
        <section className="py-16 md:py-20 bg-background border-t border-border">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-2">
                  Ready to start your build?
                </p>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                  Pick a design and get started.
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
