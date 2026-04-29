// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ScrollProvider } from "./providers";
import { initBrowserFixes } from "./utils/safari-fixes";
import "./index.css";

// Apply browser-specific fixes
initBrowserFixes();

// Disable browser scroll restoration
if ("scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ScrollProvider>
      <App />
    </ScrollProvider>
  </React.StrictMode>
);
