"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FloatingChat from "../components/FloatingChat";
import BackgroundGlow from "../components/BackgroundGlow";

import Hero, { HeroIcon } from "../components/Hero";
import { useChat } from "../hooks/useChat";

export default function Home() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const feedEndRef = useRef<HTMLDivElement>(null);
  const [chatReady, setChatReady] = useState(false);
  const [isFirstRenderComplete, setIsFirstRenderComplete] = useState(false);

  const {
    messages,
    input,
    setInput,
    handleSendMessage,
    clearMessages,
    hasMessages,
  } = useChat();

  useEffect(() => {
    // Sync theme class with HTML element
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  useEffect(() => {
    // Smooth scroll to latest message
    feedEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <div 
      className="min-h-screen flex flex-col font-sans selection:bg-indigo-500/20 selection:text-indigo-600 transition-colors duration-300 relative overflow-x-hidden pointer-events-none"
      style={{ color: "var(--text-primary)" }}
    >
      <BackgroundGlow />

      {/* Floating Top Right Actions */}
      <div className="fixed top-6 right-6 pointer-events-auto z-50 flex items-center gap-3">
        {/* HeroIcon was here, moved to the feed stream */}

        <button
          onClick={toggleTheme}
          className="p-2 rounded-full border shadow-sm transition-all hover:scale-105 active:scale-95"
          style={{
            backgroundColor: "var(--bg-pill)",
            borderColor: "var(--border-main)",
            color: "var(--text-secondary)",
          }}
          title={`Active Theme: ${theme === "dark" ? "Dark" : "Light"}`}
          aria-label="Toggle visual theme"
        >
          {theme === "dark" ? (
            <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          )}
        </button>
      </div>

      {/* Main Layout Area */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 flex flex-col justify-between z-10 py-6">
        
        {/* Unified Layout Wrapper */}
        <div className={`flex-1 flex flex-col ${!hasMessages ? "items-center justify-center my-auto pb-[15vh] gap-8 text-center" : "justify-between"}`}>
          
          <div className="pointer-events-auto">
            <Hero 
              isVisible={!hasMessages} 
              onIconClick={() => handleSendMessage("Hello! I'd love to learn more about your work.")}
            />
          </div>

          {/* Conversation Feed Stream */}
          {hasMessages && (
            <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-6 py-2 pr-1 mb-4 pointer-events-auto">
              
              {/* Centered Top Icon for Chat Mode */}
              <motion.div
                initial={{ opacity: 0, height: 0, scale: 0.9, marginTop: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: "auto", scale: 1, marginTop: 16, marginBottom: 16 }}
                transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="flex justify-center items-center w-full shrink-0"
                title="New Chat"
              >
                <HeroIcon 
                  className="w-16 h-16 opacity-80 hover:opacity-100 transition-opacity" 
                  onClick={clearMessages}
                />
              </motion.div>
              {chatReady && (
                <AnimatePresence>
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={msg.sender === "user" ? { opacity: 0 } : false}
                      animate={msg.sender === "user" ? { opacity: 1 } : false}
                      transition={msg.sender === "user" ? { 
                        duration: !isFirstRenderComplete ? 0.6 : 0.3, 
                        ease: [0.25, 0.46, 0.45, 0.94],
                      } : undefined}
                      onAnimationComplete={msg.sender === "user" ? () => setIsFirstRenderComplete(true) : undefined}
                      style={msg.sender === "user" ? { transformOrigin: "top" } : undefined}
                      className={`flex flex-col ${
                        msg.sender === "user" ? "items-end" : "items-start"
                      } w-full`}
                    >

                      {/* Message Bubble Card */}
                      <div
                        className={`text-sm leading-relaxed max-w-[90%] sm:max-w-[85%] ${
                          msg.sender === "user"
                            ? "px-5 py-2 rounded-full font-medium"
                            : ""
                        }`}
                        style={
                          msg.sender === "user"
                            ? { backgroundColor: "var(--bg-pill)", color: "var(--text-primary)" }
                            : { color: "var(--text-primary)" }
                        }
                      >
                        <p className="whitespace-pre-line">{msg.text}</p>
                        {msg.tags && (
                          <div 
                            className="mt-3 flex flex-wrap gap-1.5 pt-2.5 border-t"
                            style={{ borderColor: "var(--border-main)" }}
                          >
                            {msg.tags.map((t) => (
                              <span
                                key={t}
                                className="px-2.5 py-1 rounded-md text-[11px] font-mono border"
                                style={{
                                  backgroundColor: "var(--accent-pill-bg)",
                                  color: "var(--accent-pill-text)",
                                  borderColor: "var(--border-highlight)",
                                }}
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
              <div ref={feedEndRef} />
            </div>
          )}

          {/* Persistent Chat Input Box */}
          <motion.div
            layout
            transition={{
              layout: {
                type: "spring",
                stiffness: 500,
                damping: 35,
                mass: 0.4,
              },
            }}
            onLayoutAnimationComplete={() => {
              if (hasMessages) {
                setChatReady(true);
              }
            }}
            className={`w-full z-20 pointer-events-auto ${!hasMessages ? "max-w-2xl" : "sticky bottom-4"}`}
          >
            <FloatingChat
              input={input}
              setInput={setInput}
              onSendMessage={handleSendMessage}
            />
          </motion.div>
        </div>
      </main>
    </div>
  );
}
