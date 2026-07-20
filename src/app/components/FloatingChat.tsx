"use client";

import React, { useState, useRef, useEffect } from "react";

export interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
  tags?: string[];
}

export default function FloatingChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend?: string) => {
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
    setIsTyping(true);

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

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "assistant",
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        tags,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 600);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div 
      className="w-full rounded-3xl p-4 sm:p-5 transition-all duration-300 border"
      style={{
        backgroundColor: "var(--bg-card)",
        borderColor: "var(--border-main)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      {/* Clear conversation button if messages exist */}
      {messages.length > 0 && (
        <div className="flex justify-end pb-2">
          <button
            onClick={() => setMessages([])}
            className="text-xs hover:opacity-100 opacity-60 transition-opacity font-medium"
            style={{ color: "var(--text-secondary)" }}
          >
            Clear
          </button>
        </div>
      )}

      {/* Message History */}
      {messages.length > 0 && (
        <div 
          className="py-3 max-h-[300px] overflow-y-auto custom-scrollbar flex flex-col gap-3 border-b mb-3 px-1"
          style={{ borderColor: "var(--border-subtle)" }}
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.sender === "user" ? "items-end" : "items-start"
              } max-w-[88%] ${msg.sender === "user" ? "ml-auto" : "mr-auto"}`}
            >
              <div
                className={`p-3.5 rounded-2xl text-sm leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-indigo-600 text-white rounded-br-none shadow-md shadow-indigo-600/15"
                    : "rounded-bl-none border"
                }`}
                style={
                  msg.sender !== "user"
                    ? {
                        backgroundColor: "var(--bg-pill)",
                        borderColor: "var(--border-main)",
                        color: "var(--text-primary)",
                      }
                    : undefined
                }
              >
                <p className="whitespace-pre-line">{msg.text}</p>
                {msg.tags && (
                  <div 
                    className="mt-2.5 flex flex-wrap gap-1.5 pt-2 border-t"
                    style={{ borderColor: "var(--border-main)" }}
                  >
                    {msg.tags.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded text-[11px] font-mono border"
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
              <span className="text-[10px] mt-1 px-1" style={{ color: "var(--text-muted)" }}>{msg.timestamp}</span>
            </div>
          ))}

          {isTyping && (
            <div 
              className="flex items-center gap-1.5 p-3 rounded-2xl border w-fit"
              style={{ backgroundColor: "var(--bg-pill)", borderColor: "var(--border-main)" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Input Area & Send Button */}
      <div className="flex flex-col gap-2">
        <textarea
          rows={2}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Continue conversation..."
          className="w-full bg-transparent text-sm resize-none focus:outline-none px-1"
          style={{ color: "var(--text-primary)" }}
        />

        {/* Action Controls Bar */}
        <div className="flex items-center justify-end pt-1">
          <button
            type="button"
            onClick={() => handleSendMessage()}
            disabled={!input.trim()}
            className="w-9 h-9 rounded-full text-white flex items-center justify-center transition-all shadow-md disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
            style={{ backgroundColor: "var(--accent-indigo)" }}
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
