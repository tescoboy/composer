import { createClient } from '@/lib/auth-client';
import type { Review } from '@/types/play';

export const getPlayReviews = async (playId: number): Promise<Review[]> => {
  const supabase = createClient();
  
  try {
    // Get reviews
    const { data: reviews, error: reviewsError } = await supabase
      .from('reviews')
      .select('*')
      .eq('play_id', playId)
      .order('created_at', { ascending: false });

    if (reviewsError) {
      console.error('Error fetching reviews:', reviewsError);
      return [];
    }

    // Get profiles for all user_ids
    const userIds = [...new Set(reviews.map(r => r.user_id))];
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, name, avatar_url')
      .in('id', userIds);

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError);
      return reviews.map(review => ({
        ...review,
        user: { name: null, avatar_url: null }
      }));
    }

    // Map profiles to reviews
    const profileMap = new Map(profiles.map(p => [p.id, p]));
    
    return reviews.map(review => ({
      ...review,
      user: {
        name: profileMap.get(review.user_id)?.name || null,
        avatar_url: profileMap.get(review.user_id)?.avatar_url || null
      }
    }));
  } catch (error) {
    console.error('Exception in getPlayReviews:', error);
    return [];
  }
};

export const addReview = async (
  playId: number, 
  content: string,
  quote: string
): Promise<Review | null> => {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Not authenticated');

    // First insert the review
    const { data: review, error: insertError } = await supabase
      .from('reviews')
      .insert({
        play_id: playId,
        user_id: user.id,
        content,
        quote
      })
      .select()
      .single();

    if (insertError) {
      console.error('Insert error:', insertError);
      return null;
    }

    // Then fetch the user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('name, avatar_url')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Profile fetch error:', profileError);
      // Return review even if profile fetch fails
      return {
        ...review,
        user: {
          name: null,
          avatar_url: null
        }
      };
    }

    // Return combined data
    return {
      ...review,
      user: {
        name: profile.name,
        avatar_url: profile.avatar_url
      }
    };
  } catch (error) {
    console.error('Error adding review:', error);
    return null;
  }
};

export const updateReview = async (
  reviewId: number, 
  content: string,
  quote: string
): Promise<boolean> => {
  console.log('Starting updateReview with:', { reviewId, content, quote });
  
  const supabase = createClient();
  console.log('Supabase client created');
  
  try {
    const { error, data, status, statusText } = await supabase
      .from('reviews')
      .update({ 
        content,
        quote
      })
      .eq('id', reviewId);

    console.log('Update response:', { 
      error, 
      data, 
      status, 
      statusText,
      errorDetails: error ? {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      } : null
    });

    if (error) {
      console.error('Error updating review:', error);
      return false;
    }

    console.log('Update successful');
    return true;
  } catch (error) {
    console.error('Exception in updateReview:', error);
    return false;
  }
}; 