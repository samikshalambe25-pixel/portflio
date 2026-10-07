# Dynamic Full-Stack Portfolio & Admin CMS

A modern, responsive, and dynamic portfolio website built with **Next.js 16**, **React 19**, **Tailwind CSS**, and **Node.js/Express** with an integrated **Admin Control Center** for full CRUD management (Add, Update, Delete) of all website sections.

---

## Features

- **Dynamic Public Portfolio**:
  - **Home**: Dynamic hero headline, subtitle, avatar image, CV download, About preview, live stats counter, Featured Projects, Skills grid, and CTA banner.
  - **About Me**: Complete personal bio, education journey, personal details (DOB, Location, Email, Phone, Languages), and statistics.
  - **Skills**: Interactive categorized tech stack (Frontend, Backend, Database, Tools, DevOps) with search and percentage proficiency progress bars.
  - **Projects**: Project showcase with category filter tabs (*All, Web Applications, Full Stack, Frontend*), search bar, tech stack tags, Live Demo and GitHub buttons.
  - **Experience**: Career timeline with company names, roles, time periods, descriptions, and responsibility bullet points.
  - **Contact**: Contact cards and a live message submission form saving directly to the backend database.
  - **Theme Toggle**: Dark / Light mode switch with localStorage persistence and smooth CSS transitions.

- **Admin Control Center (`/admin`)**:
  - Secure JWT authentication (`/login`).
  - **Dashboard Overview**: Key metrics and counters.
  - **Hero & Profile Manager**: Update display name, title, subtitle, and avatar image URL.
  - **About & Bio Manager**: Update biography, journey, and personal details.
  - **Stats Counters**: Customize numbers for experience, projects, technologies, and happy clients.
  - **Projects CRUD**: Create, read, update, and delete projects with images, categories, and tags.
  - **Skills CRUD**: Add, edit, or delete skills with category assignment and proficiency slider.
  - **Experience CRUD**: Add, edit, or delete career milestones and responsibilities.
  - **Inquiries Inbox**: View contact messages, mark as Read/Replied, or delete.
  - **Footer Settings**: Update email, phone, location, and social profile links.
  - **One-Click Reset Tool**: Reset data back to default seed.

---

## Default Admin Credentials

- **URL**: `http://localhost:3000/login` or via the **Admin** button in the navbar.
- **Email**: `admin@portfolio.com`
- **Password**: `admin123`

---

## Getting Started Locally

### 1. Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### 2. Running Backend Server
```bash
cd server
npm install
npm run dev
```
Backend runs on `http://localhost:5000`.

### 3. Running Frontend Client
```bash
cd client
npm install
npm run dev
```
Frontend runs on `http://localhost:3000`.

---

## Deployment Guide

### Deploying Frontend to Vercel
1. Push your repository to GitHub.
2. In [Vercel](https://vercel.com), click **Add New Project** and import your GitHub repository.
3. In **Root Directory**, select `client` (or use the root directory with the included `vercel.json`).
4. Under **Environment Variables**, set:
   - `NEXT_PUBLIC_API_URL`: Your deployed backend API URL (e.g. `https://your-backend.onrender.com/api`)
5. Click **Deploy**.

### Deploying Backend to Render / Railway / Vercel
1. In [Render](https://render.com) or [Railway](https://railway.app), create a new Web Service and link the `server` folder.
2. Set Environment Variables:
   - `PORT`: `5000`
   - `JWT_SECRET`: `your_random_secret_key`
   - `ADMIN_EMAIL`: `your_admin_email@example.com`
   - `ADMIN_PASSWORD`: `your_secure_password`
   - `MONGODB_URI`: (Optional) MongoDB Atlas connection string.
3. Start command: `npm start`.
