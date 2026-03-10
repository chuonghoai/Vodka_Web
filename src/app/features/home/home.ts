// src/app/features/home/home.ts
import { Component, inject, OnInit, signal, computed, OnDestroy } from '@angular/core';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../models/movie.model';
import { MovieSliderComponent } from './components/movie-slider/movie-slider';
import { WatchedHistoryComponent } from './components/watched-history/watched-history';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MovieSliderComponent, WatchedHistoryComponent],
  templateUrl: './home.html'
})
export class HomeComponent implements OnInit, OnDestroy {
  private movieService = inject(MovieService);

  // --- QUẢN LÝ BANNER CHÍNH ---
  featuredMovies = signal<Movie[]>([]);
  bannerIndex = signal(0);
  currentFeaturedMovie = computed(() => {
    const movies = this.featuredMovies();
    return movies.length > 0 ? movies[this.bannerIndex()] : null;
  });

  // --- QUẢN LÝ DANH SÁCH PHIM ---
  newReleases = signal<Movie[]>([]);
  trendingMovies = signal<Movie[]>([]);
  watchedMovies = signal<Movie[]>([]);
  recentlyUpdated = signal<Movie[]>([]);
  highlyRated = signal<Movie[]>([]);
  actionMovies = signal<Movie[]>([]);

  // INIT
  private intervalId: any;
  ngOnInit(): void {
    this.fetchData();
    this.startAutoSlide();
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.clearAutoSlide();
    }
  }

  private fetchData() {
    this.movieService.getFeaturedMovies().subscribe(res => {
      if (res.success) this.featuredMovies.set(res.data);
    });

    this.movieService.getMoviesList().subscribe(res => {
      if (res.success) {
        this.newReleases.set(res.data);
        this.trendingMovies.set([...res.data].reverse());
      }
    });

    this.movieService.getWatchedHistory().subscribe(res => {
      if (res.success) this.watchedMovies.set(res.data);
    });

    this.movieService.getRecentlyUpdated().subscribe(res => {
      if (res.success) this.recentlyUpdated.set(res.data);
    });

    this.movieService.getHighlyRated().subscribe(res => {
      if (res.success) this.highlyRated.set(res.data);
    });

    this.movieService.getMoviesByGenre('Hành động').subscribe(res => {
      if (res.success) this.actionMovies.set(res.data);
    });
  }

  // --- HÀM ĐIỀU KHIỂN BANNER ---
  nextBanner() {
    this.bannerIndex.update(i => (i + 1) % this.featuredMovies().length);
    this.resetAutoSlide();
  }

  prevBanner() {
    this.bannerIndex.update(i => (i - 1 + this.featuredMovies().length) % this.featuredMovies().length);
    this.resetAutoSlide();
  }

  startAutoSlide(): void {
    this.clearAutoSlide();
    this.intervalId = setInterval(() => {
      this.bannerIndex.update(i => (i + 1) % this.featuredMovies().length);
    }, 5000);
  }

  clearAutoSlide(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  resetAutoSlide(): void {
    this.clearAutoSlide();
    this.startAutoSlide();
  }
}
