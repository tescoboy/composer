'use client';

import Link from 'next/link';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Navigation({ session }: { session: Session | null }) {
  const router = useRouter();

  // Listen for auth state changes
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      if (event === 'SIGNED_IN') {
        router.push('/');
        router.refresh();
      } else if (event === 'SIGNED_OUT') {
        router.push('/login');
        router.refresh();
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
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
                <button 
                  onClick={handleSignOut}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link 
                href="/login"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 