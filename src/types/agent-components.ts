import { SkillCategory } from '../data/skills';

export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  githubUrl?: string;
  demoUrl?: string;
}

export interface ShowSkillsOutput {
  categories: SkillCategory[];
}

export interface ShowCarouselOutput {
  title?: string;
}

export interface GetProjectsOutput {
  projects: Project[];
}

export interface AgentDynamicToolPart {
  type: string;
  toolName?: string;
  toolCallId?: string;
  state?: string;
  output?: Record<string, unknown>;
}
