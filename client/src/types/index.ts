// src/types/index.ts

export interface Genre {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Game {
  id: string;
  title: string;
  description: string;
  release_date: string;
  publisher: string;
  thumbnail: string;
  avg_user_rating: string;
  popularity_score: number;
  trending_score: number;
  created_by: string;
  createdAt: string;
  updatedAt: string;
  Genres: Genre[];
}

export interface ApiState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}
