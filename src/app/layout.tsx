import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster"
import Navigation from "@/components/Navigation";
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerComponentClient({ cookies });
  
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Session error:', error);
    }

    return (
      <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
        <body className="antialiased bg-gray-50">
          <Navigation session={session} />
          <main className="pt-16">
            {children}
          </main>
          <Toaster />
        </body>
      </html>
    );
  } catch (error) {
    console.error('Layout error:', error);
    return null;
  }
}