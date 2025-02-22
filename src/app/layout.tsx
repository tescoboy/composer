import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster"
import Navigation from "@/components/Navigation";
import { getSession } from "@/lib/auth";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
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
  const session = await getSession();

  return (
    <html lang="en" className={playfair.variable}>
      <body className="antialiased bg-gray-50">
        <Navigation session={session} />
        <main className="pt-16">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}