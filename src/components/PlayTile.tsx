'use client';

import Image from 'next/image';
import { Moon, User } from 'lucide-react';
import { Play } from '@/types/play';
import { useState } from 'react';
import { cn } from '@/lib/utils';

type PlayTileProps = Play & {
  variant?: 'default' | 'wide';
};

function RatingDisplay({ rating }: { rating: string | null }) {
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
  name,
  theatre,
  date,
  rating,
  image,
  variant = 'default',
}: PlayTileProps) {
  const [imageError, setImageError] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  if (variant === 'wide') {
    return (
      <article className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <div className="flex flex-col md:flex-row">
          <div className="relative w-full md:w-1/3 h-48 md:h-64 bg-gray-200 dark:bg-gray-700 flex-shrink-0">
            {image && !imageError ? (
              <>
                <Image
                  src={image}
                  alt={name}
                  fill
                  className={`
                    object-cover
                    transition-opacity duration-300
                    ${isImageLoading ? 'opacity-0' : 'opacity-100'}
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
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">{name}</h3>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 space-y-2 md:space-y-0">
                <span className="text-sm text-gray-600 dark:text-gray-300">{theatre || 'Theatre TBA'}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">{formattedDate}</span>
              </div>
            </div>

            <RatingDisplay rating={rating} />
          </div>
        </div>
      </article>
    );
  }

  // Default card layout (for grid view)
  return (
    <article className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 w-full bg-gray-200 dark:bg-gray-700">
        {image && !imageError ? (
          <>
            <Image
              src={image}
              alt={name}
              fill
              className={`
                object-cover
                transition-opacity duration-300
                ${isImageLoading ? 'opacity-0' : 'opacity-100'}
              `}
              onError={() => setImageError(true)}
              onLoad={() => setIsImageLoading(false)}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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

      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{name}</h3>
        
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600 dark:text-gray-300">{theatre || 'Theatre TBA'}</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">{formattedDate}</span>
        </div>

        <RatingDisplay rating={rating} />
      </div>
    </article>
  );
} 