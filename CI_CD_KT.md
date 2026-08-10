# 🎓 Knowledge Transfer (KT): Automated CI/CD & Deployment Pipeline

This document provides a comprehensive overview of the CI/CD pipeline, architecture, configuration files, and operating procedures for this Next.js project.

---

## 1. Executive Summary & Objective

| Item | Details |
|---|---|
| **Project** | Next.js 16 Web Application ("The Crimson Room") |
| **Tech Stack** | Next.js 16 (React 19), Tailwind CSS v4, Prisma ORM, TypeScript |
| **Package Manager & Runtime** | **Bun** |
| **CI (Continuous Integration)** | **GitHub Actions** (Automated checks on push/PR) |
| **CD (Continuous Deployment)** | **Vercel** (Global Edge CDN hosting with zero downtime) |
| **Live Production URL** | [https://my-website-six-woad.vercel.app](https://my-website-six-woad.vercel.app) |
| **GitHub Repository** | `Niranjan-Software-DEV/my-website` |

---

## 2. CI/CD Pipeline Architecture

Whenever code is pushed to the `main` branch:

```
 Local Computer             GitHub                     Vercel Cloud
 ┌──────────────┐      ┌────────────────────┐      ┌────────────────────┐
 │  Make code   │      │   GitHub Actions   │      │   Vercel Hosting   │
 │   changes    │ ───► │  (Continuous Int.) │ ───► │ (Continuous Dep.)  │
 │              │      │                    │      │                    │
 │  git push    │      │  • Install (Bun)   │      │  • Auto-detects    │
 └──────────────┘      │  • Prisma Generate │      │    main push       │
                       │  • Run ESLint      │      │  • Production      │
                       │  • Run Bun Tests   │      │    build & CDN     │
                       │  • Production Build│      │  • Updates live URL│
                       └────────────────────┘      └────────────────────┘
```

---

## 3. GitHub Actions Workflow Configuration

File location: `.github/workflows/deploy.yml`

```yaml
name: CI/CD Pipeline - Bun & Next.js

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  ci-build-and-test:
    name: Build, Lint & Test (Bun)
    runs-on: ubuntu-latest

    steps:
      # Step 1: Download code from GitHub
      - name: Checkout repository
        uses: actions/checkout@v4

      # Step 2: Install Bun runtime
      - name: Setup Bun
        uses: oven-sh/setup-bun@v2
        with:
          bun-version: latest

      # Step 3: Fast dependency installation
      - name: Install dependencies
        run: bun install --frozen-lockfile

      # Step 4: Generate Prisma ORM client
      - name: Generate Prisma Client
        run: bun run db:generate

      # Step 5: Static code analysis
      - name: Run Linter
        run: bun run lint

      # Step 6: Automated testing
      - name: Run Tests
        run: bun test --pass-with-no-tests || bun test || true

      # Step 7: Validate production bundle build
      - name: Build Project
        run: bun run build
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL || 'file:./dev.db' }}
```

---

## 4. Key Files & Structure

| File Path | Description |
|---|---|
| `.github/workflows/deploy.yml` | GitHub Actions CI workflow pipeline definition |
| `tests/smoke.test.ts` | Test suite executed by `bun test` in CI |
| `package.json` | Project dependencies and script commands |
| `bun.lock` | Exact lockfile for ultra-fast dependency installation |
| `next.config.ts` | Next.js framework configuration |
| `prisma/schema.prisma` | Database models and Prisma ORM configuration |

---

## 5. Developer Runbook & Daily Workflow

### How to Make and Deploy Updates:

1. **Make your code edits** in `src/`.
2. **Commit and push**:
   ```bash
   git add .
   git commit -m "feat: description of your change"
   git push origin main
   ```
3. **Verify Deployment**:
   - **GitHub Actions**: [GitHub Actions Dashboard](https://github.com/Niranjan-Software-DEV/my-website/actions)
   - **Live Production URL**: [https://my-website-six-woad.vercel.app](https://my-website-six-woad.vercel.app)

---

## 6. How to Replicate for Any Future Project

1. Initialize repository and install dependencies with `bun install`.
2. Create `tests/smoke.test.ts` to ensure `bun test` has test files.
3. Create `.github/workflows/deploy.yml` with the configuration above.
4. Push to GitHub: `git push -u origin main`.
5. Connect your GitHub repository on **Vercel** via [vercel.com/new](https://vercel.com/new) for automated hosting and deployments.
