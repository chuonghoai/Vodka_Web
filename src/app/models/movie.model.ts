export interface Movie {
  id: string;
  title: string;
  posterUrl?: string;
  bannerUrl?: string;
  releaseYear: number;
  genre: string;
  rating: number;
  tags: string[];
  description?: string;
}
