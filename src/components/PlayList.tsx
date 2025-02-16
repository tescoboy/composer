'use client';

import { useState, useEffect, useCallback } from 'react';
import PlayTile from './PlayTile';
import AddPlayModal, { PlayData } from './AddPlayModal';
import { Play } from '@/types/play';
import { getPlays, addPlay } from '@/services/plays';
import { useToast } from '@/components/ui/use-toast';
import { Switch } from '@/components/ui/switch';

export default function PlayList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [plays, setPlays] = useState<Play[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showShame, setShowShame] = useState(false);
  const { toast } = useToast();

  const loadPlays = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getPlays();
      setPlays(data);
    } catch (err) {
      console.error('Failed to load plays:', err);
      toast({
        title: 'Error',
        description: 'Failed to load plays',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadPlays();
  }, [loadPlays]);

  const handlePlayUpdate = (updatedPlay: Play) => {
    setPlays(plays.map(p => p.id === updatedPlay.id ? updatedPlay : p));
  };

  const handlePlayDelete = (playId: number) => {
    setPlays(plays.filter(p => p.id !== playId));
  };

  const handleAddPlay = async (playData: PlayData) => {
    try {
      // Validate input data
      if (!playData.title) {
        throw new Error('Play title is required');
      }
      if (!playData.date) {
        throw new Error('Play date is required');
      }

      console.log('Component: Adding play with data:', playData);

      const playToAdd = {
        name: playData.title.trim(),
        theatre: playData.theatre?.trim() || '',
        date: playData.date,
        rating: playData.isStandingOvation ? 'Standing Ovation' : String(playData.rating || 0),
        image: playData.imageUrls[0]?.trim() || null,
        image2: playData.imageUrls[1]?.trim() || null,
        image3: playData.imageUrls[2]?.trim() || null,
        image4: playData.imageUrls[3]?.trim() || null,
        image5: playData.imageUrls[4]?.trim() || null,
        comments: '',
        synopsis: ''
      };

      console.log('Component: Transformed play data:', playToAdd);

      try {
        const newPlay = await addPlay(playToAdd);
        console.log('Component: Successfully added play:', newPlay);

        setPlays([...plays, newPlay]);
        setIsModalOpen(false);
        toast({
          title: 'Success',
          description: 'Play added successfully',
        });
      } catch (serviceError) {
        console.error('Component: Service error:', serviceError);
        throw serviceError; // Re-throw to be caught by outer catch
      }
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'An unexpected error occurred while adding the play';
      
      console.error('Component: Error details:', {
        error: err,
        message: errorMessage,
        stack: err instanceof Error ? err.stack : undefined
      });

      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  // Sort and filter functions
  const upcomingPlays = plays
    .filter(play => new Date(play.date) > new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const recentlySeenPlays = plays
    .filter(play => new Date(play.date) <= new Date())
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6);

  const unratedPlays = plays
    .filter(play => new Date(play.date) <= new Date() && !play.rating)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const hallOfFamePlays = plays
    .filter(play => {
      if (play.rating === 'Standing Ovation') return true;
      const rating = Number(play.rating);
      return !isNaN(rating) && rating >= 5;
    })
    .sort((a, b) => {
      if (a.rating === 'Standing Ovation') return -1;
      if (b.rating === 'Standing Ovation') return 1;
      return Number(b.rating) - Number(a.rating);
    });

  const hallOfShamePlays = plays
    .filter(play => {
      const rating = Number(play.rating);
      return !isNaN(rating) && rating > 0 && rating <= 2;
    })
    .sort((a, b) => {
      const ratingDiff = Number(a.rating) - Number(b.rating);
      if (ratingDiff === 0) {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return ratingDiff;
    });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {/* Upcoming Plays Section */}
      <section id="upcoming" className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Upcoming Shows
        </h2>
        <div className="grid gap-4">
          {upcomingPlays.length > 0 ? (
            upcomingPlays.map(play => (
              <PlayTile key={play.id} {...play} variant="wide" onUpdate={handlePlayUpdate} onDelete={handlePlayDelete} />
            ))
          ) : (
            <div className="p-4 rounded-lg bg-white dark:bg-gray-800 shadow-md">
              <p className="text-gray-500 dark:text-gray-400">No upcoming shows</p>
            </div>
          )}
        </div>
      </section>

      {/* Recently Seen Section */}
      <section id="recent" className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Recently Seen
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {recentlySeenPlays.length > 0 ? (
            recentlySeenPlays.map(play => (
              <PlayTile key={play.id} {...play} onUpdate={handlePlayUpdate} onDelete={handlePlayDelete} />
            ))
          ) : (
            <div className="p-4 rounded-lg bg-white dark:bg-gray-800 shadow-md">
              <p className="text-gray-500 dark:text-gray-400">No plays reviewed yet</p>
            </div>
          )}
        </div>
      </section>

      {/* Unrated Plays Section */}
      {unratedPlays.length > 0 && (
        <section id="unrated" className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
            Unrated Plays
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {unratedPlays.map(play => (
              <PlayTile key={play.id} {...play} onUpdate={handlePlayUpdate} onDelete={handlePlayDelete} />
            ))}
          </div>
        </section>
      )}

      {/* Hall of Fame/Shame Section */}
      <section id="hall-of-fame" className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
            Hall of {showShame ? 'Shame' : 'Fame'}
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Fame</span>
            <Switch
              checked={showShame}
              onCheckedChange={setShowShame}
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">Shame</span>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {(showShame ? hallOfShamePlays : hallOfFamePlays).length > 0 ? (
            (showShame ? hallOfShamePlays : hallOfFamePlays).map(play => (
              <PlayTile key={play.id} {...play} onUpdate={handlePlayUpdate} onDelete={handlePlayDelete} />
            ))
          ) : (
            <div className="p-4 rounded-lg bg-white dark:bg-gray-800 shadow-md">
              <p className="text-gray-500 dark:text-gray-400">
                No plays in Hall of {showShame ? 'Shame' : 'Fame'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Add Play Button */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 p-4 rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 transition-colors"
        aria-label="Add new play"
      >
        + Add Play
      </button>

      <AddPlayModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddPlay}
      />
    </>
  );
} 