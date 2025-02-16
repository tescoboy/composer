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
import PlayCard from '@/components/PlayCard';
import { toast } from '@/components/ui/use-toast';
import { updatePlay } from '@/services/plays';

interface AllPlaysSectionProps {
  plays: Play[];
  canAdd: boolean;
  onPlayAdded: (play: Play) => void;
  onPlayDeleted: (id: number) => void;
}

const ITEMS_PER_PAGE = 15;

type SortField = 'date' | 'name' | 'theatre' | 'rating';
type SortDirection = 'asc' | 'desc';

export default function AllPlaysSection({ 
  plays, 
  canAdd,
  onPlayAdded,
  onPlayDeleted 
}: AllPlaysSectionProps) {
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [editingPlay, setEditingPlay] = useState<Play | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

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

  const handleEdit = async (updatedPlay: Play) => {
    try {
      await updatePlay(updatedPlay.id, updatedPlay);
      const updatedPlays = plays.map(p => 
        p.id === updatedPlay.id ? updatedPlay : p
      );
      onPlayAdded(updatedPlay);
      toast({
        title: "Success",
        description: "Play updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update play",
        variant: "destructive",
      });
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold font-playfair">All Plays</h2>
        {canAdd && (
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Add Play
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plays.map((play) => (
          <PlayCard 
            key={play.id} 
            play={play}
            onEdit={handleEdit}
            onDelete={onPlayDeleted}
          />
        ))}
      </div>

      {showAddModal && (
        <AddPlayModal
          onClose={() => setShowAddModal(false)}
          onSubmit={onPlayAdded}
        />
      )}
    </section>
  );
} 