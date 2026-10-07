'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './Icons';
import { footerApi, homeApi } from '../lib/api';

export default function Footer() {
  const [currentYear, setCurrentYear] = useState(2026);
  const [footerData, setFooterData] = useState({
    email: 'komalkshirasagar32009@gmail.com',
    phone: '+91-8080211162',
    location: 'Chhatrapati Sambhajinagar, Maharashtra',
    githubUrl: 'https://github.com',
    linkedinUrl: 'https://linkedin.com',
    description: 'MERN Stack Developer with a passion for creating beautiful, responsive web applications.'
  });
  const [name, setName] = useState('Komal Kshirsagar');

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
    footerApi.get().then(res => {
      if (res?.data) {
        setFooterData(prev => ({ ...prev, ...res.data }));
      }
    });
    homeApi.get().then(res => {
      if (res?.data?.hero?.name) {
        setName(res.data.hero.name);
      }
    });
  }, []);

  const firstName = name.split(' ')[0] || 'Portfolio';

  return (
    <footer className="border-t border-border/60 bg-muted/30">
      <div className="container mx-auto max-w-7xl px-4 py-8 sm:py-10 md:px-6 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Brand info */}
          <div>
            <Link href="/" className="flex items-center gap-2 font-bold text-lg sm:text-xl">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {firstName}
              </span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-sm">
              {footerData.description}
            </p>
          </div>

          {/* Contact info */}
          <div>
            <h3 className="text-base font-semibold text-foreground">Contact Info</h3>
            <ul className="mt-3 space-y-2.5 text-sm">
              <li className="flex items-center gap-2.5 text-muted-foreground hover:text-foreground transition-colors">
                <Mail className="h-4 w-4 text-blue-600 shrink-0" />
                <a href={`mailto:${footerData.email}`} className="break-all hover:underline">
                  {footerData.email}
                </a>
              </li>
              <li className="flex items-center gap-2.5 text-muted-foreground hover:text-foreground transition-colors">
                <Phone className="h-4 w-4 text-blue-600 shrink-0" />
                <a href={`tel:${footerData.phone}`} className="hover:underline">
                  {footerData.phone}
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-muted-foreground">
                <MapPin className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                <span>{footerData.location}</span>
              </li>
            </ul>
          </div>

          {/* Social links */}
          <div>
            <h3 className="text-base font-semibold text-foreground">Follow Me</h3>
            <div className="mt-3 flex items-center gap-3">
              <a
                href={footerData.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-border bg-background p-2.5 text-muted-foreground hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all"
                aria-label="GitHub"
              >
                <GithubIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
              <a
                href={footerData.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-border bg-background p-2.5 text-muted-foreground hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all"
                aria-label="LinkedIn"
              >
                <LinkedinIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
              <a
                href={`mailto:${footerData.email}`}
                className="rounded-full border border-border bg-background p-2.5 text-muted-foreground hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all"
                aria-label="Email"
              >
                <Mail className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Built with Next.js, React, Node.js & Express.
            </p>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-8 border-t border-border/60 pt-6 text-center text-xs sm:text-sm text-muted-foreground flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {currentYear} {name}. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs">
            <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
            <span>•</span>
            <Link href="/terms" className="hover:underline">Terms of Service</Link>
            <span>•</span>
            <Link href="/admin" className="text-blue-600 font-medium hover:underline">Admin Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
