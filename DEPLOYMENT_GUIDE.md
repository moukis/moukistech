# 🚀 Deployment Guide — Moukis tech

This guide walks you through deploying the project as **three distinct parts**:

| Part | What it is | Where it's hosted |
|------|------------|-------------------|
| **1. Database** | MongoDB (collections: `users`, `blog_posts`, `contacts`) | **MongoDB Atlas** |
| **2. Backend** | FastAPI REST API (auth, contact, blog) — folder `backend/` | **Render** (Web Service) |
| **3. Frontend** | React app (site, blog, admin) — folder `frontend/` | **Render** (Static Site) |

```
repo/
├── frontend/            # Part 3 — React (build → static site)
│   ├── .env.example
│   └── src/ ...
├── backend/             # Part 2 — FastAPI web service
│   ├── .env.example
│   ├── requirements.txt
│   └── server.py
├── database/            # Part 3 → docs + optional seed script for Atlas
│   ├── README.md
│   └── seed.py
├── render.yaml          # One-click Render Blueprint (backend + frontend)
├── DEPLOYMENT_GUIDE.md  # ← this file
└── README.md            # Local dev instructions
```

> **Data flow:** Frontend (browser) → calls `REACT_APP_BACKEND_URL/api/...` → Backend on Render → reads/writes MongoDB Atlas.

---

## Step 0 — Push the project to a NEW branch on GitHub

You want everything on a **separate branch** (e.g. `deploy`). Two ways:

### Option A — via the Emergent "Save to GitHub" button
1. Click **Save to GitHub** in the Emergent interface and authorize GitHub (one-time).
2. Choose (or create) your repository.
3. In the Save dialog, select/enter the **branch name** (e.g. `deploy`). If the UI pushes to `main`, use Option B below to move it to a branch, or create the branch afterwards on GitHub and merge.

### Option B — after downloading the code (full control over branches)
1. On GitHub, download the repo as ZIP (green **Code** button → **Download ZIP**) or clone it.
2. Locally, create and push a new branch:
   ```bash
   git checkout -b deploy
   git add .
   git commit -m "Deploy: frontend, backend, database parts + Render config"
   git push -u origin deploy
   ```

> `.env` files are **git-ignored** (secrets never leave your machine). Use the committed
> `*.env.example` files as templates and set real values in Atlas/Render dashboards.

---

## Part 1 — Database on MongoDB Atlas

1. Create a free account at **https://www.mongodb.com/cloud/atlas** and log in.
2. **Build a Database** → choose the **Free (M0)** shared cluster → pick a cloud provider/region close to France (e.g. Paris / Frankfurt) → **Create**.
3. **Database Access** (left menu) → **Add New Database User**:
   - Authentication: Password
   - Username: `moukis_admin` (your choice)
   - Password: generate a strong one and **save it**
   - Role: `Read and write to any database`
4. **Network Access** (left menu) → **Add IP Address** → **Allow access from anywhere** (`0.0.0.0/0`).
   *(Render's outbound IPs are dynamic on the free plan, so this is required.)*
5. **Database** → **Connect** → **Drivers** → copy the connection string. It looks like:
   ```
   mongodb+srv://moukis_admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
   Replace `<password>` with the real password. This is your **`MONGO_URL`**.
6. Pick a database name — this guide uses **`moukis_tech`** (your **`DB_NAME`**).

> **Seeding:** The backend automatically creates the indexes, the admin account, and 3 sample
> blog posts on its **first startup**. To pre-seed manually instead, see `database/README.md`
> (`python database/seed.py`).

---

## Part 2 — Backend on Render (Web Service)

### Fastest: deploy both services with the Blueprint
1. Go to **https://dashboard.render.com** → **New +** → **Blueprint**.
2. Connect your GitHub repo and select the **`deploy`** branch. Render detects `render.yaml`.
3. Click **Apply**. It creates `moukis-tech-backend` and `moukis-tech-frontend`.
4. Fill the env vars marked "required" below (Render prompts for `sync: false` values).

### Or manually create the backend service
1. **New +** → **Web Service** → connect repo → branch `deploy`.
2. Settings:
   - **Root Directory:** `backend`
   - **Runtime:** Python 3
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn server:app --host 0.0.0.0 --port $PORT`
   - **Health Check Path:** `/api/`
3. Add **Environment Variables**:

| Key | Value | Notes |
|-----|-------|-------|
| `MONGO_URL` | *(Atlas string from Part 1)* | required |
| `DB_NAME` | `moukis_tech` | required |
| `JWT_SECRET` | *(64-char hex)* | `python3 -c "import secrets;print(secrets.token_hex(32))"` |
| `ADMIN_EMAIL` | `rewllasy@gmail.com` | your admin login |
| `ADMIN_PASSWORD` | *(strong password)* | your admin login |
| `CORS_ORIGINS` | *(frontend URL, set after Part 3)* | e.g. `https://moukis-tech-frontend.onrender.com` |
| `FRONTEND_URL` | *(same as above)* | |

4. **Create Web Service.** When live, note the URL, e.g. `https://moukis-tech-backend.onrender.com`.
5. Quick test:
   ```
   https://moukis-tech-backend.onrender.com/api/       → {"message":"Moukis tech API"}
   https://moukis-tech-backend.onrender.com/docs       → interactive API docs
   ```

> ⚠️ **Free plan cold start:** the service sleeps after inactivity and takes ~30–60s to wake
> on the first request. Upgrade to a paid instance to keep it always-on.

---

## Part 3 — Frontend on Render (Static Site)

1. **New +** → **Static Site** → connect repo → branch `deploy` (skip if created by Blueprint).
2. Settings:
   - **Root Directory:** `frontend`
   - **Build Command:** `yarn install && yarn build`
   - **Publish Directory:** `build`
3. **Environment Variables:**

| Key | Value |
|-----|-------|
| `REACT_APP_BACKEND_URL` | your backend URL, e.g. `https://moukis-tech-backend.onrender.com` |

4. **SPA routing (important):** add a **Redirect/Rewrite** rule so refreshes on `/blog`, `/admin`, etc. work:
   - **Source:** `/*`  **Destination:** `/index.html`  **Action:** `Rewrite`
   *(The Blueprint `render.yaml` already includes this.)*
5. **Create Static Site.** When live, note the URL, e.g. `https://moukis-tech-frontend.onrender.com`.

> `REACT_APP_*` vars are baked in at **build time** — after changing it, trigger a **redeploy**.

---

## Step 4 — Wire the two services together

1. Go back to the **backend** service → Environment → set:
   - `CORS_ORIGINS` = your frontend URL (no trailing slash), e.g. `https://moukis-tech-frontend.onrender.com`
   - `FRONTEND_URL` = same value
2. **Save** → the backend redeploys automatically.
3. If you changed `REACT_APP_BACKEND_URL` on the frontend, **Manual Deploy → Clear build cache & deploy**.

---

## ✅ Post-deploy checklist

- [ ] `GET /api/` on the backend returns the JSON message.
- [ ] Frontend home page loads and the hero renders.
- [ ] Submitting the **contact form** shows a success toast (creates a record).
- [ ] `/admin/login` accepts your `ADMIN_EMAIL` / `ADMIN_PASSWORD` and opens the dashboard.
- [ ] The new contact appears in the admin **Messages** tab.
- [ ] Creating a blog post in admin makes it appear on `/blog`.
- [ ] Refreshing on `/blog` (not just navigating) still works (SPA rewrite OK).
- [ ] FR/EN toggle switches the language.

---

## 🛠️ Troubleshooting

| Symptom | Cause / Fix |
|---------|-------------|
| Frontend loads but every API call fails / CORS error in console | `CORS_ORIGINS` on the backend doesn't match the exact frontend origin. Set it to the frontend URL with `https://` and **no trailing slash**, then redeploy the backend. |
| `404` when refreshing `/blog` or `/admin` | SPA rewrite rule missing on the static site (Source `/*` → `/index.html`, Rewrite). |
| Admin login fails with correct password | Backend can't reach Mongo, or admin not seeded. Check backend logs; verify `MONGO_URL`, and that Atlas Network Access allows `0.0.0.0/0`. |
| First request very slow, then fine | Render free-tier cold start. Normal — upgrade plan to avoid. |
| `pymongo ServerSelectionTimeoutError` in logs | Atlas IP allowlist missing `0.0.0.0/0`, or wrong password in `MONGO_URL`. |
| Calls hit the wrong host | Frontend `REACT_APP_BACKEND_URL` wrong. Fix it and **rebuild** (it's compiled at build time). |

---

## 💻 Local development (recap)

```bash
# Backend
cd backend
cp .env.example .env        # fill MONGO_URL, JWT_SECRET, ADMIN_* ...
pip install -r requirements.txt
uvicorn server:app --host 0.0.0.0 --port 8001 --reload

# Frontend (new terminal)
cd frontend
cp .env.example .env        # REACT_APP_BACKEND_URL=http://localhost:8001
yarn install
yarn start
```

App → http://localhost:3000 · API docs → http://localhost:8001/docs

---

## 🐳 Optional: run the backend with Docker

A production `backend/Dockerfile` is included (plus `backend/.dockerignore`). It binds to the
platform-provided `$PORT`, so it works locally and on Render/Railway/Fly.io.

**Build & run locally:**
```bash
cd backend
docker build -t moukis-backend .
docker run -p 8001:8001 --env-file .env moukis-backend
# API → http://localhost:8001/api/
```

**Render (Docker runtime):** New + → Web Service → set **Root Directory** `backend`, **Runtime** `Docker`.
Render auto-detects the Dockerfile; add the same env vars as in Part 2. (No start command needed —
the image's `CMD` uses `$PORT`.)

**Railway:** New Project → Deploy from repo → set root/service to `backend`; Railway builds the
Dockerfile automatically. Add the env vars and it injects `PORT`.

**Fly.io:** `cd backend && fly launch` (it detects the Dockerfile) → set secrets with
`fly secrets set MONGO_URL=... JWT_SECRET=... ADMIN_EMAIL=... ADMIN_PASSWORD=... CORS_ORIGINS=... FRONTEND_URL=...`.

### Frontend container (nginx)

`frontend/Dockerfile` is a multi-stage build (Node build → nginx serve) with `frontend/nginx.conf`
handling gzip, asset caching, security headers, and the SPA fallback. Because CRA bakes env vars
at build time, pass the backend URL as a build arg:

```bash
cd frontend
docker build --build-arg REACT_APP_BACKEND_URL=https://moukis-tech-backend.onrender.com -t moukis-frontend .
docker run -p 3000:80 moukis-frontend        # → http://localhost:3000
```

### Full stack with Docker Compose (one command)

The root `docker-compose.yml` runs **MongoDB + backend + frontend** together with local defaults:

```bash
docker compose up --build
# Frontend → http://localhost:3000
# Backend  → http://localhost:8001/api/
# Admin    → http://localhost:3000/admin/login  (rewllasy@gmail.com / MoukisTech2025!)
```

Override any value with a root `.env` file or shell exports (e.g. `ADMIN_PASSWORD`, `JWT_SECRET`,
`REACT_APP_BACKEND_URL`). Mongo data persists in the `mongo_data` volume. Stop with
`docker compose down` (add `-v` to also wipe the database volume).

---

## 🔐 Environment variable reference

**Backend** (`backend/.env.example`): `MONGO_URL`, `DB_NAME`, `CORS_ORIGINS`, `FRONTEND_URL`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`

**Frontend** (`frontend/.env.example`): `REACT_APP_BACKEND_URL`

All backend routes are prefixed with **`/api`** and the frontend always calls `REACT_APP_BACKEND_URL` — keep both conventions when customizing.
