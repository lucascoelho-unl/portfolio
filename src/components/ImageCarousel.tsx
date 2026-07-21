"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";

import { CAROUSEL_DATA } from "@/data/carousel";

const variants: Variants = {
  enter: (dir: number) => ({
    opacity: 0,
    y: dir > 0 ? 200 : -200,
    scale: 0.9,
  }),
  center: () => ({
    opacity: 1,
    y: 0,
    scale: 1,
    zIndex: 1,
  }),
  exit: (dir: number) => ({
    opacity: 0,
    y: dir > 0 ? -200 : 200,
    scale: 0.9,
    zIndex: 0,
  }),
};

export default function ImageCarousel() {
  const [[currentIndex, direction], setPage] = useState([0, 0]);

  const paginate = (newDirection: number) => {
    let nextIndex = currentIndex + newDirection;
    if (nextIndex < 0) nextIndex = CAROUSEL_DATA.length - 1;
    if (nextIndex >= CAROUSEL_DATA.length) nextIndex = 0;
    setPage([nextIndex, newDirection]);
  };

  const currentItem = CAROUSEL_DATA[currentIndex];

  if (!currentItem) return null;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "20rem",
        height: "500px",
        margin: "1rem auto",
        borderRadius: "1.5rem",
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.1)",
        background: "rgba(18, 20, 29, 0.95)",
      }}
      className="group"
    >

      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            y: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
            scale: { duration: 0.3 },
          }}
          className="absolute inset-0"
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0.2}
          onDragEnd={(e, { offset }) => {
            if (offset.y < -50) paginate(1);
            else if (offset.y > 50) paginate(-1);
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={currentItem.url}
            alt={currentItem.title}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />

          {/* Gradient overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.2) 40%, transparent)",
              pointerEvents: "none",
            }}
          />

          {/* Caption */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              padding: "1.25rem",
              color: "white",
            }}
          >
            <h3 style={{ fontSize: "1.25rem", fontWeight: 700 }}>{currentItem.title}</h3>
            <p style={{ fontSize: "0.875rem", opacity: 0.8, marginTop: 4 }}>{currentItem.subtitle}</p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation arrows — top and bottom */}
      <button
        onClick={() => paginate(-1)}
        className="absolute z-20 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full backdrop-blur-md bg-black/40 border border-white/20 text-white hover:bg-black/60 hover:scale-105 active:scale-95 transition-all opacity-0 group-hover:opacity-100"
        style={{ top: "1rem", left: "50%", transform: "translateX(-50%)" }}
        aria-label="Previous Slide"
      >
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" /></svg>
      </button>
      <button
        onClick={() => paginate(1)}
        className="absolute z-20 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full backdrop-blur-md bg-black/40 border border-white/20 text-white hover:bg-black/60 hover:scale-105 active:scale-95 transition-all opacity-0 group-hover:opacity-100"
        style={{ bottom: "2.5rem", left: "50%", transform: "translateX(-50%)" }}
        aria-label="Next Slide"
      >
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
      </button>

      {/* Dots Indicator — vertical on the right side */}
      <div
        className="absolute z-20 pointer-events-none"
        style={{ right: "0.75rem", top: "50%", transform: "translateY(-50%)", display: "flex", flexDirection: "column", gap: "0.5rem" }}
      >
        {CAROUSEL_DATA.map((_, idx) => (
          <div
            key={idx}
            className={`w-1.5 rounded-full transition-all duration-300 ${
              idx === currentIndex ? "bg-white h-4 shadow-sm" : "bg-white/50 h-1.5"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
