// src/components/ScrollDebug.tsx

import { useSmoothScroll, useScrollNavigation } from "../providers";

interface ScrollDebugProps {
  enabled?: boolean;
}

export const ScrollDebug = ({ enabled = true }: ScrollDebugProps) => {
  const { scrollProgress, scrollDirection, isScrolling } = useSmoothScroll();
  const { activeSection, sectionProgress, isNavigating } =
    useScrollNavigation();

  // Only show in development
  if (import.meta.env.MODE !== "development" || !enabled) {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        background: "rgba(0, 0, 0, 0.9)",
        color: "#fff",
        padding: "16px 20px",
        borderRadius: 12,
        fontFamily: "ui-monospace, monospace",
        fontSize: 11,
        zIndex: 9999,
        minWidth: 220,
        border: "1px solid rgba(155, 92, 255, 0.3)",
        backdropFilter: "blur(10px)",
      }}
    >
      {/* Header */}
      <div
        style={{
          marginBottom: 12,
          paddingBottom: 8,
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          fontWeight: "bold",
          color: "#9B5CFF",
          fontSize: 12,
        }}
      >
        🔍 Scroll Debug
      </div>

      {/* Global scroll info */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ color: "#888", marginBottom: 4, fontSize: 10 }}>
          GLOBAL
        </div>
        <div>Progress: {(scrollProgress * 100).toFixed(1)}%</div>
        <div>Direction: {scrollDirection ?? "—"}</div>
        <div>Scrolling: {isScrolling ? "✓" : "—"}</div>
      </div>

      {/* Navigation info */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ color: "#888", marginBottom: 4, fontSize: 10 }}>
          NAVIGATION
        </div>
        <div>
          Active:{" "}
          <span style={{ color: "#9B5CFF", fontWeight: "bold" }}>
            {activeSection ?? "none"}
          </span>
        </div>
        <div>Navigating: {isNavigating ? "✓" : "—"}</div>
      </div>

      {/* Section progress */}
      <div>
        <div style={{ color: "#888", marginBottom: 4, fontSize: 10 }}>
          SECTIONS
        </div>
        {Object.entries(sectionProgress).length > 0 ? (
          Object.entries(sectionProgress).map(([id, progress]) => (
            <div
              key={id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 4,
              }}
            >
              <span
                style={{
                  width: 60,
                  color: activeSection === id ? "#9B5CFF" : "#666",
                  fontWeight: activeSection === id ? "bold" : "normal",
                }}
              >
                {id}
              </span>
              <div
                style={{
                  flex: 1,
                  height: 4,
                  background: "#333",
                  borderRadius: 2,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${progress * 100}%`,
                    height: "100%",
                    background:
                      activeSection === id
                        ? "#9B5CFF"
                        : "rgba(155, 92, 255, 0.3)",
                    transition: "width 0.1s",
                  }}
                />
              </div>
              <span style={{ width: 35, textAlign: "right", color: "#666" }}>
                {(progress * 100).toFixed(0)}%
              </span>
            </div>
          ))
        ) : (
          <div style={{ color: "#666", fontStyle: "italic" }}>
            Waiting for sections...
          </div>
        )}
      </div>

      {/* Global progress bar */}
      <div
        style={{
          marginTop: 12,
          paddingTop: 12,
          borderTop: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <div
          style={{
            height: 6,
            background: "#222",
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${scrollProgress * 100}%`,
              height: "100%",
              background: "linear-gradient(90deg, #9B5CFF, #D280FF)",
              transition: "width 0.1s",
            }}
          />
        </div>
      </div>

      {/* Keyboard shortcuts hint */}
      <div
        style={{
          marginTop: 12,
          paddingTop: 8,
          borderTop: "1px solid rgba(255,255,255,0.1)",
          color: "#555",
          fontSize: 9,
        }}
      >
        ↑↓ navigate • 1-5 jump to section
      </div>
    </div>
  );
};

export default ScrollDebug;
