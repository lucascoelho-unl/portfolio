"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import FloatingChat from "../components/FloatingChat";
import BackgroundGlow from "../components/BackgroundGlow";
import Hero from "../components/Hero";
import ThemeToggle from "../components/ThemeToggle";
import ChatFeed from "../components/ChatFeed";
import { useChat } from "../hooks/useChat";

import FluidBackground from "../components/FluidBackground";

export default function Home() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [chatReady, setChatReady] = useState(false);
  const [isFirstRenderComplete, setIsFirstRenderComplete] = useState(false);

  const {
    messages,
    input,
    setInput,
    handleSendMessage,
    clearMessages,
    hasMessages,
    appendDemoComponent,
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

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <div
      className="h-[100dvh] flex flex-col font-sans selection:bg-indigo-500/20 selection:text-indigo-600 transition-colors duration-300 relative overflow-x-hidden pointer-events-none"
      style={{ color: "var(--text-primary)" }}
    >
      <FluidBackground isActive={!hasMessages} />
      <BackgroundGlow />

      {/* Floating Top Right Actions */}
      <div className="fixed top-6 right-6 pointer-events-auto z-50 flex items-center gap-3">
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
      </div>

      {/* Main Layout Area */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 flex flex-col justify-between z-10 py-6 min-h-0">

        {/* Unified Layout Wrapper */}
        <div className={`flex-1 flex flex-col min-h-0 ${!hasMessages ? "items-center justify-center my-auto pb-[15vh] gap-8 text-center" : "justify-between"}`}>

          <div className="pointer-events-none shrink-0">
            <Hero
              isVisible={!hasMessages}
              onIconClick={() => handleSendMessage("Hello! I'd love to learn more about your work.")}
            />
          </div>

          {/* Conversation Feed Stream */}
          {hasMessages && (
            <ChatFeed
              messages={messages}
              chatReady={chatReady}
              clearMessages={clearMessages}
              isFirstRenderComplete={isFirstRenderComplete}
              setIsFirstRenderComplete={setIsFirstRenderComplete}
              appendDemoComponent={appendDemoComponent}
            />
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
            className={`w-full z-20 pointer-events-auto shrink-0 ${!hasMessages ? "max-w-2xl" : ""}`}
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
