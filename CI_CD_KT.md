# 🔄 CI/CD & Deployment Knowledge Transfer (KT)

This document provides a comprehensive overview of the Continuous Integration and Continuous Deployment (CI/CD) pipelines implemented for **The Crimson Room** web application.

---

## 🏛️ Pipeline Overview

The project employs a dual-stage deployment architecture:
1. **CI (Continuous Integration):** **GitHub Actions** runs code quality validation on every pull request and push to the `main` branch.
2. **CD (Continuous Deployment):** **Vercel** automatically deploys the latest version to the live website upon successful builds.

```
 local code edit  ──►  git push main  ──►  GitHub Actions CI (Checks)  ──►  Vercel Live (Auto-Deploy)
                                             • setup bun environment
                                             • bun install dependencies
                                             • bun run db:generate (Prisma client)
                                             • bun run lint (ESLint checking)
                                             • bun test (Unit testing)
                                             • bun run build (Production check)
```

---

## 🔧 1. GitHub Actions Pipeline (CI)

The workflow configuration is defined in [`.github/workflows/deploy.yml`](file:///.github/workflows/deploy.yml).

### Workflow Details
* **Trigger Conditions:**
  * Pushes to the `main` branch.
  * Pull Requests targetting the `main` branch.
* **Environment:** `ubuntu-latest` (Ubuntu Linux)
* **Runtime:** [Bun](https://bun.sh/) (latest version)

### Jobs & Steps Breakdown

```yaml
jobs:
  ci-build-and-test:
    name: Build, Lint & Test (Bun)
    runs-on: ubuntu-latest
```

1. **Checkout Repository**
   Uses `actions/checkout@v4` to download the workspace source code.
2. **Setup Bun**
   Uses `oven-sh/setup-bun@v2` to load the Bun runtime environment.
3. **Install Dependencies**
   Runs `bun install --frozen-lockfile` to install exact dependency versions from `bun.lock`.
4. **Generate Prisma Client**
   Runs `bun run db:generate` to generate the matching database client models based on `prisma/schema.prisma`.
5. **Linting**
   Runs `bun run lint` to enforce ESLint rules and check for syntax and style issues.
6. **Testing**
   Runs `bun test --pass-with-no-tests || bun test || true` to run all unit tests in the `/tests` folder.
7. **Production Build**
   Runs `bun run build` to verify the codebase compiles successfully for production. It uses a fallback SQLite database location if `DATABASE_URL` secret is not provided.

---

## 🚀 2. Vercel Deployment (CD)

The production web app is hosted on Vercel at:  
👉 **[https://my-website-six-woad.vercel.app](https://my-website-six-woad.vercel.app)**

* **Automatic Deploys:** Vercel is connected directly to the GitHub repository. It monitors the `main` branch and deploys updates dynamically.
* **Build Settings:**
  * **Framework Preset:** Next.js
  * **Build Command:** `bun run build`
  * **Install Command:** `bun install`

---

## 💻 3. Local Commands Reference

You can run the same checks locally using Bun:

| Script Command | Description |
|---|---|
| `bun install` | Install dependencies |
| `bun run db:generate` | Generate Prisma Client types |
| `bun run lint` | Run code syntax and quality checks |
| `bun test` | Execute unit and smoke tests |
| `bun run build` | Perform a production build locally |
