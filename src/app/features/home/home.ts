import { Component, inject, OnInit, signal } from '@angular/core';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../models/movie.model';
import { MovieSliderComponent } from './components/movie-slider/movie-slider';
import { WatchedHistoryComponent } from './components/watched-history/watched-history';

@Component({
  selector: 'app-home',
  standalone: true,
  // 1. Nhớ import WatchedHistoryComponent vào đây
  imports: [MovieSliderComponent, WatchedHistoryComponent],
  templateUrl: './home.html'
})
export class HomeComponent implements OnInit {
  private movieService = inject(MovieService);

  featuredMovie = signal<Movie | null>(null);
  newReleases = signal<Movie[]>([]);
  trendingMovies = signal<Movie[]>([]);

  // 2. Thêm signal chứa danh sách phim đã xem
  watchedMovies = signal<Movie[]>([]);

  ngOnInit(): void {
    this.fetchData();
  }

  private fetchData() {
    this.movieService.getFeaturedMovie().subscribe(res => {
      if (res.success) this.featuredMovie.set(res.data);
    });

    this.movieService.getMoviesList().subscribe(res => {
      if (res.success) {
        this.newReleases.set(res.data);
        this.trendingMovies.set([...res.data].reverse());
      }
    });

    // 3. Gọi API lấy lịch sử
    this.movieService.getWatchedHistory().subscribe(res => {
      if (res.success) {
        this.watchedMovies.set(res.data);
      }
    });
  }
}
