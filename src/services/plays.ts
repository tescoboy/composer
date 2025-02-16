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

export const addPlay = async (play: Omit<Play, 'id' | 'created_at'>) => {
  try {
    const playData = {
      name: play.name,
      theatre: play.theatre,
      date: play.date,
      rating: play.rating,
      isStandingOvation: play.isStandingOvation,
      image: play.image,
      image2: play.image2,
      image3: play.image3,
      image4: play.image4,
      image5: play.image5,
      synopsis: play.synopsis,
    };

    console.log('Service: Attempting to add play with data:', playData);

    // First, validate the Supabase client
    if (!supabase) {
      throw new Error('Supabase client is not initialized');
    }

    // Add type assertion for better error handling
    const { data, error } = await supabase
      .from('plays')
      .insert([playData])
      .select('*') // Be explicit about what we're selecting
      .single();

    console.log('Service: Raw Supabase response:', { data, error });

    if (error) {
      // Log detailed error information
      console.error('Service: Supabase error details:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      throw new Error(`Database error: ${error.message}`);
    }

    if (!data) {
      throw new Error('No data returned from database');
    }

    return data as Play;
  } catch (error) {
    // Log the raw error
    console.error('Service: Raw error:', error);

    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error('An unknown error occurred while adding the play');
    }
  }
};

export async function updatePlay(id: number, updates: Partial<Play>): Promise<Play> {
  const { data, error } = await supabase
    .from('plays')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deletePlay(id: number): Promise<void> {
  const { error } = await supabase
    .from('plays')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export const getPlayById = async (id: number): Promise<Play> => {
  const { data, error } = await supabase
    .from('plays')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

interface ImagePosition {
  x: number;
  y: number;
  zoom: number;
}

export const updatePlayImagePosition = async (
  playId: number, 
  position: ImagePosition
): Promise<boolean> => {
  try {
    console.log('Attempting to update play:', { playId, position });

    // Validate inputs
    if (!playId || typeof playId !== 'number') {
      throw new Error('Invalid play ID');
    }

    // Constrain values
    const updates = {
      image_x: Math.max(-50, Math.min(50, position.x)),
      image_y: Math.max(-50, Math.min(50, position.y)),
      image_zoom: Math.max(1, Math.min(1.5, position.zoom))
    };

    console.log('Sending update with values:', updates);

    // First verify the play exists
    const { data: play, error: fetchError } = await supabase
      .from('plays')
      .select('id')
      .eq('id', playId)
      .single();

    if (fetchError) {
      console.error('Error fetching play:', fetchError);
      return false;
    }

    if (!play) {
      console.error('Play not found:', playId);
      return false;
    }

    // Then update the play
    const { data, error } = await supabase
      .from('plays')
      .update(updates)
      .eq('id', playId)
      .select()
      .single();

    if (error) {
      console.error('Error updating play:', error);
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        details: error.details
      });
      return false;
    }

    console.log('Successfully updated play:', data);
    return true;
  } catch (error) {
    console.error('Unexpected error in updatePlayImagePosition:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
    }
    return false;
  }
}; 