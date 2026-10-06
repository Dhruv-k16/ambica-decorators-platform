import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { bad, ok } from '@/lib/api';

export async function GET() {
  try {
    await requireAdmin();

    const [
      enquiries,
      projects,
      reviews,
      services,
      locations,
      faqs,
      settings,
    ] = await Promise.all([
      prisma.enquiry.findMany({
        orderBy: { createdAt: 'desc' },
      }),

      prisma.project.findMany({
        orderBy: { createdAt: 'desc' },
      }),

      prisma.review.findMany({
        orderBy: { createdAt: 'desc' },
      }),

      prisma.service.findMany({
        orderBy: { sortOrder: 'asc' },
      }),

      prisma.location.findMany({
        orderBy: { sortOrder: 'asc' },
      }),

      prisma.fAQ.findMany({
        orderBy: { sortOrder: 'asc' },
      }),

      prisma.websiteSetting.findMany({
        orderBy: { key: 'asc' },
      }),
    ]);

    return ok({
      enquiries,
      projects,
      reviews,
      services,
      locations,
      faqs,
      settings,
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return bad('Unauthorized', 401);
    }

    console.error('Admin dashboard load failed:', error);

    return bad('Unable to load admin data.', 500);
  }
}
