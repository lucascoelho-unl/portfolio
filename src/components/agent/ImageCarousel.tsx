"use client";

import React, { useState } from "react";
import { motion, PanInfo } from "framer-motion";
import { CAROUSEL_DATA } from "@/data/carousel";

export default function ImageCarousel() {
  const [[page], setPage] = useState([0, 0]);

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  const handleDragEnd = (e: unknown, { offset, velocity }: PanInfo) => {
    const swipeThreshold = 60;
    if (offset.x > swipeThreshold || velocity.x > 400) {
      paginate(-1);
    } else if (offset.x < -swipeThreshold || velocity.x < -400) {
      paginate(1);
    }
  };

  const dataLength = CAROUSEL_DATA.length;

  return (
    <div className="flex items-center justify-center gap-12 sm:gap-24 md:gap-32 w-full max-w-5xl mx-auto py-8 overflow-hidden">
      <button
        onClick={() => paginate(-1)}
        className="z-30 w-10 h-10 flex items-center justify-center rounded-full backdrop-blur-md bg-black/20 border border-white/10 text-white hover:bg-black/40 hover:scale-105 active:scale-95 transition-all flex-shrink-0"
        aria-label="Previous Slide"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <div className="relative w-full max-w-[28rem] h-[500px]">
        {CAROUSEL_DATA.map((item, index) => {
          const activeDataIndex = ((page % dataLength) + dataLength) % dataLength;
          let diff = index - activeDataIndex;

          if (diff > dataLength / 2) {
            diff -= dataLength;
          } else if (diff < -dataLength / 2) {
            diff += dataLength;
          }

          return (
            <motion.div
              key={item.url}
              custom={diff}
              animate="visible"
              variants={{
                visible: (d) => {
                  const absD = Math.abs(d);
                  if (d === 0) {
                    return {
                      x: 0,
                      y: 0,
                      scale: 1,
                      opacity: 1,
                      zIndex: 20,
                      rotate: 0,
                      filter: "brightness(1) blur(0px)",
                    };
                  }

                  const isNext = d > 0;
                  const dir = isNext ? 1 : -1;

                  return {
                    x: dir * (90 + (absD - 1) * 50),
                    y: 0,
                    scale: 1 - absD * 0.12,
                    opacity: 1,
                    zIndex: 20 - absD,
                    rotate: dir * 5 * absD,
                    filter: `brightness(${1 - absD * 0.4}) blur(${absD * 1}px)`,
                  };
                },
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
              initial={false}
              drag={diff === 0 ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.6}
              onDragEnd={handleDragEnd}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: "1.5rem",
                overflow: "hidden",
                border: "none",
                boxShadow: diff === 0 ? "0 20px 40px -10px rgba(0, 0, 0, 0.4)" : "none",
                transformOrigin: "center center",
                pointerEvents: diff === 0 ? "auto" : "none",
              }}
              className="will-change-transform bg-[rgba(18,20,29,0.95)] cursor-grab active:cursor-grabbing"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.url}
                alt={item.title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                  pointerEvents: "none",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.2) 40%, transparent)",
                  pointerEvents: "none",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: "1.25rem",
                  color: "white",
                  pointerEvents: "none",
                }}
              >
                <h3 style={{ fontSize: "1.25rem", fontWeight: 700 }}>{item.title}</h3>
                <p style={{ fontSize: "0.875rem", opacity: 0.8, marginTop: 4 }}>{item.subtitle}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <button
        onClick={() => paginate(1)}
        className="z-30 w-10 h-10 flex items-center justify-center rounded-full backdrop-blur-md bg-black/20 border border-white/10 text-white hover:bg-black/40 hover:scale-105 active:scale-95 transition-all flex-shrink-0"
        aria-label="Next Slide"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
