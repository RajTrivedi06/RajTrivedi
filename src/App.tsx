// src/App.tsx

import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { PageTransition } from "./components/PageTransition";
import SingleScrollPage from "./pages/SingleScrollPage";

function AppRoutes() {
  return (
    <Routes>
      {/* Main scroll page - handles all sections */}
      <Route path="/" element={<SingleScrollPage />} />
      <Route path="/Home" element={<SingleScrollPage />} />
      <Route path="/About" element={<SingleScrollPage />} />
      <Route path="/Skills" element={<SingleScrollPage />} />
      <Route path="/Projects" element={<SingleScrollPage />} />
      <Route path="/Connect" element={<SingleScrollPage />} />

      {/* Fallback - redirect to Home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  // Disable browser scroll restoration
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  return (
    <PageTransition>
      <AppRoutes />
    </PageTransition>
  );
}

export default App;
