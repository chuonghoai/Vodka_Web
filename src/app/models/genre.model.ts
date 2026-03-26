export interface Genre {
  id: number;
  name: string;
  slug: string;
}

// Interface mở rộng cho admin management
export interface GenreDetail extends Genre {
  movieCount: number;
  createdAt: string;   
  updatedAt?: string;
}
// DTO cho tạo mới thể loại
export interface CreateGenreRequest {
  name: string;
  slug: string;
}
// DTO cho cập nhật thể loại
export interface UpdateGenreRequest {
  name?: string;
  slug?: string;
}
// Response thống kê tổng quan
export interface GenreStats {
  totalGenres: number;
  mostPopularGenre: { name: string; movieCount: number };
  unclassifiedMovies: number;
  latestGenre: { name: string; createdAt: string };
}