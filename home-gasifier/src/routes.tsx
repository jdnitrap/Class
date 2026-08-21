import { lazy } from 'react';
import { Navigate, RouteObject } from 'react-router';
import { Helmet } from '@dr.pogodin/react-helmet';
import HomePage from './pages/index';
import HowItWorksPage from './pages/how-it-works';
import BuildGuidesPage from './pages/build-guides';
import FuelTypesPage from './pages/fuel-types';
import SafetyPage from './pages/safety';
import ResourcesPage from './pages/resources';
import TroubleshootingPage from './pages/troubleshooting';
import GlossaryPage from './pages/glossary';
import AboutPage from './pages/about';
import LegalPage from './pages/legal';
import MaintenancePage from './pages/maintenance';
import RealBuildsPage from './pages/real-builds';
import SimulatorPage from './pages/simulator';
// Eager import so renderToString doesn't hit a Suspense boundary on 404 routes
// and abort to client rendering. The prod 404 page is tiny; the dev-tools
// variant stays lazy because it pulls in dev-only code we don't want in
// production bundles.
import ProdNotFoundPage from './pages/_404';

const NotFoundPage = ProdNotFoundPage;

/** Thin redirect wrapper — emits noindex + canonical so SEO scanners don't flag missing head tags */
function RedirectPage({ to }: { to: string }) {
  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href={`https://homegasifier.com${to}`} />
      </Helmet>
      <Navigate to={to} replace />
    </>
  );
}

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/how-it-works',
    element: <HowItWorksPage />,
  },
  {
    path: '/build-guides',
    element: <BuildGuidesPage />,
  },
  {
    path: '/fuel-types',
    element: <FuelTypesPage />,
  },
  {
    path: '/safety',
    element: <SafetyPage />,
  },
  {
    path: '/resources',
    element: <ResourcesPage />,
  },
  {
    path: '/troubleshooting',
    element: <TroubleshootingPage />,
  },
  {
    path: '/glossary',
    element: <GlossaryPage />,
  },
  {
    path: '/about',
    element: <AboutPage />,
  },
  {
    path: '/legal-regulatory',
    element: <LegalPage />,
  },
  {
    path: '/maintenance',
    element: <MaintenancePage />,
  },
  {
    path: '/real-builds',
    element: <RealBuildsPage />,
  },
  {
    path: '/simulator',
    element: <SimulatorPage />,
  },
  // Legacy URL redirects — wrapped to satisfy SEO scanners
  { path: '/safety-faqs', element: <RedirectPage to="/safety" /> },
  { path: '/faqs', element: <RedirectPage to="/safety" /> },
  { path: '/legal', element: <RedirectPage to="/legal-regulatory" /> },
  {
    path: '*',
    element: <NotFoundPage />,
  },
];

// Types for type-safe navigation
export type Path = '/' | '/how-it-works' | '/build-guides' | '/fuel-types' | '/safety' | '/resources' | '/troubleshooting' | '/glossary' | '/about' | '/legal-regulatory' | '/maintenance' | '/real-builds';

export type Params = Record<string, string | undefined>;
