# Security Policy

This document outlines the security policies, procedures, and practices for the Sync-Flow frontend repository.

## Supported Versions

Only the latest version of the application is actively supported with security updates.

| Version | Supported          |
| ------- | ------------------ |
| v0.1.x  | :white_check_mark: |
| < v0.1  | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability, please do not open a public issue. Instead, report it privately to the maintainers at [security@syncflow.dev] (or the designated project lead email).

Please include the following details in your report:
- **Description**: Detailed description of the vulnerability.
- **Reproducibility**: Step-by-step instructions or proof-of-concept code to reproduce the issue.
- **Impact**: Potential impact of the vulnerability.

We aim to acknowledge reports within 48 hours and provide a remediation timeline within 7 days.

---

## Architecture & Session Security Boundaries

Our application implements a hybrid authentication and authorization architecture to guarantee security and optimal user experience.

### 1. Client-Side Security & Routing (`proxy.ts`)
- **Mechanism**: The Next.js middleware client-side proxy checks for the presence of the `session_token` cookie.
- **Security Boundary**: Client-side route gating is **purely for UX purposes** (directing unauthenticated users to the login screen and authenticated users to the dashboard).
- **Rule**: Client-side routing decisions do **not** serve as absolute security boundaries.

### 2. Realtime Socket Connections (`lib/api/chat.ts`)
- **Mechanism**: The socket connection passes the `session_token` via the connection handshakes/authentication payloads.
- **Security Boundary**: Connection requests are authenticated on the backend. The frontend must only establish the connection when the token is present.

### 3. Backend-Enforced Access Control (Source of Truth)
- **Mechanism**: The backend implements strict access controls (`ProjectAccessGuard`, `IssueAccessGuard`) to validate whether the identity associated with the session token has permission to access or mutate the resource.
- **Security Boundary**: All API requests proxied or made directly to the backend are validated at the API gateway / controller level. Frontend modifications (even if bypassed) cannot expose unauthorized data because the backend strictly rejects requests that lack proper authorization.

---

## Secrets Management & Redaction Guidelines

To prevent credentials, API keys, and sensitive tokens from leaking into source control:

### 1. Environment Secrets Policy
- **Git Protection**: The `.gitignore` file must explicitly exclude `.env`, `.env.local`, `.env.production`, and any other local environment files.
- **Template Usage**: Only generic configuration templates like `.env.example` may be committed. These templates must contain placeholder values (e.g., `http://localhost:8000`) and **never** real secrets.
- **Production Secrets**: Production API URLs, keys, and tokens must be injected via the hosting environment's environment variables dashboard or secure vaults (e.g., AWS Secrets Manager, Vercel Env Vars), never committed as files.

### 2. Redaction and Leak Remediation
If you accidentally commit a secret (e.g., API key, password, session token) to a git branch:
1. **Invalidate Immediately**: Revoke and rotate the exposed secret immediately on the service provider side (e.g., reset the password or generate a new token).
2. **Purge Git History**: Do not simply delete the secret in a new commit. You must purge it from all commit logs and history using:
   - `git-filter-repo` (Recommended)
   - BFG Repo-Cleaner
3. **Notify Security Team**: Alert the project lead to ensure the remote repository is cleaned or recreated if history rewriting is restricted.

---

## Automated Security Workflows

To maintain compliance and high security standards, the workspace incorporates automated workflows:

### 1. Dependency Auditing
- **Tool**: `pnpm audit`
- **Execution**: Checks dependencies listed in `package.json` against known vulnerability databases.
- **CI Enforcement**: Integrated into the `.github/workflows/security.yml` workflow, failing the build on critical or high vulnerabilities.

### 2. Secret Scanning
- **Tool**: Secret scanning is configured in CI using Gitleaks or GitHub Advanced Security.
- **Local Check**: Developers are encouraged to install pre-commit hooks to scan for potential secrets prior to pushing.
