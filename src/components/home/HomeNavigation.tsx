'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calendar, Grid } from 'lucide-react';

export default function HomeNavigation() {
  return (
    <nav className="sticky top-20 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <div className="flex space-x-4">
            <Link
              href="#upcoming"
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white px-3 py-2 text-sm font-medium"
            >
              Upcoming
            </Link>
            <Link
              href="#recent"
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white px-3 py-2 text-sm font-medium"
            >
              Recent
            </Link>
            <Link
              href="#hall"
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white px-3 py-2 text-sm font-medium"
            >
              Hall of Fame
            </Link>
            <Link
              href="#all"
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white px-3 py-2 text-sm font-medium"
            >
              All Plays
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
} 