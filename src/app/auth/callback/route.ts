import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  console.log('------- Auth Callback Started -------');

  const code = requestUrl.searchParams.get('code');
  if (!code) {
    console.log('No code found, redirecting to login');
    return NextResponse.redirect(new URL('/login', requestUrl.origin));
  }

  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    console.log('Exchanging code for session...');
    const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error || !session) {
      console.log('Session exchange failed:', error?.message);
      throw error;
    }

    console.log('Session created for user:', session.user.id);
    
    // Set cookie and redirect
    const response = NextResponse.redirect(new URL('/', requestUrl.origin));
    
    // Ensure cookies are set
    response.cookies.set('sb-access-token', session.access_token, {
      path: '/',
      secure: true,
      sameSite: 'lax',
    });
    
    response.cookies.set('sb-refresh-token', session.refresh_token!, {
      path: '/',
      secure: true,
      sameSite: 'lax',
    });

    return response;
  } catch (error) {
    console.log('Auth error:', error);
    return NextResponse.redirect(new URL('/login', requestUrl.origin));
  } finally {
    console.log('------- Auth Callback Ended -------');
  }
} 