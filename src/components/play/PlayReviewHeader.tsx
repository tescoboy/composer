'use client';

import React, { useState, useEffect } from 'react';
import { createClient, useSession } from '@/lib/auth-client';
import { Play, Review } from '@/types/play';
import { getPlayReviews, addReview, updateReview } from '@/services/reviews';
import { AvatarImage, AvatarFallback, Avatar } from '@/components/ui/avatar';
import { toast } from '@/components/ui/use-toast';
import { Edit2, Save, X, Theater, Star, Calendar, Ticket, Bold, Italic, Quote, List, Moon, MoonStar, User, ArrowUp, Maximize2, ArrowDown, ArrowUpLeft, ArrowDownLeft, ArrowUpRight, ArrowDownRight, ArrowLeft, ArrowRight, Minus, Plus, Crop, ZoomIn, ZoomOut, Move } from 'lucide-react';
import { formatDistanceToNow } from '@/lib/utils';
import Image from 'next/image';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { updatePlayImagePosition } from '@/services/plays';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';

interface PlayReviewHeaderProps {
  play: Play;
  onUpdateImages: (images: { [key: string]: string | null }) => void;
}

// Keep only this one interface
interface ImageControls {
  zoom: number;  // 1 to 1.5
  position: {
    x: number;   // -50 to 50
    y: number;   // -50 to 50
  };
}

// Add this helper function at the top level
const RatingDisplay = ({ rating, isStandingOvation }: { rating: number; isStandingOvation: boolean }) => {
  if (isStandingOvation) {
    return (
      <div className="flex flex-col items-center space-y-2">
        <User className="h-8 w-8 text-yellow-400 animate-bounce-subtle" />
        <span className="text-lg font-medium text-yellow-400">Standing Ovation</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Moon
            key={i}
            className={`h-6 w-6 transition-all ${
              i < rating 
                ? 'fill-yellow-400 text-yellow-400' 
                : 'text-gray-300 dark:text-gray-600'
            }`}
          />
        ))}
      </div>
      <span className="text-sm text-gray-600 dark:text-gray-400">
        {rating}/5
      </span>
    </div>
  );
};

export default function PlayReviewHeader({ play, onUpdateImages }: PlayReviewHeaderProps) {
  const { user } = useAuth();
  const [review, setReview] = useState<Review | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [highlightQuote, setHighlightQuote] = useState('');
  const [imagePosition, setImagePosition] = useState<ImagePosition>(
    play.image_position || 'center'
  );

  // Add these new types and state
  const [showImageControls, setShowImageControls] = useState(false);
  const [imageControls, setImageControls] = useState<ImageControls>({
    zoom: play.image_zoom || 1,
    position: {
      x: play.image_x || 0,
      y: play.image_y || 0
    }
  });

  // Add touch/drag handling
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  // Editor setup with existing content when editing
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: true,
        orderedList: true,
      }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert max-w-none focus:outline-none min-h-[200px] p-4',
      },
    },
  });

  const validImages = [play.image, play.image2, play.image3, play.image4, play.image5]
    .filter((img): img is string => typeof img === 'string');

  // Load session and review
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load reviews regardless of session
        const reviews = await getPlayReviews(play.id);
        // If user is logged in, find their review
        if (user) {
          const userReview = reviews.find(r => r.user_id === user.id);
          if (userReview) {
            setReview(userReview);
            setHighlightQuote(userReview.quote || '');
          }
        } else {
          // If not logged in, show the first review (or you could show all reviews)
          if (reviews.length > 0) {
            setReview(reviews[0]);
            setHighlightQuote(reviews[0].quote || '');
          }
        }
      } catch (error) {
        console.error('Failed to load data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load review',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [play.id, user]);

  // Update editor content when editing starts
  useEffect(() => {
    if (isEditing && editor && review) {
      editor.commands.setContent(review.content);
    }
  }, [isEditing, review, editor]);

  const handleStartReview = () => {
    setIsEditing(true);
    editor?.commands.setContent('');
  };

  const handleSaveReview = async () => {
    if (!user || !editor) return;

    const content = editor.getHTML();
    try {
      if (review) {
        // Update existing review
        const success = await updateReview(review.id, content, highlightQuote);
        if (success) {
          setReview({ 
            ...review, 
            content, 
            quote: highlightQuote // Make sure quote is updated
          });
          toast({ title: 'Success', description: 'Review updated successfully' });
        }
      } else {
        // Create new review
        const newReview = await addReview(play.id, content, highlightQuote);
        if (newReview) {
          setReview(newReview);
          toast({ title: 'Success', description: 'Review posted successfully' });
        }
      }
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save review:', error);
      toast({
        title: 'Error',
        description: 'Failed to save review',
        variant: 'destructive',
      });
    }
  };

  // Update the handleUpdateImagePosition function
  const handleUpdateImagePosition = async (position: ImagePosition) => {
    try {
      console.log('Updating position to:', position); // Debug log
      const success = await updatePlayImagePosition(play.id, position);
      if (success) {
        setImagePosition(position);
        console.log('New position set:', position); // Debug log
        toast({
          title: 'Success',
          description: 'Image position updated',
        });
      } else {
        throw new Error('Failed to update image position');
      }
    } catch (error) {
      console.error('Error updating position:', error);
      toast({
        title: 'Error',
        description: 'Failed to update image position',
        variant: 'destructive',
      });
    }
  };

  // Update the image style generation
  const getImageStyle = (controls: ImagePosition) => {
    return {
      transform: `scale(${controls.zoom})`,
      objectPosition: `${50 + controls.x}% ${50 + controls.y}%`,
    };
  };

  // Add the new controls UI and handlers
  const ImageAdjustButton = () => (
    <button
      onClick={() => setShowImageControls(true)}
      className="absolute bottom-4 right-4 z-20 px-3 py-2 bg-black/40 backdrop-blur-sm 
                 rounded-lg text-white hover:bg-black/50 transition-all flex items-center gap-2
                 opacity-0 group-hover:opacity-100"
      title="Adjust image"
    >
      <Crop className="w-4 h-4" />
      <span className="text-sm">Adjust Image</span>
    </button>
  );

  const ImageControlsDialog = () => (
    <Dialog open={showImageControls} onOpenChange={setShowImageControls}>
      <DialogContent className="sm:max-w-[425px]">
        <div className="space-y-6">
          <div className="relative aspect-video rounded-lg overflow-hidden">
            <Image
              src={validImages[0]}
              alt={play.name}
              fill
              className="object-cover transition-all duration-300"
              style={{
                transform: `scale(${imageControls.zoom})`,
                objectPosition: `${50 + imageControls.position.x}% ${50 + imageControls.position.y}%`
              }}
            />
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Zoom</span>
                <span>{((imageControls.zoom - 1) * 100).toFixed(0)}%</span>
              </div>
              <Slider
                value={[imageControls.zoom]}
                min={1}
                max={1.5}
                step={0.01}
                onValueChange={([zoom]) => setImageControls(prev => ({
                  ...prev,
                  zoom
                }))}
              />
            </div>

            <div className="relative h-40 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
              <div
                className="absolute w-6 h-6 cursor-move"
                style={{
                  left: `${50 + imageControls.position.x}%`,
                  top: `${50 + imageControls.position.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                onPointerDown={(e) => {
                  const box = e.currentTarget.parentElement?.getBoundingClientRect();
                  if (!box) return;

                  const moveHandler = (e: PointerEvent) => {
                    const x = ((e.clientX - box.left) / box.width) * 100 - 50;
                    const y = ((e.clientY - box.top) / box.height) * 100 - 50;
                    
                    setImageControls(prev => ({
                      ...prev,
                      position: {
                        x: Math.max(-50, Math.min(50, x)),
                        y: Math.max(-50, Math.min(50, y))
                      }
                    }));
                  };

                  const upHandler = () => {
                    window.removeEventListener('pointermove', moveHandler);
                    window.removeEventListener('pointerup', upHandler);
                  };

                  window.addEventListener('pointermove', moveHandler);
                  window.addEventListener('pointerup', upHandler);
                }}
              >
                <div className="w-full h-full bg-indigo-600 rounded-full shadow-lg" />
              </div>
              <div className="absolute inset-0 pointer-events-none">
                <div className="w-full h-full border-2 border-dashed border-gray-300 dark:border-gray-600" />
                <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} className="border border-gray-300/20 dark:border-gray-600/20" />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setImageControls({
                  zoom: 1,
                  position: { x: 0, y: 0 }
                });
              }}
              className="px-4 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Reset
            </button>
            <button
              onClick={async () => {
                try {
                  console.log('Saving image controls:', {
                    x: imageControls.position.x,
                    y: imageControls.position.y,
                    zoom: imageControls.zoom
                  });

                  const success = await updatePlayImagePosition(play.id, {
                    x: imageControls.position.x,
                    y: imageControls.position.y,
                    zoom: imageControls.zoom
                  });
                  
                  if (success) {
                    setShowImageControls(false);
                    toast({ 
                      title: 'Success', 
                      description: 'Image position updated' 
                    });
                  } else {
                    throw new Error('Failed to update image position');
                  }
                } catch (error) {
                  console.error('Error saving image position:', error);
                  toast({ 
                    title: 'Error', 
                    description: 'Failed to update image position',
                    variant: 'destructive'
                  });
                }
              }}
              className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Save Changes
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  const renderHeroSection = () => (
    <div className="relative">
      <div className={`relative ${validImages.length > 0 ? 'h-[70vh]' : 'h-[50vh]'} group`}>
        {/* Navigation */}
        <div className="absolute top-0 left-0 w-full p-4 z-30">
          <div className="max-w-7xl mx-auto">
            <Link 
              href="/"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white 
                         transition-colors duration-200 group"
            >
              <div className="bg-black/30 backdrop-blur-sm rounded-full p-2 
                            transform transition-transform duration-200 
                            group-hover:-translate-x-1">
                <ChevronLeft className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium">Back to Plays</span>
            </Link>
          </div>
        </div>

        {validImages.length > 0 ? (
          <div className="relative h-full">
            <Image
              src={validImages[0]}
              alt={play.name}
              fill
              className="object-cover transition-all duration-300"
              style={{
                transform: `scale(${imageControls.zoom})`,
                objectPosition: `${50 + imageControls.position.x}% ${50 + imageControls.position.y}%`
              }}
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />
            <ImageAdjustButton />
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-700" />
        )}

        {/* Title and Info Overlay */}
        <div className="absolute inset-0 flex flex-col justify-center items-center p-8 text-white z-10">
          <div className="max-w-4xl w-full mx-auto space-y-8">
            {/* Title */}
            <div className="text-center space-y-4">
              <h1 className="font-playfair text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-shadow-lg">
                {play.name}
              </h1>
              <div className="flex items-center justify-center gap-2 text-lg text-shadow">
                <Theater className="h-5 w-5" />
                <span className="font-light">{play.theatre}</span>
              </div>
            </div>

            {/* Rating Display */}
            <div className="flex justify-center">
              {play.isStandingOvation ? (
                <div className="bg-black/30 backdrop-blur-sm rounded-xl px-6 py-4 flex flex-col items-center space-y-2">
                  <User className="h-12 w-12 text-yellow-400 animate-bounce-subtle" />
                  <span className="text-xl font-medium text-yellow-400">Standing Ovation</span>
                </div>
              ) : (
                <div className="bg-black/30 backdrop-blur-sm rounded-xl px-6 py-4 flex flex-col items-center space-y-2">
                  <div className="flex gap-2">
                    {[...Array(5)].map((_, i) => (
                      <Moon
                        key={i}
                        className={`h-8 w-8 transition-all ${
                          i < parseInt(play.rating)
                            ? 'fill-yellow-400 text-yellow-400' 
                            : 'text-white/30'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-white/80">
                    {play.rating}/5
                  </span>
                </div>
              )}
            </div>

            {/* Date */}
            <div className="flex justify-center">
              <div className="bg-black/30 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-white/80" />
                <span className="text-white/80 font-medium">
                  {new Date(play.date).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ImageControlsDialog />
    </div>
  );

  const renderEditor = () => (
    <div className="space-y-6">
      <div className="flex gap-2 border-b pb-2">
        <button
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className={`p-2 rounded ${editor?.isActive('bold') ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className={`p-2 rounded ${editor?.isActive('italic') ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded ${editor?.isActive('blockquote') ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
        >
          <Quote className="w-4 h-4" />
        </button>
      </div>
      
      <div className="space-y-4">
        <input
          type="text"
          value={highlightQuote}
          onChange={(e) => setHighlightQuote(e.target.value)}
          placeholder="Add a highlight quote from your review..."
          className="w-full px-4 py-2 border rounded-md"
        />
        <EditorContent editor={editor} />
      </div>

      <div className="flex justify-end gap-2">
        <button
          onClick={() => setIsEditing(false)}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md"
        >
          Cancel
        </button>
        <button
          onClick={handleSaveReview}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md"
        >
          {review ? 'Update Review' : 'Post Review'}
        </button>
      </div>
    </div>
  );

  // Update the renderReview function to remove duplicate play details
  const renderReview = () => {
    if (!review?.content) return null;

    const paragraphs = review.content.split('</p>');
    const additionalImages = validImages.slice(1);
    const imagePositions = calculateImagePositions(
      paragraphs.length,
      additionalImages.length
    );

    return (
      <div className="space-y-8">
        {/* Quote Section */}
        {review.quote && (
          <blockquote className="relative bg-white dark:bg-gray-800 rounded-xl p-12 shadow-lg">
            <div className="absolute top-0 left-0 transform -translate-x-4 -translate-y-4 text-7xl text-indigo-300 opacity-50">"</div>
            <p className="text-3xl italic font-serif text-center relative z-10 text-gray-800 dark:text-gray-200">
              {review.quote}
            </p>
            <div className="absolute bottom-0 right-0 transform translate-x-4 translate-y-4 text-7xl text-indigo-300 opacity-50">"</div>
            <div className="mt-6 text-center text-gray-500 dark:text-gray-400">
              — {review.user.name || review.user.email?.split('@')[0]}
            </div>
          </blockquote>
        )}

        {/* Author info */}
        <div className="flex items-center gap-4 border-b dark:border-gray-700 pb-6">
          <Avatar className="h-12 w-12">
            <AvatarImage src={review.user.avatar_url} />
            <AvatarFallback>
              {review.user.name?.charAt(0).toUpperCase() || 'A'}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium text-lg">
              {review.user.name || review.user.email?.split('@')[0]}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {formatDistanceToNow(new Date(review.created_at))} ago
            </div>
          </div>
        </div>

        {/* Review content */}
        <div className="prose dark:prose-invert max-w-none">
          {paragraphs.map((paragraph, index) => (
            <React.Fragment key={index}>
              <div 
                className={index === 0 ? 'first-letter:text-5xl first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:mt-1' : ''}
                dangerouslySetInnerHTML={{ 
                  __html: paragraph + (index < paragraphs.length - 1 ? '</p>' : '') 
                }} 
              />
              
              {imagePositions.includes(index) && additionalImages[imagePositions.indexOf(index)] && (
                <div className="my-8 relative aspect-video rounded-lg overflow-hidden group">
                  <Image
                    src={additionalImages[imagePositions.indexOf(index)]}
                    alt=""
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Edit button */}
        {user?.id === review.user_id && (
          <button
            onClick={() => setIsEditing(true)}
            className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            Edit Review
          </button>
        )}
      </div>
    );
  };

  // Helper function to calculate optimal image positions
  const calculateImagePositions = (paragraphCount: number, imageCount: number) => {
    if (imageCount === 0) return [];
    if (paragraphCount <= 2) return [0]; // Show image after first paragraph if content is short
    
    // For longer content, distribute images evenly
    const positions: number[] = [];
    const spacing = Math.floor(paragraphCount / (imageCount + 1));
    
    for (let i = 0; i < imageCount; i++) {
      const position = (i + 1) * spacing;
      if (position < paragraphCount) {
        positions.push(position);
      }
    }
    
    return positions;
  };

  // Helper function to get image position class
  const getImagePositionClass = (position: ImagePosition) => {
    switch (position) {
      case 'top-left':
        return 'object-cover object-left-top';
      case 'top':
        return 'object-cover object-top';
      case 'top-right':
        return 'object-cover object-right-top';
      case 'center-left':
        return 'object-cover object-left';
      case 'center':
        return 'object-cover object-center';
      case 'center-right':
        return 'object-cover object-right';
      case 'bottom-left':
        return 'object-cover object-left-bottom';
      case 'bottom':
        return 'object-cover object-bottom';
      case 'bottom-right':
        return 'object-cover object-right-bottom';
      default:
        return 'object-cover object-center';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {renderHeroSection()}
      
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold font-playfair">Reviews</h2>
            {/* Only show write review button if logged in and hasn't reviewed */}
            {user && !review && !isEditing && (
              <button
                onClick={handleStartReview}
                className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                Write a Review
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="animate-pulse">
              {/* Add loading skeleton */}
            </div>
          ) : isEditing ? (
            renderEditor()
          ) : review ? (
            renderReview()
          ) : !user ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">Sign in to write the first review.</p>
              <Link 
                href="/login"
                className="text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Sign In
              </Link>
            </div>
          ) : (
            <p className="text-gray-600 text-center py-8">
              Be the first to write a review!
            </p>
          )}
        </div>
      </div>
    </div>
  );
} 