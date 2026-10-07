'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Shield, ExternalLink } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { homeApi } from '../lib/api';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [brandName, setBrandName] = useState('Komal');

  useEffect(() => {
    homeApi.get().then(res => {
      if (res?.data?.hero?.name) {
        const firstName = res.data.hero.name.split(' ')[0];
        setBrandName(firstName);
      }
    });
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Skills', href: '/skills' },
    { name: 'Projects', href: '/projects' },
    { name: 'Experience', href: '/experience' },
    { name: 'Contact', href: '/contact' }
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md transition-all duration-300">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl md:text-2xl tracking-tight">
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            {brandName}
          </span>
          <span className="inline-block h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map(link => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`relative text-sm font-medium transition-colors hover:text-blue-600 ${
                  isActive ? 'text-blue-600 font-semibold' : 'text-muted-foreground'
                }`}
              >
                {link.name}
                {isActive && (
                  <span className="absolute -bottom-1.5 left-0 h-0.5 w-full bg-blue-600 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Actions (Theme & Admin link) */}
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 transition-all"
            title="Admin Management Panel"
          >
            <Shield className="h-3.5 w-3.5" />
            <span>Admin</span>
          </Link>

          <ThemeToggle />

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex md:hidden items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Toggle menu"
            type="button"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-background/95 px-4 pt-2 pb-6 space-y-3 backdrop-blur-lg">
          {navLinks.map(link => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-600/10 text-blue-600 font-semibold'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          <div className="pt-2 border-t border-border/50">
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-blue-600 bg-blue-500/10"
            >
              <Shield className="h-4 w-4" />
              <span>Admin Control Center</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
