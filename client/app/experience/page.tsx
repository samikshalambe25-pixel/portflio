'use client';

import { useState, useEffect } from 'react';
import { Briefcase, Calendar, Building, CheckCircle2, Sparkles, MapPin } from 'lucide-react';
import { experiencesApi } from '../../lib/api';

export default function ExperiencePage() {
  const [experiences, setExperiences] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    experiencesApi.getAll().then(res => {
      if (res?.data) {
        setExperiences(res.data);
      }
      setLoading(false);
    });
  }, []);

  return (
    <div className="py-16 md:py-24">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-600 mb-3">
            <Briefcase className="h-3.5 w-3.5" />
            <span>Career & Roles</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl text-foreground">
            Work Experience
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            My professional journey, key achievements, and responsibilities
          </p>
          <div className="mt-4 mx-auto h-1 w-20 bg-blue-600 rounded-full" />
        </div>

        {/* Timeline Container */}
        <div className="mt-16 relative border-l-2 border-border/80 ml-4 sm:ml-8 md:ml-12 pl-6 sm:pl-8 space-y-12">
          {experiences.map((exp, idx) => (
            <div key={exp._id || idx} className="relative group">
              {/* Timeline circle icon */}
              <div className="absolute -left-[35px] sm:-left-[43px] top-1.5 flex h-9 w-9 items-center justify-center rounded-full border-4 border-background bg-blue-600 text-white shadow-md group-hover:scale-110 transition-transform">
                <Briefcase className="h-4 w-4" />
              </div>

              {/* Experience Card */}
              <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm hover:shadow-md hover:border-blue-500/40 transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/50 pb-4">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                      {exp.role}
                    </h2>
                    <div className="mt-1 flex items-center gap-2 text-sm font-semibold text-blue-600">
                      <Building className="h-4 w-4 shrink-0" />
                      <span>{exp.company}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-600 w-fit">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{exp.period}</span>
                  </div>
                </div>

                {exp.description && (
                  <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
                    {exp.description}
                  </p>
                )}

                {/* Responsibilities */}
                {exp.responsibilities && exp.responsibilities.length > 0 && (
                  <div className="mt-5 space-y-2.5">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                      Key Responsibilities & Impact:
                    </h3>
                    <ul className="space-y-2">
                      {exp.responsibilities.map((resp: string, rIdx: number) => (
                        <li key={rIdx} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                          <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                          <span>{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {experiences.length === 0 && (
          <div className="mt-12 text-center text-muted-foreground">
            <p>Loading experiences...</p>
          </div>
        )}
      </div>
    </div>
  );
}
