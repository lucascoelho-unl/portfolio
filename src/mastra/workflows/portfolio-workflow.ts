import { createStep, createWorkflow } from '@mastra/core/workflows';
import { z } from 'zod';

const validateInquiryStep = createStep({
  id: 'validate-inquiry',
  description: 'Validates an incoming project inquiry or message',
  inputSchema: z.object({
    name: z.string(),
    email: z.string().email(),
    message: z.string(),
  }),
  outputSchema: z.object({
    isValid: z.boolean(),
    summary: z.string(),
  }),
  execute: async ({ inputData }) => {
    if (!inputData) {
      throw new Error('No inquiry data provided');
    }
    const isValid = inputData.message.trim().length > 5;
    return {
      isValid,
      summary: `Inquiry from ${inputData.name} (${inputData.email}): ${inputData.message}`,
    };
  },
});

export const portfolioInquiryWorkflow = createWorkflow({
  id: 'portfolio-inquiry-workflow',
  inputSchema: z.object({
    name: z.string(),
    email: z.string().email(),
    message: z.string(),
  }),
  outputSchema: z.object({
    isValid: z.boolean(),
    summary: z.string(),
  }),
})
  .then(validateInquiryStep);

portfolioInquiryWorkflow.commit();
