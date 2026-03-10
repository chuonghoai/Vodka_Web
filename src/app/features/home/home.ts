import { Component, inject, OnInit, signal } from '@angular/core';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../models/movie.model';
import { MovieSliderComponent } from './components/movie-slider/movie-slider';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MovieSliderComponent], // Import các thành phần con vào đây
  templateUrl: './home.html'
})
export class HomeComponent implements OnInit {
  // Inject service (Cách mới của Angular thay vì dùng constructor)
  private movieService = inject(MovieService);

  // Quản lý trạng thái bằng Signals
  featuredMovie = signal<Movie | null>(null);
  newReleases = signal<Movie[]>([]);
  trendingMovies = signal<Movie[]>([]);

  ngOnInit(): void {
    this.fetchData();
  }

  private fetchData() {
    // 1. Gọi API lấy phim Banner
    this.movieService.getFeaturedMovie().subscribe(res => {
      if (res.success) this.featuredMovie.set(res.data);
    });

    // 2. Gọi API lấy danh sách phim
    this.movieService.getMoviesList().subscribe(res => {
      if (res.success) {
        this.newReleases.set(res.data);
        // Có thể xáo trộn mảng để giả làm danh sách "Trending"
        this.trendingMovies.set([...res.data].reverse());
      }
    });
  }
}
