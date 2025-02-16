export interface Play {
  id: string;
  created_at?: string;
  name: string;
  theatre: string;
  date: string;
  rating: string | number;
  image?: string;
  comments?: string;
  synopsis?: string;
  isStandingOvation?: boolean;
} 