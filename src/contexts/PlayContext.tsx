'use client';

import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Play } from '@/types/play';
import { getPlays, updatePlay, deletePlay, addPlay } from '@/services/plays';
import { toast } from '@/components/ui/use-toast';

interface PlayContextType {
  plays: Play[];
  loading: boolean;
  refreshPlays: () => Promise<void>;
  addNewPlay: (play: Omit<Play, 'id' | 'created_at'>) => Promise<void>;
  updateExistingPlay: (updatedPlay: Play) => Promise<void>;
  deleteExistingPlay: (id: number) => Promise<void>;
}

const PlayContext = createContext<PlayContextType | undefined>(undefined);

export function PlayProvider({ children }: { children: React.ReactNode }) {
  const [plays, setPlays] = useState<Play[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshPlays = useCallback(async () => {
    console.log('Refreshing plays...');
    try {
      const data = await getPlays();
      console.log('Fetched plays:', data);
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
  }, []);

  useEffect(() => {
    refreshPlays();
  }, [refreshPlays]);

  const addNewPlay = async (play: Omit<Play, 'id' | 'created_at'>) => {
    try {
      await addPlay(play);
      await refreshPlays();
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

  const updateExistingPlay = async (updatedPlay: Play) => {
    try {
      await updatePlay(updatedPlay.id, updatedPlay);
      await refreshPlays();
      toast({
        title: 'Success',
        description: 'Play updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update play',
        variant: 'destructive',
      });
    }
  };

  const deleteExistingPlay = async (id: number) => {
    try {
      await deletePlay(id);
      await refreshPlays();
      toast({
        title: 'Success',
        description: 'Play deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete play',
        variant: 'destructive',
      });
    }
  };

  return (
    <PlayContext.Provider
      value={{
        plays,
        loading,
        refreshPlays,
        addNewPlay,
        updateExistingPlay,
        deleteExistingPlay,
      }}
    >
      {children}
    </PlayContext.Provider>
  );
}

export function usePlays() {
  const context = useContext(PlayContext);
  if (context === undefined) {
    throw new Error('usePlays must be used within a PlayProvider');
  }
  return context;
} 