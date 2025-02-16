import { calculateImagePositions } from '@/lib/utils';
import { format } from 'date-fns';
import { Edit2 } from 'lucide-react';
import Image from 'next/image';
import { Review } from '@/types/play';

interface ReviewContentProps {
  review: Review;
  images: string[];
  canEdit: boolean;
  onEdit: () => void;
}

export function ReviewContent({ review, images, canEdit, onEdit }: ReviewContentProps) {
  const paragraphs = review.content.split('\n\n').filter(Boolean);
  const imagePositions = calculateImagePositions(paragraphs.length, images.length);

  // Get user display name from the user metadata
  const userName = review.user?.raw_user_meta_data?.full_name || 
                  review.user?.email?.split('@')[0] || 
                  'Anonymous';

  return (
    <div className="prose prose-lg max-w-none">
      <div className="flex justify-between items-center mb-8">
        <div>
          <p className="text-sm text-gray-500">
            Review by {userName}
          </p>
          <p className="text-sm text-gray-400">
            Last updated {format(new Date(review.updated_at || review.created_at), 'dd MMM yyyy')}
          </p>
        </div>
        {canEdit && (
          <button
            onClick={onEdit}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Edit2 className="w-5 h-5 text-gray-600" />
          </button>
        )}
      </div>

      {paragraphs.map((paragraph, index) => (
        <div key={index}>
          <p className="first-letter:text-5xl first-letter:font-bold first-letter:mr-3 first-letter:float-left first-letter:text-theatre-primary">
            {paragraph}
          </p>
          {imagePositions.includes(index) && images[imagePositions.indexOf(index)] && (
            <figure className="my-8">
              <div className="relative aspect-[16/9] rounded-lg overflow-hidden">
                <Image
                  src={images[imagePositions.indexOf(index)]}
                  alt={`Review image ${imagePositions.indexOf(index) + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            </figure>
          )}
        </div>
      ))}
    </div>
  );
} 