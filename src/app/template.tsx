import { getSession } from '@/lib/auth-server';

export default async function Template({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  return (
    <AuthProvider initialSession={session}>
      {children}
    </AuthProvider>
  );
} 