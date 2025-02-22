'use client';

import GoogleSignIn from '@/components/GoogleSignIn';

export default function LoginPage() {
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
      </div>
    </div>
  );
} 