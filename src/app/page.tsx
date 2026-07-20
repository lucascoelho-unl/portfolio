export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  tags: string[];
  link?: string;
}

const TEMPLATE_PROJECTS: ProjectItem[] = [
  {
    id: "1",
    title: "Generative UI Portfolio",
    description: "An interactive portfolio application featuring streaming AI components and real-time agent responses.",
    tags: ["Next.js", "React", "Mastra", "TailwindCSS"],
    link: "#",
  },
  {
    id: "2",
    title: "Agentic Workflow Orchestrator",
    description: "Automated multi-agent workflow runner leveraging LLMs for structured task execution.",
    tags: ["TypeScript", "Mastra", "DuckDB", "Node.js"],
    link: "#",
  },
  {
    id: "3",
    title: "Interactive Data Platform",
    description: "Real-time analytics dashboard with dynamic data visualizations and responsive UI.",
    tags: ["Next.js", "TailwindCSS", "TypeScript"],
    link: "#",
  },
];

const TEMPLATE_SKILLS = [
  "TypeScript",
  "React / Next.js",
  "Tailwind CSS",
  "Node.js",
  "Mastra AI",
  "Generative UI",
  "REST / GraphQL",
  "PostgreSQL / SQL",
];

export default function Home() {
  return (
    <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-12 flex flex-col gap-16">
      {/* Hero Section Template */}
      <section className="flex flex-col items-start gap-4 py-8 border-b border-zinc-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
          Available for new opportunities
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
          Developer Portfolio & AI Agent Hub
        </h1>
        <p className="text-lg text-zinc-400 max-w-2xl">
          Welcome to my portfolio! Built with Next.js App Router and Mastra AI engine. 
          Explore projects, view technical skills, or interact with the embedded AI assistant.
        </p>
        <div className="flex gap-4 pt-2">
          <a
            href="#projects"
            className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors text-sm"
          >
            View Projects
          </a>
          <a
            href="#contact"
            className="px-5 py-2.5 rounded-lg border border-zinc-700 hover:bg-zinc-800 text-zinc-300 font-medium transition-colors text-sm"
          >
            Contact Me
          </a>
        </div>
      </section>

      {/* Featured Projects Section Template */}
      <section id="projects" className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-semibold text-white">Featured Projects</h2>
          <p className="text-sm text-zinc-400">
            A selection of recent work and technical experiments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TEMPLATE_PROJECTS.map((project) => (
            <div
              key={project.id}
              className="flex flex-col justify-between p-6 rounded-xl bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 transition-all group"
            >
              <div className="flex flex-col gap-3">
                <h3 className="text-lg font-medium text-white group-hover:text-indigo-400 transition-colors">
                  {project.title}
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {project.description}
                </p>
              </div>

              <div className="mt-6 flex flex-wrap gap-1.5">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-0.5 rounded text-xs font-mono bg-zinc-800 text-zinc-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Skills & Technologies Section Template */}
      <section className="flex flex-col gap-6 py-6 border-t border-zinc-800">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-semibold text-white">Tech Stack & Skills</h2>
          <p className="text-sm text-zinc-400">
            Core technologies and tools used across my projects.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {TEMPLATE_SKILLS.map((skill) => (
            <span
              key={skill}
              className="px-3.5 py-1.5 rounded-lg text-sm bg-zinc-900 border border-zinc-800 text-zinc-200"
            >
              {skill}
            </span>
          ))}
        </div>
      </section>

      {/* Contact Section Template */}
      <section id="contact" className="flex flex-col gap-4 py-8 border-t border-zinc-800">
        <h2 className="text-2xl font-semibold text-white">Get in Touch</h2>
        <p className="text-sm text-zinc-400 max-w-xl">
          Interested in collaborating or discussing a project? Feel free to reach out.
        </p>
        <div className="flex gap-4 pt-2">
          <a
            href="mailto:contact@example.com"
            className="px-5 py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium transition-colors text-sm"
          >
            Send Email
          </a>
        </div>
      </section>
    </main>
  );
}
