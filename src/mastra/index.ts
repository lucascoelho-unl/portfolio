import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { LibSQLStore } from '@mastra/libsql';
import { Observability, MastraStorageExporter, MastraPlatformExporter, SensitiveDataFilter } from '@mastra/observability';
import { portfolioAgent } from './agents/portfolio-agent';
import { getPortfolioProjectsTool, showSkillsTool, showCarouselTool } from './tools/portfolio-tools';
import { portfolioInquiryWorkflow } from './workflows/portfolio-workflow';

// Standardize API key lookup across GOOGLE_GENERATIVE_AI_API_KEY, GOOGLE_API_KEY, and GEMINI_API_KEY
if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
  const altKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
  if (altKey) {
    process.env.GOOGLE_GENERATIVE_AI_API_KEY = altKey;
    process.env.GOOGLE_API_KEY = altKey;
  }
}

const isDev = process.env.NODE_ENV === 'development' && !process.env.VERCEL;

export const mastra = new Mastra({
  agents: { portfolioAgent },
  tools: { getPortfolioProjectsTool, showSkillsTool, showCarouselTool },
  workflows: { portfolioInquiryWorkflow },
  storage: new LibSQLStore({
    id: 'mastra-storage',
    url: process.env.TURSO_DATABASE_URL ?? (isDev ? 'file:./mastra.db' : ':memory:'),
    authToken: process.env.TURSO_AUTH_TOKEN,
  }),
  logger: new PinoLogger({
    name: 'Mastra',
    level: 'info',
  }),
  observability: new Observability({
    configs: {
      default: {
        serviceName: 'mastra',
        exporters: [
          new MastraStorageExporter(),
          new MastraPlatformExporter(),
        ],
        spanOutputProcessors: [
          new SensitiveDataFilter(),
        ],
      },
    },
  }),
});
