// src/components/ui/dotted-surface.tsx
//
// Three.js point grid that undulates on two interfering sine waves. Used as
// an ambient backdrop behind the Connect / Dispatch card so the section reads
// as an "open channel" — quiet signal noise rather than a static frame.
//
// Adapted from the upstream "Dotted Surface" component:
//   • Removed `next-themes`. The site is dark-only — dot color is a fixed
//     soft purple matched to the existing palette.
//   • Removed `'use client'`. Vite doesn't use the directive.
//   • Container-scoped instead of viewport-scoped. The original sized the
//     renderer to `window.innerWidth/Height` and positioned itself `fixed
//     inset-0`, which would have overlaid the global gradient background.
//     This version sizes to its parent via ResizeObserver and defaults to
//     `absolute inset-0`, so it can sit inside any relative container.
//   • Honors `prefers-reduced-motion` by rendering one frame and skipping
//     the rAF loop.

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type DottedSurfaceProps = Omit<React.ComponentProps<"div">, "ref">;

export function DottedSurface({ className, ...props }: DottedSurfaceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const SEPARATION = 150;
    const AMOUNTX = 40;
    const AMOUNTY = 60;

    // Dot color, matched to the site's purple-500 (#9b5cff). Three.js
    // PointsMaterial vertex colors expect 0..1 floats, not 0..255.
    const DOT_R = 0.61;
    const DOT_G = 0.36;
    const DOT_B = 1.0;

    const initialWidth = container.clientWidth || 1;
    const initialHeight = container.clientHeight || 1;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      60,
      initialWidth / initialHeight,
      1,
      10000,
    );
    camera.position.set(0, 355, 1220);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(initialWidth, initialHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const positions: number[] = [];
    const colors: number[] = [];
    const geometry = new THREE.BufferGeometry();

    for (let ix = 0; ix < AMOUNTX; ix++) {
      for (let iy = 0; iy < AMOUNTY; iy++) {
        const x = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2;
        const z = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2;
        positions.push(x, 0, z);
        colors.push(DOT_R, DOT_G, DOT_B);
      }
    }

    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3),
    );
    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 8,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
      sizeAttenuation: true,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    let animationId = 0;
    let count = 0;

    const renderFrame = () => {
      const positionAttribute = geometry.attributes.position;
      const arr = positionAttribute.array as Float32Array;

      let i = 0;
      for (let ix = 0; ix < AMOUNTX; ix++) {
        for (let iy = 0; iy < AMOUNTY; iy++) {
          const index = i * 3;
          arr[index + 1] =
            Math.sin((ix + count) * 0.3) * 50 +
            Math.sin((iy + count) * 0.5) * 50;
          i++;
        }
      }
      positionAttribute.needsUpdate = true;
      renderer.render(scene, camera);
    };

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      renderFrame();
      count += 0.1;
    };

    if (reduced) {
      // Render a single static frame so the field has shape but doesn't move.
      renderFrame();
    } else {
      animate();
    }

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;
      if (width === 0 || height === 0) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    });
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      if (animationId) cancelAnimationFrame(animationId);

      scene.traverse((object) => {
        if (object instanceof THREE.Points) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach((m) => m.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [reduced]);

  return (
    <div
      ref={containerRef}
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 -z-10", className)}
      {...props}
    />
  );
}

export default DottedSurface;
