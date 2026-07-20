import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface HeroProps {
  isVisible: boolean;
}

export default function Hero({ isVisible }: HeroProps) {
  return (
    <AnimatePresence mode="popLayout">
      {isVisible && (
        <motion.div
          key="hero-header"
          layout
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0, 
            transition: { duration: 0.1, ease: "easeOut" } 
          }}
          className="flex flex-col items-center justify-center gap-6 w-full overflow-hidden text-center"
        >
          {/* Animated Radiant Flower Logo Icon */}
          <div className="relative flex items-center justify-center">
            <div className="absolute w-28 h-28 bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-2xl animate-breathe" />
            
            <div className="w-16 h-16 relative flex items-center justify-center animate-spin-slow">
              <div className="absolute w-3.5 h-7 rounded-full bg-indigo-500 transform rotate-0 -translate-y-4 shadow-sm" />
              <div className="absolute w-3.5 h-7 rounded-full bg-indigo-600 transform rotate-45 -translate-y-3 translate-x-3 shadow-sm" />
              <div className="absolute w-3.5 h-7 rounded-full bg-purple-500 transform rotate-90 translate-x-4 shadow-sm" />
              <div className="absolute w-3.5 h-7 rounded-full bg-purple-600 transform rotate-135 translate-y-3 translate-x-3 shadow-sm" />
              <div className="absolute w-3.5 h-7 rounded-full bg-pink-500 transform rotate-180 translate-y-4 shadow-sm" />
              <div className="absolute w-3.5 h-7 rounded-full bg-pink-600 transform rotate-225 translate-y-3 -translate-x-3 shadow-sm" />
              <div className="absolute w-3.5 h-7 rounded-full bg-indigo-400 transform rotate-270 -translate-x-4 shadow-sm" />
              <div className="absolute w-3.5 h-7 rounded-full bg-indigo-500 transform rotate-315 -translate-y-3 -translate-x-3 shadow-sm" />
            </div>
          </div>

          {/* Title Copy */}
          <div className="flex flex-col gap-2 max-w-xl">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
              Hi, let&apos;s explore Lucas Coelho&apos;s journey & work
            </h1>
            <p className="text-xs sm:text-sm" style={{ color: "var(--text-muted)" }}>
              Ask anything to get started.
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
