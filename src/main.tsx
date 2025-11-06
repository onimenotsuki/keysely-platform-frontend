import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import './index.css';
import { initializeSeedData } from './utils/seedData.ts';

// Import Algolia sync tools for console access
import './utils/runSync.ts';

// Import seed utilities for console access
import './utils/runSeed.ts';

// Import debug and fix tools
import './utils/checkAlgolia.ts';
import './utils/debugSpaces.ts';
import './utils/fixSpaces.ts';
import './utils/fullDiagnostic.ts';

// Suppress Google Maps Marker deprecation warning
// The @react-google-maps/api library still uses the old Marker internally
// This is a temporary measure until the library is updated
// See: https://github.com/visgl/react-google-maps/issues/614
const originalWarn = console.warn;
console.warn = (...args: unknown[]) => {
  const message = args[0];
  if (typeof message === 'string' && message.includes('google.maps.Marker is deprecated')) {
    return; // Suppress this specific warning
  }
  originalWarn.apply(console, args);
};

// Initialize seed data system
initializeSeedData();

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

createRoot(rootElement).render(
  <LanguageProvider>
    <AuthProvider>
      <App />
    </AuthProvider>
  </LanguageProvider>
);
