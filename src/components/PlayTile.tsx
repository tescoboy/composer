'use client';

import Image from 'next/image';
import { Moon, User, Edit } from 'lucide-react';
import { Play } from '@/types/play';
import { useState } from 'react';
import { cn, formatDate } from '@/lib/utils';
import EditPlayModal from './EditPlayModal';
import Link from 'next/link';

interface PlayTileProps {
  id: number;
  name: string;
  theatre: string;
  date: string;
  rating: string;
  image?: string | null;
  image2?: string | null;
  image3?: string | null;
  image4?: string | null;
  image5?: string | null;
  synopsis?: string | null;
  isStandingOvation: boolean;
  variant?: 'default' | 'wide';
  onUpdate: (play: Play) => void;
  onDelete: (id: number) => void;
}

// Move RatingDisplay outside and export it
export function RatingDisplay({ rating }: { rating: string | null }) {
  if (!rating) return null;
  
  // Special case for Standing Ovation
  if (rating === 'Standing Ovation') {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, index) => (
          <Moon
            key={index}
            className="w-5 h-5 text-yellow-400 fill-yellow-400"
          />
        ))}
        <User 
          className="w-6 h-6 ml-1 text-yellow-400 fill-yellow-400 animate-bounce-subtle" 
          strokeWidth={1.5}
        />
      </div>
    );
  }

  const ratingNumber = parseFloat(rating) || 0;
  if (ratingNumber <= 0) return null;

  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, index) => (
        <Moon
          key={index}
          className={cn(
            "w-5 h-5 transition-all duration-300",
            index < ratingNumber
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-300 dark:text-gray-600"
          )}
        />
      ))}
    </div>
  );
}

export default function PlayTile({
  id,
  name,
  theatre,
  date,
  rating,
  image,
  image2,
  image3,
  image4,
  image5,
  synopsis,
  isStandingOvation,
  variant = 'default',
  onUpdate,
  onDelete
}: PlayTileProps) {
  const [imageError, setImageError] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // Reconstruct the play object for the EditModal
  const playData = {
    id,
    name,
    theatre,
    date,
    rating,
    image,
    image2,
    image3,
    image4,
    image5,
    synopsis,
    isStandingOvation
  };

  // Use the utility function instead
  const formattedDate = formatDate(date);

  if (variant === 'wide') {
    return (
      <article className="relative bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <Link href={`/play/${id}`} className="block">
          <div className="flex flex-col md:flex-row">
            <div className="relative w-full md:w-1/3 h-48 md:h-64 bg-gray-200 dark:bg-gray-700 flex-shrink-0">
              {image && !imageError ? (
                <>
                  <Image
                    src={image}
                    alt={name}
                    fill
                    priority
                    className={`
                      object-cover
                      transition-all duration-300
                      ${isImageLoading ? 'opacity-0' : 'opacity-100'}
                      group-hover:scale-105
                    `}
                    onError={() => setImageError(true)}
                    onLoad={() => setIsImageLoading(false)}
                    sizes="(max-width: 768px) 100vw, 33vw"
                    quality={85}
                  />
                  {isImageLoading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="animate-pulse w-full h-full bg-gray-300 dark:bg-gray-600" />
                    </div>
                  )}
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <span className="text-gray-400 dark:text-gray-500">No image</span>
                </div>
              )}
            </div>

            <div className="p-6 flex flex-col justify-between flex-grow">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{name}</h3>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 space-y-2 md:space-y-0">
                  <span className="text-sm text-gray-600 dark:text-gray-300">{theatre || 'Theatre TBA'}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{formattedDate}</span>
                </div>
              </div>

              <RatingDisplay rating={rating} />
            </div>
          </div>
        </Link>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsEditModalOpen(true);
          }}
          className="absolute top-2 right-2 p-2 bg-white/80 dark:bg-gray-800/80 rounded-full hover:bg-white dark:hover:bg-gray-700 transition-colors z-10"
          aria-label="Edit play"
        >
          <Edit className="w-4 h-4 text-gray-600 dark:text-gray-300" />
        </button>

        <EditPlayModal
          play={playData}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      </article>
    );
  }

  // Default card layout (for grid view)
  return (
    <article className="group relative bg-white dark:bg-gray-800/50 rounded-xl shadow-sm hover:shadow-xl overflow-hidden transition-all duration-300">
      <Link href={`/play/${id}`} className="block">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10 dark:to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent triggering the Link
            setIsEditModalOpen(true);
          }}
          className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-lg opacity-0 group-hover:opacity-100 hover:scale-110 transition-all duration-300 z-10"
        >
          <Edit className="w-4 h-4 text-gray-600 dark:text-gray-300" />
        </button>

        <div className="relative h-48 w-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
          {image && !imageError ? (
            <Image
              src={image}
              alt={name}
              fill
              priority
              className={cn(
                "object-cover transition-all duration-700",
                isImageLoading ? "opacity-0 scale-105" : "opacity-100 scale-100",
                "group-hover:scale-105"
              )}
              onError={() => setImageError(true)}
              onLoad={() => setIsImageLoading(false)}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              quality={90}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <span className="text-gray-400 dark:text-gray-500">No image</span>
            </div>
          )}
        </div>

        <div className="p-5">
          <h3 className="font-playfair text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {name}
          </h3>
          
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              {theatre || 'Theatre TBA'}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {formattedDate}
            </span>
          </div>

          <RatingDisplay rating={rating} />
        </div>
      </Link>

      <EditPlayModal
        play={playData}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onUpdate={onUpdate}
        onDelete={onDelete}
      />
    </article>
  );
} 