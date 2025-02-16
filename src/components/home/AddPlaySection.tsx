'use client';

import { useState } from 'react';
import { Play } from '@/types/play';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { addPlay } from '@/services/plays';
import { toast } from '@/components/ui/use-toast';
import MoonRating from '@/components/ui/moon-rating';
import { Theater, Calendar, Image as ImageIcon, Plus, X } from 'lucide-react';

interface AddPlaySectionProps {
  canAdd: boolean;
  onPlayAdded: (play: Play) => void;
}

export default function AddPlaySection({ canAdd, onPlayAdded }: AddPlaySectionProps) {
  const [formData, setFormData] = useState({
    name: '',
    theatre: '',
    date: '',
    rating: '',
    isStandingOvation: false,
  });

  const [imageUrls, setImageUrls] = useState(['']);

  if (!canAdd) return null;

  const handleAddImageField = () => {
    if (imageUrls.length < 5) {
      setImageUrls([...imageUrls, '']);
    }
  };

  const handleRemoveImageField = (index: number) => {
    const newUrls = imageUrls.filter((_, i) => i !== index);
    setImageUrls(newUrls.length ? newUrls : ['']);
  };

  const handleImageChange = (index: number, value: string) => {
    const newUrls = [...imageUrls];
    newUrls[index] = value;
    setImageUrls(newUrls);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const playData = {
        ...formData,
        image1: imageUrls[0] || '',
        image2: imageUrls[1] || '',
        image3: imageUrls[2] || '',
        image4: imageUrls[3] || '',
        image5: imageUrls[4] || '',
      };
      
      const newPlay = await addPlay(playData);
      onPlayAdded(newPlay);
      setFormData({
        name: '',
        theatre: '',
        date: '',
        rating: '',
        isStandingOvation: false,
      });
      setImageUrls(['']);
      toast({
        title: "Success",
        description: "Play added successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add play",
        variant: "destructive",
      });
    }
  };

  return (
    <section id="add" className="bg-white rounded-xl shadow-sm border border-theatre-muted/10 overflow-hidden">
      <div className="relative">
        {/* Decorative header */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-theatre-primary via-theatre-accent to-theatre-secondary" />
        
        <div className="p-6">
          <h2 className="text-2xl font-playfair text-theatre-dark mb-6">Add New Play</h2>

          <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Basic Info */}
              <div className="space-y-2">
                <Label className="text-theatre-dark/80 font-medium">Play Name</Label>
                <div className="relative">
                  <Theater className="absolute left-3 top-1/2 -translate-y-1/2 text-theatre-primary/40" />
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="pl-10 border-theatre-muted/20 focus:border-theatre-primary bg-theatre-light/50 hover:bg-theatre-light transition-colors"
                    placeholder="Enter play name"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-theatre-dark/80 font-medium">Theatre</Label>
                <div className="relative">
                  <Theater className="absolute left-3 top-1/2 -translate-y-1/2 text-theatre-primary/40" />
                  <Input
                    value={formData.theatre}
                    onChange={(e) => setFormData(prev => ({ ...prev, theatre: e.target.value }))}
                    className="pl-10 border-theatre-muted/20 focus:border-theatre-primary bg-theatre-light/50 hover:bg-theatre-light transition-colors"
                    placeholder="Enter theatre name"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-theatre-dark/80 font-medium">Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-theatre-primary/40" />
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    className="pl-10 border-theatre-muted/20 focus:border-theatre-primary bg-theatre-light/50 hover:bg-theatre-light transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-theatre-dark/80 font-medium">Rating</Label>
                <MoonRating
                  value={formData.isStandingOvation ? 'standing-ovation' : formData.rating ? Number(formData.rating) : null}
                  onChange={(value) => {
                    if (value === 'standing-ovation') {
                      setFormData(prev => ({ ...prev, isStandingOvation: true, rating: '5' }));
                    } else {
                      setFormData(prev => ({ ...prev, isStandingOvation: false, rating: value.toString() }));
                    }
                  }}
                  size="lg"
                />
              </div>
            </div>

            {/* Images */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label className="text-theatre-dark/80 font-medium">Images</Label>
                {imageUrls.length < 5 && (
                  <button
                    type="button"
                    onClick={handleAddImageField}
                    className="text-theatre-primary hover:text-theatre-primary/80 text-sm flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    Add Image
                  </button>
                )}
              </div>
              
              {imageUrls.map((url, index) => (
                <div key={index} className="flex gap-2">
                  <div className="relative flex-1">
                    <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-theatre-primary/40" />
                    <Input
                      value={url}
                      onChange={(e) => handleImageChange(index, e.target.value)}
                      className="pl-10 border-theatre-muted/20 focus:border-theatre-primary bg-theatre-light/50 hover:bg-theatre-light transition-colors"
                      placeholder="Image URL"
                    />
                  </div>
                  {(index > 0 || imageUrls.length > 1) && (
                    <button
                      type="button"
                      onClick={() => handleRemoveImageField(index)}
                      className="p-2 text-red-500 hover:text-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-theatre-primary to-theatre-dark text-white rounded-lg hover:from-theatre-primary/90 hover:to-theatre-dark/90 transition-all duration-300 font-medium shadow-sm hover:shadow-md"
            >
              Add to Diary
            </button>
          </form>
        </div>
      </div>
    </section>
  );
} 