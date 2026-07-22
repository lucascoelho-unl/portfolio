import { mastra } from '../../../mastra';
import { createUIMessageStream, createUIMessageStreamResponse, UIMessage, UIMessageChunk } from 'ai';
import { toAISdkStream } from '@mastra/ai-sdk';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// Ensure Gemini API key fallback environment variable is populated
if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
  const key = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
  if (key) {
    process.env.GOOGLE_GENERATIVE_AI_API_KEY = key;
    process.env.GOOGLE_API_KEY = key;
  }
}

// TODO: Customize this fallback message for when the AI API quota is exceeded.
const QUOTA_FALLBACK_MESSAGE = "I'm currently experiencing high traffic and have run out of API quota. Please check back later!";

export async function POST(req: Request) {
  let messages: UIMessage[] = [];
  try {
    const body = await req.json();
    messages = body.messages || [];
    
    const agent = mastra.getAgent('portfolioAgent');
    const stream = await agent.stream(messages, { untilIdle: true });
    
    const uiMessageStream = createUIMessageStream({
      originalMessages: messages,
      execute: async ({ writer }) => {
        try {
          for await (const part of toAISdkStream(stream, { from: 'agent' })) {
            if (process.env.NODE_ENV === 'development') {
              console.log('[API ROUTE CHUNK]', JSON.stringify(part));
            }
            await writer.write(part as UIMessageChunk);
          }
        } catch (streamError: unknown) {
          // If the stream fails midway due to quota
          const errorObj = streamError as Record<string, unknown>;
          const msg = String(errorObj?.message || '');
          if (errorObj?.statusCode === 429 || msg.includes('429') || msg.includes('Quota')) {
            await writer.write({ type: 'text-delta', delta: `\n\n[Error: ${QUOTA_FALLBACK_MESSAGE}]`, id: Date.now().toString() } as unknown as UIMessageChunk);
          } else {
            console.error('Streaming error:', streamError);
          }
        }
      },
    });

    return createUIMessageStreamResponse({
      stream: uiMessageStream,
    });
  } catch (error: unknown) {
    const errorObj = error as Record<string, unknown>;
    const errorMsg = String(errorObj?.message || error || '');
    const errorData = errorObj?.data ? JSON.stringify(errorObj.data) : '';
    const isQuotaError = 
      errorObj?.statusCode === 429 || 
      errorObj?.status === 429 ||
      errorMsg.includes('429') || 
      errorMsg.includes('RESOURCE_EXHAUSTED') || 
      errorMsg.includes('Quota') || 
      errorMsg.includes('exceeded') ||
      errorData.includes('429');
      
    console.error('Chat API Error:', error);
    
    if (isQuotaError) {
      // Send a standard 429 response instead of faking the stream protocol.
      // The frontend will catch this error and display the fallback message.
      return new Response(QUOTA_FALLBACK_MESSAGE, { status: 429 });
    }

    return new Response('Internal Server Error', { status: 500 });
  }
}
