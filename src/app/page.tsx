"use client";

import React, { useState, useEffect } from "react";
import FloatingChat from "./components/FloatingChat";
import BackgroundGlow from "./components/BackgroundGlow";

export default function Home() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    // Sync theme class with HTML element
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <div 
      className="min-h-screen flex flex-col justify-between font-sans selection:bg-indigo-500/20 selection:text-indigo-600 transition-colors duration-300"
      style={{ backgroundColor: "var(--bg-page)", color: "var(--text-primary)" }}
    >
      <BackgroundGlow />

      {/* Header Navigation Bar */}
      <header 
        className="w-full px-6 py-4 flex items-center justify-between border-b backdrop-blur-md sticky top-0 z-20 transition-colors duration-300"
        style={{
          backgroundColor: "var(--bg-header)",
          borderColor: "var(--border-main)",
        }}
      >
        <div className="flex items-center gap-8">
          {/* Logo / Brand Icon */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center font-bold text-white text-xs shadow-sm">
              LC
            </div>
            <span className="font-semibold text-sm tracking-tight" style={{ color: "var(--text-primary)" }}>
              Lucas Coelho
            </span>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
            <a href="#projects" className="hover:opacity-100 opacity-80 transition-opacity">Projects</a>
            <a href="#stack" className="hover:opacity-100 opacity-80 transition-opacity">Tech Stack</a>
            <a href="#architecture" className="hover:opacity-100 opacity-80 transition-opacity">AI Architecture</a>
            <a href="#about" className="hover:opacity-100 opacity-80 transition-opacity">About</a>
            <a href="#contact" className="hover:opacity-100 opacity-80 transition-opacity">Contact</a>
          </nav>
        </div>

        {/* Right Section: Theme Toggle Button + User Avatar */}
        <div className="flex items-center gap-3">
          {/* Light / Dark Mode Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full border transition-all hover:scale-105 active:scale-95"
            style={{
              backgroundColor: "var(--bg-pill)",
              borderColor: "var(--border-main)",
              color: "var(--text-secondary)",
            }}
            title={`Active Theme: ${theme === "dark" ? "Dark" : "Light"}`}
            aria-label="Toggle visual theme"
          >
            {theme === "dark" ? (
              // Moon icon representing Dark mode
              <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            ) : (
              // Sun icon representing Light mode
              <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            )}
          </button>

          {/* Profile Avatar */}
          <div 
            className="w-8 h-8 rounded-full border flex items-center justify-center font-semibold text-xs transition-colors"
            style={{
              backgroundColor: "var(--bg-pill)",
              borderColor: "var(--border-main)",
              color: "var(--text-primary)",
            }}
          >
            L
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-12 flex flex-col items-center justify-center gap-8 z-10 my-auto">
        
        {/* Animated Radiant Flower Logo Icon (Meta AI style) */}
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
        <div className="text-center flex flex-col gap-2 max-w-xl">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
            Hi, let's explore Lucas Coelho's journey & work
          </h1>
          <p className="text-xs sm:text-sm" style={{ color: "var(--text-muted)" }}>
            Ask anything to get started.
          </p>
        </div>

        {/* Static Round Chat Box */}
        <div className="w-full">
          <FloatingChat />
        </div>
      </main>
    </div>
  );
}
