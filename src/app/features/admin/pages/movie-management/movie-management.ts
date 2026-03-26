import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface MovieRow {
  id: number;
  movieCode: string;
  title: string;
  posterUrl: string;
  genre: string;
  releaseYear: number;
  rating: number;
  views: number;
  favorites: number;
  createdAt: string;
}

interface SummaryStats {
  icon: string;
  iconFill: boolean;
  label: string;
  value: string;
  trend: string;
}

@Component({
  selector: 'app-movie-management',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './movie-management.html',
})
export class MovieManagementComponent {
  constructor(private router: Router) {}

  // ─── Filters ───
  selectedYear = signal('Năm: 2024');
  selectedRating = signal('Rating: > 4.0');
  selectedGenre = signal('Thể loại: Tất cả');
  selectedSort = signal('Mới nhất');
  searchQuery = signal('');
  viewMode = signal<'grid' | 'list'>('list');

  yearOptions = ['All Years', '2024', '2023', '2022', '2021'];
  ratingOptions = ['Any Star', '5 Stars', '4+ Stars', '3+ Stars'];

  // ─── Summary Stats (dòng 268-340) ───
  summaryStats = signal<SummaryStats[]>([
    { icon: 'movie', iconFill: false, label: 'Total Movies', value: '1,234', trend: '+12%' },
    { icon: 'star', iconFill: true, label: 'Avg. Rating', value: '4.5', trend: 'Stable' },
    { icon: 'visibility', iconFill: false, label: 'Total Views', value: '1.5M', trend: '+240K' },
    { icon: 'favorite', iconFill: true, label: 'Total Favorites', value: '250K', trend: '+8%' },
  ]);

  // ─── Movie Data (dòng 389-546) ───
  movies = signal<MovieRow[]>([
    {
      id: 1,
      movieCode: 'MOVIE-2024-001',
      title: 'Dune: Part Two',
      genre: 'Viễn tưởng',
      posterUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSb8jMZjURBQMpz5_YaCeP96WoyIxJOJovGKB99uzv2pQtZiTgPSOBNjeNNiUHGsLXIumgL7IuvkvX_VOS6l5J9vlfggm8BZf7BIGamRMWlbrRUjc64yGB4o3VTL9l32YlydJKGi7ktFd4IPsfYO5wZA5NaV59R38g0-94wZ4fDHHL8L3MK_hSaiD20JubFwTecDdYnpj7cfN8d0bDvE6REay_vqsElaVUV50BKIXmDtZjG7gscDOURj6oBvLsgVTOODZ3Guxyeg',
      releaseYear: 2024,
      rating: 4.9,
      views: 850230,
      favorites: 124500,
      createdAt: 'MAR 12, 2024',
    },
    {
      id: 2,
      movieCode: 'MOVIE-2027-012',
      title: 'Avengers: Secret Wars',
      genre: 'Hành động',
      posterUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC9anwQZYCPOWlAzT4-9OY0eHT9obzyxVvgU_qC5dqoOu9UUIwp3aDSNBi7c6mX1PXx0wcHs--7cZnpgnODkifWUop_Fiqc1yk84OboGr6e3i0Y3XCL8m8rhgTyCiE4FCt93fYs5NVIvCtIBdr6k-aWR08koUWCZJb9kLBoAJbIeZ37rPMtPIRI41yLIhRPR8BAUaCP_FRx8qMZXq20CtgBHN6RYl4L_sP5Cgok4yA2M0lfPz_ISwAajFRTvEy0CoGcVeKgsgicfQ',
      releaseYear: 2027,
      rating: 4.7,
      views: 1200000,
      favorites: 340000,
      createdAt: 'JAN 05, 2024',
    },
    {
      id: 3,
      movieCode: 'MOVIE-2023-088',
      title: 'Oppenheimer',
      genre: 'Chính kịch',
      posterUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD93Ysi4Gmn_PKftURfhbomtGh3A1YD438yxlnY1cKJWuJacWc-x7UpiwAhx9jc4cwWRPxp1IzJPigSUUx24kmoRv6CHX03-Ll-4CWaAA6hobNvDZCD1rUBjPKxtTmdxEOhwa9ClQmTM8GRe3eGNWQPZ-tftGPtCyt6MzfgWAQlPkaU-O-kudR5LAP9DqiIBX70QgZ7JGS0qYtL8rRKTmv8GN7VYJ1kG9mwfTwl4Zo_CiQut98IOtadDjDXtpEY2wfdWWRMUuZ2mQ',
      releaseYear: 2023,
      rating: 4.8,
      views: 980500,
      favorites: 215000,
      createdAt: 'JUL 21, 2023',
    },
  ]);

  // ─── Pagination (dòng 549-599) ───
  currentPage = signal(1);
  totalItems = signal(1234);
  pageSize = signal(10);

  totalPages = computed(() => Math.ceil(this.totalItems() / this.pageSize()));

  pages = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const pages: { label: string; value: number | null }[] = [];

    // Luôn hiển thị trang 1
    pages.push({ label: '1', value: 1 });

    if (current > 3) {
      pages.push({ label: '...', value: null });
    }

    // Các trang quanh current
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
      pages.push({ label: String(i), value: i });
    }

    if (current < total - 2) {
      pages.push({ label: '...', value: null });
    }

    // Luôn hiển thị trang cuối
    if (total > 1) {
      pages.push({ label: String(total), value: total });
    }

    return pages;
  });

  showingFrom = computed(() => (this.currentPage() - 1) * this.pageSize() + 1);
  showingTo = computed(() => Math.min(this.currentPage() * this.pageSize(), this.totalItems()));

  // ─── Style helpers ───
  getIconStyle(fill: boolean): string {
    return fill ? "font-variation-settings: 'FILL' 1" : '';
  }

  // ─── Format helpers ───
  formatNumber(num: number): string {
    return num.toLocaleString();
  }

  // ─── Actions ───
  goToPage(page: number | null) {
    if (page !== null && page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  addNewMovie() {
    // TODO: navigate đến form thêm phim hoặc mở modal
    console.log('Add new movie');
  }

  editMovie(movie: MovieRow) {
    // TODO: navigate đến form sửa phim
    console.log('Edit movie:', movie.id);
  }

  deleteMovie(movie: MovieRow) {
    // TODO: confirm dialog + gọi API xóa
    if (confirm(`Xóa phim "${movie.title}"?`)) {
      this.movies.update(list => list.filter(m => m.id !== movie.id));
    }
  }
}
