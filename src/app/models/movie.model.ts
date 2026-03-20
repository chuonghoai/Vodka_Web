import { Genre } from "./genre.model";
import { Tag } from "./tag.model";

// Movie card
export interface Movie {
  id: string;
  title: string;
  releaseYear: number;
  genre: Genre[];
  rating: number;
  posterUrl?: string;
  bannerUrl?: string;
  tags: Tag[];
  description?: string;
}

// Movie detail screen
export interface MovieDetail {
  movie: Movie;
  episodes: Season[];
  reviews: Review[];
  relatedMovies: Movie[];
  stats: MovieStats;
}

// util
export interface Episode {
  id: string;
  title: string;
  duration: number;
}

export interface Season {
  id: string;
  title: string;
  thumbnailUrl?: string;
  episodes: Episode[];
}

export interface Review {
  id: string;
  userName: string;
  avatarUrl?: string;
  rating: number;
  content: string;
  createdAt: string;
  replied?: ReplyReview[]
}

export interface ReplyReview {
  id: string;
  userName: string;
  avatarUrl?: string;
  content: string;
  createdAt: string;
}

export interface MovieStats {
  totalReviews: number;
  totalViews: number;
  favorites: number;
}
