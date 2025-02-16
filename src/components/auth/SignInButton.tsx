'use client';

import { useState } from 'react';
import { createClient } from '@/lib/auth-client';

export default function SignInButton() {
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const signInWithGoogle = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={signInWithGoogle}
      disabled={isLoading}
      className="px-4 py-2 bg-white border rounded-md hover:bg-gray-50"
    >
      {isLoading ? 'Connecting...' : 'Sign in with Google'}
    </button>
  );
} 