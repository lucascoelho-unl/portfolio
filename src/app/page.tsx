"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FloatingChat from "../components/FloatingChat";
import BackgroundGlow from "../components/BackgroundGlow";
import Header from "../components/Header";
import Hero from "../components/Hero";
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
      className="min-h-screen flex flex-col font-sans selection:bg-indigo-500/20 selection:text-indigo-600 transition-colors duration-300 relative overflow-x-hidden"
      style={{ backgroundColor: "var(--bg-page)", color: "var(--text-primary)" }}
    >
      <BackgroundGlow />

      <Header 
        theme={theme}
        toggleTheme={toggleTheme}
        hasMessages={hasMessages}
        onClearChat={clearMessages}
      />

      {/* Main Layout Area */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 flex flex-col justify-between z-10 py-6">
        
        {/* Unified Layout Wrapper */}
        <div className={`flex-1 flex flex-col ${!hasMessages ? "items-center justify-center my-auto gap-8 text-center" : "justify-between"}`}>
          
          <Hero isVisible={!hasMessages} />

          {/* Conversation Feed Stream */}
          {hasMessages && (
            <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-6 py-2 pr-1 mb-4">
              {chatReady && (
                <AnimatePresence>
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={msg.sender === "user" ? { opacity: 0 } : false}
                      animate={msg.sender === "user" ? { opacity: 1 } : false}
                      transition={msg.sender === "user" ? { 
                        duration: !isFirstRenderComplete ? 1.2 : 0.7, 
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
            className={`w-full z-20 ${!hasMessages ? "max-w-2xl" : "sticky bottom-4"}`}
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
