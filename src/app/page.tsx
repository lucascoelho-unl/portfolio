"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FloatingChat from "./components/FloatingChat";
import BackgroundGlow from "./components/BackgroundGlow";

export interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
  tags?: string[];
}

export default function Home() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");

  const feedEndRef = useRef<HTMLDivElement>(null);
  const isFirstTransition = useRef(true);
  const [chatReady, setChatReady] = useState(false);

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

  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || input.trim();
    if (!query) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInput("");


    // Simulate AI assistant response with streaming
    setTimeout(() => {
      let responseText = "Thanks for asking! Lucas is a Full-Stack & AI Systems Engineer specializing in Mastra AI agents, Next.js, and high-performance web applications.";
      let tags: string[] | undefined = undefined;

      const lower = query.toLowerCase();
      if (lower.includes("project") || lower.includes("work") || lower.includes("recruiting")) {
        responseText = "🚀 Here are Lucas's top projects:\n\n• Generative UI Portfolio — Real-time streaming AI components\n• Agentic Workflow Orchestrator — Multi-agent runner with DuckDB memory\n• Real-Time Analytics Dashboard — Low-latency metrics & visualizer";
        tags = ["Next.js", "Mastra AI", "TypeScript", "TailwindCSS"];
      } else if (lower.includes("culture") || lower.includes("stack") || lower.includes("tech") || lower.includes("background")) {
        responseText = "🛠️ Core Technical Stack:\n\n• Frontend: Next.js 16, React 19, Tailwind CSS v4, Framer Motion\n• Backend & AI: Mastra AI SDK, Node.js, TypeScript, Zod, DuckDB\n• Database & Cloud: PostgreSQL, GCP, Docker";
        tags = ["Fullstack", "Agentic AI", "TypeScript"];
      } else if (lower.includes("job") || lower.includes("suitable") || lower.includes("hire") || lower.includes("role")) {
        responseText = "💼 Lucas is open to full-stack engineering, AI systems architecture, and technical product roles!";
        tags = ["Open to Opportunities", "Full-Stack", "AI Engineering"];
      }

      const assistantId = (Date.now() + 1).toString();
      const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

      // Add empty assistant message
      const assistantMessage: ChatMessage = {
        id: assistantId,
        sender: "assistant",
        text: "",
        timestamp,
      };
      setMessages((prev) => [...prev, assistantMessage]);


      // Stream words in one at a time
      const words = responseText.split(" ");
      let wordIndex = 0;

      const streamInterval = setInterval(() => {
        wordIndex++;
        const currentText = words.slice(0, wordIndex).join(" ");
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, text: currentText } : m
          )
        );

        if (wordIndex >= words.length) {
          clearInterval(streamInterval);
          // Append tags after streaming finishes
          if (tags) {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId ? { ...m, tags } : m
              )
            );
          }
        }
      }, 30);
    }, 400);
  };

  const hasMessages = messages.length > 0;

  return (
    <div 
      className="min-h-screen flex flex-col font-sans selection:bg-indigo-500/20 selection:text-indigo-600 transition-colors duration-300 relative overflow-x-hidden"
      style={{ backgroundColor: "var(--bg-page)", color: "var(--text-primary)" }}
    >
      <BackgroundGlow />

      {/* Header Navigation Bar */}
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
              onClick={() => setMessages([])}
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

      {/* Main Layout Area */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 flex flex-col justify-between z-10 py-6">
        
        {/* Unified Layout Wrapper */}
        <div className={`flex-1 flex flex-col ${!hasMessages ? "items-center justify-center my-auto gap-8 text-center" : "justify-between"}`}>
          
          {/* Hero Header (Flower logo + Title) */}
          <AnimatePresence mode="popLayout">
            {!hasMessages && (
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
                    Hi, let's explore Lucas Coelho's journey & work
                  </h1>
                  <p className="text-xs sm:text-sm" style={{ color: "var(--text-muted)" }}>
                    Ask anything to get started.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Conversation Feed Stream — container always present for layout, content after chat settles */}
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
                        duration: isFirstTransition.current ? 1.2 : 0.7, 
                        ease: [0.25, 0.46, 0.45, 0.94],
                      } : undefined}
                      onAnimationComplete={msg.sender === "user" ? () => { isFirstTransition.current = false; } : undefined}
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

          {/* Persistent Chat Input Box (Glides down) */}
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
              if (isFirstTransition.current && hasMessages) {
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
