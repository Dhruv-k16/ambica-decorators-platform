import './globals.css';
import './public.css';

import type { Metadata, Viewport } from 'next';

const siteUrl = 'https://www.ambicadecorators.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: 'Ambica Decorators | Wedding & Event Decorators',
    template: '%s | Ambica Decorators',
  },

  description:
    'Ambica Decorators — wedding decoration, wedding planning, event management, wedding designing, event setup and venue décor across Gujarat and Rajasthan.',

  keywords: [
    'Ambica Decorators',
    'wedding decorators',
    'wedding decoration',
    'wedding planner',
    'event management',
    'wedding designing',
    'event setup',
    'venue décor',
    'wedding decorators Idar',
    'wedding planner Udaipur',
    'event decorators Rajsamand',
    'wedding decoration Gujarat',
    'wedding decoration Rajasthan',
  ],

  alternates: {
    canonical: '/',
  },

  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: siteUrl,
    siteName: 'Ambica Decorators',
    title: 'Ambica Decorators | Wedding & Event Decorators',
    description:
      'Wedding decoration, planning, event management and venue décor across Gujarat and Rajasthan.',
    images: [
      {
        url: '/assets/logo-purple.png',
        width: 512,
        height: 512,
        alt: 'Ambica Decorators',
      },
    ],
  },

  twitter: {
    card: 'summary',
    title: 'Ambica Decorators | Wedding & Event Decorators',
    description:
      'Wedding decoration, planning, event management and venue décor across Gujarat and Rajasthan.',
    images: ['/assets/logo-purple.png'],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },

  icons: {
    icon: '/assets/logo-purple.png',
    shortcut: '/assets/logo-purple.png',
    apple: '/assets/logo-purple.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#8D0086',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Playfair+Display:wght@500;600&family=Italianno&display=swap"
          rel="stylesheet"
        />
      </head>

      <body>{children}</body>
    </html>
  );
}
