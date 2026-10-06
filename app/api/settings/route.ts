import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { bad, ok } from '@/lib/api';

export async function GET() {
  try {
    await requireAdmin();

    return ok(
      await prisma.websiteSetting.findMany({
        orderBy: { key: 'asc' },
      })
    );
  } catch {
    return bad('Unauthorized', 401);
  }
}

export async function PUT(req: NextRequest) {
  try {
    await requireAdmin();

    const b = await req.json();

    if (!b?.key) {
      return bad('key required');
    }

    return ok(
      await prisma.websiteSetting.upsert({
        where: { key: b.key },
        update: {
          value: String(b.value ?? ''),
        },
        create: {
          key: b.key,
          value: String(b.value ?? ''),
        },
      })
    );
  } catch (e) {
    return bad(
      e instanceof Error ? e.message : 'Request failed',
      400
    );
  }
}
