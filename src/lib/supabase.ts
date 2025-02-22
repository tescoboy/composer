import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Create a single instance that will be reused
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    storageKey: 'theatre-diary-auth',  // Add unique key
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    autoRefreshToken: true,
  },
});

// Add a simple test function to verify connection
export const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('plays').select('count').single();
    if (error) throw error;
    console.log('Supabase connection successful:', data);
    return true;
  } catch (error) {
    console.error('Supabase connection test failed:', error);
    return false;
  }
}; 