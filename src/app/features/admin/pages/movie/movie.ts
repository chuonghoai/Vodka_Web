import { Component, computed, OnInit, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
  private route = inject(ActivatedRoute);
  private adminMovieService = inject(AdminMovieService);

  // Filters
  selectedYear = signal<string>('');
  selectedRating = signal<string>('');
  selectedGenre = signal<string>('');
  selectedSort = signal<string>('moi-nhat');
  searchQuery = signal('');
  viewMode = signal<'grid' | 'list'>('list');

  // Drop down option
  currentYear = new Date().getFullYear();
  yearOptions = Array.from({ length: this.currentYear - 1900 + 1 }, (_, i) => (this.currentYear - i).toString());
  ratingOptions = [
    { label: '> 4.0', value: '4' },
    { label: '> 3.0', value: '3' },
    { label: '> 2.0', value: '2' }
  ];
  sortOptions = [
    { label: 'Mới nhất', value: 'moi-nhat' },
    { label: 'Rating cao nhất', value: 'rating-cao-nhat' },
    { label: 'Lượt xem nhiều nhất', value: 'luot-xem-nhieu-nhat' },
    { label: 'A-Z', value: 'a-z' },
    { label: 'Z-A', value: 'z-a' }
  ];
  genreOptions = signal<any[]>([]);

  // Drop down selected
  selectedGenreName = computed(() => {
    const genre = this.genreOptions().find(g => g.slug === this.selectedGenre());
    return genre ? genre.name : 'Tất cả';
  });
  selectedRatingName = computed(() => {
    const r = this.ratingOptions.find(o => o.value === this.selectedRating());
    return r ? r.label : 'Tất cả';
  });
  selectedSortName = computed(() => {
    const s = this.sortOptions.find(o => o.value === this.selectedSort());
    return s ? s.label : 'Mới nhất';
  });

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
    this.route.queryParams.subscribe(params => {
      this.selectedGenre.set(params['genre'] || '');
      this.selectedYear.set(params['year'] || '');
      this.selectedRating.set(params['rating'] || '');
      this.selectedSort.set(params['sort'] || 'moi-nhat');
      this.currentPage.set(Number(params['page']) || 1);
      this.loadMovies();
    });
  }

  // Apis Call: Load genres 
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
      year: this.selectedYear() || null,
      genre: this.selectedGenre() || null,
      rating: this.selectedRating() || null,
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
      }
    });
  }

  // Actions: filter movie
  onFilterChange() {
    this.currentPage.set(1);
    this.updateUrl(); // Thay vì loadMovies() thẳng, ta update URL
  }

  // Actions: go to page
  goToPage(page: number | null) {
    if (page !== null && page >= 1 && page <= this.totalPages() && page !== this.currentPage()) {
      this.currentPage.set(page);
      this.updateUrl(); // Update URL, subscribe sẽ lo gọi API
    }
  }

  // Actions: reset filter
  resetFilters() {
    this.selectedGenre.set('');
    this.selectedYear.set('');
    this.selectedRating.set('');
    this.selectedSort.set('moi-nhat');
    this.currentPage.set(1);

    this.updateUrl();
  }

  // Format: number
  formatNumber(num: number): string { return num ? num.toLocaleString() : '0'; }

  // Actions: add new movie
  addNewMovie() { 
    this.router.navigate(['/admin/movies/new']); 
  }

  // Actions: edit movie
  editMovie(movie: MovieRow) { 
    this.router.navigate(['/admin/movies/edit', movie.id]); 
  }

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

  // Helper: update query in URL
  updateUrl() {
    const queryParams: any = {};
    if (this.selectedGenre()) queryParams.genre = this.selectedGenre();
    if (this.selectedYear()) queryParams.year = this.selectedYear();
    if (this.selectedRating()) queryParams.rating = this.selectedRating();
    if (this.selectedSort() !== 'moi-nhat') queryParams.sort = this.selectedSort();
    if (this.currentPage() > 1) queryParams.page = this.currentPage();

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams
    });
  }
}