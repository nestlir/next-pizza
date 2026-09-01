import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: 'Next Pizza', template: '%s | Next Pizza' },
  description: 'Вкусная пицца с доставкой',
  openGraph: {
    title: 'Next Pizza',
    description: 'Вкусная пицца с доставкой',
    url: siteUrl,
    siteName: 'Next Pizza',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    locale: 'ru_RU',
    type: 'website',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
