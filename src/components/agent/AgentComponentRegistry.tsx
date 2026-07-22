import React from 'react';
import SkillsComponent from './SkillsComponent';
import ImageCarousel from './ImageCarousel';
import ProjectsComponent from './ProjectsComponent';
import { Project, AgentDynamicToolPart } from '../../types/agent-components';
import { SkillCategory, skillsData } from '../../data/skills';

interface AgentComponentRegistryProps {
  part: AgentDynamicToolPart;
}

const defaultProjects: Project[] = [
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

export default function AgentComponentRegistry({ part }: AgentComponentRegistryProps) {
  const dynamicPart = part as unknown as Record<string, unknown>;
  const toolInvocation = dynamicPart.toolInvocation as Record<string, unknown> | undefined;

  const rawToolName =
    (dynamicPart.toolName as string) ||
    (toolInvocation?.toolName as string) ||
    (typeof dynamicPart.type === 'string' && dynamicPart.type.startsWith('tool-')
      ? dynamicPart.type.replace(/^tool-/, '')
      : '');

  const toolName = rawToolName.toLowerCase();
  const toolCallId =
    (dynamicPart.toolCallId as string) ||
    (toolInvocation?.toolCallId as string) ||
    (dynamicPart.id as string) ||
    'tool-call';

  const output = (dynamicPart.output || toolInvocation?.result || dynamicPart.result || {}) as Record<string, unknown>;

  console.log('[REGISTRY PART IN]', dynamicPart, 'parsed toolName:', toolName);

  if (toolName.includes('skill')) {
    const categories = ((output?.categories as SkillCategory[]) && (output.categories as SkillCategory[]).length > 0)
      ? (output.categories as SkillCategory[])
      : skillsData;
    return (
      <div key={toolCallId} className="mt-4 w-full">
        <SkillsComponent categories={categories} />
      </div>
    );
  }

  if (toolName.includes('carousel') || toolName.includes('photo') || toolName.includes('gallery')) {
    return (
      <div key={toolCallId} className="mt-4 w-full">
        <ImageCarousel />
      </div>
    );
  }

  if (toolName.includes('project')) {
    const projects = ((output?.projects as Project[]) && (output.projects as Project[]).length > 0)
      ? (output.projects as Project[])
      : defaultProjects;
    return (
      <div key={toolCallId} className="mt-4 w-full">
        <ProjectsComponent projects={projects} />
      </div>
    );
  }

  return null;
}
