'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Download,
  Code2,
  ExternalLink,
  ChevronDown,
  Layers,
  Sparkles,
  Award,
  Users,
  FolderGit2
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../components/Icons';
import { homeApi, statsApi, projectsApi, skillsApi, footerApi } from '../lib/api';
import ProjectCard from '../components/ProjectCard';

export default function HomePage() {
  const [homeData, setHomeData] = useState<any>({
    hero: {
      name: 'Komal Kshirsagar',
      title: 'MERN Stack Developer',
      subtitle: 'Crafting Scalable Web & Mobile Applications.'
    },
    about: {
      title: 'About Me',
      subtitle: 'Get to know me better',
      description1:
        "I'm a MERN Stack Developer with a passion for building modern, responsive web applications. With expertise in JavaScript, React, Node.js, and related technologies, I create intuitive and visually appealing user interfaces.",
      description2:
        "Currently working at Matic UI, I've contributed to various projects including a Medical Diagnostic App and a SaaS Property Management Platform.",
      currentCompany: 'Matic UI'
    },
    projects: {
      title: 'Featured Projects',
      subtitle: 'Some of my recent work'
    },
    skills: {
      title: 'My Skills',
      subtitle: 'Technologies I work with'
    },
    contact: {
      title: 'Ready to Work Together?',
      subtitle: "Let's discuss your project and see how I can help bring your ideas to life."
    }
  });

  const [stats, setStats] = useState({
    yearsExperience: '2+',
    projectsCompleted: '16+',
    technologies: '15+',
    happyClients: '5+'
  });

  const [featuredProjects, setFeaturedProjects] = useState<any[]>([]);
  const [previewSkills, setPreviewSkills] = useState<any[]>([]);
  const [footer, setFooter] = useState<any>({
    githubUrl: 'https://github.com/17komalkshirsagar',
    linkedinUrl: 'https://www.linkedin.com/in/komal-kshirsagar-5976a127b'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [homeRes, statsRes, projRes, skillsRes, footerRes] = await Promise.all([
          homeApi.get(),
          statsApi.get(),
          projectsApi.getAll(),
          skillsApi.getAll(),
          footerApi.get()
        ]);

        if (homeRes?.data) setHomeData(homeRes.data);
        if (statsRes?.data) setStats(statsRes.data);
        if (projRes?.data) {
          // Select featured projects or top 2
          const list = projRes.data;
          const feat = list.filter((p: any) => p.featured);
          setFeaturedProjects(feat.length > 0 ? feat.slice(0, 4) : list.slice(0, 4));
        }
        if (skillsRes?.data) {
          setPreviewSkills(skillsRes.data.slice(0, 10));
        }
        if (footerRes?.data) setFooter(footerRes.data);
      } catch (err) {
        console.error('Failed to load portfolio data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const heroName = homeData.hero?.name || 'Komal Kshirsagar';
  const heroSubtitle =
    homeData.hero?.subtitle || 'MERN Stack Developer crafting beautiful web experiences';

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative pb-16 pt-20 md:pt-28 md:pb-24">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 md:grid-cols-2 md:gap-16 items-center">
            {/* Left Column: Intro */}
            <div className="animate-fade-in flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400 w-fit mb-4">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Available for new opportunities</span>
              </div>

              <h1 className="text-3xl sm:text-5xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                <span className="block text-foreground">Hi, I&apos;m</span>
                <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mt-1">
                  {heroName}
                </span>
              </h1>

              <p className="mt-4 text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-xl">
                {heroSubtitle}
              </p>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 hover:bg-blue-700 transition-all hover:gap-3"
                >
                  <span>Get in Touch</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <a
                  href="/resume.pdf"
                  download
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground hover:bg-muted transition-colors shadow-sm"
                  onClick={(e) => {
                    // Friendly note if file isn't physically placed
                    if (!e.currentTarget.href.endsWith('.pdf')) {
                      e.preventDefault();
                      alert('Download CV clicked. You can upload your PDF in the Admin Panel!');
                    }
                  }}
                >
                  <Download className="h-4 w-4 text-blue-600" />
                  <span>Download CV</span>
                </a>
              </div>

              {/* Social Links */}
              <div className="mt-8 flex items-center gap-4">
                <a
                  href={footer.githubUrl || 'https://github.com/17komalkshirsagar'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-muted p-2.5 text-muted-foreground hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                  aria-label="GitHub"
                >
                  <GithubIcon className="h-5 w-5" />
                </a>
                <a
                  href={footer.linkedinUrl || 'https://www.linkedin.com/in/komal-kshirsagar-5976a127b'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-muted p-2.5 text-muted-foreground hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                  aria-label="LinkedIn"
                >
                  <LinkedinIcon className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Right Column: Hero Image Avatar */}
            <div className="relative flex justify-center order-first md:order-last">
              <div className="relative">
                {/* Glow ring */}
                <div className="absolute -inset-2 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 opacity-20 blur-xl"></div>

                <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 overflow-hidden rounded-full border-4 sm:border-8 border-background shadow-2xl bg-muted">
                  <img
                    src={homeData.hero?.avatarUrl && !homeData.hero?.avatarUrl.includes('encrypted-tbn0') ? homeData.hero?.avatarUrl : '/profile.jpg'}
                    alt={heroName}
                    className="h-full w-full object-cover object-center"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/profile.jpg';
                    }}
                  />
                </div>

                {/* Floating badge */}
                <div className="absolute -bottom-2 -right-2 sm:bottom-0 sm:right-0 rounded-full bg-background p-2.5 shadow-xl border border-border">
                  <div className="rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 p-3 text-white shadow-md">
                    <Code2 className="h-6 w-6" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Me Section Preview */}
      <section className="py-16 md:py-24 bg-muted/40 border-y border-border/40">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {homeData.about?.title || 'About Me'}
            </h2>
            <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
              {homeData.about?.subtitle || 'Get to know me better'}
            </p>
            <div className="mt-3 mx-auto h-1 w-20 bg-blue-600 rounded-full" />
          </div>

          <div className="mt-12 grid gap-10 md:grid-cols-2 md:gap-12 items-center">
            <div>
              <p className="text-base sm:text-lg leading-relaxed text-foreground">
                {homeData.about?.description1 ||
                  "I'm a MERN Stack Developer with a passion for building modern, responsive web applications. With expertise in JavaScript, React, Node.js, and related technologies, I create intuitive and visually appealing user interfaces."}
              </p>
              <p className="mt-4 text-base sm:text-lg leading-relaxed text-muted-foreground">
                {homeData.about?.description2 ||
                  "Currently working at Matic UI, I've contributed to various projects including a Medical Diagnostic App and a SaaS Property Management Platform."}
              </p>
              <div className="mt-6">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
                >
                  <span>More About Me</span>
                  <ArrowRight className="h-4 w-4 text-blue-600" />
                </Link>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-all">
                <Award className="h-6 w-6 text-blue-600 mb-2" />
                <span className="text-3xl font-extrabold text-blue-600">{stats.yearsExperience}</span>
                <span className="mt-1 text-xs sm:text-sm font-medium text-muted-foreground text-center">
                  Years Experience
                </span>
              </div>
              <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-all">
                <FolderGit2 className="h-6 w-6 text-blue-600 mb-2" />
                <span className="text-3xl font-extrabold text-blue-600">{stats.projectsCompleted}</span>
                <span className="mt-1 text-xs sm:text-sm font-medium text-muted-foreground text-center">
                  Projects Completed
                </span>
              </div>
              <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-all">
                <Layers className="h-6 w-6 text-blue-600 mb-2" />
                <span className="text-3xl font-extrabold text-blue-600">{stats.technologies}</span>
                <span className="mt-1 text-xs sm:text-sm font-medium text-muted-foreground text-center">
                  Technologies
                </span>
              </div>
              <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-all">
                <Users className="h-6 w-6 text-blue-600 mb-2" />
                <span className="text-3xl font-extrabold text-blue-600">{stats.happyClients}</span>
                <span className="mt-1 text-xs sm:text-sm font-medium text-muted-foreground text-center">
                  Happy Clients
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {homeData.projects?.title || 'Featured Projects'}
            </h2>
            <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
              {homeData.projects?.subtitle || 'Some of my recent work'}
            </p>
            <div className="mt-3 mx-auto h-1 w-20 bg-blue-600 rounded-full" />
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {featuredProjects.map((project, idx) => (
              <ProjectCard key={project._id || idx} project={project} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-blue-700 transition-colors"
            >
              <span>View All Projects</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* My Skills Preview Section */}
      <section className="py-16 md:py-24 bg-muted/40 border-y border-border/40">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {homeData.skills?.title || 'My Skills'}
            </h2>
            <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
              {homeData.skills?.subtitle || 'Technologies I work with'}
            </p>
            <div className="mt-3 mx-auto h-1 w-20 bg-blue-600 rounded-full" />
          </div>

          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {previewSkills.map((skill, idx) => (
              <div
                key={skill._id || idx}
                className="flex h-24 flex-col items-center justify-center rounded-xl border border-border bg-card p-4 shadow-sm hover:border-blue-500/50 hover:shadow-md transition-all text-center"
              >
                <span className="font-semibold text-sm sm:text-base text-foreground">
                  {skill.name}
                </span>
                {skill.level && (
                  <span className="mt-1 text-xs text-blue-600 dark:text-blue-400 font-medium">
                    {skill.level}% proficiency
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/skills"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-6 py-2.5 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
            >
              <span>View All Skills</span>
              <ArrowRight className="h-4 w-4 text-blue-600" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Banner Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 sm:p-12 text-white text-center shadow-xl">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
              {homeData.contact?.title || 'Ready to Work Together?'}
            </h2>
            <p className="mt-4 text-base sm:text-lg opacity-90 max-w-xl mx-auto">
              {homeData.contact?.subtitle ||
                "Let's discuss your project and see how I can help bring your ideas to life."}
            </p>
            <div className="mt-8">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-lg bg-white px-7 py-3.5 text-sm font-bold text-blue-600 shadow-md hover:bg-zinc-100 transition-colors"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
