# KAVON Web Platform

KAVON is a full-stack commerce platform organized as a monorepo:

- `frontend` — customer storefront built with Next.js
- `admin` — role-protected management dashboard built with Next.js
- `server` — Express, TypeScript, MongoDB, and Cloudinary API

The live checkout currently supports authenticated customers, Sri Lankan delivery, and Cash on Delivery. Product prices, stock, coupons, loyalty discounts, shipping, and final totals are recalculated by the API before an order is created.

## Account email verification

New customer accounts require email verification before checkout. The API sends
transactional email through Brevo; the Brevo secret must exist only in the
server environment.

Required API variables:

```text
BREVO_API_KEY=your-private-api-key
EMAIL_FROM_NAME=KAVON
EMAIL_FROM_ADDRESS=your-verified-sender@example.com
EMAIL_SUPPORT_ADDRESS=your-support-address@example.com
FRONTEND_URL=https://your-storefront.example.com
EMAIL_VERIFICATION_EXPIRY_HOURS=24
```

The sender configured by `EMAIL_FROM_ADDRESS` must be a verified Brevo sender.
New verification links are single-use, expire after 24 hours, and can be resent
after a 60-second cooldown. Existing customers are marked verified by an
idempotent migration when the server connects to MongoDB.

Run the verification regression suite from `server`:

```bash
npm test
```

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
