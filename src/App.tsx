// src/App.tsx

import { useEffect } from "react";
import { PageTransition } from "./components/PageTransition";
import SingleScrollPage from "./pages/SingleScrollPage";

function App() {
  // Disable browser scroll restoration
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  return (
    <PageTransition>
      <SingleScrollPage />
    </PageTransition>
  );
}

export default App;
