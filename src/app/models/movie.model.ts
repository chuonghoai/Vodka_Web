export interface Movie {
  id: string;
  title: string;
  posterUrl: string;    // Ảnh dọc cho card phim
  bannerUrl?: string;   // Ảnh ngang cho màn hình Hero Banner
  releaseYear: number;
  genre: string;
  rating: number;
  tags: string[];       // Ví dụ: ['Full HD', 'Vietsub']
  description?: string;
}
