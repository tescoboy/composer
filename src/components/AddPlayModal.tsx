import { useState } from 'react';
import { Moon, X, ChevronDown, ChevronUp, User } from 'lucide-react';
import Image from 'next/image';
import { cn } from '../lib/utils';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

interface AddPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (playData: PlayData) => void;
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

export default function AddPlayModal({ isOpen, onClose, onSubmit }: AddPlayModalProps) {
  const [playData, setPlayData] = useState<PlayData>({
    title: '',
    theatre: '',
    date: new Date().toISOString().split('T')[0],
    rating: 0,
    isStandingOvation: false,
    imageUrls: ['', '', '', '', ''], // 5 empty strings for up to 5 images
  });
  
  const [showImages, setShowImages] = useState(false);
  const [rating, setRating] = useState<string>("0");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Filter out empty image URLs
    const filteredData = {
      ...playData,
      imageUrls: playData.imageUrls.filter(url => url.trim() !== '')
    };
    onSubmit(filteredData);
    setPlayData({
      title: '',
      theatre: '',
      date: new Date().toISOString().split('T')[0],
      rating: 0,
      isStandingOvation: false,
      imageUrls: ['', '', '', '', ''],
    });
    onClose();
  };

  const handleImageUrlChange = (index: number, value: string) => {
    const newImageUrls = [...playData.imageUrls];
    newImageUrls[index] = value;
    setPlayData({ ...playData, imageUrls: newImageUrls });
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Add New Play</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Play Title *
            </label>
            <input
              type="text"
              required
              value={playData.title}
              onChange={(e) => setPlayData({ ...playData, title: e.target.value })}
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
              value={playData.theatre}
              onChange={(e) => setPlayData({ ...playData, theatre: e.target.value })}
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
              <div className="mt-2 space-y-2">
                {playData.imageUrls.map((url, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="url"
                      placeholder={`Image URL ${index + 1}`}
                      value={url}
                      onChange={(e) => handleImageUrlChange(index, e.target.value)}
                      className="w-full p-2 text-sm border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                ))}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Enter up to 5 image URLs. The first image will be used as the feature image.
                </p>
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
                    onClick={() => setRating((index + 1).toString())}
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
                onClick={() => setRating("Standing Ovation")}
                className={cn(
                  "p-1 rounded-full transition-colors",
                  rating === "Standing Ovation"
                    ? "text-yellow-400"
                    : "text-gray-300"
                )}
              >
                <User 
                  className={cn(
                    "w-6 h-6",
                    rating === "Standing Ovation" && "animate-bounce-subtle"
                  )}
                />
              </button>
            </div>
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
              Add Play
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 