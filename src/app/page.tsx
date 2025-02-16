'use client';

import { useEffect, useState } from 'react';
import { Play } from '@/types/play';
import { getPlays, updatePlay, deletePlay } from '@/services/plays';
import AllPlaysSection from '@/components/home/AllPlaysSection';
import { useAuth } from '@/components/providers/AuthProvider';
import { toast } from '@/components/ui/use-toast';
import HomeNavigation from '@/components/home/HomeNavigation';
import AnimatedSection from '@/components/home/AnimatedSection';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import PlayCard from '@/components/PlayCard';

export default function HomePage() {
  const [plays, setPlays] = useState<Play[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [showShame, setShowShame] = useState(false);

  useEffect(() => {
    const fetchPlays = async () => {
      try {
        const data = await getPlays();
        setPlays(data);
      } catch (error) {
        console.error('Error fetching plays:', error);
        toast({
          title: 'Error',
          description: 'Failed to load plays',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPlays();
  }, []);

  const handleEdit = async (updatedPlay: Play) => {
    try {
      await updatePlay(updatedPlay.id, updatedPlay);
      setPlays(plays.map(p => 
        p.id === updatedPlay.id ? updatedPlay : p
      ));
      toast({
        title: "Success",
        description: "Play updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update play",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deletePlay(id);
      setPlays(plays.filter(p => p.id !== id));
      toast({
        title: "Success",
        description: "Play deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete play",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500" />
      </div>
    );
  }

  // Ensure plays is an array
  const playsArray = plays || [];

  // Organize plays into categories
  const today = new Date();

  const upcomingPlays = playsArray
    .filter(play => new Date(play.date) > today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const recentPlays = playsArray
    .filter(play => new Date(play.date) <= today)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6);

  const unratedPlays = playsArray
    .filter(play => 
      new Date(play.date) <= today && 
      !play.rating
    );

  const hallOfFamePlays = playsArray
    .filter(play => 
      play.rating && 
      (parseInt(play.rating) === 5 || play.isStandingOvation)
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const hallOfShamePlays = playsArray
    .filter(play => 
      play.rating && 
      parseInt(play.rating) <= 2
    )
    .sort((a, b) => {
      const ratingDiff = parseInt(a.rating) - parseInt(b.rating);
      if (ratingDiff !== 0) return ratingDiff;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  return (
    <>
      <HomeNavigation />
      
      <div className="max-w-7xl mx-auto px-4 space-y-24 pb-24">
        {upcomingPlays.length > 0 && (
          <AnimatedSection 
            id="upcoming"
            title="Upcoming Shows"
            plays={upcomingPlays}
            showCalendarToggle
          />
        )}

        {recentPlays.length > 0 && (
          <AnimatedSection 
            id="recent"
            title="Recently Seen"
            plays={recentPlays}
          />
        )}

        {unratedPlays.length > 0 && (
          <AnimatedSection 
            id="unrated"
            title="Unrated Plays"
            plays={unratedPlays}
          />
        )}

        {/* Hall of Fame/Shame Section */}
        <section className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold font-playfair">
              Hall of {showShame ? 'Shame' : 'Fame'}
            </h2>
            <div className="flex items-center gap-2">
              <Label htmlFor="shame-toggle" className="text-sm text-gray-600">
                Show Hall of {showShame ? 'Fame' : 'Shame'}
              </Label>
              <Switch
                id="shame-toggle"
                checked={showShame}
                onCheckedChange={setShowShame}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(showShame ? hallOfShamePlays : hallOfFamePlays).map((play) => (
              <PlayCard 
                key={play.id} 
                play={play}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {hallOfFamePlays.length === 0 && hallOfShamePlays.length === 0 && (
            <p className="text-center text-gray-500 dark:text-gray-400">
              No plays rated yet
            </p>
          )}
        </section>

        <AllPlaysSection 
          plays={plays} 
          canAdd={!!user} 
          onPlayAdded={(newPlay) => setPlays([...plays, newPlay])}
          onPlayDeleted={(id) => setPlays(plays.filter(p => p.id !== id))}
        />

        {playsArray.length === 0 && (
          <div className="pt-24 text-center">
            <h2 className="text-2xl font-medium text-gray-600 dark:text-gray-400">
              No plays found. Add some plays to get started!
            </h2>
          </div>
        )}
      </div>
    </>
  );
}
