import React from "react";
import { motion } from "framer-motion";

interface HeaderProps {
  theme: "dark" | "light";
  toggleTheme: () => void;
  hasMessages: boolean;
  onClearChat: () => void;
}

export default function Header({ theme, toggleTheme, hasMessages, onClearChat }: HeaderProps) {
  return (
    <header 
      className="w-full px-6 py-4 flex items-center justify-between border-b backdrop-blur-md sticky top-0 z-30 transition-colors duration-300 shrink-0"
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

      {/* Right Section: Clear Chat Button + Theme Toggle Button + Avatar */}
      <div className="flex items-center gap-3">
        {hasMessages && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={onClearChat}
            className="text-xs px-3 py-1 rounded-full border transition-all hover:opacity-100 opacity-70"
            style={{
              backgroundColor: "var(--bg-pill)",
              borderColor: "var(--border-main)",
              color: "var(--text-secondary)",
            }}
          >
            New Chat
          </motion.button>
        )}

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
  );
}
