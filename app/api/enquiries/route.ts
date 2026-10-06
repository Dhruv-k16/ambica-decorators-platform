import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { bad, ok } from '@/lib/api';

const enquirySchema = z.object({
  fullName: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(7).max(20),
  whatsapp: z.string().trim().max(20).optional(),
  email: z.string().trim().email().max(150).optional(),
  city: z.string().trim().max(100).optional(),
  venue: z.string().trim().max(200).optional(),
  guestCount: z.number().int().min(1).max(100000).optional(),
  eventTypes: z.array(z.string().trim().min(1).max(60)).max(20),
  eventDates: z
    .array(z.string().trim().min(1))
    .min(1)
    .max(20),
  services: z.array(z.string().trim().min(1).max(100)).max(20),
  budget: z.string().trim().max(100).optional(),
  venueFinalized: z.enum(['YES', 'NO', 'DISCUSSION']).optional(),
  message: z.string().trim().max(2000).optional(),
});

export async function GET() {
  try {
    await requireAdmin();

    return ok(
      await prisma.enquiry.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      })
    );
  } catch {
    return bad('Unauthorized', 401);
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);

  const parsed = enquirySchema.safeParse(body);

  if (!parsed.success) {
    return bad('Please check the enquiry details and try again.', 400);
  }

  const data = parsed.data;

  const eventDates = data.eventDates.map((value) => new Date(value));

  if (eventDates.some((date) => Number.isNaN(date.getTime()))) {
    return bad('One or more event dates are invalid.', 400);
  }

  try {
    const enquiry = await prisma.enquiry.create({
      data: {
        fullName: data.fullName,
        phone: data.phone,
        whatsapp: data.whatsapp || null,
        email: data.email || null,
        city: data.city || null,
        venue: data.venue || null,
        guestCount: data.guestCount ?? null,
        eventTypes: data.eventTypes,
        eventDates,
        services: data.services,
        budget: data.budget || null,
        venueFinalized: data.venueFinalized || 'DISCUSSION',
        message: data.message || null,
      },
    });

    return ok(enquiry, 201);
  } catch (error) {
    return bad(
      error instanceof Error ? error.message : 'Unable to submit enquiry.',
      400
    );
  }
}
