const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DATA_DIR = path.join(__dirname);
const STORE_FILE = path.join(DATA_DIR, 'store.json');
const SEED_FILE = path.join(__dirname, '..', 'initial_seed.json');

// Default initial state fallback
let data = {
  users: [],
  home: {},
  about: {},
  stats: {},
  skills: [],
  projects: [],
  experiences: [],
  contacts: [],
  footer: {}
};

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}

function initStore() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  let seed = {};
  if (fs.existsSync(SEED_FILE)) {
    try {
      seed = JSON.parse(fs.readFileSync(SEED_FILE, 'utf8'));
    } catch (e) {
      console.error('Error reading initial_seed.json:', e);
    }
  }

  let needsSave = false;
  if (fs.existsSync(STORE_FILE)) {
    try {
      data = JSON.parse(fs.readFileSync(STORE_FILE, 'utf8'));
    } catch (e) {
      console.error('Error reading store.json, using seed fallback:', e);
      loadSeedIntoData(seed);
      needsSave = true;
    }
  } else {
    loadSeedIntoData(seed);
    needsSave = true;
  }

  // Ensure default admin user exists
  if (ensureAdminUser()) {
    needsSave = true;
  }

  if (needsSave) {
    saveStore();
  }
}

function loadSeedIntoData(seed) {
  data.home = seed.home?.data || {
    hero: {
      name: "Komal Kshirsagar",
      title: "MERN Stack Developer",
      subtitle: "Crafting Scalable Web & Mobile Applications."
    },
    about: {
      title: "About Me",
      subtitle: "Get to know me better",
      description1: "I'm a MERN Stack Developer with a passion for building modern, responsive web applications. With expertise in JavaScript, React, Node.js, and related technologies, I create intuitive and visually appealing user interfaces.",
      description2: "Currently working at Matic UI, I've contributed to various projects including a Medical Diagnostic App and a SaaS Property Management Platform.",
      currentCompany: "Matic UI"
    },
    projects: {
      title: "Featured Projects",
      subtitle: "Some of my recent work"
    },
    skills: {
      title: "My Skills",
      subtitle: "Technologies I work with"
    },
    contact: {
      title: "Ready to Work Together?",
      subtitle: "Let's discuss your project and see how I can help bring your ideas to life."
    }
  };

  data.about = seed.about?.data || {
    name: "Komal Kshirsagar",
    title: "MERN Stack Developer",
    bio: {
      introduction: "I'm Komal Kshirsagar, a MERN Stack Developer based in Chhatrapati Sambhajinagar, Maharashtra. With a strong foundation in web development, I specialize in creating responsive and user-friendly web applications.",
      journey: "My journey in web development began during my MCA studies where I developed a passion for creating elegant solutions to complex problems. Since then, I've worked on various projects ranging from e-commerce platforms to real-time communication applications.",
      current: "Currently working at Matic UI, I've had the opportunity to work on cutting-edge projects including a Medical Diagnostic App and a SaaS Property Management Platform. I enjoy collaborating with teams and clients to deliver high-quality products that exceed expectations."
    },
    personalInfo: {
      dateOfBirth: "17 March",
      location: "Chhatrapati Sambhajinagar, Maharashtra",
      email: "komalkshirasagar32009@gmail.com",
      phone: "+91-8080211162",
      languages: ["English", "Hindi", "Marathi"]
    },
    profileImage: "/komal.jpg"
  };

  data.stats = seed.stats?.data || {
    yearsExperience: "2+",
    projectsCompleted: "16+",
    technologies: "15+",
    happyClients: "5+"
  };

  data.skills = seed.skills?.data || [];
  data.projects = seed.projects?.data || [];
  data.experiences = seed.experiences?.data || [];
  data.contacts = [];
  data.footer = seed.footer?.data || {
    email: "komalkshirasagar32009@gmail.com",
    phone: "+91-8080211162",
    location: "Chhatrapati Sambhajinagar, Maharashtra",
    githubUrl: "https://github.com",
    linkedinUrl: "https://linkedin.com",
    description: "MERN Stack Developer with a passion for creating beautiful, responsive web applications."
  };
}

function ensureAdminUser() {
  if (!data.users) data.users = [];
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@portfolio.com';
  const existing = data.users.find(u => u.email.toLowerCase() === adminEmail.toLowerCase());
  if (!existing) {
    const rawPass = process.env.ADMIN_PASSWORD || 'admin123';
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(rawPass, salt);
    data.users.push({
      _id: generateId(),
      username: 'admin',
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
      createdAt: new Date().toISOString()
    });
    console.log(`Created default admin user: ${adminEmail} (password: ${rawPass})`);
    return true;
  }
  return false;
}

function saveStore() {
  try {
    fs.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving store.json:', err);
  }
}

// Store API methods
const Store = {
  // Users
  getUserByEmail(email) {
    return (data.users || []).find(u => u.email.toLowerCase() === email.toLowerCase());
  },
  getUserById(id) {
    return (data.users || []).find(u => u._id === id);
  },
  createUser(userData) {
    const user = {
      _id: generateId(),
      ...userData,
      createdAt: new Date().toISOString()
    };
    if (!data.users) data.users = [];
    data.users.push(user);
    saveStore();
    return user;
  },

  // Home
  getHome() {
    return data.home;
  },
  updateHome(update) {
    data.home = {
      ...data.home,
      ...update,
      updatedAt: new Date().toISOString()
    };
    saveStore();
    return data.home;
  },

  // About
  getAbout() {
    return data.about;
  },
  updateAbout(update) {
    data.about = {
      ...data.about,
      ...update,
      updatedAt: new Date().toISOString()
    };
    saveStore();
    return data.about;
  },

  // Stats
  getStats() {
    return data.stats;
  },
  updateStats(update) {
    data.stats = {
      ...data.stats,
      ...update,
      updatedAt: new Date().toISOString()
    };
    saveStore();
    return data.stats;
  },

  // Skills
  getSkills() {
    return data.skills || [];
  },
  getSkillById(id) {
    return (data.skills || []).find(s => s._id === id);
  },
  createSkill(skill) {
    const newSkill = {
      _id: generateId(),
      name: skill.name || '',
      category: skill.category || 'Other',
      level: Number(skill.level) || 80,
      order: Number(skill.order) || 0,
      icon: skill.icon || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    if (!data.skills) data.skills = [];
    data.skills.push(newSkill);
    saveStore();
    return newSkill;
  },
  updateSkill(id, update) {
    const index = (data.skills || []).findIndex(s => s._id === id);
    if (index === -1) return null;
    data.skills[index] = {
      ...data.skills[index],
      ...update,
      updatedAt: new Date().toISOString()
    };
    saveStore();
    return data.skills[index];
  },
  deleteSkill(id) {
    const prevLen = (data.skills || []).length;
    data.skills = (data.skills || []).filter(s => s._id !== id);
    if (data.skills.length !== prevLen) {
      saveStore();
      return true;
    }
    return false;
  },

  // Projects
  getProjects(category) {
    let projs = data.projects || [];
    if (category && category !== 'all') {
      projs = projs.filter(p => (p.category || '').toLowerCase() === category.toLowerCase());
    }
    return projs;
  },
  getProjectById(id) {
    return (data.projects || []).find(p => p._id === id);
  },
  createProject(proj) {
    const newProj = {
      _id: generateId(),
      title: proj.title || 'Untitled Project',
      description: proj.description || '',
      image: proj.image || '',
      category: proj.category || 'web',
      technologies: Array.isArray(proj.technologies) 
        ? proj.technologies 
        : (proj.technologies ? proj.technologies.split(',').map(t => t.trim()) : []),
      liveUrl: proj.liveUrl || '',
      githubUrl: proj.githubUrl || '',
      featured: Boolean(proj.featured),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    if (!data.projects) data.projects = [];
    data.projects.unshift(newProj);
    saveStore();
    return newProj;
  },
  updateProject(id, update) {
    const index = (data.projects || []).findIndex(p => p._id === id);
    if (index === -1) return null;
    if (typeof update.technologies === 'string') {
      update.technologies = update.technologies.split(',').map(t => t.trim()).filter(Boolean);
    }
    data.projects[index] = {
      ...data.projects[index],
      ...update,
      updatedAt: new Date().toISOString()
    };
    saveStore();
    return data.projects[index];
  },
  deleteProject(id) {
    const prevLen = (data.projects || []).length;
    data.projects = (data.projects || []).filter(p => p._id !== id);
    if (data.projects.length !== prevLen) {
      saveStore();
      return true;
    }
    return false;
  },

  // Experiences
  getExperiences() {
    return (data.experiences || []).sort((a, b) => (a.order || 0) - (b.order || 0));
  },
  getExperienceById(id) {
    return (data.experiences || []).find(e => e._id === id);
  },
  createExperience(exp) {
    const newExp = {
      _id: generateId(),
      role: exp.role || '',
      company: exp.company || '',
      period: exp.period || '',
      description: exp.description || '',
      responsibilities: Array.isArray(exp.responsibilities) 
        ? exp.responsibilities 
        : (exp.responsibilities ? exp.responsibilities.split('\n').map(r => r.trim()).filter(Boolean) : []),
      order: Number(exp.order) || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    if (!data.experiences) data.experiences = [];
    data.experiences.push(newExp);
    saveStore();
    return newExp;
  },
  updateExperience(id, update) {
    const index = (data.experiences || []).findIndex(e => e._id === id);
    if (index === -1) return null;
    if (typeof update.responsibilities === 'string') {
      update.responsibilities = update.responsibilities.split('\n').map(r => r.trim()).filter(Boolean);
    }
    data.experiences[index] = {
      ...data.experiences[index],
      ...update,
      updatedAt: new Date().toISOString()
    };
    saveStore();
    return data.experiences[index];
  },
  deleteExperience(id) {
    const prevLen = (data.experiences || []).length;
    data.experiences = (data.experiences || []).filter(e => e._id !== id);
    if (data.experiences.length !== prevLen) {
      saveStore();
      return true;
    }
    return false;
  },

  // Contact
  getContacts() {
    return (data.contacts || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },
  getContactById(id) {
    return (data.contacts || []).find(c => c._id === id);
  },
  createContact(msg) {
    const newMsg = {
      _id: generateId(),
      name: msg.name || '',
      email: msg.email || '',
      subject: msg.subject || '',
      message: msg.message || '',
      status: 'unread',
      createdAt: new Date().toISOString()
    };
    if (!data.contacts) data.contacts = [];
    data.contacts.unshift(newMsg);
    saveStore();
    return newMsg;
  },
  updateContactStatus(id, status) {
    const index = (data.contacts || []).findIndex(c => c._id === id);
    if (index === -1) return null;
    data.contacts[index].status = status;
    saveStore();
    return data.contacts[index];
  },
  deleteContact(id) {
    const prevLen = (data.contacts || []).length;
    data.contacts = (data.contacts || []).filter(c => c._id !== id);
    if (data.contacts.length !== prevLen) {
      saveStore();
      return true;
    }
    return false;
  },

  // Footer
  getFooter() {
    return data.footer;
  },
  updateFooter(update) {
    data.footer = {
      ...data.footer,
      ...update,
      updatedAt: new Date().toISOString()
    };
    saveStore();
    return data.footer;
  },

  // Reset to default seed
  resetAll() {
    let seed = {};
    if (fs.existsSync(SEED_FILE)) {
      seed = JSON.parse(fs.readFileSync(SEED_FILE, 'utf8'));
    }
    loadSeedIntoData(seed);
    ensureAdminUser();
    saveStore();
    return true;
  }
};

initStore();

module.exports = Store;
