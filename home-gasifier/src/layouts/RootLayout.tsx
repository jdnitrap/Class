import { Helmet } from '@dr.pogodin/react-helmet';
import { type ReactElement } from 'react';
import { ScrollRestoration } from 'react-router';

import Footer from '@/layouts/parts/Footer';
import Header from '@/layouts/parts/Header';
import Website from '@/layouts/Website';
import CookieBanner from '@/components/CookieBanner';

/**
 * Root layout component that wraps all pages with consistent header and footer.
 *
 * To customize the header or footer, directly edit the Header.tsx and Footer.tsx
 * files in the layouts/parts directory.
 *
 * Site-wide <title> and <meta> live in the <Helmet> below. Individual pages can
 * override them by rendering their own <Helmet> — last-mounted wins.
 */
interface RootLayoutProps {
  children: ReactElement;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <Website>
      <Helmet>
        <title>Home Gasifier — Power Your Home with Wood Gas</title>
        <meta
          name="description"
          content="Your friendly guide to wood gas energy — build guides, fuel types, safety, and FAQs for DIY builders and off-grid experimenters."
        />
      </Helmet>
      <ScrollRestoration />
      <Header />
      {children}
      <Footer />
      <CookieBanner />
    </Website>
  );
}
