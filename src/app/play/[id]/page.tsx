'use client';

import { useEffect, useState } from 'react';
import { Play } from '@/types/play';
import { getPlayById, updatePlay } from '@/services/plays';
import PlayReviewHeader from '@/components/play/PlayReviewHeader';
import PlayReviewContent from '@/components/play/PlayReviewContent';
import PlayReviewSkeleton from '@/components/play/PlayReviewSkeleton';
import { useParams, useRouter } from 'next/navigation';
import { toast } from '@/components/ui/use-toast';
import MoonRating from '@/components/ui/moon-rating';
import { format } from 'date-fns';
import { useAuth } from '@/components/providers/AuthProvider';

export default function PlayReviewPage() {
  const { user } = useAuth();
  const [play, setPlay] = useState<Play | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const router = useRouter();
  const isOwner = user?.id === play?.userId;

  useEffect(() => {
    const loadPlay = async () => {
      try {
        if (!params.id || isNaN(Number(params.id))) {
          throw new Error('Invalid play ID');
        }

        const data = await getPlayById(Number(params.id));
        setPlay(data);
        setError(null);
      } catch (error) {
        console.error('Failed to load play:', error);
        setError(error instanceof Error ? error.message : 'Failed to load play');
        toast({
          title: "Error",
          description: "Failed to load play details",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadPlay();
  }, [params.id]);

  const handleUpdateImages = async (images: { [key: string]: string | null }) => {
    if (!play) return;
    
    try {
      await updatePlay(play.id, images);
      // Update local play state with new images
      setPlay(prev => prev ? { ...prev, ...images } : null);
    } catch (error) {
      throw new Error('Failed to update images');
    }
  };

  if (isLoading) {
    return <PlayReviewSkeleton />;
  }

  if (error || !play) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            {error || 'Play not found'}
          </h1>
          <button
            onClick={() => router.push('/')}
            className="text-indigo-600 hover:text-indigo-700"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold font-playfair">{play.name}</h1>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xl text-gray-600 dark:text-gray-400">{play.theatre}</p>
              <p className="text-gray-500 dark:text-gray-500">
                {format(new Date(play.date), 'dd MMMM yyyy')}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <MoonRating 
                value={
                  play.isStandingOvation 
                    ? 'standing-ovation' 
                    : play.rating 
                      ? Number(play.rating) 
                      : null
                }
                readonly
                size="xl"
              />
            </div>
          </div>
        </div>
        
        {isOwner && (
          <PlayReviewHeader 
            play={play} 
            onUpdateImages={handleUpdateImages}
          />
        )}
      </div>
    </article>
  );
} 