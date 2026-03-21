import { Episode, Movie, MovieStats, Review, Season } from "./movie.model";

export interface WatchDetailData {
  movie: { id: number; title: string };
  currentEpisode: Episode & { videoUrl?: string; description?: string };
  seasons: Season[];
  reviews: Review[];
  relatedMovies: Movie[];
  stats: MovieStats;
}
