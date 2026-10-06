import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import { prisma } from './prisma';

const authSecret = process.env.AUTH_SECRET;

if (!authSecret) {
  throw new Error('AUTH_SECRET is required');
}

const secret = new TextEncoder().encode(authSecret);
const COOKIE = 'ambica_admin_session';

export async function createSession(adminId: string) {
  return new SignJWT({
    sub: adminId,
    role: 'ADMIN',
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret);
}

export async function setSession(adminId: string) {
  (await cookies()).set(COOKIE, await createSession(adminId), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSession() {
  (await cookies()).delete(COOKIE);
}

export async function requireAdmin() {
  const token = (await cookies()).get(COOKIE)?.value;

  if (!token) {
    throw new Error('UNAUTHORIZED');
  }

  try {
    const { payload } = await jwtVerify(token, secret);

    if (payload.role !== 'ADMIN' || !payload.sub) {
      throw new Error();
    }

    const admin = await prisma.adminUser.findUnique({
      where: {
        id: String(payload.sub),
      },
    });

    if (!admin) {
      throw new Error();
    }

    return admin;
  } catch {
    throw new Error('UNAUTHORIZED');
  }
}

export const sessionCookieName = COOKIE;
