import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  console.log('Auth Callback: Starting auth callback handling');
  console.log('Auth Callback: URL:', requestUrl.toString());

  const code = requestUrl.searchParams.get('code');
  if (!code) {
    console.log('Auth Callback: No code found, redirecting to login');
    return NextResponse.redirect(new URL('/login', requestUrl.origin));
  }

  try {
    console.log('Auth Callback: Code found, exchanging for session');
    const supabase = createRouteHandlerClient({ cookies });
    
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error('Auth Callback: Error exchanging code:', error);
      throw error;
    }

    console.log('Auth Callback: Session created successfully:', data.session?.user?.id);
    console.log('Auth Callback: Redirecting to home page');
    
    return NextResponse.redirect(new URL('/', requestUrl.origin));
  } catch (error) {
    console.error('Auth Callback: Fatal error:', error);
    return NextResponse.redirect(new URL('/login', requestUrl.origin));
  }
} 