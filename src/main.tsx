import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initializeSeedData } from "./utils/seedData.ts";
import { AuthProvider } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";

// Initialize seed data system
initializeSeedData();

createRoot(document.getElementById("root")!).render(
  <LanguageProvider>
    <AuthProvider>
      <App />
    </AuthProvider>
  </LanguageProvider>
);
