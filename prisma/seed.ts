import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌸 Seeding Ambica Decorators database...");

  // ------------------------------------------------------------
  // ADMIN USER
  // ------------------------------------------------------------
  const email = process.env.ADMIN_EMAIL || "admin@ambicadecorators.com";
  const password = process.env.ADMIN_PASSWORD || "ChangeMeImmediately!";

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.adminUser.upsert({
    where: { email },
    update: {
      name: "Ambica Admin",
      passwordHash,
      role: "ADMIN",
    },
    create: {
      name: "Ambica Admin",
      email,
      passwordHash,
      role: "ADMIN",
    },
  });

  console.log(`✓ Admin: ${email}`);

  // ------------------------------------------------------------
  // SERVICES
  // ------------------------------------------------------------
await prisma.service.deleteMany({
  where: {
    name: {
      in: [
        "Wedding Planning",
        "Event Management",
        "Wedding Décor",
        "Mandap Décor",
        "Stage Décor",
        "Entry Décor",
        "Venue Décor",
        "Complete Event Setup",
      ],
    },
  },
});

  const services = [
  {
    name: "Wedding Decoration",
    description:
      "Complete wedding decoration including mandap, stage, entry, passage, floral décor, seating décor and overall venue styling.",
  },
  {
    name: "Wedding Planning",
    description:
      "End-to-end wedding planning, coordination and execution tailored to your celebration.",
  },
  {
    name: "Event Management",
    description:
      "Professional planning, coordination and execution for weddings, social, corporate, government and other events.",
  },
  {
    name: "Wedding Designing",
    description:
      "Creative wedding concepts, themes, colour palettes, layouts and visual styling designed around your celebration.",
  },
  {
    name: "Event Setup",
    description:
      "Complete event infrastructure including dome, stage, chairs, tables, lighting and other setup requirements.",
  },
  {
    name: "Venue Décor",
    description:
      "Complete venue styling and decoration designed to transform the space according to your event and theme.",
  },
];

  for (let i = 0; i < services.length; i++) {
    const service = services[i];

    await prisma.service.upsert({
      where: { name: service.name },
      update: {
        description: service.description,
        sortOrder: i,
        published: true,
      },
      create: {
        name: service.name,
        description: service.description,
        sortOrder: i,
        published: true,
      },
    });
  }

  console.log(`✓ Services: ${services.length}`);

  // ------------------------------------------------------------
  // LOCATIONS
  // ------------------------------------------------------------
  const locations = [
    ["Idar", "Gujarat"],
    ["Sabarkantha", "Gujarat"],
    ["Gandhinagar", "Gujarat"],
    ["Ahmedabad", "Gujarat"],
    ["Khedbrahma", "Gujarat"],
    ["Ambaji", "Gujarat"],
    ["Abu Road", "Rajasthan"],
    ["Udaipur", "Rajasthan"],
    ["Rajsamand", "Rajasthan"],
    ["Nathdwara", "Rajasthan"],
    ["Kankroli", "Rajasthan"],
    ["Kumbhalgarh", "Rajasthan"],
  ] as const;

  for (let i = 0; i < locations.length; i++) {
    const [name, state] = locations[i];

    await prisma.location.upsert({
      where: { name },
      update: {
        state,
        sortOrder: i,
        published: true,
      },
      create: {
        name,
        state,
        sortOrder: i,
        published: true,
      },
    });
  }

  console.log(`✓ Locations: ${locations.length}`);

  // ------------------------------------------------------------
  // FAQs
  // ------------------------------------------------------------
  const faqs = [
    {
      question: "Which locations do you serve?",
      answer:
      "Ambica Decorators is based in Idar, Gujarat, with operations in Udaipur and Rajsamand, Rajasthan, and serves surrounding destinations across Gujarat and Rajasthan.",
    },
    {
      question: "Do you handle complete wedding setups?",
      answer:
      "Yes. We can manage complete event setups including planning, décor, mandap, stage, entry and venue décor.",
    },
    {
      question: "Can I request a customized décor theme?",
      answer:
      "Yes. Décor concepts can be customized according to your event style, venue, colour palette and requirements.",
    },
    {
      question: "Can I enquire for multiple event dates?",
      answer:
      "Yes. Our enquiry process supports multiple dates for events such as mehendi, haldi, wedding and reception.",
    },
    {
      question: "How can I enquire about an event?",
      answer:
      "Use the enquiry form on the website or contact Ambica Decorators directly through phone, WhatsApp or Instagram.",
    },
  ];

  for (let i = 0; i < faqs.length; i++) {
    const faq = faqs[i];

    const existing = await prisma.fAQ.findFirst({
      where: { question: faq.question },
    });

    if (existing) {
      await prisma.fAQ.update({
        where: { id: existing.id },
        data: {
          answer: faq.answer,
          sortOrder: i,
          published: true,
        },
      });
    } else {
      await prisma.fAQ.create({
        data: {
          question: faq.question,
          answer: faq.answer,
          sortOrder: i,
          published: true,
        },
      });
    }
  }

  console.log(`✓ FAQs: ${faqs.length}`);

  // ------------------------------------------------------------
  // WEBSITE SETTINGS
  // ------------------------------------------------------------
  const settings: Record<string, string> = {
    businessName: "Ambica Decorators",
    businessFullName: "Ambica Decorators and Wedding Planners",
    email: "decorambica@gmail.com",
    phone: "982534**** / 926534****",
    whatsapp: "926534****",
    instagramPrimary: "ambicadecorators",
    instagramSecondary: "ambicaweddingplanner",
    primaryLocation: "Idar, Gujarat",
    secondaryLocations: "Udaipur & Rajsamand, Rajasthan",
    experienceText: "35+ Years of Experience",
  };

  for (const [key, value] of Object.entries(settings)) {
    await prisma.websiteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }

  console.log(`✓ Website settings: ${Object.keys(settings).length}`);

  // ------------------------------------------------------------
  // MOCK REVIEWS
  // ------------------------------------------------------------
  const reviews = [
    {
      clientName: "Priya & Family",
      rating: 5,
      text: "The décor looked beautiful and the entire setup was handled smoothly. The team understood our requirements very well.",
      eventType: "Wedding",
      location: "Udaipur",
    },
    {
      clientName: "Mehul & Family",
      rating: 5,
      text: "Professional coordination and a lovely setup. The stage and entry décor looked exactly like the theme we discussed.",
      eventType: "Wedding",
      location: "Idar",
    },
    {
      clientName: "Kavya & Family",
      rating: 5,
      text: "Everything from the venue décor to the mandap came together beautifully. Very happy with the overall experience.",
      eventType: "Wedding",
      location: "Rajsamand",
    },
  ];

  for (const review of reviews) {
    const existing = await prisma.review.findFirst({
      where: {
        clientName: review.clientName,
        text: review.text,
      },
    });

    if (!existing) {
      await prisma.review.create({
        data: {
          ...review,
          published: true,
        },
      });
    }
  }

  console.log(`✓ Mock reviews: ${reviews.length}`);

  // ------------------------------------------------------------
  // MOCK PORTFOLIO PROJECTS
  // ------------------------------------------------------------
  const projects = [
    {
      title: "Royal Wedding Celebration",
      slug: "royal-wedding-celebration",
      description:
      "A luxury wedding décor concept featuring a statement stage, elegant mandap and coordinated venue styling.",
      eventType: "Wedding",
      location: "Udaipur",
    },
    {
      title: "Floral Mandap Celebration",
      slug: "floral-mandap-celebration",
      description:
      "A floral-focused mandap setup designed with a soft, elegant wedding palette.",
      eventType: "Wedding",
      location: "Idar",
    },
    {
      title: "Grand Reception Setup",
      slug: "grand-reception-setup",
      description:
      "A sophisticated reception stage and venue décor concept for a memorable celebration.",
      eventType: "Reception",
      location: "Rajsamand",
    },
  ];

  for (const project of projects) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: {
        title: project.title,
        description: project.description,
        eventType: project.eventType,
        location: project.location,
        published: true,
      },
      create: {
        ...project,
        published: true,
      },
    });
  }

  console.log(`✓ Mock portfolio projects: ${projects.length}`);

  console.log("");
  console.log("🎉 Ambica Decorators seed completed successfully.");
  console.log("");
  console.log(`Admin email: ${email}`);
  console.log("Admin password: value from ADMIN_PASSWORD or the development default");
}

main()
.catch((error) => {
  console.error("❌ Seed failed:");
  console.error(error);
  process.exit(1);
})
.finally(async () => {
  await prisma.$disconnect();
});
