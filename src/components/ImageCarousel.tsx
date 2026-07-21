"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";

import { CAROUSEL_DATA } from "@/data/carousel";

const variants: Variants = {
  enter: (dir: number) => ({
    opacity: 0,
    x: dir > 0 ? 200 : -200,
    scale: 0.9,
  }),
  center: (dir: number) => ({
    opacity: 1,
    x: 0,
    scale: 1,
    zIndex: 1,
  }),
  exit: (dir: number) => ({
    opacity: 0,
    x: dir > 0 ? -200 : 200,
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
        maxWidth: "42rem",
        height: "400px",
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
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
            scale: { duration: 0.3 },
          }}
          className="absolute inset-0"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={(e, { offset }) => {
            if (offset.x < -50) paginate(1);
            else if (offset.x > 50) paginate(-1);
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

      {/* Navigation arrows */}
      <button
        onClick={() => paginate(-1)}
        className="absolute left-4 sm:left-6 z-20 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full backdrop-blur-md bg-black/40 border border-white/20 text-white hover:bg-black/60 hover:scale-105 active:scale-95 transition-all opacity-0 group-hover:opacity-100"
        style={{ top: "50%", transform: "translateY(-50%)" }}
        aria-label="Previous Slide"
      >
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
      </button>
      <button
        onClick={() => paginate(1)}
        className="absolute right-4 sm:right-6 z-20 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full backdrop-blur-md bg-black/40 border border-white/20 text-white hover:bg-black/60 hover:scale-105 active:scale-95 transition-all opacity-0 group-hover:opacity-100"
        style={{ top: "50%", transform: "translateY(-50%)" }}
        aria-label="Next Slide"
      >
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-3 left-0 right-0 z-20 flex justify-center gap-2 pointer-events-none">
        {CAROUSEL_DATA.map((_, idx) => (
          <div
            key={idx}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              idx === currentIndex ? "bg-white w-4 shadow-sm" : "bg-white/50 w-1.5"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
