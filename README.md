# KAVON Web Platform

<<<<<<< HEAD
KAVON contains three applications:

- `frontend` — customer storefront (Next.js, port 3000)
- `admin` — management dashboard (Next.js, port 3001)
- `server` — Express/TypeScript API (port 5000) with MongoDB Atlas

## Fresh clone setup

### 1. Prerequisites

- Node.js 22 or newer
- npm 11 or newer
- A MongoDB Atlas project and cluster
- Optional feature accounts: Cloudinary for image uploads and an SMTP mailbox for email

Run all commands below from the repository root.

### 2. Install exact dependencies

```powershell
npm run install:all
```

### 3. Create local environment files

```powershell
Copy-Item server/.env.example server/.env.local
Copy-Item frontend/.env.example frontend/.env.local
Copy-Item admin/.env.example admin/.env.local
```

Both Next.js files must contain exactly this local API base (including one `/api`):

```text
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 4. Configure MongoDB Atlas

1. In Atlas, create or select a cluster.
2. Under **Database Access**, create a database user with read/write access.
3. Under **Network Access**, allow your current IP address. Use `0.0.0.0/0` only when you understand the security trade-off and the database user has a strong unique password.
4. Choose **Connect → Drivers → Node.js** and copy the connection string.
5. Replace `<db_password>` with the URL-encoded database-user password and include the database name `kavon` before the query string.

Example shape (never commit the real value):

```text
MONGODB_URI=mongodb+srv://DATABASE_USER:ENCODED_PASSWORD@CLUSTER_HOST/kavon?retryWrites=true&w=majority
```

Set at least these values in `server/.env.local`:

```text
NODE_ENV=development
PORT=5000
MONGODB_URI=your-real-atlas-driver-uri
JWT_SECRET=a-long-random-secret
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
FRONTEND_URL=http://localhost:3000
```

Generate a JWT secret with:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 5. Optional but required for the related features

For product/avatar uploads, fill in the three `CLOUDINARY_*` values in `server/.env.local`.

For verification, order, and campaign email, fill in `EMAIL_FROM_ADDRESS`, `EMAIL_PASSWORD`, and optionally the SMTP overrides. Gmail and Outlook normally require an app password. Keep these values only in `server/.env.local` or the deployment provider's secret settings.

For password recovery, fill in the three `EMAILJS_*` values.

### 6. Create the first administrator

In `server/.env.local`, set:

```text
ADMIN_NAME=Your Name
ADMIN_EMAIL=you@example.com
ADMIN_PASSWORD=a-unique-password-with-at-least-12-characters
```

Then run once:

```powershell
npm --prefix server run seed:admin
```

The command creates the account or promotes an existing account with the same email. Remove `ADMIN_PASSWORD` from the environment file after the seed succeeds.

### 7. Start the three apps

Open three terminals at the repository root:

```powershell
npm run dev:server
```

```powershell
npm run dev:frontend
```

```powershell
npm run dev:admin
```

Open:

- Storefront: http://localhost:3000
- Admin: http://localhost:3001
- API health: http://localhost:5000

The API health page should show `KAVON_API: SYSTEM_ACTIVE`. A request to `http://localhost:5000/api/products` verifies the MongoDB connection; it should return JSON, not HTTP 503.

### 8. Verify before deployment

```powershell
npm run check
```

## Deployment configuration

- Set the Vercel project root to `frontend` for the storefront and `admin` for the dashboard.
- Deploy `server` using `render.yaml` or another Node host.
- Set `NEXT_PUBLIC_API_URL` in both Next.js deployments to `https://YOUR-API-HOST/api`.
- Set `CORS_ORIGINS` on the API to the exact storefront and admin origins, comma-separated and without trailing slashes.
- Put all secrets in provider environment settings; never commit `.env` or `.env.local`.

## Common failures

- **API routes return 503:** `MONGODB_URI` is missing, malformed, the Atlas IP allowlist is wrong, or the database username/password is wrong.
- **Browser shows CORS errors:** `CORS_ORIGINS` does not exactly match `http://localhost:3000` and `http://localhost:3001` (or the deployed origins).
- **Frontend/admin cannot load data:** `NEXT_PUBLIC_API_URL` must end in exactly one `/api`.
- **Admin login fails:** run the admin seed command and use the seeded email/password.
- **Emails fail but registration succeeds:** SMTP variables are missing or the provider requires an app password.
- **Image upload fails:** Cloudinary variables are missing or invalid.
- **`EPERM` mentions `next-swc...node`:** stop the running Next.js dev server, run `npm ci` in that app, then restart it.
=======
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
>>>>>>> 0046e567ddbf60b0a1c0c1c6fa8ee5d2dd390c70
