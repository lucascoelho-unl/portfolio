import { mastra } from '../../../mastra';
import { createUIMessageStream, createUIMessageStreamResponse } from 'ai';
import { toAISdkStream } from '@mastra/ai-sdk';

// TODO: Customize this fallback message for when the AI API quota is exceeded.
const QUOTA_FALLBACK_MESSAGE = "I'm currently experiencing high traffic and have run out of API quota. Please check back later!";

export async function POST(req: Request) {
  let messages: any[] = [];
  try {
    const body = await req.json();
    messages = body.messages || [];
    
    const agent = mastra.getAgent('portfolioAgent');
    const stream = await agent.stream(messages);
    
    const uiMessageStream = createUIMessageStream({
      originalMessages: messages,
      execute: async ({ writer }) => {
        try {
          for await (const part of toAISdkStream(stream, { from: 'agent' })) {
            await writer.write(part as any);
          }
        } catch (streamError: any) {
          // If the stream fails midway due to quota
          if (streamError?.statusCode === 429 || streamError?.message?.includes('429') || streamError?.message?.includes('Quota')) {
            await writer.write({ type: 'text-delta', textDelta: `\n\n[Error: ${QUOTA_FALLBACK_MESSAGE}]` } as any);
          } else {
            console.error('Streaming error:', streamError);
          }
        }
      },
    });

    return createUIMessageStreamResponse({
      stream: uiMessageStream,
    });
  } catch (error: any) {
    const errorMsg = error?.message || String(error) || '';
    const errorData = error?.data ? JSON.stringify(error.data) : '';
    const isQuotaError = 
      error?.statusCode === 429 || 
      error?.status === 429 ||
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
