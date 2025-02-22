'use client';

import Link from 'next/link';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useRouter } from 'next/navigation';

export default function Navigation({ session }: { session: Session | null }) {
  const router = useRouter();
  console.log('Navigation: Rendering with session:', session?.user?.id);

  const handleSignOut = async () => {
    console.log('Navigation: Starting sign out');
    await supabase.auth.signOut();
    console.log('Navigation: Signed out, refreshing page');
    router.refresh();
  };

  const handleSignIn = async () => {
    console.log('Navigation: Starting Google sign in');
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold">
            Theatre Diary
          </Link>

          <div>
            {session ? (
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src={session.user?.user_metadata?.avatar_url} />
                  <AvatarFallback>
                    {session.user?.email?.[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <button
                  onClick={handleSignOut}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={handleSignIn}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Sign In with Google
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 