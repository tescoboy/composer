import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(new URL('/login', requestUrl.origin));
  }

  try {
    const supabase = createRouteHandlerClient({ cookies });
    await supabase.auth.exchangeCodeForSession(code);
    return NextResponse.redirect(new URL('/', requestUrl.origin));
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.redirect(new URL('/login', requestUrl.origin));
  }
} 