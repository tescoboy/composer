'use client';

import { useState } from 'react';
import { Editor } from './editor/Editor';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Quote } from 'lucide-react';

interface ReviewEditorProps {
  initialContent: string;
  initialQuote: string;
  onSave: (data: { text: string; quote: string }) => void;
  onCancel: () => void;
}

export function ReviewEditor({ 
  initialContent, 
  initialQuote, 
  onSave, 
  onCancel 
}: ReviewEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [quote, setQuote] = useState(initialQuote);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ text: content, quote });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Quote className="w-4 h-4" />
            Featured Quote
          </Label>
          <Input
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            placeholder="Add a memorable quote from the play..."
            className="font-playfair text-lg"
          />
        </div>

        <div className="space-y-2">
          <Label>Your Review</Label>
          <Editor content={content} onChange={setContent} />
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-theatre-primary text-white rounded-md hover:bg-theatre-primary/90 transition-colors"
        >
          Save Review
        </button>
      </div>
    </form>
  );
} 