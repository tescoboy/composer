'use client';

import { X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ImageUrlInputsProps {
  urls: string[];
  onChange: (urls: string[]) => void;
}

export default function ImageUrlInputs({ urls, onChange }: ImageUrlInputsProps) {
  const [currentUrls, setCurrentUrls] = useState<string[]>(urls);
  // Initialize activeFields based on the number of non-empty URLs + 1
  const [activeFields, setActiveFields] = useState(() => {
    const nonEmptyCount = urls.filter(url => url.trim()).length;
    return nonEmptyCount + 1 > 5 ? 5 : Math.max(nonEmptyCount + 1, 1);
  });

  // Update state when urls prop changes
  useEffect(() => {
    setCurrentUrls(urls);
    const nonEmptyCount = urls.filter(url => url.trim()).length;
    setActiveFields(nonEmptyCount + 1 > 5 ? 5 : Math.max(nonEmptyCount + 1, 1));
  }, [urls]);

  const handleUrlChange = (index: number, value: string) => {
    const newUrls = [...currentUrls];
    newUrls[index] = value;
    setCurrentUrls(newUrls);

    // If this field has content and it's the last active field, show next field
    if (value.trim() && index === activeFields - 1 && activeFields < 5) {
      setActiveFields(prev => prev + 1);
    }

    // Update parent with non-empty URLs
    onChange(newUrls.filter(url => url.trim() !== ''));
  };

  const handleClear = (index: number) => {
    const newUrls = [...currentUrls];
    newUrls[index] = '';
    setCurrentUrls(newUrls);
    
    // If clearing a field that's not the last one, collapse subsequent fields
    if (index < activeFields - 1) {
      setActiveFields(index + 1);
    }

    // Update parent with non-empty URLs
    onChange(newUrls.filter(url => url.trim() !== ''));
  };

  return (
    <div className="space-y-2">
      {Array.from({ length: activeFields }).map((_, index) => (
        <div key={index} className="flex gap-2">
          <input
            type="url"
            placeholder={`Image URL ${index + 1}`}
            value={currentUrls[index] || ''}
            onChange={(e) => handleUrlChange(index, e.target.value)}
            onBlur={() => {
              // When field loses focus, if it's empty and not the first field,
              // and the previous field is also empty, collapse this field
              if (index > 0 && !currentUrls[index]?.trim() && !currentUrls[index - 1]?.trim()) {
                setActiveFields(prev => prev - 1);
              }
            }}
            className="w-full p-2 text-sm border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          {currentUrls[index]?.trim() && (
            <button
              type="button"
              onClick={() => handleClear(index)}
              className="p-2 text-gray-500 hover:text-gray-700"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      ))}
      {activeFields < 5 && currentUrls[activeFields - 1]?.trim() && (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Enter an image URL above to add another field (up to 5)
        </p>
      )}
    </div>
  );
} 