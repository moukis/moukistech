# Moukis tech — Site de réparation d'ordinateurs

Premium dark-themed, French-language website for **Moukis tech** (owner: **SYLLA Mactar**, laptop & electronics repair technician, France). Built to build trust, generate repair bookings, and prepare for future online sales.

- **Frontend:** React 19 + Tailwind CSS + shadcn/ui + Framer Motion + Lenis (smooth scroll)
- **Backend:** FastAPI (Python) + JWT auth (bcrypt)
- **Database:** MongoDB

---

## ✨ Features

- **Landing page** (one-page): kinetic hero, editorial marquee, 12 service cards (bento grid), About, "Pourquoi me choisir" manifesto, testimonials, gallery, future store showcase, FAQ accordion, contact form.
- **Contact form** → stored in the database, viewable in the admin panel (mark read / delete).
- **Full blog** with public listing + article pages, and an **admin panel** to create / edit / delete posts.
- **Admin dashboard** (`/admin`) protected by JWT login.
- Floating WhatsApp button, back-to-top, sticky nav, QR code to contact, social icons, SEO titles, accessibility (focus states, reduced-motion).

---

## 📁 Project structure

```
/app
├── backend
│   ├── server.py          # FastAPI app: auth, contact CRUD, blog CRUD, seed logic
│   ├── requirements.txt    # Python dependencies
│   └── .env                # MONGO_URL, DB_NAME, JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD
└── frontend
    ├── src
    │   ├── App.js
    │   ├── pages/          # Landing, Blog, BlogArticle, AdminLogin, AdminDashboard
    │   ├── components/     # Navbar, Footer, FloatingActions, sections/*
    │   ├── context/        # AuthContext (JWT in localStorage)
    │   ├── data/content.js # All French copy (services, testimonials, FAQ, store)
    │   └── lib/api.js      # Axios client
    ├── package.json
    └── .env                # REACT_APP_BACKEND_URL
```

---

## 🔐 Admin credentials (default)

| Field    | Value                    |
|----------|--------------------------|
| URL      | `/admin/login`           |
| Email    | `rewllasy@gmail.com`     |
| Password | `MoukisTech2025!`        |

> Change these by editing `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `backend/.env` then restarting the backend (the admin is re-seeded automatically).

---

## 🚀 Run locally (step by step)

### Prerequisites
- **Node.js 18+** and **Yarn**
- **Python 3.11+**
- **MongoDB** running locally (or a connection string)

### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>
```

### 2. Configure environment variables

`backend/.env`
```
MONGO_URL="mongodb://localhost:27017"
DB_NAME="moukis_tech"
CORS_ORIGINS="*"
JWT_SECRET="<generate: python3 -c 'import secrets;print(secrets.token_hex(32))'>"
ADMIN_EMAIL="rewllasy@gmail.com"
ADMIN_PASSWORD="MoukisTech2025!"
FRONTEND_URL="http://localhost:3000"
```

`frontend/.env`
```
REACT_APP_BACKEND_URL=http://localhost:8001
```

### 3. Start the backend
```bash
cd backend
pip install -r requirements.txt
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```
On first start, the admin account and 3 sample blog posts are seeded automatically.

### 4. Start the frontend (new terminal)
```bash
cd frontend
yarn install
yarn start
```

### 5. Open the app
- Website: <http://localhost:3000>
- Admin panel: <http://localhost:3000/admin/login>
- API docs: <http://localhost:8001/docs>

---

## 🔌 API overview (all prefixed with `/api`)

| Method | Endpoint                     | Auth | Description                    |
|--------|------------------------------|------|--------------------------------|
| POST   | `/api/auth/login`            | —    | Login → returns JWT + user     |
| GET    | `/api/auth/me`               | ✅   | Current admin                  |
| POST   | `/api/contact`               | —    | Submit contact/booking form    |
| GET    | `/api/contact`               | ✅   | List submissions               |
| PATCH  | `/api/contact/{id}/read`     | ✅   | Mark submission read           |
| DELETE | `/api/contact/{id}`          | ✅   | Delete submission              |
| GET    | `/api/blog`                  | —    | List published posts           |
| GET    | `/api/blog/{slug}`           | —    | Get a single post              |
| POST   | `/api/blog`                  | ✅   | Create post                    |
| PUT    | `/api/blog/{id}`             | ✅   | Update post                    |
| DELETE | `/api/blog/{id}`             | ✅   | Delete post                    |

Auth uses a **Bearer JWT** sent in the `Authorization` header (token stored client-side in `localStorage` under `moukis_token`).

---

## ✏️ Customizing content

Most of the French copy lives in **`frontend/src/data/content.js`** — phone, email, services, testimonials, FAQ, store items. Blog articles are managed live from the **admin panel**.

---

## 🏢 Business contact
- **Owner:** SYLLA Mactar
- **Phone / WhatsApp:** +33 7 58 96 46 20
- **Email:** rewllasy@gmail.com
- **Country:** France

---

© Moukis tech. All rights reserved.
