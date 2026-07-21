import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { skillsData } from '../../data/skills';
import { Project } from '../../types/agent-components';

export const getPortfolioProjectsTool = createTool({
  id: 'get-portfolio-projects',
  description: 'Get list of featured portfolio projects and work experience',
  inputSchema: z.object({
    category: z.string().optional().describe('Optional category filter e.g. web, ai, mobile'),
  }),
  outputSchema: z.object({
    projects: z.array(
      z.object({
        id: z.string(),
        title: z.string(),
        description: z.string(),
        techStack: z.array(z.string()),
        githubUrl: z.string().optional(),
        demoUrl: z.string().optional(),
      })
    ),
  }),
  execute: async ({ category }) => {
    const allProjects: Project[] = [
      {
        id: '1',
        title: 'Generative UI Portfolio',
        description: 'An AI-powered portfolio with dynamic component streaming and interactive agent chat.',
        techStack: ['Next.js', 'React', 'Mastra', 'TailwindCSS'],
        githubUrl: 'https://github.com/example/portfolio',
      },
      {
        id: '2',
        title: 'Agentic Workflow Engine',
        description: 'Automated workflow orchestration system built with Mastra and AI agents.',
        techStack: ['TypeScript', 'Mastra', 'Node.js', 'DuckDB'],
        githubUrl: 'https://github.com/example/agentic-engine',
      },
    ];

    const filtered = category
      ? allProjects.filter((p) =>
          p.techStack.some((t) => t.toLowerCase().includes(category.toLowerCase()))
        )
      : allProjects;

    return { projects: filtered };
  },
});

export const showSkillsTool = createTool({
  id: 'show-skills',
  description: 'Displays the developer\'s skills and expertise broken down by category. Use this tool whenever the user asks about skills, stack, technologies, or expertise.',
  inputSchema: z.object({}),
  outputSchema: z.object({
    categories: z.array(
      z.object({
        title: z.string(),
        icon: z.string().optional(),
        skills: z.array(z.string()),
      })
    ),
  }),
  execute: async () => {
    return { categories: skillsData };
  },
});

export const showCarouselTool = createTool({
  id: 'show-carousel',
  description: 'Displays an interactive 3D photo carousel featuring developer projects, creations, and visual highlights. Use this tool whenever the user asks to see photos, pictures, images, gallery, or visual work.',
  inputSchema: z.object({}),
  outputSchema: z.object({
    title: z.string().optional(),
  }),
  execute: async () => {
    return { title: 'Featured Gallery' };
  },
});
