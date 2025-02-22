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
      
      if (error) throw error;

      // Add console log to debug
      console.log('Auth success, redirecting to home');
      
      // Redirect to the home page after successful authentication
      return NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_SITE_URL));
    } catch (error) {
      console.error('Auth error:', error);
      return NextResponse.redirect(new URL('/login', process.env.NEXT_PUBLIC_SITE_URL));
    }
  }

  // If no code, redirect to login
  return NextResponse.redirect(new URL('/login', process.env.NEXT_PUBLIC_SITE_URL));
} 