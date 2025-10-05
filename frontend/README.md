# Mediverse Frontend

This directory contains the Next.js 14 landing page and web experience for Mediverse.

## Quick start

```bash
npm install
cp .env.local.example .env.local  # optional: configure backend URL
npm run dev
```

The dev server runs on `http://localhost:3000`.

## Features

- **Animated hero** with gradient overlays and floating elements powered by Framer Motion.
- **Live demo console** that sends sample queries to the FastAPI backend and displays structured responses.
- **Modal booking flow** using Headless UI with working CTAs and form validation states.
- **Testimonial carousel** with autoplay and manual navigation indicators.
- **Responsive sections** covering features, workflow, FAQ, partners, and contact forms.

## Environment variables

Create a `.env.local` file:

```properties
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

When deploying, point this to your production backend URL.

## Build & deploy

```bash
npm run build
npm run start
```

For static export (if needed):

```bash
npm run build
npx next export
```

## Stack

- **Next.js 14** with App Router and React Server Components
- **TypeScript** for type safety
- **Tailwind CSS** for utility-first styling
- **Framer Motion** for declarative animations
- **Headless UI** for accessible modal dialogs and dropdowns
- **Heroicons** for consistent iconography

---

For backend setup and API documentation, see the main [README](../README.md).
