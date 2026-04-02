// src/app/features/home/home.ts
import { Component, inject, OnInit, signal, computed, OnDestroy, PLATFORM_ID } from '@angular/core';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../models/movie.model';
import { MovieSliderComponent } from './components/movie-slider/movie-slider';
import { MovieColumnComponent } from './components/movie-column/movie-column';
import { MovieListComponent } from "./components/movie-list/movie-list";
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MovieSliderComponent, MovieColumnComponent, MovieListComponent, RouterLink],
  templateUrl: './home.html'
})
export class HomeComponent implements OnInit, OnDestroy {
  // Inject
  private movieService = inject(MovieService);
  private platformId = inject(PLATFORM_ID);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // List banner
  featuredMovies = signal<Movie[]>([]);
  bannerIndex = signal(0);
  currentFeaturedMovie = computed(() => { const m = this.featuredMovies(); return m.length > 0 ? m[this.bannerIndex()] : null; });
  private intervalId: any;

  // List movie
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
    this.route.queryParams.subscribe(params => {
      const page = params['page']? parseInt(params['page'], 10): 1;
      this.loadNewReleases(page);
    })
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.clearAutoSlide();
    }
  }

  /**
   * Gửi đồng loạt các API requests để fetch dữ liệu cho luồng trang chủ:
   * Banner nổi bật, trending, lịch sử xem, phim mới cập nhật, đánh giá cao, hành động
   */
  private fetchData() {
    this.movieService.getFeaturedMovies().subscribe(res => { if (res.success) this.featuredMovies.set(res.data); });
    this.movieService.getTrendingMovies(15).subscribe(res => { if (res.success) this.trendingMovies.set(res.data); });
    this.movieService.getWatchedHistory().subscribe(res => { if (res.success) this.watchedMovies.set(res.data); });
    this.movieService.getRecentlyUpdated().subscribe(res => { if (res.success) this.recentlyUpdated.set(res.data); });
    this.movieService.getHighlyRated().subscribe(res => { if (res.success) this.highlyRated.set(res.data); });
    this.movieService.filterMovies({genres: ['hanh-dong']}).subscribe(res => { if (res.success) this.actionMovies.set(res.data); });
  }

  /**
   * Tải danh sách phim Mới Phát Hành
   * Hỗ trợ cuộn mượt (smooth scroll) tùy theo kết quả ở Page 1 hay trang tiếp theo
   */
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

  /**
   * Bắt sự kiện chuyển trang cho danh sách Phim Mới
   * Gắn params vào URL thay vì call API trực tiếp, Subscription trong ngOnInit sẽ tự trigger
   */
  onPageChange(page: number) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: page },
      queryParamsHandling: 'merge'
    });
  }

  /**
   * Chuyển thủ công tới banner tiếp theo
   */
  nextBanner() { this.bannerIndex.update(i => (i + 1) % this.featuredMovies().length); this.resetAutoSlide(); }

  /**
   * Chuyển thủ công tới banner trước đó
   */
  prevBanner() { this.bannerIndex.update(i => (i - 1 + this.featuredMovies().length) % this.featuredMovies().length); this.resetAutoSlide(); }

  /**
   * Khởi chạy vòng lặp tự động chuyển slide sau mỗi 5s
   */
  startAutoSlide(): void { this.clearAutoSlide(); this.intervalId = setInterval(() => { this.bannerIndex.update(i => (i + 1) % this.featuredMovies().length); }, 5000); }

  /**
   * Hủy vòng lặp tự động chuyển slide hiện tại
   */
  clearAutoSlide(): void { if (this.intervalId) clearInterval(this.intervalId); }

  /**
   * Reset bộ đếm slide tự động, thường dùng sau khi người dùng vừa có thao tác click thủ công
   */
  resetAutoSlide(): void { this.clearAutoSlide(); this.startAutoSlide(); }
}
