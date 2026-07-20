import { useState } from "react";
import { useChat as useAiChat } from "@ai-sdk/react";
import type { ChatMessage } from "../types/chat";

export function useChat() {
  const { 
    messages: aiMessages, 
    sendMessage, 
    setMessages: setAiMessages, 
    status
  } = useAiChat({
    onError: (err) => {
      // Append the fallback message permanently to the chat history
      setAiMessages((currentMessages) => [
        ...currentMessages,
        {
          id: `error-${Date.now()}`,
          role: 'assistant',
          parts: [{ type: 'text', text: "I'm currently experiencing high traffic and have run out of API quota. Please check back later!" }]
        }
      ]);
    }
  });

  const [input, setInput] = useState("");

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || input.trim();
    if (!query) return;

    if (!textToSend) setInput("");
    
    await sendMessage({
      text: query,
    });
  };

  const clearMessages = () => setAiMessages([]);

  return {
    messages: aiMessages,
    input: input || "",
    setInput,
    handleSendMessage,
    clearMessages,
    hasMessages: aiMessages.length > 0,
    isLoading: status === 'submitted' || status === 'streaming',
  };
}
