# 🚀 Deployment Checklist & Security Handbook

This document outlines the critical steps required to deploy the VSIBL authentication system safely to production.

## 1. 🔐 Environment Variables

Ensure these variables are set in your production environment (e.g., Vercel, Railway, AWS).

| Variable | Required? | value (Example) | Notes |
| :--- | :--- | :--- | :--- |
| `DATABASE_URL` | ✅ YES | `postgresql://user:pass@host/db?sslmode=require` | Must be the **pooled** connection string for Neon/serverless. |
| `JWT_SECRET` | ✅ YES | `(random 64-char string)` | Generates secure tokens. **DO NOT** use default. |
| `NEXT_PUBLIC_API_URL`| ✅ YES | `https://api.vsibl.com` | Frontend usage. |
| `ALLOWED_ORIGIN` | ✅ YES | `https://app.vsibl.com` | **Strictly** limit CORS to your frontend domain. |

### ⚠️ Critical Security Note
- **NEVER** commit `.env` files to Git.
- **NEVER** expose `DATABASE_URL` or `JWT_SECRET` to the frontend (NEXT_PUBLIC prefix).

---

## 2. 🗄️ Database & Prisma Migrations

Since we are avoiding Prisma 7 and using Neon (Postgres), follow this strict order during deployment:

### Pre-Deployment (Local/CI)
1. **Generate Client**: Ensure `package.json` has `"postinstall": "prisma generate"`.
2. **Review Migrations**: Check `prisma/migrations` for any pending changes.

### Deployment Pipeline
1. **Apply Migrations**:
   Run this command **during the build process** or as a pre-deploy hook:
   ```bash
   npx prisma migrate deploy
   ```
   *Note: Do NOT use `migrate dev` in production.*

---

## 3. 🌐 HTTPS & CORS Configuration

We are currently handling CORS via route headers. For production, you must update the `ALLOWED_ORIGIN` logic.

### Action Item: Update `route.ts` Logic
Currently, headers are hardcoded or permissive. Change `Access-Control-Allow-Origin` to utilize an environment variable.

```typescript
const allowedOrigin = process.env.ALLOWED_ORIGIN || 'https://your-production-domain.com';

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};
```

**Cookie Attributes (If moving to Cookies later):**
- `Secure`: true (HTTPS only)
- `SameSite`: 'Strict' or 'Lax'
- `HttpOnly`: true

---

## 4. 🧪 Post-Deployment Smoke Tests

Run these tests against your **PRODUCTION** URL immediately after deployment.

### 1. Health Check
```bash
curl -I https://api.vsibl.com/api/auth/options
# Expect: 200 OK
```

### 2. Full Flow Verification (PowerShell/Bash)
```bash
# 1. Signup
curl -X POST https://api.vsibl.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"prod_test_01@vsibl.com", "password":"StrongPassword123!", "name":"Smoke Test"}'

# 2. Login (Get Tokens)
curl -X POST https://api.vsibl.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"prod_test_01@vsibl.com", "password":"StrongPassword123!"}'

# 3. Refresh Token
curl -X POST https://api.vsibl.com/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"<TOKEN_FROM_STEP_2>"}'
```

---

## 5. 🚒 Troubleshooting Guide: "If X breaks, check Y"

| Symptom | Likely Cause | Solution |
| :--- | :--- | :--- |
| **Login returns 500** | DB connection failed | Check `DATABASE_URL` is correct and allowed to connect from Vercel IPs. |
| **"Invalid credentials" loop** | `JWT_SECRET` mismatch | Ensure `JWT_SECRET` is consistent across restarts/instances. |
| **CORS Errors (Frontend)** | Origin mismatch | Verify `Access-Control-Allow-Origin` matches the exact frontend URL (no trailing slash). |
| **Refresh returns 401 immediately** | Token Rotation Logic | Check DB `RefreshToken` table. If `revoked=true`, family revocation was triggered. |
| **Prisma "Client not found"** | Build artifact missing | Ensure `npx prisma generate` ran during build. |

## 6. 🛡️ Final Security Review

- [ ] Rate Limiting enabled? (Consider Vercel KV or Upstash ratelimit)
- [ ] Logs do NOT contain passwords or tokens?
- [ ] Database backups scheduled?
