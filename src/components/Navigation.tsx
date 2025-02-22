'use client';

import Link from 'next/link';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function Navigation({ session }: { session: Session | null }) {
  const router = useRouter();

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      }
    });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="font-bold">Theatre Diary</Link>

          <div>
            {session ? (
              <div className="flex items-center gap-4">
                <span>{session.user.email}</span>
                <button onClick={handleSignOut}>Sign Out</button>
              </div>
            ) : (
              <button onClick={handleSignIn}>Sign In with Google</button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 