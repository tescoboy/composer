'use client';

import { Play } from '@/types/play';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Theater, MapPin, Clock } from 'lucide-react';
import Link from 'next/link';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isToday, getDay } from 'date-fns';

interface CalendarViewProps {
  plays: Play[];
}

const theatreIcons: { [key: string]: string } = {
  'National Theatre': '🎭',
  'Royal Court': '👑',
  'Young Vic': '🌟',
  'Old Vic': '🏛️',
  'Shakespeare\'s Globe': '🌍',
  // Add more theatres and their icons
};

export default function CalendarView({ plays }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const startDate = monthStart;
  const endDate = monthEnd;
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  
  // Calculate empty days at start of month for grid
  const emptyDays = getDay(monthStart);

  // Get plays for the current month
  const monthPlays = plays.filter(play => {
    const playDate = new Date(play.date);
    return isSameMonth(playDate, currentMonth);
  });

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const [slideDirection, setSlideDirection] = useState(0);

  const changeMonth = (direction: number) => {
    setSlideDirection(direction);
    setCurrentMonth(prev => direction > 0 ? addMonths(prev, 1) : subMonths(prev, 1));
  };

  return (
    <motion.div 
      className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Calendar Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => changeMonth(-1)}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </motion.button>
          <h3 className="text-2xl font-bold">
            {format(currentMonth, 'MMMM yyyy')}
          </h3>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => changeMonth(1)}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </motion.button>
        </div>
      </div>

      <AnimatePresence initial={false} custom={slideDirection}>
        <motion.div 
          key={currentMonth.toISOString()}
          custom={slideDirection}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
          }}
          className="p-6"
        >
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-4">
            {/* Day Headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center font-medium text-sm py-2 text-gray-500 dark:text-gray-400">
                {day}
              </div>
            ))}

            {/* Empty cells for start of month */}
            {[...Array(emptyDays)].map((_, index) => (
              <div key={`empty-${index}`} className="min-h-[120px]" />
            ))}

            {/* Calendar Days */}
            {days.map(day => {
              const dayPlays = monthPlays.filter(play => 
                isSameDay(new Date(play.date), day)
              );

              return (
                <motion.div
                  key={day.toISOString()}
                  className={`
                    min-h-[120px] p-3 rounded-xl border border-gray-200 dark:border-gray-700
                    ${isToday(day) ? 'ring-2 ring-indigo-500 dark:ring-indigo-400' : ''}
                    ${dayPlays.length > 0 ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''}
                  `}
                  whileHover={{ scale: 1.02, translateY: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className={`
                    text-sm font-medium mb-2 
                    ${isToday(day) ? 'text-indigo-600 dark:text-indigo-400' : ''}
                  `}>
                    {format(day, 'd')}
                  </div>
                  <div className="space-y-2">
                    {dayPlays.map(play => (
                      <Link
                        key={play.id}
                        href={`/play/${play.id}`}
                      >
                        <motion.div 
                          className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="text-sm font-medium mb-1 line-clamp-1">
                            {play.name}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                            <span className="text-lg" role="img" aria-label="theatre">
                              {theatreIcons[play.theatre] || '🎭'}
                            </span>
                            <span className="line-clamp-1">{play.theatre}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-1">
                            <Clock className="w-3 h-3" />
                            <span>{format(new Date(play.date), 'h:mm a')}</span>
                          </div>
                        </motion.div>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
} 