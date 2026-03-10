// src/app/features/home/home.ts
import { Component, inject, OnInit, signal, computed, OnDestroy, PLATFORM_ID } from '@angular/core';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../models/movie.model';
import { MovieSliderComponent } from './components/movie-slider/movie-slider';
import { WatchedHistoryComponent } from './components/watched-history/watched-history';
import { MovieListComponent } from "./components/movie-list/movie-list";
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MovieSliderComponent, WatchedHistoryComponent, MovieListComponent],
  templateUrl: './home.html'
})
export class HomeComponent implements OnInit, OnDestroy {
  private movieService = inject(MovieService);
  private platformId = inject(PLATFORM_ID);

  // --- QUẢN LÝ BANNER CHÍNH ---
  featuredMovies = signal<Movie[]>([]);
  bannerIndex = signal(0);
  currentFeaturedMovie = computed(() => { const m = this.featuredMovies(); return m.length > 0 ? m[this.bannerIndex()] : null; });
  private intervalId: any;

  // --- QUẢN LÝ DANH SÁCH PHIM ---
  newReleases = signal<Movie[]>([]);
  newReleasesPage = signal(1);
  newReleasesTotalPages = signal(1);

  trendingMovies = signal<Movie[]>([]);
  watchedMovies = signal<Movie[]>([]);
  recentlyUpdated = signal<Movie[]>([]);
  highlyRated = signal<Movie[]>([]);
  actionMovies = signal<Movie[]>([]);

  // INIT
  ngOnInit(): void {
    this.fetchData();
    this.startAutoSlide();
    this.loadNewReleases(1);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.clearAutoSlide();
    }
  }

  private fetchData() {
    this.movieService.getFeaturedMovies().subscribe(res => { if (res.success) this.featuredMovies.set(res.data); });
    this.movieService.getTrendingMovies(15).subscribe(res => { if (res.success) this.trendingMovies.set(res.data); });
    this.movieService.getWatchedHistory().subscribe(res => { if (res.success) this.watchedMovies.set(res.data); });
    this.movieService.getRecentlyUpdated().subscribe(res => { if (res.success) this.recentlyUpdated.set(res.data); });
    this.movieService.getHighlyRated().subscribe(res => { if (res.success) this.highlyRated.set(res.data); });
    this.movieService.getMoviesByGenre('Hành động').subscribe(res => { if (res.success) this.actionMovies.set(res.data); });
  }

  loadNewReleases(page: number) {
    this.newReleasesPage.set(page);
    const pageSize = page === 1 ? 30 : 50;

    this.movieService.getNewReleases(page, pageSize).subscribe(res => {
      if (res.success) {
        this.newReleases.set(res.data);

        if (res.pagination) {
          this.newReleasesTotalPages.set(res.pagination.totalPages);
        }

        if (isPlatformBrowser(this.platformId)) {
          setTimeout(() => {
            if (page === 1) {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
              document.getElementById('new-releases-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 100);
        }
      }
    });
  }

  // --- HÀM ĐIỀU KHIỂN BANNER ---
  nextBanner() { this.bannerIndex.update(i => (i + 1) % this.featuredMovies().length); this.resetAutoSlide(); }
  prevBanner() { this.bannerIndex.update(i => (i - 1 + this.featuredMovies().length) % this.featuredMovies().length); this.resetAutoSlide(); }
  startAutoSlide(): void { this.clearAutoSlide(); this.intervalId = setInterval(() => { this.bannerIndex.update(i => (i + 1) % this.featuredMovies().length); }, 5000); }
  clearAutoSlide(): void { if (this.intervalId) clearInterval(this.intervalId); }
  resetAutoSlide(): void { this.clearAutoSlide(); this.startAutoSlide(); }
}
