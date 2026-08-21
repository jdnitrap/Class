import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { HelmetProvider } from '@dr.pogodin/react-helmet';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AiroErrorBoundary from '../export-plugins/AiroErrorBoundary';
import App from './App';
import './styles/globals.css';

// Global error handler for debugging
if (import.meta.env.MODE === 'development') {
  const meta = document.createElement('meta');
  meta.name = 'robots';
  meta.content = 'noindex, nofollow';
  document.head.appendChild(meta);

  window.addEventListener('error', (event) => {
    console.error('❌ Global error:', event.error);
  });

  window.addEventListener('unhandledrejection', (event) => {
    console.error('❌ Unhandled promise rejection:', event.reason);
  });
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: { retry: 0 },
  },
});

const rootElement = document.getElementById('app');
if (!rootElement) {
  document.body.innerHTML = '<div style="color:red;padding:20px;font-family:monospace">ERROR: Root element #app not found</div>';
  throw new Error('Root element not found');
}

try {
  const providers = (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </HelmetProvider>
  );

  const tree = (
    <StrictMode>
      {import.meta.env.MODE === 'development' ? (
        <AiroErrorBoundary>{providers}</AiroErrorBoundary>
      ) : (
        providers
      )}
    </StrictMode>
  );

  if (rootElement.firstElementChild) {
    hydrateRoot(rootElement, tree);
  } else {
    createRoot(rootElement).render(tree);
  }
} catch (err) {
  console.error('❌ Failed to mount React:', err);
  rootElement.innerHTML = `<div style="color:red;padding:20px;font-family:monospace;white-space:pre-wrap">ERROR mounting app:<br/>${err instanceof Error ? err.message : String(err)}</div>`;
}
