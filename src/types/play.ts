export interface Play {
  id: number;
  created_at?: string;
  name: string;
  theatre: string;
  date: string;
  rating: string;
  image?: string;
  comments?: string;
  synopsis?: string;
  isStandingOvation?: boolean;
} 