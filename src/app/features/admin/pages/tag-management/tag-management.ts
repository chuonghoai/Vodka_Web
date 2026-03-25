import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';

interface TagRow {
  id: number;
  name: string;
  slug: string;
  movieCount: number;
  createdAt: string;
}

interface TagStat {
  icon: string;
  label: string;
  value: string;
  description: string;
  badgeText: string;
  badgeColor: string;
}

@Component({
  selector: 'app-tag-management',
  standalone: true,
  imports: [FormsModule, NgClass],
  templateUrl: './tag-management.html',
})
export class TagManagementComponent {
  // Filters
  searchQuery = signal('');

  selectedSort = signal('Sắp xếp: Tên A-Z');

  // Summary Stats
  tagStats = signal<TagStat[]>([
    {
      icon: 'label',
      label: 'Tổng số Tag',
      value: '18',
      description: 'Tổng số tag nội dung',
      badgeText: 'Total',
      badgeColor: 'blue',
    },
    {
      icon: 'trending_up',
      label: 'Phổ biến nhất',
      value: 'Phim bộ',
      description: '567 phim liên kết',
      badgeText: 'Top',
      badgeColor: 'blue',
    },
    {
      icon: 'local_fire_department',
      label: 'Tag Hot',
      value: 'Hot',
      description: '312 phim đang hot',
      badgeText: 'Trending',
      badgeColor: 'red',
    },
    {
      icon: 'new_releases',
      label: 'Mới nhất',
      value: 'Marvel',
      description: '2 ngày trước',
      badgeText: 'New',
      badgeColor: 'emerald',
    },
  ]);

  // Tag data
  tags = signal<TagRow[]>([
    { id: 1, name: 'Top IMDb', slug: '/top-imdb', movieCount: 145, createdAt: '01/02/2024' },
    { id: 2, name: 'Hot', slug: '/hot', movieCount: 312, createdAt: '01/02/2024' },
    { id: 3, name: 'Phim bộ', slug: '/phim-bo', movieCount: 567, createdAt: '05/02/2024' },
    { id: 4, name: 'Phim lẻ', slug: '/phim-le', movieCount: 423, createdAt: '05/02/2024' },
    { id: 5, name: 'Mới cập nhật', slug: '/moi-cap-nhat', movieCount: 89, createdAt: '10/02/2024' },
    { id: 6, name: 'Netflix Original', slug: '/netflix-original', movieCount: 89, createdAt: '10/02/2024' },
    { id: 7, name: 'Bom tấn', slug: '/bom-tan', movieCount: 201, createdAt: '15/02/2024' },
    { id: 8, name: 'Vietsub', slug: '/vietsub', movieCount: 345, createdAt: '15/02/2024' },
    { id: 9, name: 'Thuyết minh', slug: '/thuyet-minh', movieCount: 234, createdAt: '18/02/2024' },
    { id: 10, name: 'Marvel', slug: '/marvel', movieCount: 56, createdAt: '20/02/2024' },
  ]);

  // Side Panel
  selectedTag = signal<TagRow | null>(null);
  showPanel = signal(false);

  // Add Modal
  showAddModal = signal(false);
  newTagName = signal('');
  newTagSlug = signal('');

  // Pagination
  currentPage = signal(1);
  totalItems = signal(18);
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



  // Actions
  goToPage(page: number | null) {
    if (page !== null && page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  viewTag(tag: TagRow) {
    this.selectedTag.set(tag);
    this.showPanel.set(true);
  }

  closePanel() {
    this.showPanel.set(false);
    this.selectedTag.set(null);
  }


  // Add Modal Actions
  openAddModal() {
    this.newTagName.set('');
    this.newTagSlug.set('');
    this.showAddModal.set(true);
  }

  closeAddModal() {
    this.showAddModal.set(false);
  }

  addTag() {
    const name = this.newTagName().trim();
    const slug = this.newTagSlug().trim();
    if (!name || !slug) return;
    const newId = Math.max(...this.tags().map(t => t.id), 0) + 1;
    this.tags.update(list => [
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

  deleteTag(tag: TagRow) {
    if (confirm(`Xóa tag "${tag.name}"?`)) {
      this.tags.update(list => list.filter(t => t.id !== tag.id));
      if (this.selectedTag()?.id === tag.id) {
        this.closePanel();
      }
    }
  }
}
