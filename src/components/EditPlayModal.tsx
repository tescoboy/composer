'use client';

import { useState, useEffect } from 'react';
import { Moon, X, ChevronDown, ChevronUp, User, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Play } from '@/types/play';
import { useToast } from './ui/use-toast';
import { updatePlay, deletePlay } from '@/services/plays';
import ImageUrlInputs from './ImageUrlInputs';

interface EditPlayModalProps {
  play: Play;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedPlay: Play) => void;
  onDelete: (id: number) => void;
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

export default function EditPlayModal({ 
  play, 
  isOpen, 
  onClose, 
  onUpdate,
  onDelete 
}: EditPlayModalProps) {
  const [playData, setPlayData] = useState(play);
  const [showImages, setShowImages] = useState(false);
  const [rating, setRating] = useState(play.rating);
  const { toast } = useToast();

  useEffect(() => {
    setPlayData(play);
    setRating(play.rating);
  }, [play]);

  const [imageUrls, setImageUrlsState] = useState<string[]>(() => {
    const urls = [
      play.image,
      play.image2,
      play.image3,
      play.image4,
      play.image5
    ].filter((url): url is string => !!url);
    
    // Ensure array has enough slots
    return [...urls, ...Array(5 - urls.length).fill('')];
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedPlay = await updatePlay(play.id, playData);
      onUpdate(updatedPlay);
      toast({
        title: 'Success',
        description: 'Play updated successfully',
      });
      onClose();
    } catch (err) {
      console.error('Failed to update play:', err);
      toast({
        title: 'Error',
        description: 'Failed to update play',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this play?')) return;
    
    try {
      await deletePlay(play.id);
      onDelete(play.id);
      toast({
        title: 'Success',
        description: 'Play deleted successfully',
      });
      onClose();
    } catch (err) {
      console.error('Failed to delete play:', err);
      toast({
        title: 'Error',
        description: 'Failed to delete play',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Edit Play</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-4 space-y-4">
          <div>
            <Label>Play Title *</Label>
            <input
              type="text"
              required
              value={playData.name}
              onChange={(e) => setPlayData({ ...playData, name: e.target.value })}
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <Label>Theatre *</Label>
            <input
              type="text"
              required
              value={playData.theatre}
              onChange={(e) => setPlayData({ ...playData, theatre: e.target.value })}
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              list="theatre-options"
            />
            <datalist id="theatre-options">
              {THEATRE_OPTIONS.map((theatre) => (
                <option key={theatre} value={theatre} />
              ))}
            </datalist>
          </div>

          <div>
            <Label>Date *</Label>
            <input
              type="date"
              required
              value={playData.date}
              onChange={(e) => setPlayData({ ...playData, date: e.target.value })}
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
                  urls={imageUrls}
                  onChange={(newUrls) => {
                    setImageUrlsState(newUrls);
                    setImageUrls(newUrls);
                  }}
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Rating</Label>
            <div className="flex items-center gap-4">
              <div className="flex gap-1">
                {[...Array(5)].map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      const newRating = (index + 1).toString();
                      setRating(newRating);
                      setPlayData({ ...playData, rating: newRating, isStandingOvation: false });
                    }}
                    className={cn(
                      "p-1 rounded-full transition-colors",
                      Number(rating) > index 
                        ? "text-yellow-400" 
                        : "text-gray-300"
                    )}
                  >
                    <Moon className="w-6 h-6" />
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => {
                  setRating('Standing Ovation');
                  setPlayData({ 
                    ...playData, 
                    rating: 'Standing Ovation',
                    isStandingOvation: true 
                  });
                }}
                className={cn(
                  "p-1 rounded-full transition-colors",
                  rating === "Standing Ovation"
                    ? "text-yellow-400"
                    : "text-gray-300"
                )}
              >
                <User className={cn(
                  "w-6 h-6",
                  rating === "Standing Ovation" && "animate-bounce-subtle"
                )} />
              </button>
              <button
                type="button"
                onClick={() => {
                  setRating('0');
                  setPlayData({ 
                    ...playData, 
                    rating: '0',
                    isStandingOvation: false 
                  });
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                Reset
              </button>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={handleDelete}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
            
            <div className="flex gap-2">
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
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 