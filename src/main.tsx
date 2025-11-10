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
