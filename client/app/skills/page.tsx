'use client';

import { useState, useEffect } from 'react';
import { Search, Sparkles, Filter, CheckCircle2 } from 'lucide-react';
import { skillsApi } from '../../lib/api';

export default function SkillsPage() {
  const [skills, setSkills] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    skillsApi.getAll().then(res => {
      if (res?.data) {
        setSkills(res.data);
      }
      setLoading(false);
    });
  }, []);

  // Extract unique categories or map empty categories to sensible groups
  const categories = ['All', 'Frontend', 'Backend', 'Database', 'Tools', 'DevOps'];

  // Categorize skill if not explicitly categorized
  const getCategory = (skill: any) => {
    if (skill.category && skill.category.trim() !== '') return skill.category;
    const name = (skill.name || '').toLowerCase();
    if (['react', 'next.js', 'html', 'css', 'tailwind css', 'javascript', 'typescript', 'redux', 'shadcn ui', 'material ui'].some(k => name.includes(k))) return 'Frontend';
    if (['node', 'express', 'socket.io', 'rest', 'api', 'jwt'].some(k => name.includes(k))) return 'Backend';
    if (['mongo', 'sql', 'postgres', 'redis', 'database'].some(k => name.includes(k))) return 'Database';
    if (['git', 'github', 'postman', 'swagger', 'cloudinary', 'multer'].some(k => name.includes(k))) return 'Tools';
    if (['docker', 'render', 'vercel', 'aws'].some(k => name.includes(k))) return 'DevOps';
    return 'Tools';
  };

  const filteredSkills = skills.filter(skill => {
    const cat = getCategory(skill);
    const matchesCategory = selectedCategory === 'All' || cat.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="py-16 md:py-24">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-600 mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Tech Stack & Tools</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl text-foreground">
            My Skills
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Technologies, libraries, and frameworks I use to build scalable web applications
          </p>
          <div className="mt-4 mx-auto h-1 w-20 bg-blue-600 rounded-full" />
        </div>

        {/* Filter and Search Bar */}
        <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                type="button"
                className={`rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search skills..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-border bg-background py-2 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>
        </div>

        {/* Skills Grid */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredSkills.map((skill, idx) => {
            const level = skill.level || 80;
            const category = getCategory(skill);

            return (
              <div
                key={skill._id || idx}
                className="group relative rounded-xl border border-border bg-card p-5 shadow-sm hover:border-blue-500/50 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0" />
                    <h3 className="font-bold text-foreground text-base group-hover:text-blue-600 transition-colors">
                      {skill.name}
                    </h3>
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground">
                    {level}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="mt-4 h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-700 ease-out"
                    style={{ width: `${level}%` }}
                  />
                </div>

                <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                  <span className="rounded bg-muted/80 px-2 py-0.5">{category}</span>
                  <span>Proficient</span>
                </div>
              </div>
            );
          })}
        </div>

        {filteredSkills.length === 0 && (
          <div className="mt-16 text-center text-muted-foreground">
            <p className="text-lg">No skills found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
