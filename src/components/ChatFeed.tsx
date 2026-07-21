import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HeroIcon } from "./Hero";
import SkillsComponent from "./SkillsComponent";
import ImageCarousel from "./ImageCarousel";
import { UIMessage } from "ai";
import { SkillCategory } from "../data/skills";

interface ChatFeedProps {
  messages: UIMessage[];
  chatReady: boolean;
  clearMessages: () => void;
  isFirstRenderComplete: boolean;
  setIsFirstRenderComplete: (val: boolean) => void;
  appendDemoComponent?: (componentName: string) => void;
}

export default function ChatFeed({
  messages,
  chatReady,
  clearMessages,
  isFirstRenderComplete,
  setIsFirstRenderComplete,
  appendDemoComponent,
}: ChatFeedProps) {
  const feedEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Smooth scroll to latest message
    feedEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div 
      className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-6 py-2 pr-1 mb-4 pointer-events-auto"
      style={{
        maskImage: "linear-gradient(to bottom, black 0%, black calc(100% - 40px), transparent 100%)",
        WebkitMaskImage: "linear-gradient(to bottom, black 0%, black calc(100% - 40px), transparent 100%)"
      }}
    >
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
                  msg.role === "user" ? "px-5 py-2 rounded-full font-medium" : "w-full"
                }`}
                style={
                  msg.role === "user"
                    ? { backgroundColor: "var(--bg-pill)", color: "var(--text-primary)" }
                    : { color: "var(--text-primary)" }
                }
              >
                {msg.parts?.map((part, index) => {
                  if (part.type === 'text') {
                    return <p key={index} className="whitespace-pre-line">{part.text}</p>;
                  }

                  // Cast to access dynamic tool properties
                  const dynamicPart = part as unknown as { type: string; toolName?: string; toolCallId?: string; state?: string; output?: Record<string, unknown> };

                  // Skills component — matches static 'tool-show-skills' or dynamic-tool with toolName
                  if (
                    (dynamicPart.type === 'tool-show-skills') ||
                    (dynamicPart.type === 'dynamic-tool' && dynamicPart.toolName === 'show-skills')
                  ) {
                    return (
                      <div key={dynamicPart.toolCallId || index} className="mt-4 w-full">
                        <SkillsComponent categories={
                          (dynamicPart.output as { categories?: SkillCategory[] })?.categories || []
                        } />
                      </div>
                    );
                  }

                  // Image carousel — matches static 'tool-show-carousel' or dynamic-tool with toolName
                  if (
                    (dynamicPart.type === 'tool-show-carousel') ||
                    (dynamicPart.type === 'dynamic-tool' && dynamicPart.toolName === 'show-carousel')
                  ) {
                    return (
                      <div key={dynamicPart.toolCallId || index} className="mt-4 w-full">
                        <ImageCarousel />
                      </div>
                    );
                  }

                  // Add other tools here in the future
                  return null;
                })}

                {(msg.metadata as { isFallback?: boolean })?.isFallback && appendDemoComponent && (
                  <div className="flex gap-2 mt-4 flex-wrap">
                    <button
                      onClick={() => appendDemoComponent('skills')}
                      className="px-4 py-2 text-xs rounded-full border border-[var(--border-color)] hover:bg-[var(--bg-pill)] transition-colors"
                    >
                      Show Skills Component
                    </button>
                    <button
                      onClick={() => appendDemoComponent('carousel')}
                      className="px-4 py-2 text-xs rounded-full border border-[var(--border-color)] hover:bg-[var(--bg-pill)] transition-colors"
                    >
                      Show Image Carousel
                    </button>
                    {/* Add more buttons here later */}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      )}
      <div ref={feedEndRef} />
    </div>
  );
}
