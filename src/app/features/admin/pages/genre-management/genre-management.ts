import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';

interface GenreRow {
  id: number;
  name: string;
  slug: string;
  movieCount: number;
  createdAt: string;
}

interface GenreStat {
  icon: string;
  label: string;
  value: string;
  description: string;
  badgeText: string;
  badgeColor: string;
}

@Component({
  selector: 'app-genre-management',
  standalone: true,
  imports: [FormsModule, NgClass],
  templateUrl: './genre-management.html',
})
export class GenreManagementComponent {
  // Filters
  searchQuery = signal('');
  selectedSort = signal('Sắp xếp: Tên A-Z');

  // Summary Stats
  genreStats = signal<GenreStat[]>([
    {
      icon: 'category',
      label: 'Tổng thể loại',
      value: '12',
      description: 'Tổng số thể loại phim',
      badgeText: 'Total',
      badgeColor: 'zinc',
    },
    {
      icon: 'trending_up',
      label: 'Phổ biến nhất',
      value: 'Tâm lý',
      description: '278 phim liên kết',
      badgeText: 'Top',
      badgeColor: 'red',
    },
    {
      icon: 'warning',
      label: 'Chưa phân loại',
      value: '23',
      description: 'Phim chưa gắn thể loại',
      badgeText: 'Warning',
      badgeColor: 'amber',
    },
    {
      icon: 'schedule',
      label: 'Thêm gần đây',
      value: 'Âm nhạc',
      description: '2 ngày trước',
      badgeText: 'New',
      badgeColor: 'blue',
    },
  ]);

  // Genre data
  genres = signal<GenreRow[]>([
    { id: 1, name: 'Hành động', slug: '/hanh-dong',movieCount: 234, createdAt: '15/01/2024' },
    { id: 2, name: 'Kinh dị', slug: '/kinh-di', movieCount: 156, createdAt: '15/01/2024' },
    { id: 3, name: 'Tâm lý', slug: '/tam-ly', movieCount: 278, createdAt: '15/01/2024' },
    { id: 4, name: 'Hài hước', slug: '/hai-huoc', movieCount: 189, createdAt: '20/01/2024' },
    { id: 5, name: 'Tình cảm', slug: '/tinh-cam', movieCount: 145, createdAt: '20/01/2024' },
    { id: 6, name: 'Khoa học viễn tưởng', slug: '/khoa-hoc-vien-tuong', movieCount: 98, createdAt: '22/01/2024' },
    { id: 7, name: 'Phiêu lưu', slug: '/phieu-luu', movieCount: 167, createdAt: '22/01/2024' },
    { id: 8, name: 'Hoạt hình', slug: '/hoat-hinh', movieCount: 112, createdAt: '25/01/2024' },
    { id: 9, name: 'Tài liệu', slug: '/tai-lieu', movieCount: 67, createdAt: '28/01/2024' },
    { id: 10, name: 'Âm nhạc', slug: '/am-nhac', movieCount: 34, createdAt: '01/02/2024' },
  ]);

  // Side Panel
  selectedGenre = signal<GenreRow | null>(null);
  showPanel = signal(false);

  // Add Modal
  showAddModal = signal(false);
  newGenreName = signal('');
  newGenreSlug = signal('');

  // Pagination
  currentPage = signal(1);
  totalItems = signal(12);
  pageSize = signal(10);

  totalPages = computed(() => Math.ceil(this.totalItems() / this.pageSize()));

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

  showingFrom = computed(() => (this.currentPage() - 1) * this.pageSize() + 1);
  showingTo = computed(() => Math.min(this.currentPage() * this.pageSize(), this.totalItems()));

  // Helpers
  getBadgeClasses(color: string): string {
    switch (color) {
      case 'red': return 'bg-red-600/10 text-red-500';
      case 'amber': return 'bg-amber-500/10 text-amber-500';
      case 'blue': return 'bg-blue-500/10 text-blue-500';
      default: return 'bg-zinc-800 text-zinc-400';
    }
  }

  getDotClasses(color: string): string {
    switch (color) {
      case 'red': return 'bg-red-500';
      case 'amber': return 'bg-amber-500 animate-pulse';
      case 'blue': return 'bg-blue-500';
      default: return 'bg-zinc-500';
    }
  }

  getIconColorClass(color: string): string {
    switch (color) {
      case 'red': return 'text-red-500';
      case 'amber': return 'text-amber-500';
      case 'blue': return 'text-blue-500';
      default: return 'text-zinc-400';
    }
  }

  getHoverBorderClass(color: string): string {
    switch (color) {
      case 'red': return 'hover:border-red-500/30';
      case 'amber': return 'hover:border-amber-500/30';
      case 'blue': return 'hover:border-blue-500/30';
      default: return 'hover:border-red-600/30';
    }
  }

  // Actions
  goToPage(page: number | null) {
    if (page !== null && page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  viewGenre(genre: GenreRow) {
    this.selectedGenre.set(genre);
    this.showPanel.set(true);
  }

  closePanel() {
    this.showPanel.set(false);
    this.selectedGenre.set(null);
  }

  // Add Modal Actions
  openAddModal() {
    this.newGenreName.set('');
    this.newGenreSlug.set('');
    this.showAddModal.set(true);
  }

  closeAddModal() {
    this.showAddModal.set(false);
  }

  addGenre() {
    const name = this.newGenreName().trim();
    const slug = this.newGenreSlug().trim();
    if (!name || !slug) return;
    const newId = Math.max(...this.genres().map(g => g.id), 0) + 1;
    this.genres.update(list => [
      ...list,
      {
        id: newId,
        name,
        slug: '/' + slug,
        movieCount: 0,
        createdAt: new Date().toLocaleDateString('vi-VN'),
      },
    ]);
    this.closeAddModal();
  }

  deleteGenre(genre: GenreRow) {
    if (confirm(`Xóa thể loại "${genre.name}"?`)) {
      this.genres.update(list => list.filter(g => g.id !== genre.id));
      if (this.selectedGenre()?.id === genre.id) {
        this.closePanel();
      }
    }
  }
}
