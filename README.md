# 🍷 The Crimson Room — Noir Murder-Mystery Web Experience

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)](https://react.dev/)
[![Bun](https://img.shields.io/badge/Bun-v1.3+-fbf0df?style=flat-square&logo=bun)](https://bun.sh/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub_Actions-2088FF?style=flat-square&logo=githubactions)](https://github.com/Niranjan-Software-DEV/my-website/actions)
[![Deploy with Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=flat-square&logo=vercel)](https://my-website-six-woad.vercel.app)

> An immersive, atmospheric murder-mystery supper experience web application built with **Next.js 16**, **React 19**, **Tailwind CSS v4**, **Prisma**, and powered by **Bun** with automated **GitHub Actions CI/CD** & **Vercel** deployment.

🌐 **Live Production Website:** [https://my-website-six-woad.vercel.app](https://my-website-six-woad.vercel.app)  
📁 **GitHub Repository:** [Niranjan-Software-DEV/my-website](https://github.com/Niranjan-Software-DEV/my-website)  
📘 **CI/CD Knowledge Transfer:** [CI_CD_KT.md](./CI_CD_KT.md)

---

## 📑 Table of Contents

- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📋 Prerequisites](#-prerequisites)
- [🚀 Quick Start & How to Run Everything](#-quick-start--how-to-run-everything)
  - [1. Clone & Navigate](#1-clone--navigate)
  - [2. Environment Configuration](#2-environment-configuration)
  - [3. Install Dependencies](#3-install-dependencies)
  - [4. Database Setup (Prisma)](#4-database-setup-prisma)
  - [5. Run Local Development Server](#5-run-local-development-server)
  - [6. Run Tests & Linting](#6-run-tests--linting)
  - [7. Production Build & Standalone Server](#7-production-build--standalone-server)
- [📜 Complete Script Reference](#-complete-script-reference)
- [🔄 CI/CD & Deployment Flow](#-cicd--deployment-flow)
- [📂 Project Directory Structure](#-project-directory-structure)
- [👤 Author & License](#-author--license)

---

## ✨ Features

- 🕯️ **Immersive Noir Aesthetic**: Custom vintage typewriter typography, moody dark lighting, animated dust motes, and interactive desk lamp controls.
- 🕵️ **Interactive Evidence Board**: Dynamic clue connections, pinned photos, and dossier case cards.
- 🎟️ **Seat & Ticket Booking**: Interactive reservation form with live date and tier selections.
- ⚡ **Next.js 16 App Router & Turbopack**: High-performance Server & Client Component architecture.
- 🚀 **Full CI/CD Pipeline**: Automated testing, linting, and building with **Bun** via GitHub Actions, auto-deploying to Vercel on every push.

---

## 🛠️ Tech Stack

| Layer | Technology | Description |
|---|---|---|
| **Frontend Framework** | **Next.js 16** (App Router) | Modern React 19 server/client components |
| **Styling & UI** | **Tailwind CSS v4** + Radix UI + Shadcn | Responsive styling & accessible UI primitives |
| **Animations** | **Framer Motion** | Micro-interactions and smooth page transitions |
| **Package Manager & Runtime** | **Bun** | Fast JavaScript/TypeScript runtime & package manager |
| **ORM & Database** | **Prisma ORM** | Schema models & SQLite database client |
| **CI Engine** | **GitHub Actions** | Automated testing, linting, and build verification |
| **Hosting & CD** | **Vercel** | Edge network hosting with automated deployments |

---

## 📋 Prerequisites

Ensure you have the following installed on your machine:
- **[Bun](https://bun.sh/)** (`v1.1+` recommended) OR **[Node.js](https://nodejs.org/)** (`v20+` / `v22+`)
- **[Git](https://git-scm.com/)**

---

## 🚀 Quick Start & How to Run Everything

### 1. Clone & Navigate

```bash
git clone https://github.com/Niranjan-Software-DEV/my-website.git
cd my-website
```

---

### 2. Environment Configuration

Create a `.env` file in the project root:

```env
DATABASE_URL="file:./dev.db"
```

---

### 3. Install Dependencies

Using **Bun** (Fastest):
```bash
bun install
```

*(Or using npm: `npm install`)*

---

### 4. Database Setup (Prisma)

Generate the Prisma Client types and sync your database schema:

```bash
# Generate the Prisma Client
bun run db:generate

# Push schema to local database
bun run db:push
```

---

### 5. Run Local Development Server

Start the local Next.js development server with hot reload on port `3000`:

```bash
bun run dev
```

Open your browser and visit:  
👉 **[http://localhost:3000](http://localhost:3000)**

---

### 6. Run Tests & Linting

Verify code quality and run automated smoke tests before committing:

```bash
# Run unit & smoke tests
bun test

# Run ESLint to check for syntax and style issues
bun run lint
```

---

### 7. Production Build & Standalone Server

To test the production build locally:

```bash
# 1. Build optimized production bundle
bun run build

# 2. Start the production standalone server
bun run start
```

---

## 📜 Complete Script Reference

| Command (Bun) | Command (npm) | Description |
|---|---|---|
| `bun run dev` | `npm run dev` | Starts local Next.js dev server on `http://localhost:3000` |
| `bun run build` | `npm run build` | Builds optimized production bundle & standalone assets |
| `bun run start` | `npm run start` | Starts the production standalone server |
| `bun run lint` | `npm run lint` | Runs ESLint code quality checks |
| `bun test` | `npm test` | Runs the automated test suite |
| `bun run db:generate` | `npx prisma generate` | Generates the Prisma Client |
| `bun run db:push` | `npx prisma db push` | Pushes the Prisma schema to the database |
| `bun run db:migrate` | `npx prisma migrate dev` | Creates and runs Prisma database migrations |

---

## 🔄 CI/CD & Deployment Flow

```
 local code edit  ──►  git push main  ──►  GitHub Actions CI  ──►  Vercel Live (20s)
                                            • bun install
                                            • bun run db:generate
                                            • bun run lint
                                            • bun test
                                            • bun run build
```

Every time you push to the `main` branch:
1. **GitHub Actions** runs `.github/workflows/deploy.yml` to validate your code using Bun.
2. **Vercel** automatically builds and updates the live website at **[https://my-website-six-woad.vercel.app](https://my-website-six-woad.vercel.app)**.

For complete architectural details, see [**`CI_CD_KT.md`**](./CI_CD_KT.md).

---

## 📂 Project Directory Structure

```
my-website/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions CI/CD Pipeline definition
├── prisma/
│   └── schema.prisma           # Prisma database schema & model definitions
├── public/                     # Static public assets (images, icons, fonts)
├── src/
│   ├── app/                    # Next.js App Router (pages, layout, API routes)
│   │   ├── api/                # Backend API route handlers
│   │   ├── layout.tsx          # Root HTML & metadata layout
│   │   └── page.tsx            # Main homepage entry point
│   ├── components/
│   │   ├── noir/               # Noir-themed custom components (Hero, Footer, Board)
│   │   └── ui/                 # Reusable UI primitives (Buttons, Dialogs, Cards)
│   └── lib/                    # Shared utility functions
├── tests/
│   └── smoke.test.ts           # Bun automated smoke test suite
├── .env                        # Environment variables
├── bun.lock                    # Bun dependency lockfile
├── CI_CD_KT.md                 # Complete Master CI/CD Knowledge Transfer document
├── next.config.ts              # Next.js configuration
├── package.json                # Project dependencies & scripts
├── tailwind.config.ts          # Tailwind CSS styling configuration
└── tsconfig.json               # TypeScript compiler configuration
```

---

## 👤 Author & License

- **Author**: Niranjan ([@Niranjan-Software-DEV](https://github.com/Niranjan-Software-DEV))
- **Live URL**: [https://my-website-six-woad.vercel.app](https://my-website-six-woad.vercel.app)
- **License**: Private & Proprietary
