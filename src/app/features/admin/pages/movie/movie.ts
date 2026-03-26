import { Component, computed, OnInit, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MovieRow, SummaryStats } from '../../models/movie.model';
import { AdminMovieService } from '../../../../services/admin/movie.service';

@Component({
  selector: 'app-movie-management',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './movie.html',
})
export class MovieManagementComponent implements OnInit {
  private router = inject(Router);
  private adminMovieService = inject(AdminMovieService);

  // Filters
  selectedYear = signal<string>('');
  selectedRating = signal<string>('');
  selectedGenre = signal<string>('');
  selectedSort = signal<string>('Mới nhất');
  searchQuery = signal('');
  viewMode = signal<'grid' | 'list'>('list');

  // Drop down filter
  currentYear = new Date().getFullYear();
  yearOptions = Array.from({ length: this.currentYear - 1900 + 1 }, (_, i) => (this.currentYear - i).toString());
  ratingOptions = ['> 4.0', '> 3.0', '> 2.0'];
  sortOptions = ['Mới nhất', 'Rating cao nhất', 'Lượt xem nhiều nhất', 'A-Z', 'Z-A'];
  genreOptions = signal<any[]>([]);

  // Data signal
  summaryStats = signal<SummaryStats | null>(null);
  movies = signal<MovieRow[]>([]);
  isLoading = signal<boolean>(false);

  // Pagination
  currentPage = signal(1);
  totalItems = signal(0);
  pageSize = signal(10);
  totalPages = computed(() => Math.max(1, Math.ceil(this.totalItems() / this.pageSize())));
  showingFrom = computed(() => (this.totalItems() === 0 ? 0 : (this.currentPage() - 1) * this.pageSize() + 1));
  showingTo = computed(() => Math.min(this.currentPage() * this.pageSize(), this.totalItems()));

  pages = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const pages: { label: string; value: number | null }[] = [];

    pages.push({ label: '1', value: 1 });
    if (current > 3) pages.push({ label: '...', value: null });

    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
      pages.push({ label: String(i), value: i });
    }

    if (current < total - 2) pages.push({ label: '...', value: null });
    if (total > 1) pages.push({ label: String(total), value: total });

    return pages;
  });

  // Init
  ngOnInit() {
    this.loadGenres();
    this.loadStats();
    this.loadMovies();
  }

  // Apis Call: Load tags 
  loadGenres() {
    this.adminMovieService.getGenres().subscribe({
      next: (res) => {
        if (res.success) this.genreOptions.set(res.data);
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  // Apis Call: Load stats
  loadStats() {
    this.adminMovieService.getMovieStats().subscribe({
      next: (res) => {
        if (res.success) this.summaryStats.set(res.data);
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  // Apis Call: Load movies
  loadMovies() {
    this.isLoading.set(true);
    const params = {
      page: this.currentPage(),
      limit: this.pageSize(),
      year: this.selectedYear() !== 'Tất cả' ? this.selectedYear() : null,
      tag: this.selectedGenre() !== 'Tất cả' ? this.selectedGenre() : null,
      sort: this.selectedSort()
    };

    this.adminMovieService.getMovies(params).subscribe({
      next: (res) => {
        if (res.success) {
          console.log(res);
          this.movies.set(res.data);
          if (res.pagination) {
            this.totalItems.set(res.pagination.totalItems);
            this.currentPage.set(res.pagination.currentPage);
            this.pageSize.set(res.pagination.pageSize);
          }
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
        console.log(err);
      }
    });
  }

  // Actions: filter movie
  onFilterChange() {
    this.currentPage.set(1);
    this.loadMovies();
  }

  // Actions: go to page
  goToPage(page: number | null) {
    if (page !== null && page >= 1 && page <= this.totalPages() && page !== this.currentPage()) {
      this.currentPage.set(page);
      this.loadMovies();
    }
  }

  // Format: number
  formatNumber(num: number): string { return num ? num.toLocaleString() : '0'; }

  // Actions: add new movie
  addNewMovie() { console.log('Add new movie'); }

  // Actions: edit movie
  editMovie(movie: MovieRow) { console.log('Edit movie:', movie.id); }

  // Actions: delete movie
  deleteMovie(movie: MovieRow) {
    if (confirm(`Xóa phim "${movie.title}"?`)) {
      // Gọi API Delete ở đây, sau đó load lại danh sách
      this.movies.update(list => list.filter(m => m.id !== movie.id));
    }
  }

  // Format value: kpi
  formatKpi(num: number | undefined | null, isRating: boolean = false): string {
    if (num === undefined || num === null) return '0';

    const sign = num < 0 ? '-' : '';
    const absNum = Math.abs(num);

    if (isRating) return sign + absNum.toFixed(1);
    if (absNum >= 1000000) return sign + (absNum / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    if (absNum >= 10000) return sign + (absNum / 1000).toFixed(0) + 'K';
    return sign + absNum.toLocaleString('en-US');
  }

  // Format value: trend
  formatTrend(num: number | undefined | null, isRating: boolean = false): string {
    if (num === undefined || num === null || num === 0) return isRating ? '0.0' : '0';
    const prefix = num > 0 ? '+' : '';
    return prefix + this.formatKpi(num, isRating);
  }
}