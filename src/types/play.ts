export interface Review {
  id: number;
  play_id: number;
  user_id: string;
  content: string;
  created_at: string;
  user: {
    name: string | null;
    avatar_url: string | null;
  };
}

export interface Play {
  id: number;
  name: string;
  theatre: string;
  date: string;
  rating: string;
  isStandingOvation: boolean;
  image?: string | null;
  image1?: string | null;
  image2?: string | null;
  image3?: string | null;
  image4?: string | null;
  image5?: string | null;
  quote?: string | null;
  review?: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
} 