import { useState } from "react";
import type { ChatMessage } from "../types/chat";

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");

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

  const clearMessages = () => setMessages([]);

  return {
    messages,
    input,
    setInput,
    handleSendMessage,
    clearMessages,
    hasMessages: messages.length > 0,
  };
}
