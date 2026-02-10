# Catcam

A Next.js frontend for viewing **Shinobi** camera feeds: live streams and recordings. Log in with your Shinobi credentials, pick a monitor, and watch live or browse past videos.

## Features

- **Live view** – HLS livestream with monitor selector and HQ/stream quality toggle
- **Recordings** – Browse and play recorded clips with thumbnails
- **Settings** – Default camera, home page, theme (light / dark / auto), stream quality
- **Auth** – Session-based login against your Shinobi backend; CSRF and secure cookies in production

## Tech stack

- **Next.js 16** (App Router), **React 19**, **TypeScript**
- **Tailwind CSS 4**, HeroUI, Framer Motion
- **HLS.js** for live/recorded video playback
- **Standalone** output for smaller Docker images

## Prerequisites

- **Node.js 20+** (local dev)
- A **Shinobi** backend (or compatible API) reachable at `SERVER_URL`
- For Docker: **Docker** and **Docker Compose** (or Portainer)

---

## Local development

1. **Clone and install**

   ```bash
   git clone <repo-url>
   cd catcam
   npm install
   ```

2. **Environment variables**

   Copy the example env file and fill in your values:

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your Shinobi API URL and secrets (see [Environment variables](#environment-variables) below).

3. **Run the dev server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000). You’ll be redirected to `/login` if not authenticated.

### Scripts

| Command         | Description           |
| --------------- | --------------------- |
| `npm run dev`   | Start dev server      |
| `npm run build` | Production build      |
| `npm run start` | Run production server |
| `npm run lint`  | Run ESLint            |

---

## Docker

The app is built as a **standalone** Next.js app and runs with `node server.js` (no full `node_modules` in the final image).

### Where the image lives (GitHub Actions)

On every **push to `main`**, the GitHub Action builds the image and pushes it to **GitHub Container Registry (GHCR)**. The image URL is:

```text
ghcr.io/<your-github-username-or-org>/catcam:latest
```

Replace `<your-github-username-or-org>` with your GitHub user or organization name (same as in the repo URL). You can pull it from any machine logged in to GHCR, or use it in docker-compose / Portainer.

- **Pull from GHCR:** `docker pull ghcr.io/OWNER/catcam:latest` (after logging in: `docker login ghcr.io` with a GitHub Personal Access Token with `read:packages`).
- **In docker-compose:** Set `CATCAM_IMAGE=ghcr.io/OWNER/catcam:latest` in your `stack.env` (see `.env.example`). Then run `docker compose --env-file stack.env up -d` — no local build needed.

### Build and run with Docker Compose

1. **Env file**

   Create a `stack.env` with your real values (you can copy from `.env.example`). To use the CI-built image, add `CATCAM_IMAGE=ghcr.io/OWNER/catcam:latest` (replace `OWNER`). Compose uses it for container env.

2. **Pull and start (using CI image)**

   ```bash
   docker compose --env-file stack.env pull
   docker compose --env-file stack.env up -d
   ```

   Or **build locally** (no CI image):

   ```bash
   docker compose --env-file stack.env build
   docker compose --env-file stack.env up -d
   ```

   The app will listen on `PORT` from your env (default 3000).

### Build and run with Portainer (or plain Docker)

- **Build:** From the repo root, build the image. If your env file is not in the repo (e.g. Git clone without `.env`), pass build args so the client bundle gets the public URL:
  - `NEXT_PUBLIC_DOMAIN_NAME` = your app URL (e.g. `https://catcam.example.com`)
- **Run:** Start the container with the same env vars (e.g. via Portainer env or `stack.env`). Mount a volume for `USER_SETTINGS_PATH` if you use it.

Example (plain Docker, after building):

```bash
docker run -d \
  --env-file stack.env \
  -p 3000:3000 \
  -v /data/user-settings:/data/user-settings \
  catcam:latest
```

### Dockerfile overview

- **Builder:** Installs deps, runs `next build`. If `next.config.js` is missing (e.g. gitignored in the repo), a minimal config with `output: "standalone"` is created so `.next/standalone` is produced.
- **Runner:** Copies only `.next/standalone`, `.next/static`, and `public`. No `npm ci` in the final stage. `CMD` is `node server.js`.

---

## Environment variables

Used by the app and/or Docker.

| Variable             | Required | Description                                                                                                                                   |
| -------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `DOMAIN_NAME`        | Yes      | Public URL of this app (e.g. `https://catcam.example.com` or `http://localhost:3000`). Used for cookies, redirects, and stream URLs.          |
| `SERVER_URL`         | Yes      | Base URL of the Shinobi (or compatible) API (e.g. `https://api.shinobi.example.com`).                                                         |
| `JWT_SIGN_SECRET`    | Yes      | Secret used to sign session JWTs (e.g. base64 string).                                                                                        |
| `CSRF_TOKEN_SECRET`  | Yes      | Secret used for CSRF tokens.                                                                                                                  |
| `PORT`               | No       | Port the app listens on (default `3000`).                                                                                                     |
| `USER_SETTINGS_PATH` | No       | Directory for persisted user settings (e.g. `/data/user-settings`). Used with Docker volume.                                                  |
| `CATCAM_IMAGE`       | No       | Docker image for docker-compose (default `catcam:latest`). Set to `ghcr.io/OWNER/catcam:latest` when using the image built by GitHub Actions. |

For **client-side** code (e.g. image/stream URLs), the app uses `DOMAIN_NAME` from the **container/env at runtime** where possible; for the initial client bundle, `NEXT_PUBLIC_DOMAIN_NAME` can be passed as a **build arg** when the env file is not available during the image build (e.g. Git-only build in Portainer).

---

## Project structure (high level)

```
src/
├── app/                    # App Router pages and API routes
│   ├── api/                 # Auth, image proxy, stream proxy, settings, video
│   ├── live/                # Live stream page
│   ├── recordings/          # Recordings list and playback
│   ├── settings/            # User settings
│   └── login, logout        # Auth pages
├── components/              # UI (navbar, video player, display mode, etc.)
├── hooks/                   # useSession, useModal, etc.
├── libs/                    # Helpers (imageLoader, formatDate, CSRF, JWT)
├── models/                  # Types (monitor, video, session, settings)
├── services/                # Shinobi API client, session, settings
└── config.ts                # App config and env-derived constants
```

---

## Learn more

- [Next.js Documentation](https://nextjs.org/docs)
- [Shinobi](https://shinobi.video/) – NVR/camera backend this frontend is designed to work with
