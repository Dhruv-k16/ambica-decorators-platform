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

    const item = await prisma.review.update({
      where: { id },
      data: {
        clientName: b.clientName,
        eventType: b.eventType,
        location: b.location,
        text: b.text,
        rating: Number(b.rating ?? 5),
        published: b.published,
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
