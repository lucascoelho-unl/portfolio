export interface SkillCategory {
  title: string;
  icon?: string;
  skills: string[];
}

export const skillsData: SkillCategory[] = [
  {
    title: "Frontend Development",
    icon: "Code",
    skills: [
      "HTML",
      "CSS",
      "JavaScript/TypeScript",
      "Tailwind CSS",
      "Bootstrap",
      "Next.js",
      "React",
      "Vercel AI SDK",
      "Gsap",
    ],
  },
  {
    title: "Backend & Systems",
    icon: "Server",
    skills: [
      "Unix",
      "C",
      "C++",
      "Python",
      "Typescript",
      "Git",
      "GitHub",
      "Docker",
      "GCP",
      "PostgreSQL",
    ],
  },
  {
    title: "Design & Creative Tools",
    icon: "PenTool",
    skills: ["Figma", "Davinci Code", "Illustrator", "Canva", "Keynote"],
  },
  {
    title: "Soft Skills",
    icon: "Users",
    skills: [
      "Communication",
      "Problem-Solving",
      "Adaptability",
      "Learning Agility",
      "Teamwork",
      "Creativity",
      "Focus",
    ],
  },
  {
    title: "AI & Fullstack Engineering",
    icon: "Cpu",
    skills: [
      "LLM Providers (ChatGPT, Whisper, Groq, Mistral & Claude)",
      "AI Agents",
      "Prompt engineering",
      "Vector databases (Weaviate, Pinecone)",
      "RAG (Retrieval-Augmented Generation)",
      "Tool routing & calling",
      "Hugging Face Transformers",
      "Vercel AI SDK",
      "Supabase",
      "Prisma",
      "Next.js",
    ],
  },
];
