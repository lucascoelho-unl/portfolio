import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HeroIcon } from "./Hero";
import SkillsComponent from "./SkillsComponent";
import { Message } from "@ai-sdk/react";

interface ChatFeedProps {
  messages: Message[];
  chatReady: boolean;
  clearMessages: () => void;
  isFirstRenderComplete: boolean;
  setIsFirstRenderComplete: (val: boolean) => void;
}

export default function ChatFeed({
  messages,
  chatReady,
  clearMessages,
  isFirstRenderComplete,
  setIsFirstRenderComplete,
}: ChatFeedProps) {
  const feedEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Smooth scroll to latest message
    feedEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
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
          className="w-16 h-16 opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
          onClick={clearMessages}
        />
      </motion.div>
      
      {chatReady && (
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={msg.role === "user" ? { opacity: 0 } : false}
              animate={msg.role === "user" ? { opacity: 1 } : false}
              transition={
                msg.role === "user"
                  ? {
                      duration: !isFirstRenderComplete ? 0.6 : 0.3,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    }
                  : undefined
              }
              onAnimationComplete={
                msg.role === "user" ? () => setIsFirstRenderComplete(true) : undefined
              }
              style={msg.role === "user" ? { transformOrigin: "top" } : undefined}
              className={`flex flex-col ${
                msg.role === "user" ? "items-end" : "items-start"
              } w-full`}
            >
              {/* Message Bubble Card */}
              <div
                className={`text-sm leading-relaxed max-w-[90%] sm:max-w-[85%] ${
                  msg.role === "user" ? "px-5 py-2 rounded-full font-medium" : ""
                }`}
                style={
                  msg.role === "user"
                    ? { backgroundColor: "var(--bg-pill)", color: "var(--text-primary)" }
                    : { color: "var(--text-primary)" }
                }
              >
                {msg.content && <p className="whitespace-pre-line">{msg.content}</p>}

                {msg.toolInvocations?.map((toolInvocation) => {
                  if (toolInvocation.toolName === "show-skills" && "result" in toolInvocation) {
                    return (
                      <div key={toolInvocation.toolCallId} className="mt-4">
                        <SkillsComponent categories={toolInvocation.result.categories} />
                      </div>
                    );
                  }
                  // Add other tools here in the future
                  return null;
                })}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      )}
      <div ref={feedEndRef} />
    </div>
  );
}
