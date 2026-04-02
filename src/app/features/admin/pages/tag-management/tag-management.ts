import { DecimalPipe, NgClass } from '@angular/common';
import { afterNextRender, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UpdateTagRequest } from '../../../../models/tag.model';
import { TagService } from '../../../../services/tag.service';
import { buildPageItems } from '../../utils/pagination.utils';
import { NotificationService } from '../../../../services/notification.service';
import { NotificationType } from '../../../../models/notification.model';

@Component({
  selector: 'app-tag-management',
  standalone: true,
  imports: [FormsModule, NgClass, DecimalPipe],
  templateUrl: './tag-management.html',
})
export class TagManagementComponent {

  private tagService = inject(TagService);
  private notif = inject(NotificationService);

  // State
  isLoading = signal(false);
  errorMessage = signal('');

  // Filters
  searchQuery = signal('');
  selectedSort = signal('Sắp xếp: Tên A-Z');

  // Data
  tagStats = signal<TagStat[]>([]);
  tags = signal<TagRow[]>([]);

  // Side panel
  selectedTag = signal<TagRow | null>(null);
  showPanel = signal(false);
  editName = signal('');
  editSlug = signal('');

  // Add Modal
  showAddModal = signal(false);
  newTagName = signal('');
  newTagSlug = signal('');

  // Pagination
  currentPage = signal(1);
  totalItems = signal(0);
  pageSize = signal(10);

  // SortMap
  private sortMap: Record<string, string> = {
    'Sắp xếp: Tên A-Z': 'name_asc',
    'Sắp xếp: Số phim giảm dần': 'movieCount_desc',
    'Sắp xếp: Ngày tạo': 'createdAt_desc',
  };

  constructor(){
    afterNextRender(() =>{
      this.loadTags();
      this.loadStats();
    })
  }

  /**
   * Tải danh sách tag từ server (có phân trang, tìm kiếm, sắp xếp)
   */
  loadTags(){
    this.isLoading.set(true);
    this.tagService.getTags({
      page: this.currentPage(),
      pageSize: this.pageSize(),
      search: this.searchQuery(),
      sort: this.sortMap[this.selectedSort()] || 'name_asc',

    }).subscribe({
      next: (res) =>{
        if(res.success){
          this.tags.set(res.data);
          this.totalItems.set(res.pagination?.totalItems ?? 0);
        }
        this.isLoading.set(false);
      },
      error: () =>{
        this.errorMessage.set('Không thể tải danh sách thể loại');
        this.isLoading.set(false);
      }
    })

  }

  /**
   * Tải thẻ thống kê (KPIs) của Tag từ server
   */
  loadStats() {
    this.tagService.getTagStats().subscribe({
      next: (res) => {
        if (res.success) {
          const d = res.data;
          this.tagStats.set([
            { icon: 'label', label: 'Tổng số Tag', value: String(d.totalTags),
              description: 'Tổng số tag nội dung', badgeText: 'Total', badgeColor: 'blue' },
            { icon: 'trending_up', label: 'Phổ biến nhất', value: d.mostPopularTag.name,
              description: `${d.mostPopularTag.movieCount} phim liên kết`, badgeText: 'Top', badgeColor: 'blue' },
            { icon: 'local_fire_department', label: 'Phim chưa gắn Tag', value: String(d.unclassifiedMovies),
              description: `${d.unclassifiedMovies} phim chưa gắn Tag`, badgeText: 'Unclassified', badgeColor: 'red' },
            { icon: 'new_releases', label: 'Mới nhất', value: d.latestTag.name,
              description: d.latestTag.createdAt, badgeText: 'New', badgeColor: 'emerald' },
          ]);
        }
      }
    });
  }

  totalPages = computed(() => Math.ceil(this.totalItems() / this.pageSize()));

  pages = computed(() => buildPageItems(this.currentPage(), this.totalPages()));

  showingFrom = computed(() => (this.currentPage() - 1) * this.pageSize() + 1);
  showingTo = computed(() => Math.min(this.currentPage() * this.pageSize(), this.totalItems()));

  // Helpers
  getBadgeClasses(color: string): string {
    switch (color) {
      case 'emerald': return 'bg-emerald-500/10 text-emerald-500';
      case 'red': return 'bg-red-600/10 text-red-500';
      case 'blue': return 'bg-blue-500/10 text-blue-500';
      default: return 'bg-zinc-800 text-zinc-400';
    }
  }

  getDotClasses(color: string): string {
    switch (color) {
      case 'emerald': return 'bg-emerald-500';
      case 'red': return 'bg-red-500 animate-pulse';
      case 'blue': return 'bg-blue-500';
      default: return 'bg-zinc-500';
    }
  }

  getIconColorClass(color: string): string {
    switch (color) {
      case 'emerald': return 'text-emerald-500';
      case 'red': return 'text-red-500';
      case 'blue': return 'text-blue-500';
      default: return 'text-zinc-400';
    }
  }

  getHoverBorderClass(color: string): string {
    switch (color) {
      case 'emerald': return 'hover:border-emerald-500/30';
      case 'red': return 'hover:border-red-500/30';
      case 'blue': return 'hover:border-blue-500/30';
      default: return 'hover:border-red-600/30';
    }
  }

  /**
   * Gọi khi người dùng nhập Text tìm kiếm
   */
  onSearchChange(){
    this.currentPage.set(1);
    this.loadTags();
  }

  /**
   * Gọi khi người dùng thay đổi tiêu chí sắp xếp Dropdown
   */
  onSortChange(){
    this.currentPage.set(1);
    this.loadTags();
  }


  /**
   * Chuyển đổi trang (Pagination)
   */
  goToPage(page: number | null) {
    if (page !== null && page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      this.loadTags();
    }
  }

  /**
   * Mở Side Panel để xem/chỉnh sửa thông tin chi tiết tag
   */
  viewTag(tag: TagRow) {
    this.selectedTag.set(tag);
    this.editName.set(tag.name);
    this.editSlug.set(tag.slug);
    this.showPanel.set(true);
  }

  /**
   * Đóng Side Panel
   */
  closePanel() {
    this.showPanel.set(false);
    this.selectedTag.set(null);
  }


  /**
   * Mở Modal thêm tag mới
   */
  openAddModal() {
    this.newTagName.set('');
    this.newTagSlug.set('');
    this.showAddModal.set(true);
  }

  /**
   * Đóng Modal thêm tag
   */
  closeAddModal() {
    this.showAddModal.set(false);
  }


  /**
   * Thực hiện lưu tag mới lên server
   */
  addTag() {
    const name = this.newTagName().trim();
    const slug = this.newTagSlug().trim();
    if (!name || !slug) return;
    this.tagService.createTag({ name, slug }).subscribe({
      next: (res) => {
        if (res.success) {
          this.notif.show(NotificationType.SUCCESS, `Đã thêm tag "${name}" thành công`);
          this.closeAddModal();
          this.loadTags();
          this.loadStats();
        }
      },
      error: () => {
        this.notif.show(NotificationType.ERROR, 'Không thể tạo tag');
      }
    });
  }

  /**
   * Cập nhật thông tin tag đang mở trong Side Panel
   */
  updateTag(){
    const tag = this.selectedTag();
    if(!tag) return;

    const payload: UpdateTagRequest = {};
    if (this.editName().trim() !== tag.name) payload.name = this.editName().trim();
    if (this.editSlug().trim() !== tag.slug) payload.slug = this.editSlug().trim();

    if(!payload.name && !payload.slug){
      this.closePanel();
      return;
    }

    this.tagService.updateTag(tag.id, payload).subscribe({
      next: () => {
        this.notif.show(NotificationType.SUCCESS, `Cập nhật tag "${tag.name}" thành công`);
        this.loadTags();
        this.closePanel();
      },
      error: () => {
        this.notif.show(NotificationType.ERROR, 'Không thể cập nhật tag');
      }
    })

  }

  /**
   * Xóa một tag khỏi hệ thống
   */
  deleteTag(tag: TagRow) {
    if (confirm(`Xóa tag "${tag.name}"?`)) {
      this.tagService.deleteTag(tag.id).subscribe({
        next: () => {
          this.notif.show(NotificationType.SUCCESS, `Đã xóa tag "${tag.name}" thành công`);
          this.loadTags();
          this.loadStats();
        },
        error: () => {
          this.notif.show(NotificationType.ERROR, `Không thể xóa tag "${tag.name}"`);
        }
      });
    }
  }

  dismissError() { this.errorMessage.set(''); }
}
