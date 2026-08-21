import { Helmet } from '@dr.pogodin/react-helmet';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { useState } from 'react';
import { ArrowRight, ChevronRight, Mail, CheckCircle2, XCircle } from 'lucide-react';
import { home } from 'virtual:content';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' as const } },
} as const;

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
} as const;

const site = 'https://homegasifier.com';

export default function HomePage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    // Simulate submission — replace with real endpoint when email skill is connected
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setEmail('');
    }, 800);
  };
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${site}/#website`,
        name: 'Home Gasifier',
        url: `${site}/`,
      },
      {
        '@type': 'Organization',
        '@id': `${site}/#organization`,
        name: 'Home Gasifier',
        url: `${site}/`,
      },
      {
        '@type': 'WebPage',
        '@id': `${site}/#webpage`,
        url: `${site}/`,
        name: 'Home Gasifier — Power Your Home with Wood Gas',
        isPartOf: { '@id': `${site}/#website` },
        about: { '@id': `${site}/#organization` },
        datePublished: '2026-08-19',
        dateModified: '2026-08-19',
      },
    ],
  };

  return (
    <>
      <Helmet>
        <title>Home Gasifier — Power Your Home with Wood Gas</title>
        <meta
          name="description"
          content="Learn how to build and run a home gasifier. Guides on gasification science, DIY build plans, fuel types, safety, and FAQs for off-grid builders and curious experimenters."
        />
        <link rel="canonical" href={`${site}/`} />
        <meta property="og:title" content="Home Gasifier — Power Your Home with Wood Gas" />
        <meta
          property="og:description"
          content="Your friendly guide to wood gas energy — from first spark to full system."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${site}/`} />
        <meta property="og:image" content={`${site}/og-image.png`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Home Gasifier — Power Your Home with Wood Gas" />
        <meta
          name="twitter:description"
          content="Your friendly guide to wood gas energy — from first spark to full system."
        />
        <meta name="twitter:image" content={`${site}/og-image.png`} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <main>
        {/* ── HERO ── */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <img
            src="/airo-assets/images/pages/home/hero"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover"
            loading="eager"
            fetchPriority="high"
            width={1920}
            height={1080}
          />
          {/* Overlay using Tailwind bg-background opacity layers */}
          <div className="absolute inset-0 bg-background/55 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background/90 pointer-events-none" />

          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-32 pt-40">
            <motion.div initial="hidden" animate="visible" variants={stagger}>
              <motion.p
                variants={fadeUp}
                className="text-primary text-sm font-semibold uppercase tracking-widest mb-4"
              >
                Off-grid energy for everyone
              </motion.p>
              <motion.h1
                variants={fadeUp}
                className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground leading-tight mb-6"
              >
                {home.hero.headline}
              </motion.h1>
              <motion.p
                variants={fadeUp}
                className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
              >
                {home.hero.subheadline}
              </motion.p>
              <motion.div
                variants={fadeUp}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Link
                  to="/how-it-works"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-primary text-primary-foreground font-semibold rounded-md hover:bg-primary/90 transition-colors text-base"
                >
                  {home.hero.cta1Label}
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/build-guides"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border border-border text-foreground font-semibold rounded-md hover:bg-muted transition-colors text-base"
                >
                  {home.hero.cta2Label}
                </Link>
              </motion.div>
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' as const }}
              className="w-6 h-10 rounded-full border-2 border-border flex items-start justify-center pt-2"
            >
              <div className="w-1 h-2 bg-muted-foreground rounded-full" />
            </motion.div>
          </div>
        </section>

        {/* ── TRANSPARENCY NOTICE ── */}
        <section className="bg-muted/60 border-b border-border py-4">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-muted-foreground text-sm leading-relaxed">
              <span className="font-semibold text-foreground">A note about this site:</span>{' '}
              I'm one person who hasn't built a gasifier yet — but I'm working toward it. Everything
              here is based on research, not personal hands-on experience. I try to be upfront about
              that throughout.{' '}
              <Link to="/about" className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors">
                Read more about the site
              </Link>
              .
            </p>
          </div>
        </section>

        {/* ── TEXTURE DIVIDER ── */}
        <div
          className="relative h-16 bg-muted overflow-hidden"
          aria-hidden="true"
        >
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                'repeating-linear-gradient(90deg, hsl(var(--primary)) 0px, hsl(var(--primary)) 1px, transparent 1px, transparent 40px)',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background" />
        </div>

        {/* ── INTRO ── */}
        <section className="py-20 md:py-28 bg-background">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
              {/* Text */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-80px' }}
                variants={stagger}
              >
                <motion.p
                  variants={fadeUp}
                  className="text-primary text-sm font-semibold uppercase tracking-widest mb-3"
                >
                  {home.intro.eyebrow}
                </motion.p>
                <motion.h2
                  variants={fadeUp}
                  className="text-3xl md:text-4xl font-bold text-foreground mb-6 leading-snug"
                >
                  {home.intro.heading}
                </motion.h2>
                <div className="flex flex-col gap-4">
                  {home.intro.body.map((p) => (
                    <motion.p
                      key={p.id}
                      variants={fadeUp}
                      className="text-muted-foreground leading-relaxed"
                    >
                      {p.text}
                    </motion.p>
                  ))}
                </div>
                <motion.div variants={fadeUp} className="mt-8">
                  <Link
                    to="/how-it-works"
                    className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
                  >
                    Learn the full process <ChevronRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              </motion.div>

              {/* Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6, ease: 'easeOut' as const }}
                className="relative"
              >
                <div className="rounded-xl overflow-hidden aspect-[4/3] shadow-2xl">
                  <img
                    src="/airo-assets/images/pages/home/intro"
                    alt="Wood logs and biomass fuel ready for gasification"
                    className="w-full h-full object-cover"
                    loading="lazy"
                    width={800}
                    height={600}
                  />
                </div>
                <div className="absolute -bottom-3 -right-3 w-full h-full rounded-xl border-2 border-primary/30 -z-10" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── TOPIC CARDS (Bento) ── */}
        <section className="py-20 md:py-28 bg-muted/40">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={stagger}
              className="text-center mb-14"
            >
              <motion.p
                variants={fadeUp}
                className="text-primary text-sm font-semibold uppercase tracking-widest mb-3"
              >
                Explore the guides
              </motion.p>
              <motion.h2
                variants={fadeUp}
                className="text-3xl md:text-4xl font-bold text-foreground"
              >
                Everything you need to know
              </motion.h2>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={stagger}
              className="grid grid-cols-1 md:grid-cols-2 gap-5"
            >
              {/* Featured cards */}
              {home.topics
                .filter((t) => t.featured)
                .map((topic, i) => (
                  <motion.div key={topic.id} variants={fadeUp}>
                    <Link
                      to={topic.href}
                      className="group relative block rounded-xl overflow-hidden h-64 md:h-72 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <img
                        src={
                          i === 0
                            ? '/airo-assets/images/pages/home/intro'
                            : '/airo-assets/images/pages/home/build-guides'
                        }
                        alt={topic.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                        width={800}
                        height={600}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent pointer-events-none" />
                      <div className="absolute inset-0 p-6 flex flex-col justify-end">
                        <h3 className="text-xl font-bold text-foreground mb-2">{topic.title}</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                          {topic.description}
                        </p>
                        <span className="inline-flex items-center gap-1.5 text-primary text-sm font-semibold group-hover:gap-2.5 transition-all">
                          Explore <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                      <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-primary/50 transition-colors duration-300 pointer-events-none" />
                    </Link>
                  </motion.div>
                ))}

              {/* Smaller cards */}
              <motion.div
                variants={fadeUp}
                className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5"
              >
                {home.topics
                  .filter((t) => !t.featured)
                  .map((topic, i) => (
                    <Link
                      key={topic.id}
                      to={topic.href}
                      className="group relative block rounded-xl overflow-hidden h-48 shadow-md hover:shadow-xl transition-all duration-300"
                    >
                      <img
                        src={
                          i === 0
                            ? '/airo-assets/images/pages/home/fuel-types'
                            : '/airo-assets/images/pages/home/safety'
                        }
                        alt={topic.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                        width={800}
                        height={600}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/35 to-transparent pointer-events-none" />
                      <div className="absolute inset-0 p-5 flex flex-col justify-end">
                        <h3 className="text-lg font-bold text-foreground mb-1.5">{topic.title}</h3>
                        <p className="text-muted-foreground text-sm leading-snug mb-3 line-clamp-2">
                          {topic.description}
                        </p>
                        <span className="inline-flex items-center gap-1.5 text-primary text-sm font-semibold group-hover:gap-2.5 transition-all">
                          Explore <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                      <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-primary/50 transition-colors duration-300 pointer-events-none" />
                    </Link>
                  ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ── BENEFITS ── */}
        <section className="py-20 md:py-28 bg-background">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={stagger}
              className="text-center mb-14"
            >
              <motion.p
                variants={fadeUp}
                className="text-primary text-sm font-semibold uppercase tracking-widest mb-3"
              >
                Why wood gas?
              </motion.p>
              <motion.h2
                variants={fadeUp}
                className="text-3xl md:text-4xl font-bold text-foreground"
              >
                Real reasons to make the switch
              </motion.h2>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={stagger}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {home.benefits.map((benefit) => (
                <motion.div
                  key={benefit.id}
                  variants={fadeUp}
                  className="bg-card border border-border rounded-xl p-8 flex flex-col gap-3"
                >
                  <div className="text-3xl md:text-4xl font-bold text-primary">{benefit.stat}</div>
                  <div className="text-foreground font-semibold text-lg">{benefit.label}</div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {benefit.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── REALISTIC EXPECTATIONS ── */}
        <section className="py-20 md:py-28 bg-muted/40">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={stagger}
              className="text-center mb-14"
            >
              <motion.p
                variants={fadeUp}
                className="text-primary text-sm font-semibold uppercase tracking-widest mb-3"
              >
                {home.expectations.eyebrow}
              </motion.p>
              <motion.h2
                variants={fadeUp}
                className="text-3xl md:text-4xl font-bold text-foreground mb-4"
              >
                {home.expectations.heading}
              </motion.h2>
              <motion.p variants={fadeUp} className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                {home.expectations.intro}
              </motion.p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={stagger}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10"
            >
              {home.expectations.items.map((item) => (
                <motion.div
                  key={item.id}
                  variants={fadeUp}
                  className={`flex items-start gap-4 rounded-xl p-5 border ${
                    item.verdict === 'yes'
                      ? 'bg-secondary/5 border-secondary/25'
                      : 'bg-muted/60 border-border'
                  }`}
                >
                  {item.verdict === 'yes' ? (
                    <CheckCircle2 className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        item.verdict === 'yes'
                          ? 'bg-secondary/15 text-secondary border border-secondary/30'
                          : 'bg-muted text-muted-foreground border border-border'
                      }`}>
                        {item.verdict === 'yes' ? 'Good fit' : 'Not ideal'}
                      </span>
                      <h3 className="text-foreground font-bold text-sm">{item.use_case}</h3>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">{item.detail}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.p
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={fadeUp}
              className="text-center text-muted-foreground max-w-2xl mx-auto leading-relaxed italic"
            >
              {home.expectations.closing}
            </motion.p>
          </div>
        </section>

        {/* ── NEWSLETTER ── */}
        <section className="py-16 md:py-20 bg-muted/40 border-t border-border">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={stagger}
              className="max-w-2xl mx-auto text-center"
            >
              <motion.div variants={fadeUp} className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/15 border border-primary/30 mb-5">
                <Mail className="w-5 h-5 text-primary" aria-hidden="true" />
              </motion.div>
              <motion.p variants={fadeUp} className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">
                {home.newsletter.eyebrow}
              </motion.p>
              <motion.h2 variants={fadeUp} className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                {home.newsletter.heading}
              </motion.h2>
              <motion.p variants={fadeUp} className="text-muted-foreground mb-8">
                {home.newsletter.body}
              </motion.p>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-primary/10 border border-primary/30 rounded-xl px-6 py-4 text-primary font-medium"
                >
                  {home.newsletter.successMessage}
                </motion.div>
              ) : (
                <motion.form
                  variants={fadeUp}
                  onSubmit={handleSubscribe}
                  className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={home.newsletter.placeholder}
                    required
                    className="flex-1 px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm"
                    aria-label="Email address"
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors text-sm disabled:opacity-60"
                  >
                    {submitting ? 'Subscribing…' : home.newsletter.buttonLabel}
                    {!submitting && <ArrowRight className="w-4 h-4" aria-hidden="true" />}
                  </button>
                </motion.form>
              )}
            </motion.div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="relative py-24 md:py-32 overflow-hidden">
          <img
            src="/airo-assets/images/pages/home/cta-bg"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
            width={1200}
            height={600}
          />
          <div className="absolute inset-0 bg-background/80 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-br from-background/10 to-background/60 pointer-events-none" />

          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-xl">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                variants={stagger}
              >
                <motion.p
                  variants={fadeUp}
                  className="text-primary text-sm font-semibold uppercase tracking-widest mb-4"
                >
                  Get building
                </motion.p>
                <motion.h2
                  variants={fadeUp}
                  className="text-3xl md:text-4xl font-bold text-foreground mb-5 leading-snug"
                >
                  {home.cta.heading}
                </motion.h2>
                <motion.p variants={fadeUp} className="text-muted-foreground leading-relaxed mb-8">
                  {home.cta.body}
                </motion.p>
                <motion.div variants={fadeUp}>
                  <Link
                    to="/build-guides"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-md hover:bg-primary/90 transition-colors text-base"
                  >
                    {home.cta.buttonLabel}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
