# KAVON Web Platform

KAVON is a full-stack commerce platform organized as a monorepo:

- `frontend` — customer storefront built with Next.js
- `admin` — role-protected management dashboard built with Next.js
- `server` — Express, TypeScript, MongoDB, and Cloudinary API

The live checkout currently supports authenticated customers, Sri Lankan delivery, and Cash on Delivery. Product prices, stock, coupons, loyalty discounts, shipping, and final totals are recalculated by the API before an order is created.

## Local development

Install and run each application from its own directory:

```text
frontend: npm ci → npm run dev
admin:    npm ci → npm run dev
server:   npm ci → npm run dev
```

The storefront uses port `3000`, the admin panel uses `3001`, and the API uses `5000` by default.

## Required configuration

Storefront and admin:

```text
NEXT_PUBLIC_API_URL=https://your-api-host/api
```

API variables are listed in `server/.env.example`. Production requires MongoDB, JWT, CORS, and Cloudinary values. Password recovery also requires the EmailJS recovery variables.

Never commit `.env` or `.env.local` files.

## Production checks

Run these before deployment:

```text
frontend: npm run lint && npm test && npm run build
admin:    npm run lint && npm run build
server:   npm run build
```

The Vercel projects must use their matching root directories (`frontend`, `admin`, and `server`). `CORS_ORIGINS` must contain the exact deployed storefront and admin origins without trailing slashes.
