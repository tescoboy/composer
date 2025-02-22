'use client';

import GoogleSignIn from '@/components/GoogleSignIn';
import Link from 'next/link';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export default function LoginPage() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      if (event === 'SIGNED_IN') {
        router.push('/');
      } else if (event === 'SIGNED_OUT') {
        router.push('/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Welcome to Theatre Diary</h1>
          <p className="mt-2 text-gray-600">Please sign in to continue</p>
        </div>

        <div className="flex justify-center">
          <GoogleSignIn />
        </div>

        <div className="text-center">
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
  );
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(new URL('/login', requestUrl.origin));
  }

  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error || !session) {
      throw error;
    }

    return NextResponse.redirect(new URL('/', requestUrl.origin));
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.redirect(new URL('/login', requestUrl.origin));
  }
} 