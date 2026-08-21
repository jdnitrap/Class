import { Helmet } from '@dr.pogodin/react-helmet';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import {
  Flame,
  Wrench,
  Calendar,
  Snowflake,
  Sun,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { maintenance } from 'virtual:content';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
} as const;

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
} as const;

const site = 'https://homegasifier.com';
const url = `${site}/maintenance`;

// Icon map keyed to schedule icon field
const SCHEDULE_ICONS = {
  flame: Flame,
  wrench: Wrench,
  calendar: Calendar,
  snowflake: Snowflake,
  sun: Sun,
} as const;

// Color map for schedule cards
const SCHEDULE_COLORS: Record<string, { border: string; badge: string; icon: string; dot: string }> = {
  primary: {
    border: 'border-primary/40',
    badge: 'bg-primary/15 text-primary border border-primary/30',
    icon: 'text-primary',
    dot: 'bg-primary',
  },
  secondary: {
    border: 'border-secondary/40',
    badge: 'bg-secondary/15 text-secondary border border-secondary/30',
    icon: 'text-secondary',
    dot: 'bg-secondary',
  },
  accent: {
    border: 'border-accent/40',
    badge: 'bg-accent/15 text-accent border border-accent/30',
    icon: 'text-accent',
    dot: 'bg-accent',
  },
  muted: {
    border: 'border-border',
    badge: 'bg-muted text-muted-foreground border border-border',
    icon: 'text-muted-foreground',
    dot: 'bg-muted-foreground',
  },
};

export default function MaintenancePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    '@id': `${url}#webpage`,
    name: 'Home Gasifier Maintenance & Off-Season Guide',
    url,
    isPartOf: { '@id': `${site}/#website` },
    about: { '@id': `${site}/#organization` },
    description:
      'Complete maintenance schedules for home gasifiers — after-run tasks, between-run checks, monthly inspection, seasonal shutdown, and spring startup.',
  };

  return (
    <>
      <Helmet>
        <title>Gasifier Maintenance & Off-Season Guide — Home Gasifier</title>
        <meta
          name="description"
          content="Complete maintenance schedules for home gasifiers — after-run tasks, between-run checks, monthly inspection, seasonal shutdown, and spring startup checklist."
        />
        <link rel="canonical" href={url} />
        <meta property="og:title" content="Gasifier Maintenance & Off-Season Guide — Home Gasifier" />
        <meta
          property="og:description"
          content="Maintenance schedules, consumables guide, and seasonal shutdown procedures for home gasifier builders."
        />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={`${site}/og-image.png`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Gasifier Maintenance & Off-Season Guide — Home Gasifier" />
        <meta name="twitter:description" content="Maintenance schedules and seasonal shutdown procedures for home gasifiers." />
        <meta name="twitter:image" content={`${site}/og-image.png`} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <main>
        {/* ── HERO ── */}
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-background">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background pointer-events-none" />
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial="hidden" animate="visible" variants={stagger}>
              <motion.p
                variants={fadeUp}
                className="text-primary text-sm font-semibold uppercase tracking-widest mb-4"
              >
                {maintenance.hero.eyebrow}
              </motion.p>
              <motion.h1
                variants={fadeUp}
                className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground leading-tight mb-6"
              >
                {maintenance.hero.heading}
              </motion.h1>
              <motion.p
                variants={fadeUp}
                className="text-lg text-muted-foreground max-w-2xl leading-relaxed"
              >
                {maintenance.hero.subheading}
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* ── INTRO ── */}
        <section className="py-16 md:py-20 bg-muted/40 border-y border-border">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={stagger}
            >
              <motion.h2 variants={fadeUp} className="text-2xl md:text-3xl font-bold text-foreground mb-6">
                {maintenance.intro.heading}
              </motion.h2>
              <div className="flex flex-col gap-4">
                {maintenance.intro.body.map((p) => (
                  <motion.p key={p.id} variants={fadeUp} className="text-muted-foreground leading-relaxed">
                    {p.text}
                  </motion.p>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── MAINTENANCE SCHEDULES ── */}
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
                Maintenance schedules
              </motion.p>
              <motion.h2
                variants={fadeUp}
                className="text-3xl md:text-4xl font-bold text-foreground"
              >
                Five checklists, one reliable system
              </motion.h2>
            </motion.div>

            <div className="flex flex-col gap-8">
              {maintenance.schedules.map((sched) => {
                const colors = SCHEDULE_COLORS[sched.color] ?? SCHEDULE_COLORS.muted;
                const IconComp = SCHEDULE_ICONS[sched.icon as keyof typeof SCHEDULE_ICONS] ?? Wrench;
                return (
                  <motion.div
                    key={sched.id}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-60px' }}
                    variants={fadeUp}
                    className={`bg-card border-2 rounded-xl overflow-hidden ${colors.border}`}
                  >
                    {/* Header */}
                    <div className="flex items-start gap-4 px-6 pt-6 pb-4">
                      <div className={`w-10 h-10 rounded-full bg-card border-2 ${colors.border} flex items-center justify-center shrink-0`}>
                        <IconComp className={`w-5 h-5 ${colors.icon}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="text-foreground font-bold text-lg">{sched.title}</h3>
                          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${colors.badge}`}>
                            {sched.timing}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Tasks */}
                    <div className="px-6 pb-6">
                      <ul className="flex flex-col gap-2.5">
                        {sched.tasks.map((task) => (
                          <li key={task.id} className="flex items-start gap-3">
                            {task.critical ? (
                              <AlertTriangle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                            ) : (
                              <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${colors.icon}`} />
                            )}
                            <span className={`text-sm leading-relaxed ${task.critical ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                              {task.task}
                            </span>
                          </li>
                        ))}
                      </ul>
                      {sched.tasks.some((t) => t.critical) && (
                        <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                          <AlertTriangle className="w-3.5 h-3.5 text-destructive shrink-0" />
                          <span>Red items are safety-critical — do not skip</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── CONSUMABLES ── */}
        <section className="py-20 md:py-28 bg-muted/40">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={stagger}
              className="mb-10"
            >
              <motion.p
                variants={fadeUp}
                className="text-primary text-sm font-semibold uppercase tracking-widest mb-3"
              >
                What wears out
              </motion.p>
              <motion.h2
                variants={fadeUp}
                className="text-3xl md:text-4xl font-bold text-foreground mb-4"
              >
                {maintenance.consumables.heading}
              </motion.h2>
              <motion.p variants={fadeUp} className="text-muted-foreground leading-relaxed">
                {maintenance.consumables.intro}
              </motion.p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={stagger}
              className="bg-card border border-border rounded-xl overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="text-left px-5 py-3 font-semibold text-foreground">Item</th>
                      <th className="text-left px-5 py-3 font-semibold text-foreground">Replace when</th>
                      <th className="text-left px-5 py-3 font-semibold text-foreground">Typical cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {maintenance.consumables.items.map((item, i) => (
                      <motion.tr
                        key={item.id}
                        variants={fadeUp}
                        className={`border-b border-border last:border-0 ${i % 2 === 0 ? '' : 'bg-muted/20'}`}
                      >
                        <td className="px-5 py-3.5 text-foreground font-medium">{item.item}</td>
                        <td className="px-5 py-3.5 text-muted-foreground">{item.interval}</td>
                        <td className="px-5 py-3.5 text-muted-foreground">{item.cost}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── MAINTENANCE LOG TIP ── */}
        <section className="py-16 md:py-20 bg-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={fadeUp}
              className="bg-primary/10 border border-primary/30 rounded-xl p-6 md:p-8 flex items-start gap-5"
            >
              <BookOpen className="w-8 h-8 text-primary shrink-0 mt-0.5" />
              <div>
                <h2 className="text-xl font-bold text-foreground mb-3">{maintenance.log_tip.heading}</h2>
                <p className="text-muted-foreground leading-relaxed">{maintenance.log_tip.body}</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-16 md:py-20 bg-muted/40 border-t border-border">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={stagger}
            >
              <motion.p
                variants={fadeUp}
                className="text-primary text-sm font-semibold uppercase tracking-widest mb-2"
              >
                Next steps
              </motion.p>
              <motion.h2
                variants={fadeUp}
                className="text-2xl md:text-3xl font-bold text-foreground mb-3"
              >
                {maintenance.cta.heading}
              </motion.h2>
              <motion.p variants={fadeUp} className="text-muted-foreground mb-8 leading-relaxed">
                {maintenance.cta.body}
              </motion.p>
              <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
                <Link
                  to="/build-guides"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary text-primary-foreground font-semibold rounded-md hover:bg-primary/90 transition-colors"
                >
                  {maintenance.cta.link1Label} <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/troubleshooting"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-card border border-border text-foreground font-semibold rounded-md hover:bg-muted/60 transition-colors"
                >
                  {maintenance.cta.link2Label} <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
}
