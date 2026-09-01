import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: { default: 'Next Pizza', template: '%s | Next Pizza' },
  description: 'Вкусная пицца с доставкой',
  openGraph: {
    title: 'Next Pizza',
    description: 'Вкусная пицца с доставкой',
    url: 'https://next-pizza.example.com',
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
