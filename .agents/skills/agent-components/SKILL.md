---
name: agent-components
description: "Guidelines, architecture, patterns, libraries, and step-by-step procedures for creating and registering new agent-renderable UI components (Generative UI) in Mastra and Next.js."
---

# Agent UI Components Guide (Generative UI)

This skill provides an independent, reusable framework for creating and registering **Agent UI Components**—interactive React components that the AI agent can dynamically invoke and render inside chat feeds.

---

## 1. System Architecture

The Generative UI workflow links backend agent decision-making with dynamic client-side rendering:

```
┌───────────────────────────┐
│ 1. User Message           │
└─────────────┬─────────────┘
              │
              ▼
┌───────────────────────────┐
│ 2. Mastra Agent           │ -> Evaluates intent & invokes a Mastra Tool (`src/mastra/tools/`)
└─────────────┬─────────────┘
              │
              ▼
┌───────────────────────────┐
│ 3. Stream API Route       │ -> Streams tool call and results via `toAISdkStream()`
└─────────────┬─────────────┘
              │
              ▼
┌───────────────────────────┐
│ 4. Vercel AI SDK          │ -> Receives tool call message part in `useChat()`
└─────────────┬─────────────┘
              │
              ▼
┌───────────────────────────┐
│ 5. AgentComponentRegistry │ -> Maps `toolName` to React Component (`src/components/agent/`)
└─────────────┬─────────────┘
              │
              ▼
┌───────────────────────────┐
│ 6. Rendered React UI      │ -> Displays interactive, animated component inside message bubble
└───────────────────────────┘
```

---

## 2. Core Libraries & Technologies

- **`@mastra/core`**: Tool definition (`createTool`), Agent configuration (`Agent`), and Workflow orchestration.
- **`zod`**: Schema definition for tool inputs (`inputSchema`) and outputs (`outputSchema`).
- **`ai` & `@ai-sdk/react`**: Stream management (`toAISdkStream`, `createUIMessageStream`) and React hooks (`useChat`).
- **`framer-motion`**: Micro-animations, entrance/exit transitions, and interactive physics.
- **React & TypeScript**: Component structure, strict prop contracts, and layout composition.
- **CSS Variables & Tailwind**: Theme isolation and responsive layout styling.

---

## 3. Step-by-Step Guide: Creating a New Agent Component

Follow these 6 steps whenever adding a new UI component that the agent can render.

### Step 1: Define Output & Props Contract
Add the tool output and component prop interfaces in `src/types/agent-components.ts`:

```typescript
export interface MyNewToolOutput {
  items: Array<{
    id: string;
    title: string;
    description: string;
  }>;
}
```

### Step 2: Build the Mastra Tool
Create or update a Mastra tool in `src/mastra/tools/` using `createTool` and `zod`:

```typescript
import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

export const myNewTool = createTool({
  id: 'my-new-tool',
  description: 'Displays new feature data to the user. Use when user asks about feature X.',
  inputSchema: z.object({
    filter: z.string().optional(),
  }),
  outputSchema: z.object({
    items: z.array(
      z.object({
        id: z.string(),
        title: z.string(),
        description: z.string(),
      })
    ),
  }),
  execute: async ({ filter }) => {
    // Fetch data or compute result
    return { items: [...] };
  },
});
```

### Step 3: Register Tool in Agent & Mastra Config
1. Register tool in `src/mastra/agents/portfolio-agent.ts`:
   - Add `myNewTool` to `tools` object.
   - Update agent `instructions` prompt describing when to trigger the tool.
2. Register tool in `src/mastra/index.ts`:
   - Add `myNewTool` to Mastra `tools` registry.

### Step 4: Create the UI Component
Create a new React component under `src/components/agent/MyNewComponent.tsx`:

```tsx
import React from 'react';
import { motion } from 'framer-motion';
import { MyNewToolOutput } from '../../types/agent-components';

export default function MyNewComponent({ items }: MyNewToolOutput) {
  if (!items || items.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full flex flex-col gap-4 mt-4"
    >
      {items.map((item) => (
        <div key={item.id} className="p-4 rounded-xl border border-[var(--border-main)] bg-[var(--bg-pill)]">
          <h4 className="font-bold text-[var(--text-primary)]">{item.title}</h4>
          <p className="text-sm opacity-80 text-[var(--text-primary)]">{item.description}</p>
        </div>
      ))}
    </motion.div>
  );
}
```

### Step 5: Register Component in `AgentComponentRegistry`
Add the tool mapping in `src/components/agent/AgentComponentRegistry.tsx`:

```tsx
case 'my-new-tool': {
  const items = (part.output as MyNewToolOutput)?.items || [];
  return (
    <div key={part.toolCallId} className="mt-4 w-full">
      <MyNewComponent items={items} />
    </div>
  );
}
```

### Step 6: Add Fallback / Demo Action (Optional)
In `src/hooks/useChat.ts`, update `appendDemoComponent` and add a manual trigger button in `ChatFeed.tsx` for fallback mode (e.g. quota limits).

---

## 4. Best Practices & Design Guidelines

1. **Theme Consistency**:
   - Always use standard CSS variables (`var(--bg-pill)`, `var(--text-primary)`, `var(--border-main)`) or Tailwind classes so the component renders seamlessly in both light and dark themes.
2. **Animation Standards**:
   - Wrap top-level component in `<motion.div>` with subtle `opacity` and `y` offsets.
   - Use staggered animation delays (`delay: idx * 0.1`) for list items to make loading feel smooth.
3. **Responsive Design**:
   - Use flexible grid/flexbox layouts (`grid-cols-1 sm:grid-cols-2`, `w-full max-w-full`).
   - Touch/drag targets should be at least 44x44px for mobile devices.
4. **Empty/Error States**:
   - Components must handle `undefined` or empty output arrays gracefully without throwing runtime null reference errors.
