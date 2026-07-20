import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface HeroProps {
  isVisible: boolean;
}

const HeroIcon = () => {
  return (
    <div className="relative w-32 h-32 flex items-center justify-center">
      <motion.svg
        viewBox="0 0 100 100"
        className="w-full h-full drop-shadow-xl overflow-visible"
      >
        <defs>
          <linearGradient id="orbit-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
          <linearGradient id="orbit-grad-2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>

          <filter id="core-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Global rotation for the entire system */}
        <motion.g
          style={{ transformOrigin: "50px 50px" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 40, ease: "linear", repeat: Infinity }}
        >
          {/* Orbits */}
          {[0, 1, 2].map((i) => (
            <motion.g
              key={i}
              style={{ transformOrigin: "50px 50px" }}
              initial={{ rotate: i * 60 }}
            >
              {/* The elliptical orbit */}
              <motion.ellipse
                cx="50"
                cy="50"
                rx="40"
                ry="15"
                fill="none"
                stroke={i % 2 === 0 ? "url(#orbit-grad-1)" : "url(#orbit-grad-2)"}
                strokeWidth="1.5"
                className="opacity-70"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, ease: "easeInOut", delay: i * 0.4 }}
              />

              {/* Traveling dot along the orbit */}
              <circle r="2.5" fill="#ffffff" filter="url(#core-glow)">
                <animateMotion
                  dur={`${4 + i}s`}
                  repeatCount="indefinite"
                  path="M 10,50 A 40,15 0 1,0 90,50 A 40,15 0 1,0 10,50"
                />
              </circle>
            </motion.g>
          ))}

          {/* Central pulsating core */}
          <motion.circle
            cx="50"
            cy="50"
            r="8"
            fill="url(#orbit-grad-1)"
            filter="url(#core-glow)"
            animate={{ scale: [0.8, 1.1, 0.8] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.circle
            cx="50"
            cy="50"
            r="3"
            fill="#ffffff"
            animate={{ scale: [1.2, 0.8, 1.2] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Subtle outer geometric ring */}
          <motion.circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke="url(#orbit-grad-2)"
            strokeWidth="0.5"
            strokeDasharray="2 6"
            animate={{ rotate: -360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "50px 50px" }}
            className="opacity-40"
          />
        </motion.g>
      </motion.svg>
    </div>
  );
};

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
          className="flex flex-col items-center justify-center gap-6 w-full overflow-hidden text-center mt-12"
        >
          {/* Custom Animated Hero Icon */}
          <HeroIcon />

          {/* Title Copy */}
          <div className="flex flex-col gap-2 max-w-xl mt-4">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
              Hi, let&apos;s explore Lucas Coelho&apos;s journey!
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
