"use client";

import React from "react";

interface FloatingChatProps {
  input: string;
  setInput: (val: string) => void;
  onSendMessage: (text?: string) => void;
}

export default function FloatingChat({
  input,
  setInput,
  onSendMessage,
}: FloatingChatProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div 
      className="w-full rounded-3xl p-3.5 sm:p-4 transition-all duration-500 border shadow-lg"
      style={{
        backgroundColor: "var(--bg-card)",
        borderColor: "var(--border-main)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      <div className="flex flex-col gap-2">
        <textarea
          rows={2}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything about Lucas's projects, stack, or background..."
          className="w-full bg-transparent text-sm resize-none focus:outline-none px-2 pt-1"
          style={{ color: "var(--text-primary)" }}
        />

        {/* Action Controls Bar */}
        <div className="flex items-center justify-end pt-1">
          <button
            type="button"
            onClick={() => onSendMessage()}
            disabled={!(input || "").trim()}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
            style={{ backgroundColor: "var(--bg-pill)", color: "var(--text-primary)" }}
            aria-label="Send message"
          >
            <svg className="w-4 h-4 transform -rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
