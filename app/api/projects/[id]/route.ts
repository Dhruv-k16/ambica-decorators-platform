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

    const item = await prisma.project.update({
      where: { id },
      data: {
        title: b.title,
        slug: b.slug,
        eventType: b.eventType,
        location: b.location,
        description: b.description,
        coverImage: b.coverImage,
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
