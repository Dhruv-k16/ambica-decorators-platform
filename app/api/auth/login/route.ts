import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { setSession } from '@/lib/auth';
import { bad, ok } from '@/lib/api';
import {
  checkLoginRateLimit,
  clearLoginFailures,
  recordLoginFailure,
} from '@/lib/rate-limit';

function getClientKey(req: NextRequest) {
  const forwardedFor = req.headers.get('x-forwarded-for');

  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  return req.headers.get('x-real-ip') || 'unknown';
}

export async function POST(req: NextRequest) {
  const key = `login:${getClientKey(req)}`;

  const limit = checkLoginRateLimit(key);

  if (!limit.allowed) {
    return new Response(
      JSON.stringify({
        error: 'Too many login attempts. Please try again later.',
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(limit.retryAfter),
        },
      }
    );
  }

  const body = await req.json().catch(() => null);

  if (!body?.email || !body?.password) {
    return bad('Email and password are required');
  }

  const email = String(body.email).trim().toLowerCase();
  const password = String(body.password);

  const admin = await prisma.adminUser.findUnique({
    where: {
      email,
    },
  });

  if (
    !admin ||
    !(await bcrypt.compare(password, admin.passwordHash))
  ) {
    recordLoginFailure(key);
    return bad('Invalid credentials', 401);
  }

  clearLoginFailures(key);

  await setSession(admin.id);

  return ok({
    id: admin.id,
    name: admin.name,
    email: admin.email,
  });
}
