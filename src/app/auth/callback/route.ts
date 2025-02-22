import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  console.log('------- Auth Callback Started -------');
  console.log('URL:', requestUrl.toString());

  const code = requestUrl.searchParams.get('code');
  if (!code) {
    console.log('No code found in URL, redirecting to login');
    return NextResponse.redirect(new URL('/login', requestUrl.origin));
  }

  try {
    console.log('Code found, creating Supabase client');
    const supabase = createRouteHandlerClient({ cookies });
    
    console.log('Exchanging code for session...');
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.log('Error exchanging code:', error.message);
      throw error;
    }

    console.log('Session created for user:', data.session?.user?.id);
    console.log('Redirecting to home page');
    
    return NextResponse.redirect(new URL('/', requestUrl.origin));
  } catch (error) {
    console.log('Auth error:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.redirect(new URL('/login', requestUrl.origin));
  } finally {
    console.log('------- Auth Callback Ended -------');
  }
} 