import { Episode, Movie, MovieStats, Review, Season } from "./movie.model";

export interface WatchDetailData {
  movie: { id: string; title: string };
  currentEpisode: Episode & { videoUrl?: string; description?: string };
  seasons: Season[];
  reviews: Review[];
  relatedMovies: Movie[];
  stats: MovieStats;
}
