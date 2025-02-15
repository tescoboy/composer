import { supabase } from '@/lib/supabase';
import { Play } from '@/types/play';

export async function getPlays() {
  const { data, error } = await supabase
    .from('plays')
    .select('*')
    .order('date', { ascending: true });

  if (error) throw error;
  return data as Play[];
}

export async function addPlay(play: Omit<Play, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('plays')
    .insert([{
      name: play.name,
      date: play.date,
      rating: play.rating,
      comments: play.comments,
      synopsis: play.synopsis,
      image: play.image,
      theatre: play.theatre,
      image2: play.image2,
      image3: play.image3,
      person: play.person
    }])
    .select()
    .single();

  if (error) throw error;
  return data as Play;
}

export async function updatePlay(id: number, play: Partial<Play>) {
  const { data, error } = await supabase
    .from('plays')
    .update(play)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Play;
}

export async function deletePlay(id: number) {
  const { error } = await supabase
    .from('plays')
    .delete()
    .eq('id', id);

  if (error) throw error;
} 