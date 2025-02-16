'use client';

import { useState } from 'react';
import { Play } from '@/types/play';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import Link from 'next/link';
import { Star, Moon, User, ChevronUp, ChevronDown, Search, Pencil } from 'lucide-react';
import AddPlayModal from '@/components/AddPlayModal';
import MoonRating from '@/components/ui/moon-rating';

interface AllPlaysSectionProps {
  id: string;
  title: string;
  plays: Play[];
}

const ITEMS_PER_PAGE = 15;

type SortField = 'date' | 'name' | 'theatre' | 'rating';
type SortDirection = 'asc' | 'desc';

export default function AllPlaysSection({ id, title, plays }: AllPlaysSectionProps) {
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [editingPlay, setEditingPlay] = useState<Play | null>(null);

  // Filter plays based on search with null checks
  const filteredPlays = plays.filter(play => {
    const searchLower = search.toLowerCase();
    const nameMatch = play.name?.toLowerCase()?.includes(searchLower) ?? false;
    const theatreMatch = play.theatre?.toLowerCase()?.includes(searchLower) ?? false;
    return nameMatch || theatreMatch;
  });

  // Sort plays
  const sortedPlays = [...filteredPlays].sort((a, b) => {
    const direction = sortDirection === 'asc' ? 1 : -1;
    
    switch (sortField) {
      case 'date':
        return direction * (new Date(a.date).getTime() - new Date(b.date).getTime());
      case 'name':
        return direction * (a.name || '').localeCompare(b.name || '');
      case 'theatre':
        return direction * (a.theatre || '').localeCompare(b.theatre || '');
      case 'rating':
        return direction * ((parseInt(a.rating) || 0) - (parseInt(b.rating) || 0));
      default:
        return 0;
    }
  });

  // Paginate plays
  const totalPages = Math.ceil(sortedPlays.length / ITEMS_PER_PAGE);
  const paginatedPlays = sortedPlays.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(current => current === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (field !== sortField) return null;
    return sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />;
  };

  return (
    <section id={id} className="pt-24">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold font-playfair">{title}</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search plays..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-64 pl-9"
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                  <th 
                    className="px-6 py-4 text-left cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => handleSort('date')}
                  >
                    <div className="flex items-center gap-2">
                      Date
                      <SortIcon field="date" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center gap-2">
                      Play
                      <SortIcon field="name" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => handleSort('theatre')}
                  >
                    <div className="flex items-center gap-2">
                      Theatre
                      <SortIcon field="theatre" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => handleSort('rating')}
                  >
                    <div className="flex items-center gap-2">
                      Rating
                      <SortIcon field="rating" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {paginatedPlays.map(play => (
                  <motion.tr
                    key={play.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
                    className="group"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {format(new Date(play.date), 'dd MMM yyyy')}
                    </td>
                    <td className="px-6 py-4">
                      <Link 
                        href={`/play/${play.id}`}
                        className="text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-indigo-600 dark:hover:text-indigo-400"
                      >
                        {play.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {play.theatre}
                    </td>
                    <td className="px-6 py-4">
                      <MoonRating 
                        value={
                          play.isStandingOvation 
                            ? 'standing-ovation' 
                            : play.rating 
                              ? Number(play.rating) 
                              : null
                        }
                        readonly
                        size="sm"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setEditingPlay(play)}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Pencil className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        <span className="sr-only">Edit {play.name}</span>
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, sortedPlays.length)} of {sortedPlays.length} plays
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-sm rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Play Modal */}
      <AddPlayModal
        play={editingPlay}
        onClose={() => setEditingPlay(null)}
        onSubmit={async () => {
          setEditingPlay(null);
          // You might want to add a way to refresh the plays data here
        }}
      />
    </section>
  );
} 