'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Dialog } from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface PlayReviewGalleryProps {
  images: string[];
}

export default function PlayReviewGallery({ images }: PlayReviewGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const validImages = images.filter(Boolean);

  const handlePrevious = () => {
    setSelectedImage(prev => 
      prev === null ? null : prev <= 0 ? validImages.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setSelectedImage(prev => 
      prev === null ? null : prev >= validImages.length - 1 ? 0 : prev + 1
    );
  };

  if (validImages.length === 0) return null;

  return (
    <>
      <div className="mt-12">
        <h2 className="font-playfair text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          Gallery
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {validImages.map((image, index) => (
            <button
              key={image}
              onClick={() => setSelectedImage(index)}
              className="relative aspect-[3/2] overflow-hidden rounded-lg group"
            >
              <Image
                src={image}
                alt=""
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>
      </div>

      <Dialog open={selectedImage !== null} onOpenChange={() => setSelectedImage(null)}>
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 text-white/75 hover:text-white"
          >
            <X className="w-8 h-8" />
          </button>

          {selectedImage !== null && (
            <div className="relative w-full h-full flex items-center justify-center">
              <button
                onClick={handlePrevious}
                className="absolute left-4 text-white/75 hover:text-white"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>

              <div className="relative w-full h-full max-w-6xl max-h-[80vh] mx-8">
                <Image
                  src={validImages[selectedImage]}
                  alt=""
                  fill
                  className="object-contain"
                  quality={95}
                />
              </div>

              <button
                onClick={handleNext}
                className="absolute right-4 text-white/75 hover:text-white"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </div>
          )}
        </div>
      </Dialog>
    </>
  );
} 