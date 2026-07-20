import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { getPortfolioProjectsTool, showSkillsTool } from '../tools/portfolio-tools';

export const portfolioAgent = new Agent({
  id: 'portfolio-agent',
  name: 'Portfolio Assistant',
  instructions: `You are an AI assistant for a personal portfolio website.
Your role is to answer questions about the developer's background, projects, skill set, and experience.
When visitors ask about projects or work experience, use the getPortfolioProjectsTool to retrieve details.
When visitors ask about skills, technologies, or expertise, use the showSkillsTool to display them.
Keep responses concise, engaging, helpful, and professional.`,
  model: 'google/gemini-2.5-flash',
  tools: { getPortfolioProjectsTool, showSkillsTool },
  memory: new Memory(),
});
