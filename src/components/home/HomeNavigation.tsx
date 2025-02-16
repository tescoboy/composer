'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Star, Award, List, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';

const sections = [
  { id: 'upcoming', label: 'Upcoming Shows', icon: Calendar },
  { id: 'recent', label: 'Recently Seen', icon: Clock },
  { id: 'unrated', label: 'Unrated', icon: AlertTriangle },
  { id: 'hall', label: 'Hall of Fame', icon: Award },
  { id: 'all', label: 'All Plays', icon: List },
];

export default function HomeNavigation() {
  const [activeSection, setActiveSection] = useState('upcoming');
  const [isScrolled, setIsScrolled] = useState(false);
  const [showShame, setShowShame] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 10);

      // Update active section based on scroll position
      const sectionElements = sections.map(section => ({
        id: section.id,
        element: document.getElementById(section.id),
      }));

      const currentSection = sectionElements.find(section => {
        if (!section.element) return false;
        const rect = section.element.getBoundingClientRect();
        return rect.top <= 100 && rect.bottom >= 100;
      });

      if (currentSection) {
        setActiveSection(currentSection.id);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // Account for fixed header
      window.scrollTo({
        top: element.offsetTop - offset,
        behavior: 'smooth'
      });
    }
  };

  return (
    <nav
      className={cn(
        "fixed top-20 left-0 right-0 z-40 transition-all duration-200",
        isScrolled ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-md" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            {sections.map(section => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={cn(
                  "relative px-3 py-2 text-sm font-medium transition-colors",
                  activeSection === section.id
                    ? "text-indigo-600 dark:text-indigo-400"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                )}
              >
                <div className="flex items-center gap-2">
                  <section.icon className="w-4 h-4" />
                  <span>{
                    section.id === 'hall' 
                      ? showShame ? 'Hall of Shame' : 'Hall of Fame'
                      : section.label
                  }</span>
                </div>
                {activeSection === section.id && (
                  <motion.div
                    layoutId="activeSection"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30
                    }}
                  />
                )}
              </button>
            ))}
          </div>
          
          {activeSection === 'hall' && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {showShame ? 'Shame' : 'Fame'}
              </span>
              <Switch
                checked={showShame}
                onCheckedChange={setShowShame}
              />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
} 