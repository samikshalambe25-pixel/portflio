'use client';

import { useState, useEffect } from 'react';
import { Search, FolderGit2, Sparkles, Filter } from 'lucide-react';
import { projectsApi } from '../../lib/api';
import ProjectCard from '../../components/ProjectCard';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    projectsApi.getAll().then(res => {
      if (res?.data) {
        setProjects(res.data);
      }
      setLoading(false);
    });
  }, []);

  const categories = [
    { label: 'All Projects', value: 'all' },
    { label: 'Web Applications', value: 'web' },
    { label: 'Full Stack', value: 'fullstack' },
    { label: 'Frontend', value: 'frontend' }
  ];

  const filteredProjects = projects.filter(project => {
    const cat = (project.category || 'web').toLowerCase();
    const matchesCategory =
      selectedCategory === 'all' ||
      cat === selectedCategory.toLowerCase() ||
      (selectedCategory === 'fullstack' && cat.includes('full'));

    const searchTarget = (
      project.title +
      ' ' +
      project.description +
      ' ' +
      (project.technologies?.join(' ') || '')
    ).toLowerCase();

    const matchesSearch = searchTarget.includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="py-16 md:py-24">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-600 mb-3">
            <FolderGit2 className="h-3.5 w-3.5" />
            <span>Showcase & Case Studies</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl text-foreground">
            Featured Projects
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Explore live production apps, full stack systems, and open source contributions
          </p>
          <div className="mt-4 mx-auto h-1 w-20 bg-blue-600 rounded-full" />
        </div>

        {/* Filters and Search Bar */}
        <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map(cat => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                type="button"
                className={`rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition-all ${
                  selectedCategory === cat.value
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by title, technology..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-border bg-background py-2 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>
        </div>

        {/* Project Cards Grid */}
        <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-2">
          {filteredProjects.map((project, idx) => (
            <ProjectCard key={project._id || idx} project={project} />
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="mt-16 text-center text-muted-foreground py-12 rounded-xl border border-dashed border-border">
            <p className="text-lg font-medium">No projects found matching your criteria.</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="mt-3 text-sm text-blue-600 hover:underline"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
