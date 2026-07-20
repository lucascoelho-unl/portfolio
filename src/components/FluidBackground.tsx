"use client";

import { useEffect, useRef } from "react";


export default function FluidBackground({ isActive = true }: { isActive?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (canvasRef.current && !initialized.current) {
      initialized.current = true;

      import("webgl-fluid").then(({ default: fluid }) => {
        if (!canvasRef.current) return;
        fluid(canvasRef.current, {
          IMMEDIATE: true,
          TRIGGER: "hover",
          SIM_RESOLUTION: 128,
          DYE_RESOLUTION: 1024,
          CAPTURE_RESOLUTION: 512,
          DENSITY_DISSIPATION: 0.5,
          VELOCITY_DISSIPATION: 0.2,
          PRESSURE: 0.6,
          PRESSURE_ITERATIONS: 20,
          CURL: 5,
          SPLAT_RADIUS: 0.16,
          SPLAT_FORCE: 3500,
          SHADING: true,
          COLORFUL: true,
          COLOR_UPDATE_SPEED: 10,
          PAUSED: false,
          BACK_COLOR: { r: 0, g: 0, b: 0 },
          TRANSPARENT: true,
          BLOOM: false,
          BLOOM_ITERATIONS: 8,
          BLOOM_RESOLUTION: 256,
          BLOOM_INTENSITY: 0.3,
          BLOOM_THRESHOLD: 0.6,
          BLOOM_SOFT_KNEE: 0.7,
          SUNRAYS: false,
          SUNRAYS_RESOLUTION: 196,
          SUNRAYS_WEIGHT: 1.0,
        });
      });
    }
  }, []);

  return (
    <div 
      className={`fixed inset-0 z-0 pointer-events-none w-full h-full overflow-hidden transition-opacity duration-1000 ${isActive ? 'opacity-100' : 'opacity-0'}`}
    >
      <canvas
        ref={canvasRef}
        className={`w-full h-full opacity-40 dark:opacity-50 ${isActive ? 'pointer-events-auto' : 'pointer-events-none'}`}
      />
    </div>
  );
}
