# PRD — Moukis tech (Computer Repair Website)

## Problem statement
Premium, modern, responsive dark-themed website for laptop/electronics repair business
"Moukis tech" (owner SYLLA Mactar, France). Goals: build trust, generate bookings,
quick contact, showcase expertise, prepare for future online sales. French language.

## Stack
React 19 + Tailwind + shadcn/ui + Framer Motion + Lenis | FastAPI + JWT (bcrypt) | MongoDB

## User choices
- Contact form: stored in DB, viewed via admin page
- Blog: full working blog with admin CRUD panel
- Language: French; WhatsApp/Call: +33 7 58 96 46 20; Store: "Coming Soon" showcase

## Implemented (2026-07-08)
- Landing: kinetic hero (masked reveal + parallax), marquee, 12 services bento, About,
  Why-Choose manifesto, testimonials, gallery, future store, FAQ accordion, contact form
  (validation, shadcn Select + Calendar, sonner toast), footer with QR code + socials
- Floating WhatsApp + back-to-top, sticky nav
- Blog: public list /blog + article /blog/:slug (3 seeded posts)
- Admin: /admin/login (JWT), /admin dashboard — Messages (view/mark-read/delete),
  Blog CRUD (create/edit/delete)
- Backend: /api/auth/{login,me}, /api/contact CRUD, /api/blog CRUD; admin + blog seeding
- Tested: iteration_2.json backend 100%, frontend 100%

## Admin creds
rewllasy@gmail.com / MoukisTech2025! (see test_credentials.md)

## Backlog / Next
- P1: Email notification on new contact (Resend/SendGrid) — currently DB only
- P1: Activate online store (product catalog + Stripe checkout)
- P2: Multilingual toggle (FR/EN), before/after image slider, real gallery photos
- P2: Blog rich-text editor, categories/search
