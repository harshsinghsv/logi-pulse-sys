import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { AuthProvider } from './contexts/AuthContext';

// Debug boot logs
console.log("Bootstrapping app...");

const rootEl = document.getElementById("root");
if (!rootEl) {
  console.error("Root element #root not found");
}

window.addEventListener('error', (e) => {
  console.error('Global error:', e.message, e.error);
});
window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled promise rejection:', e.reason);
});

try {
  createRoot(rootEl!).render(
    <AuthProvider>
      <App />
    </AuthProvider>
  );
  console.log("App rendered successfully");
} catch (err) {
  console.error("React render failed:", err);
}
