'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Shield,
  LayoutDashboard,
  FolderGit2,
  Cpu,
  Briefcase,
  Mail,
  User,
  Sliders,
  LogOut,
  Plus,
  Trash2,
  Edit,
  ExternalLink,
  Save,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  X,
  Eye,
  Check,
  Award
} from 'lucide-react';
import {
  authApi,
  homeApi,
  aboutApi,
  statsApi,
  projectsApi,
  skillsApi,
  experiencesApi,
  contactApi,
  footerApi,
  resetApi
} from '../../lib/api';

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  // Data states
  const [homeData, setHomeData] = useState<any>({});
  const [aboutData, setAboutData] = useState<any>({});
  const [statsData, setStatsData] = useState<any>({});
  const [projects, setProjects] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [footerData, setFooterData] = useState<any>({});

  // Modal states for Project
  const [projectModal, setProjectModal] = useState<{ open: boolean; mode: 'add' | 'edit'; data: any }>({
    open: false,
    mode: 'add',
    data: {}
  });

  // Modal states for Skill
  const [skillModal, setSkillModal] = useState<{ open: boolean; mode: 'add' | 'edit'; data: any }>({
    open: false,
    mode: 'add',
    data: {}
  });

  // Modal states for Experience
  const [expModal, setExpModal] = useState<{ open: boolean; mode: 'add' | 'edit'; data: any }>({
    open: false,
    mode: 'add',
    data: {}
  });

  // Check authentication
  useEffect(() => {
    if (!authApi.isAuthenticated()) {
      router.push('/login');
    } else {
      setIsAuthenticated(true);
      fetchAllData();
    }
  }, []);

  const notify = (type: 'success' | 'error', msg: string) => {
    setFeedback({ type, msg });
    setTimeout(() => setFeedback(null), 3500);
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [h, a, st, p, sk, e, c, f] = await Promise.all([
        homeApi.get(),
        aboutApi.get(),
        statsApi.get(),
        projectsApi.getAll(),
        skillsApi.getAll(),
        experiencesApi.getAll(),
        contactApi.getAll(),
        footerApi.get()
      ]);

      if (h?.data) setHomeData(h.data);
      if (a?.data) setAboutData(a.data);
      if (st?.data) setStatsData(st.data);
      if (p?.data) setProjects(p.data);
      if (sk?.data) setSkills(sk.data);
      if (e?.data) setExperiences(e.data);
      if (c?.data) setContacts(c.data);
      if (f?.data) setFooterData(f.data);
    } catch (err) {
      notify('error', 'Error loading administrative data.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authApi.logout();
    router.push('/login');
  };

  const handleResetDatabase = async () => {
    if (confirm('Are you sure you want to reset all portfolio data back to the default seed?')) {
      const res = await resetApi.resetAll();
      if (res.success) {
        notify('success', 'Database reset to default seed!');
        fetchAllData();
      } else {
        notify('error', 'Failed to reset database.');
      }
    }
  };

  // ---------------- Projects Handlers ----------------
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    const pData = projectModal.data;
    try {
      if (projectModal.mode === 'add') {
        const res = await projectsApi.create(pData);
        if (res.success) {
          notify('success', 'Project created successfully!');
          setProjectModal({ open: false, mode: 'add', data: {} });
          fetchAllData();
        } else notify('error', res.message || 'Creation failed');
      } else {
        const res = await projectsApi.update(pData._id, pData);
        if (res.success) {
          notify('success', 'Project updated successfully!');
          setProjectModal({ open: false, mode: 'add', data: {} });
          fetchAllData();
        } else notify('error', res.message || 'Update failed');
      }
    } catch (err) {
      notify('error', 'Network error.');
    }
  };

  const handleDeleteProject = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete project: "${title}"?`)) {
      const res = await projectsApi.delete(id);
      if (res.success) {
        notify('success', 'Project deleted!');
        setProjects(prev => prev.filter(p => p._id !== id));
      } else notify('error', 'Delete failed');
    }
  };

  // ---------------- Skills Handlers ----------------
  const handleSaveSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    const sData = skillModal.data;
    try {
      if (skillModal.mode === 'add') {
        const res = await skillsApi.create(sData);
        if (res.success) {
          notify('success', 'Skill added!');
          setSkillModal({ open: false, mode: 'add', data: {} });
          fetchAllData();
        } else notify('error', res.message || 'Failed to add');
      } else {
        const res = await skillsApi.update(sData._id, sData);
        if (res.success) {
          notify('success', 'Skill updated!');
          setSkillModal({ open: false, mode: 'add', data: {} });
          fetchAllData();
        } else notify('error', res.message || 'Failed to update');
      }
    } catch (err) {
      notify('error', 'Network error.');
    }
  };

  const handleDeleteSkill = async (id: string, name: string) => {
    if (confirm(`Delete skill: "${name}"?`)) {
      const res = await skillsApi.delete(id);
      if (res.success) {
        notify('success', 'Skill removed!');
        setSkills(prev => prev.filter(s => s._id !== id));
      } else notify('error', 'Delete failed');
    }
  };

  // ---------------- Experience Handlers ----------------
  const handleSaveExp = async (e: React.FormEvent) => {
    e.preventDefault();
    const eData = expModal.data;
    try {
      if (expModal.mode === 'add') {
        const res = await experiencesApi.create(eData);
        if (res.success) {
          notify('success', 'Experience record created!');
          setExpModal({ open: false, mode: 'add', data: {} });
          fetchAllData();
        } else notify('error', res.message || 'Failed to create');
      } else {
        const res = await experiencesApi.update(eData._id, eData);
        if (res.success) {
          notify('success', 'Experience updated!');
          setExpModal({ open: false, mode: 'add', data: {} });
          fetchAllData();
        } else notify('error', res.message || 'Failed to update');
      }
    } catch (err) {
      notify('error', 'Network error.');
    }
  };

  const handleDeleteExp = async (id: string, role: string) => {
    if (confirm(`Delete experience: "${role}"?`)) {
      const res = await experiencesApi.delete(id);
      if (res.success) {
        notify('success', 'Experience removed!');
        setExperiences(prev => prev.filter(e => e._id !== id));
      } else notify('error', 'Delete failed');
    }
  };

  // ---------------- Contact Messages Handlers ----------------
  const handleUpdateContactStatus = async (id: string, status: string) => {
    const res = await contactApi.updateStatus(id, status);
    if (res.success) {
      notify('success', `Marked as ${status}`);
      setContacts(prev => prev.map(c => (c._id === id ? { ...c, status } : c)));
    }
  };

  const handleDeleteContact = async (id: string) => {
    if (confirm('Delete this message?')) {
      const res = await contactApi.delete(id);
      if (res.success) {
        notify('success', 'Message deleted');
        setContacts(prev => prev.filter(c => c._id !== id));
      }
    }
  };

  if (!isAuthenticated) return null;

  const unreadMessagesCount = contacts.filter(c => c.status === 'unread').length;

  return (
    <div className="min-h-screen bg-muted/20 pb-20">
      {/* Top Banner Bar */}
      <div className="border-b border-border bg-card px-4 py-3 sm:px-6">
        <div className="container mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-600 p-2 text-white">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">Admin Control Center</h1>
              <p className="text-xs text-muted-foreground">Manage dynamic portfolio content & CRUD controls</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted"
            >
              <span>View Live Website</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>

            <button
              onClick={handleResetDatabase}
              className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-600 hover:bg-amber-500/20"
              title="Reset data back to seed"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset Seed</span>
            </button>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Floating notification */}
      {feedback && (
        <div className="fixed top-20 right-6 z-50 animate-fade-in">
          <div
            className={`flex items-center gap-2 rounded-xl p-4 shadow-xl border text-sm font-semibold ${
              feedback.type === 'success'
                ? 'border-emerald-500/30 bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                : 'border-red-500/30 bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-300'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
            )}
            <span>{feedback.msg}</span>
          </div>
        </div>
      )}

      {/* Main Admin Layout */}
      <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-12 items-start">
          {/* Sidebar Tabs (3 cols) */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-border bg-card p-3 shadow-sm space-y-1">
              {[
                { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
                { id: 'home', label: 'Hero & Home Section', icon: Sliders },
                { id: 'about', label: 'About & Bio', icon: User },
                { id: 'stats', label: 'Stats Counters', icon: Award },
                { id: 'projects', label: `Projects (${projects.length})`, icon: FolderGit2 },
                { id: 'skills', label: `Skills (${skills.length})`, icon: Cpu },
                { id: 'experience', label: `Experience (${experiences.length})`, icon: Briefcase },
                {
                  id: 'messages',
                  label: `Inquiries (${contacts.length})`,
                  icon: Mail,
                  badge: unreadMessagesCount > 0 ? unreadMessagesCount : undefined
                },
                { id: 'footer', label: 'Footer & Socials', icon: Sliders }
              ].map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="h-4 w-4 shrink-0" />
                      <span>{tab.label}</span>
                    </div>
                    {tab.badge && (
                      <span className="rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content (9 cols) */}
          <div className="lg:col-span-9 space-y-6">
            {/* 1. OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="space-y-6 animate-fade-in">
                {/* Metric Cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                    <p className="text-xs font-semibold text-muted-foreground">Total Projects</p>
                    <p className="mt-2 text-3xl font-extrabold text-blue-600">{projects.length}</p>
                    <button
                      onClick={() => setActiveTab('projects')}
                      className="mt-3 text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
                    >
                      Manage Projects →
                    </button>
                  </div>

                  <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                    <p className="text-xs font-semibold text-muted-foreground">Total Skills</p>
                    <p className="mt-2 text-3xl font-extrabold text-indigo-600">{skills.length}</p>
                    <button
                      onClick={() => setActiveTab('skills')}
                      className="mt-3 text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
                    >
                      Manage Skills →
                    </button>
                  </div>

                  <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                    <p className="text-xs font-semibold text-muted-foreground">Work Experience</p>
                    <p className="mt-2 text-3xl font-extrabold text-emerald-600">{experiences.length}</p>
                    <button
                      onClick={() => setActiveTab('experience')}
                      className="mt-3 text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
                    >
                      Manage Timeline →
                    </button>
                  </div>

                  <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                    <p className="text-xs font-semibold text-muted-foreground">Contact Messages</p>
                    <div className="mt-2 flex items-center gap-2">
                      <p className="text-3xl font-extrabold text-amber-600">{contacts.length}</p>
                      {unreadMessagesCount > 0 && (
                        <span className="rounded-full bg-red-500/10 text-red-600 px-2 py-0.5 text-xs font-bold">
                          {unreadMessagesCount} unread
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => setActiveTab('messages')}
                      className="mt-3 text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
                    >
                      View Messages →
                    </button>
                  </div>
                </div>

                {/* Quick Profile Summary */}
                <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                  <h2 className="text-lg font-bold text-foreground mb-4">Portfolio Profile Summary</h2>
                  <div className="grid gap-4 sm:grid-cols-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Display Name:</span>
                      <p className="font-semibold text-foreground text-base">
                        {homeData?.hero?.name || 'Komal Kshirsagar'}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Headline Title:</span>
                      <p className="font-semibold text-foreground text-base">
                        {homeData?.hero?.title || 'MERN Stack Developer'}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Current Company:</span>
                      <p className="font-semibold text-foreground">
                        {homeData?.about?.currentCompany || 'Matic UI'}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Contact Email:</span>
                      <p className="font-semibold text-foreground">
                        {footerData?.email || 'komalkshirasagar32009@gmail.com'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. HERO & HOME SECTION */}
            {activeTab === 'home' && (
              <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6 animate-fade-in">
                <div className="border-b border-border/50 pb-4">
                  <h2 className="text-xl font-bold text-foreground">Hero & Home Page Settings</h2>
                  <p className="text-xs text-muted-foreground">
                    Customize titles, headlines, and call-to-actions on the main landing page
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-semibold text-foreground mb-1">
                        Hero Full Name
                      </label>
                      <input
                        type="text"
                        value={homeData.hero?.name || ''}
                        onChange={e =>
                          setHomeData({
                            ...homeData,
                            hero: { ...homeData.hero, name: e.target.value }
                          })
                        }
                        className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm text-foreground focus:border-blue-600 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-foreground mb-1">
                        Job Title
                      </label>
                      <input
                        type="text"
                        value={homeData.hero?.title || ''}
                        onChange={e =>
                          setHomeData({
                            ...homeData,
                            hero: { ...homeData.hero, title: e.target.value }
                          })
                        }
                        className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm text-foreground focus:border-blue-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">
                      Hero Subtitle Description
                    </label>
                    <input
                      type="text"
                      value={homeData.hero?.subtitle || ''}
                      onChange={e =>
                        setHomeData({
                          ...homeData,
                          hero: { ...homeData.hero, subtitle: e.target.value }
                        })
                      }
                      className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm text-foreground focus:border-blue-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">
                      Hero Profile Image URL
                    </label>
                    <input
                      type="text"
                      placeholder="https://... or /profile.jpg"
                      value={homeData.hero?.avatarUrl || ''}
                      onChange={e =>
                        setHomeData({
                          ...homeData,
                          hero: { ...homeData.hero, avatarUrl: e.target.value }
                        })
                      }
                      className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm text-foreground focus:border-blue-600 focus:outline-none"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-semibold text-foreground mb-1">
                        About Section Title
                      </label>
                      <input
                        type="text"
                        value={homeData.about?.title || ''}
                        onChange={e =>
                          setHomeData({
                            ...homeData,
                            about: { ...homeData.about, title: e.target.value }
                          })
                        }
                        className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm text-foreground focus:border-blue-600 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-foreground mb-1">
                        About Section Subtitle
                      </label>
                      <input
                        type="text"
                        value={homeData.about?.subtitle || ''}
                        onChange={e =>
                          setHomeData({
                            ...homeData,
                            about: { ...homeData.about, subtitle: e.target.value }
                          })
                        }
                        className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm text-foreground focus:border-blue-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">
                      About Description Paragraph 1
                    </label>
                    <textarea
                      rows={3}
                      value={homeData.about?.description1 || ''}
                      onChange={e =>
                        setHomeData({
                          ...homeData,
                          about: { ...homeData.about, description1: e.target.value }
                        })
                      }
                      className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm text-foreground focus:border-blue-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">
                      About Description Paragraph 2
                    </label>
                    <textarea
                      rows={2}
                      value={homeData.about?.description2 || ''}
                      onChange={e =>
                        setHomeData({
                          ...homeData,
                          about: { ...homeData.about, description2: e.target.value }
                        })
                      }
                      className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm text-foreground focus:border-blue-600 focus:outline-none"
                    />
                  </div>

                  <button
                    onClick={async () => {
                      const res = await homeApi.update(homeData);
                      if (res.success) notify('success', 'Home section updated successfully!');
                      else notify('error', 'Update failed');
                    }}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save Home Section Changes</span>
                  </button>
                </div>
              </div>
            )}

            {/* 3. ABOUT & BIO TAB */}
            {activeTab === 'about' && (
              <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6 animate-fade-in">
                <div className="border-b border-border/50 pb-4">
                  <h2 className="text-xl font-bold text-foreground">About Page & Bio</h2>
                  <p className="text-xs text-muted-foreground">
                    Update personal biography, education journey, and personal details
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">
                      Introduction
                    </label>
                    <textarea
                      rows={3}
                      value={aboutData.bio?.introduction || ''}
                      onChange={e =>
                        setAboutData({
                          ...aboutData,
                          bio: { ...aboutData.bio, introduction: e.target.value }
                        })
                      }
                      className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm text-foreground focus:border-blue-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">
                      My Journey (Education & Background)
                    </label>
                    <textarea
                      rows={3}
                      value={aboutData.bio?.journey || ''}
                      onChange={e =>
                        setAboutData({
                          ...aboutData,
                          bio: { ...aboutData.bio, journey: e.target.value }
                        })
                      }
                      className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm text-foreground focus:border-blue-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">
                      Current Work & Collaborations
                    </label>
                    <textarea
                      rows={3}
                      value={aboutData.bio?.current || ''}
                      onChange={e =>
                        setAboutData({
                          ...aboutData,
                          bio: { ...aboutData.bio, current: e.target.value }
                        })
                      }
                      className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm text-foreground focus:border-blue-600 focus:outline-none"
                    />
                  </div>

                  <h3 className="text-sm font-bold text-foreground pt-4 border-t border-border/50">
                    Personal Information
                  </h3>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-semibold text-foreground mb-1">
                        Date of Birth
                      </label>
                      <input
                        type="text"
                        value={aboutData.personalInfo?.dateOfBirth || ''}
                        onChange={e =>
                          setAboutData({
                            ...aboutData,
                            personalInfo: { ...aboutData.personalInfo, dateOfBirth: e.target.value }
                          })
                        }
                        className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm text-foreground focus:border-blue-600 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-foreground mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        value={aboutData.personalInfo?.location || ''}
                        onChange={e =>
                          setAboutData({
                            ...aboutData,
                            personalInfo: { ...aboutData.personalInfo, location: e.target.value }
                          })
                        }
                        className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm text-foreground focus:border-blue-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-semibold text-foreground mb-1">
                        Contact Email
                      </label>
                      <input
                        type="text"
                        value={aboutData.personalInfo?.email || ''}
                        onChange={e =>
                          setAboutData({
                            ...aboutData,
                            personalInfo: { ...aboutData.personalInfo, email: e.target.value }
                          })
                        }
                        className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm text-foreground focus:border-blue-600 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-foreground mb-1">
                        Contact Phone
                      </label>
                      <input
                        type="text"
                        value={aboutData.personalInfo?.phone || ''}
                        onChange={e =>
                          setAboutData({
                            ...aboutData,
                            personalInfo: { ...aboutData.personalInfo, phone: e.target.value }
                          })
                        }
                        className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm text-foreground focus:border-blue-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    onClick={async () => {
                      const res = await aboutApi.update(aboutData);
                      if (res.success) notify('success', 'About & Bio updated successfully!');
                      else notify('error', 'Update failed');
                    }}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save About & Bio Changes</span>
                  </button>
                </div>
              </div>
            )}

            {/* 4. STATS TAB */}
            {activeTab === 'stats' && (
              <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6 animate-fade-in">
                <div className="border-b border-border/50 pb-4">
                  <h2 className="text-xl font-bold text-foreground">Stats Counters</h2>
                  <p className="text-xs text-muted-foreground">
                    Update the numerical highlights shown across the website
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">
                      Years Experience (e.g. 2+)
                    </label>
                    <input
                      type="text"
                      value={statsData.yearsExperience || ''}
                      onChange={e => setStatsData({ ...statsData, yearsExperience: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm text-foreground focus:border-blue-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">
                      Projects Completed (e.g. 16+)
                    </label>
                    <input
                      type="text"
                      value={statsData.projectsCompleted || ''}
                      onChange={e => setStatsData({ ...statsData, projectsCompleted: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm text-foreground focus:border-blue-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">
                      Technologies Count (e.g. 15+)
                    </label>
                    <input
                      type="text"
                      value={statsData.technologies || ''}
                      onChange={e => setStatsData({ ...statsData, technologies: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm text-foreground focus:border-blue-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">
                      Happy Clients (e.g. 5+)
                    </label>
                    <input
                      type="text"
                      value={statsData.happyClients || ''}
                      onChange={e => setStatsData({ ...statsData, happyClients: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm text-foreground focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  onClick={async () => {
                    const res = await statsApi.update(statsData);
                    if (res.success) notify('success', 'Stats updated successfully!');
                    else notify('error', 'Update failed');
                  }}
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Stats</span>
                </button>
              </div>
            )}

            {/* 5. PROJECTS CRUD TAB */}
            {activeTab === 'projects' && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-foreground">Projects Management</h2>
                    <p className="text-xs text-muted-foreground">Add, update, or remove portfolio projects</p>
                  </div>
                  <button
                    onClick={() =>
                      setProjectModal({
                        open: true,
                        mode: 'add',
                        data: {
                          title: '',
                          description: '',
                          image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000',
                          category: 'web',
                          technologies: 'React, Node.js, Express, MongoDB',
                          liveUrl: '',
                          githubUrl: '',
                          featured: false
                        }
                      })
                    }
                    className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add New Project</span>
                  </button>
                </div>

                {/* Projects Table */}
                <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="border-b border-border bg-muted/50 text-xs font-semibold text-muted-foreground">
                        <tr>
                          <th className="p-3.5">Image</th>
                          <th className="p-3.5">Title</th>
                          <th className="p-3.5">Category</th>
                          <th className="p-3.5">Featured</th>
                          <th className="p-3.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {projects.map(proj => (
                          <tr key={proj._id} className="hover:bg-muted/30 transition-colors">
                            <td className="p-3.5">
                              <img
                                src={proj.image || '/placeholder.png'}
                                alt=""
                                className="h-10 w-14 rounded object-cover bg-muted"
                                onError={e => {
                                  (e.target as HTMLImageElement).src =
                                    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=200';
                                }}
                              />
                            </td>
                            <td className="p-3.5">
                              <span className="font-semibold text-foreground block">{proj.title}</span>
                              <span className="text-xs text-muted-foreground line-clamp-1">
                                {proj.description}
                              </span>
                            </td>
                            <td className="p-3.5">
                              <span className="rounded bg-muted px-2 py-0.5 text-xs font-medium uppercase">
                                {proj.category || 'web'}
                              </span>
                            </td>
                            <td className="p-3.5">
                              {proj.featured ? (
                                <span className="rounded-full bg-emerald-500/10 text-emerald-600 px-2.5 py-0.5 text-xs font-bold">
                                  Yes
                                </span>
                              ) : (
                                <span className="text-xs text-muted-foreground">No</span>
                              )}
                            </td>
                            <td className="p-3.5 text-right space-x-2">
                              <button
                                onClick={() =>
                                  setProjectModal({
                                    open: true,
                                    mode: 'edit',
                                    data: {
                                      ...proj,
                                      technologies: Array.isArray(proj.technologies)
                                        ? proj.technologies.join(', ')
                                        : proj.technologies
                                    }
                                  })
                                }
                                className="rounded p-1.5 text-blue-600 hover:bg-blue-500/10"
                                title="Edit Project"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteProject(proj._id, proj.title)}
                                className="rounded p-1.5 text-red-600 hover:bg-red-500/10"
                                title="Delete Project"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 6. SKILLS CRUD TAB */}
            {activeTab === 'skills' && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-foreground">Skills Management</h2>
                    <p className="text-xs text-muted-foreground">Add, update, or remove technical skills</p>
                  </div>
                  <button
                    onClick={() =>
                      setSkillModal({
                        open: true,
                        mode: 'add',
                        data: { name: '', category: 'Frontend', level: 85 }
                      })
                    }
                    className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add New Skill</span>
                  </button>
                </div>

                {/* Skills Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {skills.map(skill => (
                    <div
                      key={skill._id}
                      className="rounded-xl border border-border bg-card p-4 shadow-sm flex items-center justify-between"
                    >
                      <div>
                        <h4 className="font-bold text-foreground text-sm">{skill.name}</h4>
                        <span className="text-xs text-muted-foreground block">
                          Level: {skill.level || 80}% • {skill.category || 'General'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() =>
                            setSkillModal({ open: true, mode: 'edit', data: { ...skill } })
                          }
                          className="rounded p-1.5 text-blue-600 hover:bg-blue-500/10"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteSkill(skill._id, skill.name)}
                          className="rounded p-1.5 text-red-600 hover:bg-red-500/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 7. EXPERIENCE CRUD TAB */}
            {activeTab === 'experience' && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-foreground">Experience Management</h2>
                    <p className="text-xs text-muted-foreground">
                      Manage career timeline, companies, and roles
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setExpModal({
                        open: true,
                        mode: 'add',
                        data: {
                          role: '',
                          company: '',
                          period: '2026 - Present',
                          description: '',
                          responsibilities: ''
                        }
                      })
                    }
                    className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Experience</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {experiences.map(exp => (
                    <div
                      key={exp._id}
                      className="rounded-xl border border-border bg-card p-5 shadow-sm"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-bold text-foreground text-lg">{exp.role}</h3>
                          <p className="text-sm font-semibold text-blue-600">
                            {exp.company} • <span className="text-muted-foreground">{exp.period}</span>
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              setExpModal({
                                open: true,
                                mode: 'edit',
                                data: {
                                  ...exp,
                                  responsibilities: Array.isArray(exp.responsibilities)
                                    ? exp.responsibilities.join('\n')
                                    : exp.responsibilities
                                }
                              })
                            }
                            className="rounded p-1.5 text-blue-600 hover:bg-blue-500/10"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteExp(exp._id, exp.role)}
                            className="rounded p-1.5 text-red-600 hover:bg-red-500/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {exp.description && (
                        <p className="mt-2 text-xs sm:text-sm text-muted-foreground">
                          {exp.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 8. CONTACT MESSAGES / INBOX TAB */}
            {activeTab === 'messages' && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-foreground">Inquiries & Messages</h2>
                    <p className="text-xs text-muted-foreground">
                      Messages submitted by visitors through the contact form
                    </p>
                  </div>
                </div>

                {contacts.length === 0 ? (
                  <div className="rounded-2xl border border-border bg-card p-12 text-center text-muted-foreground">
                    <Mail className="mx-auto h-10 w-10 text-muted-foreground/50 mb-2" />
                    <p className="text-base font-semibold">No messages received yet.</p>
                    <p className="text-xs mt-1">Test out the contact form on the website to see messages here!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {contacts.map(c => (
                      <div
                        key={c._id}
                        className={`rounded-xl border p-5 transition-all ${
                          c.status === 'unread'
                            ? 'border-blue-500/50 bg-blue-500/5 shadow-sm'
                            : 'border-border bg-card'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/50 pb-3">
                          <div>
                            <span className="font-bold text-foreground text-base">{c.name}</span>
                            <a
                              href={`mailto:${c.email}`}
                              className="text-xs text-blue-600 hover:underline block sm:inline sm:ml-2"
                            >
                              ({c.email})
                            </a>
                          </div>

                          <div className="flex items-center gap-2">
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-xs font-bold uppercase ${
                                c.status === 'unread'
                                  ? 'bg-amber-500/10 text-amber-600'
                                  : c.status === 'replied'
                                  ? 'bg-emerald-500/10 text-emerald-600'
                                  : 'bg-muted text-muted-foreground'
                              }`}
                            >
                              {c.status}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(c.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        {c.subject && (
                          <p className="mt-3 text-xs font-bold text-foreground">
                            Subject: <span className="font-normal">{c.subject}</span>
                          </p>
                        )}

                        <p className="mt-2 text-sm text-foreground bg-muted/40 p-3 rounded-lg leading-relaxed">
                          {c.message}
                        </p>

                        <div className="mt-4 flex items-center justify-end gap-2 text-xs">
                          {c.status === 'unread' ? (
                            <button
                              onClick={() => handleUpdateContactStatus(c._id, 'read')}
                              className="rounded px-3 py-1 font-semibold text-blue-600 hover:bg-blue-500/10"
                            >
                              Mark as Read
                            </button>
                          ) : (
                            <button
                              onClick={() => handleUpdateContactStatus(c._id, 'replied')}
                              className="rounded px-3 py-1 font-semibold text-emerald-600 hover:bg-emerald-500/10"
                            >
                              Mark as Replied
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteContact(c._id)}
                            className="rounded px-3 py-1 font-semibold text-red-600 hover:bg-red-500/10"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 9. FOOTER SETTINGS TAB */}
            {activeTab === 'footer' && (
              <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6 animate-fade-in">
                <div className="border-b border-border/50 pb-4">
                  <h2 className="text-xl font-bold text-foreground">Footer & Social Settings</h2>
                  <p className="text-xs text-muted-foreground">
                    Customize global footer contact info and external profiles
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-semibold text-foreground mb-1">
                        Footer Email
                      </label>
                      <input
                        type="text"
                        value={footerData.email || ''}
                        onChange={e => setFooterData({ ...footerData, email: e.target.value })}
                        className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm text-foreground focus:border-blue-600 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-foreground mb-1">
                        Footer Phone
                      </label>
                      <input
                        type="text"
                        value={footerData.phone || ''}
                        onChange={e => setFooterData({ ...footerData, phone: e.target.value })}
                        className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm text-foreground focus:border-blue-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      value={footerData.location || ''}
                      onChange={e => setFooterData({ ...footerData, location: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm text-foreground focus:border-blue-600 focus:outline-none"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-semibold text-foreground mb-1">
                        GitHub URL
                      </label>
                      <input
                        type="text"
                        value={footerData.githubUrl || ''}
                        onChange={e => setFooterData({ ...footerData, githubUrl: e.target.value })}
                        className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm text-foreground focus:border-blue-600 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-foreground mb-1">
                        LinkedIn URL
                      </label>
                      <input
                        type="text"
                        value={footerData.linkedinUrl || ''}
                        onChange={e => setFooterData({ ...footerData, linkedinUrl: e.target.value })}
                        className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm text-foreground focus:border-blue-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">
                      Footer Short Bio
                    </label>
                    <textarea
                      rows={2}
                      value={footerData.description || ''}
                      onChange={e => setFooterData({ ...footerData, description: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm text-foreground focus:border-blue-600 focus:outline-none"
                    />
                  </div>

                  <button
                    onClick={async () => {
                      const res = await footerApi.update(footerData);
                      if (res.success) notify('success', 'Footer settings updated successfully!');
                      else notify('error', 'Update failed');
                    }}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save Footer Changes</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ===================== MODAL: PROJECT ===================== */}
      {projectModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-xl rounded-2xl border border-border bg-card p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border/50 pb-3">
              <h3 className="text-lg font-bold text-foreground">
                {projectModal.mode === 'add' ? 'Add New Project' : 'Edit Project'}
              </h3>
              <button
                onClick={() => setProjectModal({ ...projectModal, open: false })}
                className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 🪴 Kedar Krushi Seva Kendra"
                  value={projectModal.data.title || ''}
                  onChange={e =>
                    setProjectModal({
                      ...projectModal,
                      data: { ...projectModal.data, title: e.target.value }
                    })
                  }
                  className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm text-foreground focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Description *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Brief description of the project features..."
                  value={projectModal.data.description || ''}
                  onChange={e =>
                    setProjectModal({
                      ...projectModal,
                      data: { ...projectModal.data, description: e.target.value }
                    })
                  }
                  className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm text-foreground focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Image URL
                </label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={projectModal.data.image || ''}
                  onChange={e =>
                    setProjectModal({
                      ...projectModal,
                      data: { ...projectModal.data, image: e.target.value }
                    })
                  }
                  className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm text-foreground focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Category
                  </label>
                  <select
                    value={projectModal.data.category || 'web'}
                    onChange={e =>
                      setProjectModal({
                        ...projectModal,
                        data: { ...projectModal.data, category: e.target.value }
                      })
                    }
                    className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm text-foreground focus:border-blue-600 focus:outline-none"
                  >
                    <option value="web">Web Application</option>
                    <option value="fullstack">Full Stack</option>
                    <option value="frontend">Frontend</option>
                    <option value="mobile">Mobile App</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="featCheck"
                    checked={Boolean(projectModal.data.featured)}
                    onChange={e =>
                      setProjectModal({
                        ...projectModal,
                        data: { ...projectModal.data, featured: e.target.checked }
                      })
                    }
                    className="h-4 w-4 rounded text-blue-600"
                  />
                  <label htmlFor="featCheck" className="text-xs font-semibold text-foreground">
                    Featured on Home Page
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Technologies (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="React, Next.js, Node.js, Express, MongoDB"
                  value={projectModal.data.technologies || ''}
                  onChange={e =>
                    setProjectModal({
                      ...projectModal,
                      data: { ...projectModal.data, technologies: e.target.value }
                    })
                  }
                  className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm text-foreground focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Live Demo URL
                  </label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={projectModal.data.liveUrl || ''}
                    onChange={e =>
                      setProjectModal({
                        ...projectModal,
                        data: { ...projectModal.data, liveUrl: e.target.value }
                      })
                    }
                    className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm text-foreground focus:border-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    GitHub URL
                  </label>
                  <input
                    type="text"
                    placeholder="https://github.com/..."
                    value={projectModal.data.githubUrl || ''}
                    onChange={e =>
                      setProjectModal({
                        ...projectModal,
                        data: { ...projectModal.data, githubUrl: e.target.value }
                      })
                    }
                    className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm text-foreground focus:border-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-border/50">
                <button
                  type="button"
                  onClick={() => setProjectModal({ ...projectModal, open: false })}
                  className="rounded-lg border border-border px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-5 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================== MODAL: SKILL ===================== */}
      {skillModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border/50 pb-3">
              <h3 className="text-lg font-bold text-foreground">
                {skillModal.mode === 'add' ? 'Add Skill' : 'Edit Skill'}
              </h3>
              <button
                onClick={() => setSkillModal({ ...skillModal, open: false })}
                className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSkill} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Skill Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Next.js, Node.js, Redux"
                  value={skillModal.data.name || ''}
                  onChange={e =>
                    setSkillModal({
                      ...skillModal,
                      data: { ...skillModal.data, name: e.target.value }
                    })
                  }
                  className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm text-foreground focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Category
                </label>
                <select
                  value={skillModal.data.category || 'Frontend'}
                  onChange={e =>
                    setSkillModal({
                      ...skillModal,
                      data: { ...skillModal.data, category: e.target.value }
                    })
                  }
                  className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm text-foreground focus:border-blue-600 focus:outline-none"
                >
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="Database">Database</option>
                  <option value="Tools">Tools</option>
                  <option value="DevOps">DevOps</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Proficiency Level: {skillModal.data.level || 80}%
                </label>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={skillModal.data.level || 80}
                  onChange={e =>
                    setSkillModal({
                      ...skillModal,
                      data: { ...skillModal.data, level: Number(e.target.value) }
                    })
                  }
                  className="w-full"
                />
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-border/50">
                <button
                  type="button"
                  onClick={() => setSkillModal({ ...skillModal, open: false })}
                  className="rounded-lg border border-border px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-5 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                >
                  Save Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================== MODAL: EXPERIENCE ===================== */}
      {expModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border/50 pb-3">
              <h3 className="text-lg font-bold text-foreground">
                {expModal.mode === 'add' ? 'Add Experience' : 'Edit Experience'}
              </h3>
              <button
                onClick={() => setExpModal({ ...expModal, open: false })}
                className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveExp} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Job Role *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Full Stack Developer"
                  value={expModal.data.role || ''}
                  onChange={e =>
                    setExpModal({
                      ...expModal,
                      data: { ...expModal.data, role: e.target.value }
                    })
                  }
                  className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm text-foreground focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Company *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mayking / Matic UI"
                    value={expModal.data.company || ''}
                    onChange={e =>
                      setExpModal({
                        ...expModal,
                        data: { ...expModal.data, company: e.target.value }
                      })
                    }
                    className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm text-foreground focus:border-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Period *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. June 2026 - Present"
                    value={expModal.data.period || ''}
                    onChange={e =>
                      setExpModal({
                        ...expModal,
                        data: { ...expModal.data, period: e.target.value }
                      })
                    }
                    className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm text-foreground focus:border-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Overview of duties..."
                  value={expModal.data.description || ''}
                  onChange={e =>
                    setExpModal({
                      ...expModal,
                      data: { ...expModal.data, description: e.target.value }
                    })
                  }
                  className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm text-foreground focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Responsibilities (one per line)
                </label>
                <textarea
                  rows={4}
                  placeholder="Developed responsive frontend components&#10;Built secure RESTful APIs&#10;Collaborated with cross-functional teams"
                  value={expModal.data.responsibilities || ''}
                  onChange={e =>
                    setExpModal({
                      ...expModal,
                      data: { ...expModal.data, responsibilities: e.target.value }
                    })
                  }
                  className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm text-foreground focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-border/50">
                <button
                  type="button"
                  onClick={() => setExpModal({ ...expModal, open: false })}
                  className="rounded-lg border border-border px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-5 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                >
                  Save Experience
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
