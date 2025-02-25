import { CartProvider } from '@/app/components/cart/context';
import { Inter } from 'next/font/google';
import { Suspense } from 'react';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: process.env.SITE_NAME,
  description: 'STORES.jp Commerce'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          <Suspense>
            <main>{children}</main>
          </Suspense>
        </CartProvider>
      </body>
    </html>
  );
}
