// import React from "react";
import { Routes, Route } from "react-router-dom";

// Landing page on root
import LandingPage from "./pages/LandingPage";

// SingleScrollPage that stacks Home, About, Skills, Projects, Connect
import SingleScrollPage from "./pages/SingleScrollPage";

export default function App() {
  return (
    <Routes>
      {/* Landing page on root */}
      <Route path="/" element={<LandingPage />} />

      {/* All other paths show the single-scroll container,
          each route scrolls to a different section */}
      <Route path="/Home" element={<SingleScrollPage section="Home" />} />
      <Route path="/About" element={<SingleScrollPage section="About" />} />
      <Route path="/Skills" element={<SingleScrollPage section="Skills" />} />
      <Route
        path="/Projects"
        element={<SingleScrollPage section="Projects" />}
      />
      <Route path="/Connect" element={<SingleScrollPage section="Connect" />} />

      {/*
        Comment out the Experience route for now:
        <Route path="/Experience" element={<SingleScrollPage section="Experience" />} />
      */}

      {/* Optionally, a fallback 404 route */}
      {/* <Route path="*" element={<NotFoundPage />} /> */}
    </Routes>
  );
}
