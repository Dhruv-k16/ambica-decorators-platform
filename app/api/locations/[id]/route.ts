import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { bad, ok } from '@/lib/api';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();

    const { id } = await params;
    const b = await req.json();

    const item = await prisma.location.update({
      where: { id },
      data: {
        name: b.name,
        state: b.state,
        description: b.description,
        published: b.published,
        sortOrder: Number(b.sortOrder ?? 0),
      },
    });

    return ok(item);
  } catch (e) {
    return bad(
      e instanceof Error ? e.message : 'Request failed',
      400
    );
  }
}
