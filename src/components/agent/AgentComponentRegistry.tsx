import React from 'react';
import SkillsComponent from './SkillsComponent';
import ImageCarousel from './ImageCarousel';
import ProjectsComponent from './ProjectsComponent';
import { Project, AgentDynamicToolPart } from '../../types/agent-components';
import { SkillCategory } from '../../data/skills';

interface AgentComponentRegistryProps {
  part: AgentDynamicToolPart;
}

export default function AgentComponentRegistry({ part }: AgentComponentRegistryProps) {
  const toolName = part.toolName || (part.type.startsWith('tool-') ? part.type.replace('tool-', '') : '');

  switch (toolName) {
    case 'show-skills':
    case 'skills': {
      const categories = (part.output as { categories?: SkillCategory[] })?.categories || [];
      return (
        <div key={part.toolCallId} className="mt-4 w-full">
          <SkillsComponent categories={categories} />
        </div>
      );
    }

    case 'show-carousel':
    case 'carousel': {
      return (
        <div key={part.toolCallId} className="mt-4 w-full">
          <ImageCarousel />
        </div>
      );
    }

    case 'get-portfolio-projects':
    case 'projects': {
      const projects = (part.output as { projects?: Project[] })?.projects || [];
      return (
        <div key={part.toolCallId} className="mt-4 w-full">
          <ProjectsComponent projects={projects} />
        </div>
      );
    }

    default:
      return null;
  }
}
