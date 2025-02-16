'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MoonRatingProps {
  value: number | 'standing-ovation' | null;
  onChange?: (value: number | 'standing-ovation') => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClasses = {
  sm: 'text-lg',
  md: 'text-2xl',
  lg: 'text-3xl',
  xl: 'text-4xl'
};

export default function MoonRating({ 
  value, 
  onChange, 
  readonly = false,
  size = 'md' 
}: MoonRatingProps) {
  const [hoveredValue, setHoveredValue] = useState<number | null>(null);
  const [lastClickTime, setLastClickTime] = useState<number>(0);
  const [lastClickedIndex, setLastClickedIndex] = useState<number | null>(null);

  const handleMoonClick = (index: number) => {
    if (readonly) return;
    
    const currentTime = Date.now();
    const isDoubleClick = currentTime - lastClickTime < 300 && lastClickedIndex === index;
    
    if (isDoubleClick) {
      // On double click, set to index - 0.5 (half moon)
      onChange?.(index - 0.5);
    } else {
      // On single click, set to full index
      onChange?.(index);
    }
    
    setLastClickTime(currentTime);
    setLastClickedIndex(index);
  };

  const getMoonIcon = (index: number) => {
    const displayValue = hoveredValue ?? value ?? 0;
    
    if (typeof displayValue === 'number') {
      if (index < Math.floor(displayValue)) {
        return '🌕'; // Full moon
      } else if (index === Math.floor(displayValue) && displayValue % 1 !== 0) {
        return '🌗'; // Half moon
      }
    }
    return '🌑'; // Empty moon
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((index) => (
          <motion.button
            key={index}
            type="button"
            onClick={() => handleMoonClick(index)}
            onMouseEnter={() => !readonly && setHoveredValue(index)}
            onMouseLeave={() => !readonly && setHoveredValue(null)}
            className={cn(
              "relative transition-transform",
              !readonly && "hover:scale-110 cursor-pointer",
              readonly && "cursor-default",
              sizeClasses[size]
            )}
            whileHover={!readonly ? { scale: 1.1 } : {}}
            whileTap={!readonly ? { scale: 0.95 } : {}}
          >
            <span className={cn(
              "block transition-all",
              value === 'standing-ovation' ? "opacity-30" : "opacity-100",
              (!value && !hoveredValue) && "opacity-40" // Make empty moons more grey
            )}>
              {getMoonIcon(index)}
            </span>
            {!readonly && hoveredValue && hoveredValue >= index && (
              <motion.span
                className="absolute inset-0 text-yellow-400"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.5, opacity: 0 }}
              >
                ✨
              </motion.span>
            )}
          </motion.button>
        ))}
      </div>

      <motion.button
        type="button"
        onClick={() => !readonly && onChange?.('standing-ovation')}
        className={cn(
          "relative transition-all",
          value === 'standing-ovation' ? "text-yellow-400" : "text-gray-300",
          !readonly && "hover:scale-110 cursor-pointer",
          readonly && "cursor-default",
          sizeClasses[size]
        )}
        whileHover={!readonly ? { scale: 1.1 } : {}}
        whileTap={!readonly ? { scale: 0.95 } : {}}
      >
        <User 
          className={cn(
            "w-[1em] h-[1em]",
            value === 'standing-ovation' && "animate-bounce"
          )}
        />
        {value === 'standing-ovation' && (
          <motion.span
            className="absolute inset-0 flex items-center justify-center"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity
            }}
          >
            ✨
          </motion.span>
        )}
      </motion.button>
    </div>
  );
} 