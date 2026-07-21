import React from "react";
import { motion } from "framer-motion";
import { SkillCategory } from "../../data/skills";

const CategoryIcon = ({ icon, className = "w-5 h-5" }: { icon?: string; className?: string }) => {
  switch (icon) {
    case "Code":
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      );
    case "Server":
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2" />
        </svg>
      );
    case "PenTool":
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      );
    case "Users":
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      );
    case "Cpu":
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m14-6h2m-2 6h2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
      );
    default:
      return null;
  }
};

export interface SkillsComponentProps {
  categories: SkillCategory[];
}

export default function SkillsComponent({ categories }: SkillsComponentProps) {
  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full flex flex-col gap-8 bg-transparent"
    >
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">Skills & Expertise</h2>
      </div>

      <div className="flex flex-col gap-10">
        {categories.map((category, idx) => (
          <motion.div 
            key={category.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            className="flex flex-col gap-4"
          >
            <div className="flex items-center gap-2 text-lg font-semibold text-[var(--text-primary)]">
              <CategoryIcon icon={category.icon} />
              <h3>{category.title}</h3>
            </div>
            
            <div className="flex flex-wrap gap-2.5">
              {category.skills.map((skill, skillIdx) => (
                <motion.span
                  key={skill}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: (idx * 0.1) + (skillIdx * 0.02) }}
                  className="px-3.5 py-1.5 rounded-lg text-sm font-medium border"
                  style={{
                    backgroundColor: "var(--bg-pill)",
                    color: "var(--text-primary)",
                    borderColor: "var(--border-main)",
                  }}
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
