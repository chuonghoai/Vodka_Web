import { DecimalPipe, NgClass } from '@angular/common';
import { afterNextRender, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GenreService } from '../../../../services/genre.service';
import { UpdateGenreRequest } from '../../../../models/genre.model';
import { GenreRow, GenreStat } from '../../models/genre.model';
import { buildPageItems } from '../../utils/pagination.utils';
import { NotificationService } from '../../../../services/notification.service';
import { NotificationType } from '../../../../models/notification.model';

@Component({
  selector: 'app-genre-management',
  standalone: true,
  imports: [FormsModule, NgClass, DecimalPipe],
  templateUrl: './genre-management.html',
})

export class GenreManagementComponent {

  private genreService = inject(GenreService);
  private notif = inject(NotificationService);

  // State
  isLoading = signal(false);
  errorMessage = signal('');

  // Filters
  searchQuery = signal('');
  selectedSort = signal('Sắp xếp: Tên A-Z');

  // Summary Stats
  genreStats = signal<GenreStat[]>([]);

  // Genre data
  genres = signal<GenreRow[]>([]);

  // Side Panel
  selectedGenre = signal<GenreRow | null>(null);
  showPanel = signal(false);
  isEditing = signal(false);
  editName = signal('');
  editSlug = signal('');

  // Add Modal
  showAddModal = signal(false);
  newGenreName = signal('');
  newGenreSlug = signal('');

  // Pagination
  currentPage = signal(1);
  totalItems = signal(0);
  pageSize = signal(10);

  totalPages = computed(() => Math.ceil(this.totalItems() / this.pageSize()));

  pages = computed(() => buildPageItems(this.currentPage(), this.totalPages()));

  showingFrom = computed(() => (this.currentPage() - 1) * this.pageSize() + 1);
  showingTo = computed(() => Math.min(this.currentPage() * this.pageSize(), this.totalItems()));

  // SortMapping
  private sortMap: Record<string, string> = {
    'Sắp xếp: Tên A-Z': 'name_asc',
    'Sắp xếp: Số phim giảm dần': 'movieCount_desc',
    'Sắp xếp: Ngày tạo': 'createdAt_desc',
  }

  constructor() {
    afterNextRender(() => {
      this.loadGenres();
      this.loadStats();
    });
  }

  /**
   * Tải danh sách thể loại từ server (có phân trang, sắp xếp và lọc tìm kiếm)
   */
  loadGenres() {
    this.isLoading.set(true);
    this.errorMessage.set('');
    this.genreService.getGenres({
      page: this.currentPage(),
      pageSize: this.pageSize(),
      search: this.searchQuery() || undefined,
      sort: this.sortMap[this.selectedSort()] || 'name_asc',
    }).subscribe({
      next: (res) => {
        if (res.success) {
          this.genres.set(res.data);
          this.totalItems.set(res.pagination?.totalItems ?? 0);
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Không thể tải dữ liệu thể loại');
        this.isLoading.set(false);
      }
    })
  }

  /**
   * Tải các chỉ số thống kê (KPIs) của Thể loại
   */
  loadStats() {
    this.genreService.getGenreStats().subscribe({
      next: (res) => {
        if (res.success) {
          const d = res.data;
          this.genreStats.set([
            {
              icon: 'category',
              label: 'Tổng thể loại',
              value: String(d.totalGenres),
              description: 'Tổng số thể loại phim',
              badgeText: 'Total',
              badgeColor: 'zinc',
            },
            {
              icon: 'trending_up',
              label: 'Phổ biến nhất',
              value: d.mostPopularGenre.name,
              description: `${d.mostPopularGenre.movieCount} phim liên kết`,
              badgeText: 'Top',
              badgeColor: 'red',
            },
            {
              icon: 'warning',
              label: 'Chưa phân loại',
              value: String(d.unclassifiedMovies),
              description: 'Phim chưa gắn thể loại',
              badgeText: 'Warning',
              badgeColor: 'amber',
            },
            {
              icon: 'schedule',
              label: 'Thêm gần đây',
              value: d.latestGenre.name,
              description: d.latestGenre.createdAt,
              badgeText: 'New',
              badgeColor: 'blue',
            },
          ]);
        }
      },
      error: () => {
        this.errorMessage.set('Không thể tải thống kê');
      }
    });
  }

  // Search and sort
  /**
   * Gọi khi người dùng nhập nội dung tìm kiếm
   */
  onSearchChange() {
    this.currentPage.set(1);
    this.loadGenres();
  }
  /**
   * Gọi khi người dùng đổi chế độ sắp xếp trong Dropdown
   */
  onSortChange() {
    this.currentPage.set(1);
    this.loadGenres();
  }


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
  /**
   * Chuyển trang theo pagination
   */
  goToPage(page: number | null) {
    if (page !== null && page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      this.loadGenres();
    }
  }

  /**
   * Xem chi tiết Thể loại bên Side Panel
   */
  viewGenre(genre: GenreRow) {
    this.selectedGenre.set(genre);
    this.editName.set(genre.name);
    this.editSlug.set(genre.slug);
    this.isEditing.set(false);
    this.showPanel.set(true);
  }

  /**
   * Đóng Side Panel hiện tại
   */
  closePanel() {
    this.showPanel.set(false);
    this.selectedGenre.set(null);
    this.isEditing.set(false);
  }

  /**
   * Bật/Tắt chế độ chỉnh sửa trên Side Panel
   */
  toggleEdit() {
    this.isEditing.update(v => !v);
  }

  /**
   * Cập nhật thông tin Thể loại đang xem tren Side Panel
   */
  updateGenre() {
    const genre = this.selectedGenre();
    if (!genre) return;

    const payload: UpdateGenreRequest = {};
    const newName = this.editName().trim();
    const newSlug = this.editSlug().trim();

    if (newName && newName !== genre.name) payload.name = newName;
    if (newSlug && newSlug !== genre.slug) payload.slug = newSlug;

    if (!payload.name && !payload.slug) {
      this.closePanel();
      return;
    }

    this.genreService.updateGenre(genre.id, payload).subscribe({
      next: (res) => {
        if (res.success) {
          this.notif.show(NotificationType.SUCCESS, `Cập nhật thể loại "${newName || genre.name}" thành công`);
          this.closePanel();
          this.loadGenres();
          this.loadStats();
        }
      },
      error: () => {
        this.notif.show(NotificationType.ERROR, 'Không thể cập nhật thể loại');
      }
    });

  }
  // Add Modal Actions
  /**
   * Mở Modal thêm thể loại mới
   */
  openAddModal() {
    this.newGenreName.set('');
    this.newGenreSlug.set('');
    this.showAddModal.set(true);
  }

  /**
   * Đóng Modal thêm thể loại
   */
  closeAddModal() {
    this.showAddModal.set(false);
  }

  /**
   * Submit thể loại mới lên Server
   */
  addGenre() {
    const name = this.newGenreName().trim();
    const slug = this.newGenreSlug().trim();
    if (!name || !slug) return;
    this.genreService.createGenre({ name, slug }).subscribe({
      next: (res) => {
        if (res.success) {
          this.notif.show(NotificationType.SUCCESS, `Đã thêm thể loại "${name}" thành công`);
          this.closeAddModal();
          this.loadGenres();
          this.loadStats();
        }
      },
      error: () => {
        this.notif.show(NotificationType.ERROR, 'Không thể tạo thể loại');
      }
    });
  }

  /**
   * Xóa một thể loại khỏi hệ thống (Cảnh báo nếu đang có phim dùng thể loại này)
   */
  deleteGenre(genre: GenreRow) {
    if (!confirm(`Xóa thể loại "${genre.name}"?`)) return;
    this.genreService.deleteGenre(genre.id).subscribe({
      next: (res) => {
        if (res.success) {
          this.notif.show(NotificationType.SUCCESS, `Đã xóa thể loại "${genre.name}" thành công`);
          if (this.selectedGenre()?.id === genre.id) this.closePanel();
          this.loadGenres();
          this.loadStats();
        }
      },
      error: () => {
        this.notif.show(NotificationType.ERROR, `Không thể xóa thể loại "${genre.name}"`);
      }
    });
  }

  dismissError() {
    this.errorMessage.set('');
  }
}
