import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster"
import Navigation from "@/components/Navigation";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { getSession } from '@/lib/auth-server';
import { Suspense } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import Loading from './loading';

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: 'swap',
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
});

export const metadata = {
  title: 'Theatre Diary',
  description: 'Track and rate your theatre experiences',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="antialiased bg-neutral-50 dark:bg-gray-950">
        <ErrorBoundary>
          <Suspense fallback={<Loading />}>
            <AuthProvider initialSession={null}>
              <Navigation />
              <main className="pt-20">
                {children}
              </main>
            </AuthProvider>
          </Suspense>
        </ErrorBoundary>
        <Toaster />
      </body>
    </html>
  );
}
