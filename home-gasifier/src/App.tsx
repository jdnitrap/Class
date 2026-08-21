import { lazy, Suspense, Component } from 'react';
import React from 'react';
import { Outlet, createBrowserRouter, type RouteObject } from 'react-router';
import { RouterProvider } from 'react-router/dom';

import AiroErrorBoundary from '../export-plugins/AiroErrorBoundary';
import CookieBannerErrorBoundary from '@/components/CookieBannerErrorBoundary';
import RootLayout from './layouts/RootLayout';
import Spinner from './components/Spinner';
import { routes } from './routes';

console.log('✅ App.tsx loaded successfully');

const CookieBanner = lazy(() =>
  import('@/components/CookieBanner').catch((error) => {
    console.warn('⚠️ Failed to load CookieBanner:', error);
    return { default: (() => null) as unknown as () => React.ReactElement };
  })
);

const SpinnerFallback = () => (
  <div className="flex justify-center py-8 h-screen items-center">
    <Spinner />
  </div>
);

const rootElement = (
  <Suspense fallback={<SpinnerFallback />}>
    <RootLayout>
      <Outlet />
    </RootLayout>
  </Suspense>
);

const routeTree: RouteObject[] = [
  {
    element:
      import.meta.env.MODE === 'development' ? (
        <AiroErrorBoundary captureGlobalErrors={false}>{rootElement}</AiroErrorBoundary>
      ) : (
        rootElement
      ),
    children: routes,
  },
];

let router: any;
try {
  console.log('Creating browser router...');
  router = createBrowserRouter(routeTree);
  console.log('✅ Router created successfully');
} catch (err) {
  console.error('❌ Failed to create router:', err);
  throw err;
}

interface AppProps {}
interface AppState {
  hasError: boolean;
  error: Error | null;
}

class AppErrorBoundary extends Component<{ children: React.ReactNode }, AppState> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: { componentStack: string }) {
    console.error('❌ App error caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '40px',
          fontFamily: 'monospace',
          backgroundColor: '#ffe6e6',
          color: '#cc0000',
          minHeight: '100vh'
        }}>
          <h2>Error Loading Application</h2>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{this.state.error?.message}</pre>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function App() {
  console.log('Rendering App component...');
  return (
    <AppErrorBoundary>
      <RouterProvider router={router} />
      <CookieBannerErrorBoundary>
        <Suspense fallback={null}>
          <CookieBanner />
        </Suspense>
      </CookieBannerErrorBoundary>
    </AppErrorBoundary>
  );
}
