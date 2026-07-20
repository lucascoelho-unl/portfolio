import React from "react";

export default function BackgroundGlow() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10 select-none">
      {/* Top Center Radiant Glow */}
      <div 
        className="absolute top-[-15%] left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-b from-indigo-500/20 via-purple-500/10 to-transparent rounded-full blur-[140px] transition-opacity duration-500"
        style={{ opacity: "var(--glow-opacity)" }} 
      />

      {/* Top Left Subtle Accent Glow */}
      <div 
        className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] bg-purple-500/15 rounded-full blur-[130px] transition-opacity duration-500"
        style={{ opacity: "var(--glow-opacity)" }} 
      />

    </div>
  );
}
