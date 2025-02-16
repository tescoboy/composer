'use client';

import { motion } from 'framer-motion';
import { Play } from '@/types/play';
import PlayCard from '@/components/PlayCard';
import { useEffect, useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { LayoutGrid, Calendar } from 'lucide-react';
import CalendarView from './CalendarView';

interface AnimatedSectionProps {
  title: string;
  plays: Play[];
  id: string;
  alternateTitle?: string;
  alternatePlays?: Play[];
  showCalendarToggle?: boolean;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function AnimatedSection({ 
  title, 
  plays, 
  id, 
  alternateTitle, 
  alternatePlays,
  showCalendarToggle 
}: AnimatedSectionProps) {
  const [showAlternate, setShowAlternate] = useState(false);
  const [displayedPlays, setDisplayedPlays] = useState(plays);
  const [viewMode, setViewMode] = useState<'grid' | 'calendar'>('grid');

  useEffect(() => {
    setDisplayedPlays(showAlternate ? alternatePlays || [] : plays);
  }, [showAlternate, plays, alternatePlays]);

  return (
    <section id={id} className="pt-24">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-8"
      >
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold font-playfair">
            {showAlternate ? alternateTitle : title}
          </h2>
          <div className="flex items-center gap-4">
            {alternateTitle && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {showAlternate ? alternateTitle : title}
                </span>
                <Switch
                  checked={showAlternate}
                  onCheckedChange={setShowAlternate}
                />
              </div>
            )}
            {showCalendarToggle && (
              <button
                onClick={() => setViewMode(v => v === 'grid' ? 'calendar' : 'grid')}
                className="flex items-center gap-2 px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {viewMode === 'grid' ? (
                  <>
                    <Calendar className="w-4 h-4" />
                    <span>Calendar View</span>
                  </>
                ) : (
                  <>
                    <LayoutGrid className="w-4 h-4" />
                    <span>Grid View</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {viewMode === 'grid' ? (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={container}
          >
            {displayedPlays.map(play => (
              <motion.div key={play.id} variants={item}>
                <PlayCard play={play} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <CalendarView plays={displayedPlays} />
        )}
      </motion.div>
    </section>
  );
} 