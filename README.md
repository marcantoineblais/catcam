# Catcam

A Next.js frontend for viewing **Shinobi** camera feeds: live streams and recordings. Log in with your Shinobi credentials, pick a monitor, and watch live or browse past videos.

## Features

- **Live view** – HLS livestream with monitor selector and HQ/stream quality toggle
- **Recordings** – Browse and play recorded clips with thumbnails
- **Settings** – Default camera, home page, theme (light / dark / auto), stream quality
- **Auth** – Session-based login against your Shinobi backend; CSRF and secure cookies in production

## Tech stack

- **Next.js 16** (App Router), **React 19**, **TypeScript**
- **Tailwind CSS 4**, Framer Motion
- **HLS.js** for live/recorded video playback
- **Standalone** output for smaller Docker images

## Prerequisites

- **Node.js 24** and **pnpm** (local dev). `corepack enable` installs the pnpm version pinned in `package.json`.
- A **Shinobi** backend (or compatible API) reachable at `SERVER_URL`
- For Docker: **Docker** and **Docker Compose** (or Portainer)

---

## Local development

1. **Clone and install**

   ```bash
   git clone <repo-url>
   cd catcam
   pnpm install
   ```

2. **Environment variables**

   Copy the example env file and fill in your values:

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your Shinobi API URL and secrets (see [Environment variables](#environment-variables) below).

3. **Run the dev server**

   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000). You’ll be redirected to `/login` if not authenticated.

### Scripts

| Command      | Description                 |
| ------------ | --------------------------- |
| `pnpm dev`   | Start dev server            |
| `pnpm build` | Production build            |
| `pnpm start` | Run production server       |
| `pnpm lint`  | Run ESLint                  |
| `pnpm fix`   | Run ESLint and fix problems |

---

## Docker

The app is built as a **standalone** Next.js app and runs with `node server.js` (no full `node_modules` in the final image).

### Where the image lives (GitHub Actions)

On every **push to `main` or `staging`**, the GitHub Action (`.github/workflows/build-and-release.yml`) runs lint, builds the image and pushes it to **GitHub Container Registry (GHCR)**, tagged with the commit SHA and a moving tag: `latest` for `main`, `staging` for `staging`. Pull requests to `main` run lint and build the image without pushing it. The image URL is:

```text
ghcr.io/<your-github-username-or-org>/catcam:latest
```

Replace `<your-github-username-or-org>` with your GitHub user or organization name (same as in the repo URL). You can pull it from any machine logged in to GHCR, or use it in docker-compose / Portainer.

- **Pull from GHCR:** `docker pull ghcr.io/OWNER/catcam:latest` (after logging in: `docker login ghcr.io` with a GitHub Personal Access Token with `read:packages`).
- **In docker-compose:** `docker-compose.yml` uses `ghcr.io/marcantoineblais/catcam:latest`, so `docker compose --env-file stack.env up -d` runs the latest `main` build — no local build needed.

### Releasing and deploying with Portainer

There is no version to bump: every push to `main` that passes lint is released. Once the image is pushed, CI copies `main` to the `deploy` branch with the catcam image in `docker-compose.yml` pinned to the commit's tag, and force-pushes it. Pushes to `staging` do the same with the `staging` tag and the `deploy-staging` branch. Don't commit to `deploy` or `deploy-staging`: CI overwrites them on every release.

The Portainer stack is a Git stack on this repository that follows the **`deploy` branch** (compose path `docker-compose.yml`) with polling. Each release is a new commit with a new image tag, so Portainer redeploys the stack and Compose pulls the new image, recreating only the catcam container (the MariaDB and Shinobi images don't change). Set the app's env vars as the stack's environment variables: Portainer writes them to `stack.env`.

### Build and run with Docker Compose

1. **Env file**

   Create a `stack.env` with your real values (you can copy from `.env.example`). Compose uses it for container env.

2. **Pull and start (using CI image)**

   The stack also runs Shinobi and MariaDB, and joins the external `caddy_proxy` network, so create that first (`docker network create caddy_proxy`).

   ```bash
   docker compose --env-file stack.env pull
   docker compose --env-file stack.env up -d
   ```

   The app will listen on `PORT` from your env (default 3000).

### Build and run with plain Docker

- **Build:** From the repo root, run `docker build -t catcam .`. No build args are needed: the app reads its env vars at runtime.
- **Run:** Start the container with your env file. Mount a volume for `USER_SETTINGS_PATH` if you use it.

Example:

```bash
docker run -d \
  --env-file stack.env \
  -p 3000:3000 \
  -v /data/user-settings:/data/user-settings \
  catcam:latest
```

### Dockerfile overview

- **Builder:** Installs deps with pnpm (enabled through corepack), runs `next build`. `next.config.js` sets `output: "standalone"`, which produces `.next/standalone`.
- **Runner:** Copies only `.next/standalone`, `.next/static`, and `public`. No dependency install in the final stage. `CMD` is `node server.js`.

---

## Environment variables

Used by the app and/or Docker.

| Variable             | Required | Description                                                                                                                |
| -------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------- |
| `DOMAIN_NAME`        | Yes      | Public URL of this app (e.g. `https://catcam.example.com` or `http://localhost:3000`). Used for redirects and stream URLs. |
| `SERVER_URL`         | Yes      | Base URL of the Shinobi (or compatible) API (e.g. `https://api.shinobi.example.com`).                                      |
| `SERVER_TIMEZONE`    | No       | Timezone the Shinobi server records video times in, as an IANA name (e.g. `America/Toronto`). Default `UTC`.               |
| `JWT_SIGN_SECRET`    | Yes      | Secret used to sign session JWTs (e.g. base64 string).                                                                     |
| `CSRF_TOKEN_SECRET`  | Yes      | Secret used for CSRF tokens.                                                                                               |
| `PORT`               | No       | Port the app listens on (default `3000`).                                                                                  |
| `USER_SETTINGS_PATH` | No       | Directory for persisted user settings (default `user-settings` in the working directory). Mount a Docker volume there.     |

The app reads all of these on the server at **runtime**, so the same image works for any deployment without build args.

---

## Project structure (high level)

```
.
├── app/                     # App Router pages and API routes
│   ├── api/                 # Auth, image proxy, stream proxy, settings, video
│   ├── live/                # Live stream page
│   ├── recordings/          # Recordings list and playback
│   ├── settings/            # User settings
│   ├── login/               # Login page
│   └── config.ts            # App config and env-derived constants
├── components/              # UI (navbar, video player, modal, display mode, etc.)
├── hooks/                   # useSession, useDebounce, etc.
├── libs/                    # Helpers (toImageUrl, formatDate, CSRF, JWT)
├── models/                  # Types (monitor, video, session, settings)
├── services/                # Shinobi API client, session, settings
└── proxy.ts                 # Redirects unauthenticated requests to /login
```

---

## Learn more

- [Next.js Documentation](https://nextjs.org/docs)
- [Shinobi](https://shinobi.video/) – NVR/camera backend this frontend is designed to work with
