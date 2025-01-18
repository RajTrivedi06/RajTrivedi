// src/components/ui/SiteLayout.tsx

// import React from "react";
import { Outlet } from "react-router-dom";
import { NavDock } from "./NavDock";

export function SiteLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Fixed NavDock on top */}
      <NavDock />
      {/* Page content below */}
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}
