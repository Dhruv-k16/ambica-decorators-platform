import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { bad, ok } from '@/lib/api';

export async function GET() {
  try {
    await requireAdmin();

    return ok(
      await prisma.location.findMany({
        orderBy: { sortOrder: 'asc' },
      })
    );
  } catch {
    return bad('Unauthorized', 401);
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();

    const b = await req.json();

    const item = await prisma.location.create({
      data: {
        name: b.name,
        state: b.state,
        description: b.description,
        published: b.published ?? true,
        sortOrder: Number(b.sortOrder ?? 0),
      },
    });

    return ok(item, 201);
  } catch (e) {
    return bad(
      e instanceof Error ? e.message : 'Request failed',
      400
    );
  }
}
