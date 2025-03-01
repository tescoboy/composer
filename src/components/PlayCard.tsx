'use client';

import { Play } from '@/types/play';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Theater, Edit2, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import MoonRating from '@/components/ui/moon-rating';
import { format } from 'date-fns';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/components/providers/AuthProvider';
import EditPlayModal from '@/components/EditPlayModal';

interface PlayCardProps {
  play: Play;
  onEdit?: (updatedPlay: Play) => void;
  onDelete?: (id: number) => void;
}

export default function PlayCard({ play, onEdit, onDelete }: PlayCardProps) {
  const { user } = useAuth();
  const isOwner = user?.id === play.userId;
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Safely handle the image URL
  const imageUrl = play.image || play.image1 || null;
  const safeImageUrl = imageUrl && !imageError ? imageUrl : null;

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowEditModal(true);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (window.confirm('Are you sure you want to delete this play?')) {
      onDelete?.(play.id);
    }
  };

  return (
    <>
      <Link href={`/play/${play.id}`}>
        <motion.div 
          className="group relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
          whileHover={{ y: -5 }}
        >
          {/* Image */}
          <div className="relative aspect-[3/2] overflow-hidden">
            {safeImageUrl ? (
              <>
                <Image
                  src={safeImageUrl}
                  alt={play.name}
                  fill
                  priority={false}
                  className={cn(
                    "object-cover transition-all duration-500",
                    isImageLoading ? "opacity-0 scale-105" : "opacity-100 scale-100",
                    "group-hover:scale-105"
                  )}
                  onError={() => setImageError(true)}
                  onLoad={() => setIsImageLoading(false)}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  quality={75}
                />
                {isImageLoading && (
                  <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
                )}
              </>
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
          
          {/* Content */}
          <div className="relative p-6">
            {/* Title */}
            <h3 className="text-xl font-bold font-playfair mb-3 text-gray-900 dark:text-white">
              {play.name}
            </h3>

            {/* Details */}
            <div className="space-y-4">
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                {/* Theatre */}
                <div className="flex items-center gap-1">
                  <Theater className="w-4 h-4" />
                  <span>{play.theatre}</span>
                </div>

                {/* Date */}
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{format(new Date(play.date), 'dd MMM yyyy')}</span>
                </div>
              </div>

              {/* Rating */}
              <div className="flex justify-end">
                <MoonRating 
                  value={
                    play.isStandingOvation 
                      ? 'standing-ovation' 
                      : play.rating 
                        ? Number(play.rating) 
                        : null
                  }
                  readonly
                  size="sm"
                />
              </div>
            </div>

            {/* Edit button only */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={handleEdit}
                className="p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
              >
                <Edit2 className="w-4 h-4 text-gray-700" />
              </button>
            </div>
          </div>
        </motion.div>
      </Link>

      {showEditModal && (
        <EditPlayModal
          play={play}
          onClose={() => setShowEditModal(false)}
          onSubmit={onEdit}
          onDelete={onDelete}
        />
      )}
    </>
  );
} 