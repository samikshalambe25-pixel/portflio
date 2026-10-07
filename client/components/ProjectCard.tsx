'use client';

import { ExternalLink, Layers } from 'lucide-react';
import { GithubIcon } from './Icons';

interface ProjectProps {
  project: {
    _id?: string;
    id?: number;
    title: string;
    description: string;
    image?: string;
    category?: string;
    technologies?: string[];
    liveUrl?: string;
    githubUrl?: string;
    featured?: boolean;
  };
}

export default function ProjectCard({ project }: ProjectProps) {
  const defaultImage =
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop';

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm hover:shadow-lg transition-all duration-300">
      {/* Project Image */}
      <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-muted">
        <img
          src={project.image || defaultImage}
          alt={project.title}
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = defaultImage;
          }}
        />
        {project.category && (
          <span className="absolute top-3 right-3 rounded-full bg-background/90 backdrop-blur-md px-3 py-1 text-xs font-semibold uppercase tracking-wider text-foreground shadow-sm">
            {project.category}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-xl font-bold tracking-tight text-foreground group-hover:text-blue-600 transition-colors">
          {project.title}
        </h3>

        <p className="mt-2.5 text-sm text-muted-foreground line-clamp-3 leading-relaxed">
          {project.description}
        </p>

        {/* Tech Stack Badges */}
        {project.technologies && project.technologies.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.technologies.slice(0, 8).map((tech, idx) => (
              <span
                key={idx}
                className="inline-flex items-center rounded-md bg-blue-500/10 px-2.5 py-1 text-xs font-medium text-blue-600 dark:text-blue-400"
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 8 && (
              <span className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                +{project.technologies.length - 8} more
              </span>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 pt-4 border-t border-border/50 flex items-center gap-3 mt-auto">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
            >
              <span>Live Demo</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-border bg-background px-4 py-2 text-xs sm:text-sm font-semibold text-foreground hover:bg-muted transition-colors"
              title="View Source on GitHub"
            >
              <GithubIcon className="h-4 w-4" />
              <span>GitHub</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
