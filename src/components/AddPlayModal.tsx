'use client';

import { useState, useEffect } from 'react';
import { Moon, X, ChevronDown, ChevronUp, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import ImageUrlInputs from './ImageUrlInputs';
import { useAuth } from '@/components/providers/AuthProvider';
import { toast } from '@/components/ui/use-toast';
import { createClient } from '@/lib/supabase';
import MoonRating from '@/components/ui/moon-rating';
import { Play } from '@/types/play';

interface AddPlayModalProps {
  play?: Play | null;
  onClose: () => void;
  onSubmit: () => void;
}

export interface PlayData {
  title: string;
  theatre: string;
  date: string;
  rating: number;
  isStandingOvation: boolean;
  imageUrls: string[];
}

const THEATRE_OPTIONS = [
  'National Theatre',
  'Old Vic',
  'Young Vic',
  'Almeida',
  'Yard',
  'Royal Court',
  'Shakespeare\'s Globe',
];

export default function AddPlayModal({ play, onClose, onSubmit }: AddPlayModalProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(play?.name || '');
  const [theatre, setTheatre] = useState(play?.theatre || '');
  const [date, setDate] = useState(play?.date || '');
  const [rating, setRating] = useState(play?.rating || '');
  const [isStandingOvation, setIsStandingOvation] = useState(play?.isStandingOvation || false);
  const [quote, setQuote] = useState(play?.quote || '');
  const [review, setReview] = useState(play?.review || '');
  const [showImages, setShowImages] = useState(false);

  useEffect(() => {
    if (play) {
      setOpen(true);
      setName(play.name);
      setTheatre(play.theatre);
      setDate(play.date);
      setRating(play.rating);
      setIsStandingOvation(play.isStandingOvation);
      setQuote(play.quote || '');
      setReview(play.review || '');
    } else {
      setOpen(false);
      // Reset form
      setName('');
      setTheatre('');
      setDate('');
      setRating('');
      setIsStandingOvation(false);
      setQuote('');
      setReview('');
    }
  }, [play]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to add a play",
        variant: "destructive",
      });
      return;
    }
    
    const supabase = createClient();

    try {
      if (play?.id) {
        // Update existing play
        const { error } = await supabase
          .from('plays')
          .update({
            name,
            theatre,
            date,
            rating,
            isStandingOvation,
            quote,
            review
          })
          .eq('id', play.id);

        if (error) throw error;
      } else {
        // Create new play
        const { error } = await supabase
          .from('plays')
          .insert([
            {
              name,
              theatre,
              date,
              rating,
              isStandingOvation,
              quote,
              review
            }
          ]);

        if (error) throw error;
      }

      toast({
        title: play?.id ? "Play updated" : "Play added",
        description: play?.id ? "Your play has been updated successfully." : "Your play has been added successfully.",
      });

      onSubmit();
      setOpen(false);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "There was a problem saving your play.",
        variant: "destructive",
      });
    }
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) onClose();
    }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{play?.id ? 'Edit Play' : 'Add New Play'}</DialogTitle>
          <DialogDescription>
            {play?.id ? 'Update the details of your play.' : 'Add a new play to your collection.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Play Title *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Theatre
            </label>
            <input
              type="text"
              list="theatres"
              value={theatre}
              onChange={(e) => setTheatre(e.target.value)}
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <datalist id="theatres">
              {THEATRE_OPTIONS.map((theatre) => (
                <option key={theatre} value={theatre} />
              ))}
            </datalist>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Date *
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <button
              type="button"
              onClick={() => setShowImages(!showImages)}
              className="flex items-center justify-between w-full p-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600"
            >
              <span>Images (Optional)</span>
              {showImages ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            
            {showImages && (
              <div className="mt-2">
                <ImageUrlInputs
                  urls={[
                    play?.image1 || '',
                    play?.image2 || '',
                    play?.image3 || '',
                    play?.image4 || '',
                    play?.image5 || ''
                  ].filter(Boolean)}
                  onChange={(newUrls) => {
                    // Handle the image updates
                    // This will be implemented when we add image upload functionality
                  }}
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Rating</Label>
            <MoonRating 
              value={rating === 'standing-ovation' ? 'standing-ovation' : Number(rating) || null}
              onChange={(newRating) => {
                if (newRating === 'standing-ovation') {
                  setRating('standing-ovation');
                  setIsStandingOvation(true);
                } else {
                  setRating(newRating.toString());
                  setIsStandingOvation(false);
                }
              }}
              size="lg"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              {play?.id ? 'Update Play' : 'Add Play'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 