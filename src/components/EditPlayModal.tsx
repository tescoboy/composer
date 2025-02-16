'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Play } from '@/types/play';
import { toast } from '@/components/ui/use-toast';
import MoonRating from './ui/moon-rating';
import { Trash2, Plus, X } from 'lucide-react';

interface EditPlayModalProps {
  play: Play;
  onClose: () => void;
  onSubmit: (play: Play) => void;
  onDelete: (id: number) => void;
}

export default function EditPlayModal({ play, onClose, onSubmit, onDelete }: EditPlayModalProps) {
  const [formData, setFormData] = useState({
    name: play.name,
    theatre: play.theatre,
    date: play.date,
    rating: play.rating,
    isStandingOvation: play.isStandingOvation,
    image1: play.image1 || '',
    image2: play.image2 || '',
    image3: play.image3 || '',
    image4: play.image4 || '',
    image5: play.image5 || '',
  });

  const handleImageChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [`image${index + 1}`]: value
    }));
  };

  const handleDeleteImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      [`image${index + 1}`]: ''
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      onSubmit({
        ...play,
        ...formData,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update play",
        variant: "destructive",
      });
    }
  };

  const handleDeletePlay = () => {
    if (window.confirm('Are you sure you want to delete this play?')) {
      onDelete(play.id);
      onClose();
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Play</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            
            <div>
              <Label>Theatre</Label>
              <Input
                value={formData.theatre}
                onChange={(e) => setFormData(prev => ({ ...prev, theatre: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label>Date</Label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                required
              />
            </div>
          </div>

          {/* Rating */}
          <div>
            <Label>Rating</Label>
            <div className="flex items-center gap-4">
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
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, rating: '', isStandingOvation: false }))}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Reset Rating
              </button>
            </div>
          </div>

          {/* Images */}
          <div className="space-y-4">
            <Label>Images</Label>
            {[0,1,2,3,4].map((index) => {
              const imageUrl = formData[`image${index + 1}` as keyof typeof formData];
              if (!imageUrl && index > 0 && !formData[`image${index}` as keyof typeof formData]) {
                return null;
              }
              
              return (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder={`Image URL ${index + 1}`}
                    value={imageUrl}
                    onChange={(e) => handleImageChange(index, e.target.value)}
                  />
                  {imageUrl && (
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(index)}
                      className="p-2 text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={handleDeletePlay}
              className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100"
            >
              Delete Play
            </button>
            
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                Update
              </button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 