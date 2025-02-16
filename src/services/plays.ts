import { supabase } from '@/lib/supabase';
import { Play } from '@/types/play';

export async function getPlays(): Promise<Play[]> {
  const { data, error } = await supabase
    .from('plays')
    .select('*')
    .order('date', { ascending: true });

  if (error) throw error;
  return data as Play[];
}

export async function addPlay(play: Omit<Play, 'id' | 'created_at'>): Promise<Play> {
  const { data, error } = await supabase
    .from('plays')
    .insert([play])
    .select()
    .single();

  if (error) throw error;
  return data as Play;
}

export async function updatePlay(id: number, play: Partial<Play>): Promise<Play> {
  const { data, error } = await supabase
    .from('plays')
    .update(play)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Play;
}

export async function deletePlay(id: number): Promise<void> {
  const { error } = await supabase
    .from('plays')
    .delete()
    .eq('id', id);

  if (error) throw error;
} 