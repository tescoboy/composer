import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    try {
      // Exchange the code for a session
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error) {
        console.error('Session exchange error:', error);
        throw error;
      }

      console.log('Auth success, session:', data.session?.user?.id);
      
      // Force redirect to home page
      return new Response(null, {
        status: 302,
        headers: {
          Location: '/',
        },
      });
    } catch (error) {
      console.error('Auth error:', error);
      // Force redirect to login page
      return new Response(null, {
        status: 302,
        headers: {
          Location: '/login',
        },
      });
    }
  }

  // No code, redirect to login
  return new Response(null, {
    status: 302,
    headers: {
      Location: '/login',
    },
  });
} 