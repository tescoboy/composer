'use client';

import { useState, useEffect } from 'react';
import PlayTile from './PlayTile';
import AddPlayModal, { PlayData } from './AddPlayModal';
import { Play } from '@/types/play';
import { getPlays, addPlay } from '@/services/plays';
import { useToast } from '@/components/ui/use-toast';
import { Switch } from '@/components/ui/switch';

// Sample data moved to client component
const samplePlays: Play[] = [
  {
    id: 1,
    title: "Hamlet",
    theatre: "National Theatre",
    date: new Date('2024-04-15'),
    rating: 4,
    imageUrls: ["https://images.unsplash.com/photo-1503095396549-807759245b35?w=800&auto=format&fit=crop"]
  },
  {
    id: 2,
    title: "The Seagull",
    theatre: "Young Vic",
    date: new Date('2024-03-20'),
    rating: 5,
    isStandingOvation: true,
    imageUrls: ["https://images.unsplash.com/photo-1507924538820-ede94a04019d?w=800&auto=format&fit=crop"]
  }
];

export default function PlayList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [plays, setPlays] = useState<Play[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showShame, setShowShame] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadPlays();
  }, []);

  async function loadPlays() {
    try {
      setIsLoading(true);
      const data = await getPlays();
      setPlays(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load plays',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleAddPlay = async (playData: PlayData) => {
    try {
      const newPlay = await addPlay({
        title: playData.title,
        theatre: playData.theatre,
        date: new Date(playData.date),
        rating: playData.rating,
        image_urls: playData.imageUrls.filter(url => url.trim() !== ''),
        is_standing_ovation: playData.isStandingOvation,
      });
      
      setPlays([...plays, newPlay]);
      setIsModalOpen(false);
      toast({
        title: 'Success',
        description: 'Play added successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add play',
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
      const rating = parseFloat(play.rating);
      return rating >= 5;
    })
    .sort((a, b) => {
      // Standing Ovation should be at the top
      if (a.rating === 'Standing Ovation') return -1;
      if (b.rating === 'Standing Ovation') return 1;
      return parseFloat(b.rating) - parseFloat(a.rating);
    });

  const hallOfShamePlays = plays
    .filter(play => {
      const rating = parseFloat(play.rating);
      return rating > 0 && rating <= 2;
    })
    .sort((a, b) => {
      const ratingDiff = parseFloat(a.rating) - parseFloat(b.rating);
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
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Upcoming Shows
        </h2>
        <div className="grid gap-4">
          {upcomingPlays.length > 0 ? (
            upcomingPlays.map(play => (
              <PlayTile key={play.id} {...play} variant="wide" />
            ))
          ) : (
            <div className="p-4 rounded-lg bg-white dark:bg-gray-800 shadow-md">
              <p className="text-gray-500 dark:text-gray-400">No upcoming shows</p>
            </div>
          )}
        </div>
      </section>

      {/* Recently Seen Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Recently Seen
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {recentlySeenPlays.length > 0 ? (
            recentlySeenPlays.map(play => (
              <PlayTile key={play.id} {...play} />
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
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
            Unrated Plays
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {unratedPlays.map(play => (
              <PlayTile key={play.id} {...play} />
            ))}
          </div>
        </section>
      )}

      {/* Hall of Fame/Shame Section */}
      <section className="mb-8">
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
              <PlayTile key={play.id} {...play} />
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