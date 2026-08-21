export default function AppDebug() {
  return (
    <div style={{
      padding: '40px',
      textAlign: 'center',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: '#333', fontSize: '2.5em', margin: '0 0 20px 0' }}>✅ React is Running</h1>

      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '8px',
        maxWidth: '600px',
        margin: '0 auto',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        textAlign: 'left'
      }}>
        <h2 style={{ color: '#0066cc', marginTop: 0 }}>Home Gasifier App</h2>

        <p style={{ fontSize: '1.1em', lineHeight: 1.6, color: '#666' }}>
          The React application is loading successfully. If you see this page, the issue is in the main App component or its dependencies.
        </p>

        <div style={{
          backgroundColor: '#f0f7ff',
          padding: '15px',
          borderLeft: '4px solid #0066cc',
          marginTop: '20px',
          fontFamily: 'monospace'
        }}>
          <h3 style={{ marginTop: 0, color: '#0066cc' }}>Debug Info:</h3>
          <p><strong>Environment:</strong> {import.meta.env.MODE}</p>
          <p><strong>React Version:</strong> 19.x</p>
          <p><strong>Vite Build:</strong> Running</p>
        </div>

        <div style={{
          backgroundColor: '#fff9e6',
          padding: '15px',
          borderLeft: '4px solid #ff9900',
          marginTop: '20px'
        }}>
          <h3 style={{ marginTop: 0, color: '#ff9900' }}>Next Steps:</h3>
          <ol style={{ lineHeight: 1.8, marginBottom: 0 }}>
            <li>Check browser console (F12) for error messages</li>
            <li>Check terminal for TypeScript/plugin errors</li>
            <li>Verify all dependencies are installed: <code>npm install</code></li>
            <li>Restart dev server: <code>npm run dev</code></li>
          </ol>
        </div>
      </div>
    </div>
  );
}
