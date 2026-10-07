'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Calendar,
  MapPin,
  Mail,
  Phone,
  Languages,
  Award,
  FolderGit2,
  Layers,
  Users,
  Download,
  ArrowRight
} from 'lucide-react';
import { aboutApi, statsApi, homeApi } from '../../lib/api';

export default function AboutPage() {
  const [aboutData, setAboutData] = useState<any>({
    name: 'Komal Kshirsagar',
    title: 'MERN Stack Developer',
    bio: {
      introduction:
        "I'm Komal Kshirsagar, a MERN Stack Developer based in Chhatrapati Sambhajinagar, Maharashtra. With a strong foundation in web development, I specialize in creating responsive and user-friendly web applications.",
      journey:
        "My journey in web development began during my MCA studies where I developed a passion for creating elegant solutions to complex problems. Since then, I've worked on various projects ranging from e-commerce platforms to real-time communication applications.",
      current:
        "Currently working at Matic UI, I've had the opportunity to work on cutting-edge projects including a Medical Diagnostic App and a SaaS Property Management Platform. I enjoy collaborating with teams and clients to deliver high-quality products that exceed expectations."
    },
    personalInfo: {
      dateOfBirth: '17 March',
      location: 'Chhatrapati Sambhajinagar, Maharashtra',
      email: 'komalkshirasagar32009@gmail.com',
      phone: '+91-8080211162',
      languages: ['English', 'Hindi', 'Marathi']
    }
  });

  const [stats, setStats] = useState({
    yearsExperience: '2+',
    projectsCompleted: '16+',
    technologies: '15+',
    happyClients: '5+'
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAbout() {
      try {
        const [aboutRes, statsRes] = await Promise.all([aboutApi.get(), statsApi.get()]);
        if (aboutRes?.data) setAboutData(aboutRes.data);
        if (statsRes?.data) setStats(statsRes.data);
      } catch (err) {
        console.error('Error fetching about data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAbout();
  }, []);

  const pInfo = aboutData.personalInfo || {};

  return (
    <div className="py-16 md:py-24">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl text-foreground">
            About Me
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Get to know my journey, skills, and background
          </p>
          <div className="mt-4 mx-auto h-1 w-20 bg-blue-600 rounded-full" />
        </div>

        {/* Main Grid */}
        <div className="mt-14 grid gap-12 lg:grid-cols-12 items-start">
          {/* Left Column: Image & Personal info card (5 cols) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-sm">
              <div className="aspect-square w-full overflow-hidden rounded-xl bg-muted relative">
                <img
                  src={aboutData.profileImage || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReVqJ3jDZixw_H1mSqaDAWeZG_f-QFpz3WHlGeDF113Q&s"}
                  alt={aboutData.name}
                  className="h-full w-full object-cover object-center"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/profile.jpg';
                  }}
                />
              </div>

              <div className="mt-4 text-center">
                <h2 className="text-xl font-bold text-foreground">{aboutData.name}</h2>
                <p className="text-sm font-medium text-blue-600">{aboutData.title}</p>
              </div>
            </div>

            {/* Personal Details Card */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h3 className="text-lg font-bold text-foreground mb-4">Personal Information</h3>
              <ul className="space-y-4 text-sm">
                <li className="flex items-center gap-3 text-muted-foreground">
                  <Calendar className="h-4 w-4 text-blue-600 shrink-0" />
                  <span className="font-medium text-foreground">Date of Birth:</span>
                  <span>{pInfo.dateOfBirth || '17 March'}</span>
                </li>
                <li className="flex items-center gap-3 text-muted-foreground">
                  <MapPin className="h-4 w-4 text-blue-600 shrink-0" />
                  <span className="font-medium text-foreground">Location:</span>
                  <span>{pInfo.location || 'Chhatrapati Sambhajinagar, Maharashtra'}</span>
                </li>
                <li className="flex items-center gap-3 text-muted-foreground">
                  <Mail className="h-4 w-4 text-blue-600 shrink-0" />
                  <span className="font-medium text-foreground">Email:</span>
                  <a
                    href={`mailto:${pInfo.email || 'komalkshirasagar32009@gmail.com'}`}
                    className="hover:text-blue-600 hover:underline break-all"
                  >
                    {pInfo.email || 'komalkshirasagar32009@gmail.com'}
                  </a>
                </li>
                <li className="flex items-center gap-3 text-muted-foreground">
                  <Phone className="h-4 w-4 text-blue-600 shrink-0" />
                  <span className="font-medium text-foreground">Phone:</span>
                  <a
                    href={`tel:${pInfo.phone || '+91-8080211162'}`}
                    className="hover:text-blue-600 hover:underline"
                  >
                    {pInfo.phone || '+91-8080211162'}
                  </a>
                </li>
                <li className="flex items-start gap-3 text-muted-foreground">
                  <Languages className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                  <span className="font-medium text-foreground">Languages:</span>
                  <span>
                    {Array.isArray(pInfo.languages)
                      ? pInfo.languages.join(', ')
                      : 'English, Hindi, Marathi'}
                  </span>
                </li>
              </ul>

              <div className="mt-6 pt-4 border-t border-border/50">
                <a
                  href="/resume.pdf"
                  download
                  className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span>Download Resume</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Bio stories and Stats (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm">
              <h3 className="text-2xl font-bold tracking-tight text-foreground">Who am I?</h3>
              <p className="mt-4 text-base sm:text-lg leading-relaxed text-muted-foreground">
                {aboutData.bio?.introduction}
              </p>

              <h4 className="mt-6 text-xl font-bold text-foreground">My Journey</h4>
              <p className="mt-3 text-base sm:text-lg leading-relaxed text-muted-foreground">
                {aboutData.bio?.journey}
              </p>

              <h4 className="mt-6 text-xl font-bold text-foreground">Current Endeavors</h4>
              <p className="mt-3 text-base sm:text-lg leading-relaxed text-muted-foreground">
                {aboutData.bio?.current}
              </p>

              <div className="mt-8 flex items-center gap-4">
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
                >
                  <span>Explore My Projects</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
                >
                  <span>Contact Me</span>
                </Link>
              </div>
            </div>

            {/* Stats Highlight Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card p-5 text-center shadow-sm">
                <Award className="h-6 w-6 text-blue-600 mb-1" />
                <span className="text-2xl sm:text-3xl font-extrabold text-blue-600">
                  {stats.yearsExperience}
                </span>
                <span className="mt-1 text-xs text-muted-foreground">Years Experience</span>
              </div>
              <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card p-5 text-center shadow-sm">
                <FolderGit2 className="h-6 w-6 text-blue-600 mb-1" />
                <span className="text-2xl sm:text-3xl font-extrabold text-blue-600">
                  {stats.projectsCompleted}
                </span>
                <span className="mt-1 text-xs text-muted-foreground">Projects Done</span>
              </div>
              <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card p-5 text-center shadow-sm">
                <Layers className="h-6 w-6 text-blue-600 mb-1" />
                <span className="text-2xl sm:text-3xl font-extrabold text-blue-600">
                  {stats.technologies}
                </span>
                <span className="mt-1 text-xs text-muted-foreground">Technologies</span>
              </div>
              <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card p-5 text-center shadow-sm">
                <Users className="h-6 w-6 text-blue-600 mb-1" />
                <span className="text-2xl sm:text-3xl font-extrabold text-blue-600">
                  {stats.happyClients}
                </span>
                <span className="mt-1 text-xs text-muted-foreground">Happy Clients</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
