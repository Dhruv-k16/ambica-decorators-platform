import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const [
      projects,
      reviews,
      services,
      locations,
      faqs,
      settings,
    ] = await Promise.all([
      prisma.project.findMany({
        where: { published: true },
        include: {
          photos: {
            orderBy: {
              sortOrder: 'asc',
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),

      prisma.review.findMany({
        where: { published: true },
        orderBy: {
          createdAt: 'desc',
        },
      }),

      prisma.service.findMany({
        where: { published: true },
        orderBy: {
          sortOrder: 'asc',
        },
      }),

      prisma.location.findMany({
        where: { published: true },
        orderBy: {
          sortOrder: 'asc',
        },
      }),

      prisma.fAQ.findMany({
        where: { published: true },
        orderBy: {
          sortOrder: 'asc',
        },
      }),

      prisma.websiteSetting.findMany(),
    ]);

    const settingsMap = Object.fromEntries(
      settings.map((setting) => [setting.key, setting.value])
    );

    return Response.json({
      projects,
      reviews,
      services,
      locations,
      faqs,
      settings: settingsMap,
    });
  } catch (error) {
    console.error('Public API error:', error);

    return Response.json(
      {
        error: 'Unable to load public website content.',
      },
      {
        status: 500,
      }
    );
  }
}
