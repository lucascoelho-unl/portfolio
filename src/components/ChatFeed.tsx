import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HeroIcon } from "./Hero";
import AgentComponentRegistry from "./agent/AgentComponentRegistry";
import { UIMessage } from "ai";
import { AgentDynamicToolPart } from "../types/agent-components";

interface ChatFeedProps {
  messages: UIMessage[];
  chatReady: boolean;
  clearMessages: () => void;
  isFirstRenderComplete: boolean;
  setIsFirstRenderComplete: (val: boolean) => void;
  appendDemoComponent?: (componentName: string) => void;
}

interface ToolCallMerged {
  toolCallId: string;
  toolName: string;
  output?: Record<string, unknown>;
  input?: Record<string, unknown>;
  type: string;
}

function processMessageParts(parts?: Array<Record<string, unknown>>, contentFallback?: string) {
  if (process.env.NODE_ENV === 'development') {
    console.log('[CHATFEED RAW PARTS]', parts);
  }
  if (!parts || parts.length === 0) {
    if (contentFallback) {
      return {
        textParts: [{ type: 'text', text: contentFallback, key: 'text-fallback' }],
        toolCalls: [],
      };
    }
    return { textParts: [], toolCalls: [] };
  }

  const textParts: Array<{ type: 'text'; text: string; key: string }> = [];
  const toolCallsMap = new Map<string, ToolCallMerged>();
  const toolCallOrder: string[] = [];

  parts.forEach((part, index) => {
    if (part.type === 'text' && typeof part.text === 'string') {
      textParts.push({
        type: 'text',
        text: part.text,
        key: `text-${index}`,
      });
      return;
    }

    const toolInvocation = part.toolInvocation as Record<string, unknown> | undefined;
    const toolCallId =
      (part.toolCallId as string) ||
      (toolInvocation?.toolCallId as string) ||
      (part.id as string) ||
      `tool-${index}`;

    const rawToolName =
      (part.toolName as string) ||
      (toolInvocation?.toolName as string) ||
      (typeof part.type === 'string' &&
        part.type.startsWith('tool-') &&
        !['tool-input-start', 'tool-input-delta', 'tool-input-available', 'tool-output-available', 'tool-result', 'tool-call', 'tool-invocation', 'tool-agent', 'tool-workflow'].includes(part.type)
        ? part.type.replace(/^tool-/, '')
        : '');

    const output = (part.output || toolInvocation?.result || part.result) as Record<string, unknown> | undefined;
    const input = (part.input || toolInvocation?.args || part.args) as Record<string, unknown> | undefined;

    if (!toolCallsMap.has(toolCallId)) {
      toolCallsMap.set(toolCallId, {
        toolCallId,
        toolName: rawToolName || '',
        output,
        input,
        type: (part.type as string) || 'tool-call',
      });
      toolCallOrder.push(toolCallId);
    } else {
      const existing = toolCallsMap.get(toolCallId)!;
      if (rawToolName && !existing.toolName) {
        existing.toolName = rawToolName;
      }
      if (output && Object.keys(output).length > 0) {
        existing.output = { ...(existing.output || {}), ...output };
      }
      if (input && Object.keys(input).length > 0) {
        existing.input = { ...(existing.input || {}), ...input };
      }
    }
  });

  return {
    textParts,
    toolCalls: toolCallOrder.map((id) => toolCallsMap.get(id)!),
  };
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
          {messages.map((msg) => {
            const { textParts, toolCalls } = processMessageParts(
              msg.parts as Array<Record<string, unknown>> | undefined,
              (msg as unknown as Record<string, unknown>).content as string | undefined
            );

            return (
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
                className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"
                  } w-full`}
              >
                {/* Message Bubble Card */}
                <div
                  className={`text-sm leading-relaxed max-w-[90%] sm:max-w-[85%] ${msg.role === "user" ? "px-5 py-2 rounded-full font-medium" : "w-full"
                    }`}
                  style={
                    msg.role === "user"
                      ? { backgroundColor: "var(--bg-pill)", color: "var(--text-primary)" }
                      : { color: "var(--text-primary)" }
                  }
                >
                  {textParts.map((tp) => (
                    <p key={tp.key} className="whitespace-pre-line">{tp.text}</p>
                  ))}

                  {toolCalls.map((tc) => (
                    <AgentComponentRegistry
                      key={tc.toolCallId}
                      part={tc as unknown as AgentDynamicToolPart}
                    />
                  ))}

                  {(msg.metadata as { isFallback?: boolean })?.isFallback && appendDemoComponent && (
                    <div className="flex gap-2 mt-4 flex-wrap">
                      <button
                        onClick={() => appendDemoComponent('skills')}
                        className="px-4 py-2 text-xs rounded-full border border-[var(--border-color)] hover:bg-[var(--bg-pill)] transition-colors text-[var(--text-primary)]"
                      >
                        Show Skills Component
                      </button>
                      <button
                        onClick={() => appendDemoComponent('carousel')}
                        className="px-4 py-2 text-xs rounded-full border border-[var(--border-color)] hover:bg-[var(--bg-pill)] transition-colors text-[var(--text-primary)]"
                      >
                        Show Image Carousel
                      </button>
                      <button
                        onClick={() => appendDemoComponent('projects')}
                        className="px-4 py-2 text-xs rounded-full border border-[var(--border-color)] hover:bg-[var(--bg-pill)] transition-colors text-[var(--text-primary)]"
                      >
                        Show Projects Component
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      )}
      <div ref={feedEndRef} />
    </div>
  );
}
