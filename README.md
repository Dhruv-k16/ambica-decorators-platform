# Ambica Decorators — Production Platform Foundation

A Next.js 15 + TypeScript + Prisma + PostgreSQL foundation for the Ambica Decorators public website and secure admin CMS.

## Stack
- Next.js App Router
- TypeScript
- PostgreSQL
- Prisma ORM
- JWT session in an HttpOnly cookie
- bcrypt password hashing
- Zod can be added to each route for stricter validation

## Run
1. Install Node.js 20+ and PostgreSQL.
2. Copy `.env.example` to `.env` and set `DATABASE_URL` and a strong `AUTH_SECRET`.
3. `npm install`
4. `npx prisma db push`
5. `ADMIN_EMAIL=your-email ADMIN_PASSWORD='your-password' npm run db:seed`
6. `npm run dev`
7. Open `http://localhost:3000/login`

## Important
The admin dashboard in this foundation is authenticated, but it is intentionally the first production layer rather than the finished CMS UI. Before public deployment, add rate limiting, strict Zod validation, audit logs, CSRF strategy appropriate to the chosen mutation pattern, password reset via a transactional email provider, Cloudinary signed uploads, backups, monitoring, and production secret management.
