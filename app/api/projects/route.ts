import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { bad, ok } from '@/lib/api';

export async function GET() {
  try {
    await requireAdmin();

    return ok(
      await prisma.project.findMany({
        include: {
          photos: {
            orderBy: { sortOrder: 'asc' },
          },
        },
        orderBy: { createdAt: 'desc' },
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

    const item = await prisma.project.create({
      data: {
        title: b.title,
        slug: b.slug,
        eventType: b.eventType,
        location: b.location,
        description: b.description,
        coverImage: b.coverImage,
        published: b.published ?? true,
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
