import { NgClass } from '@angular/common';
import { afterNextRender, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserState } from '../../../../core/states/user.state';
import { AdminReply, AdminReview } from '../../../../models/admin-review.modal';
import { NotificationType } from '../../../../models/notification.model';
import { AdminReviewService } from '../../../../services/admin/review.service';
import { NotificationService } from '../../../../services/notification.service';
import { buildPageItems } from '../../utils/pagination.utils';
import { AddReviewComponent } from './add-review/add-review';

@Component({
  selector: 'app-review-management',
  standalone: true,
  imports: [FormsModule, NgClass, AddReviewComponent],
  templateUrl: './review-management.html',
})
export class ReviewManagementComponent {

  private reviewService = inject(AdminReviewService);
  protected userState = inject(UserState);
  private notif = inject(NotificationService);

  // Loading/ Error
  isLoading = signal(false);
  errorMessage = signal('');

  // Filters
  searchQuery = signal('');
  selectedRating = signal('all');
  selectedSort = signal('createdAt_desc');

  // Sort options
  sortOptions = [
    { label: 'Mới nhất', value: 'createdAt_desc' },
    { label: 'Cũ nhất', value: 'createdAt_asc' },
    { label: 'Rating cao → thấp', value: 'rating_desc' },
    { label: 'Rating thấp → cao', value: 'rating_asc' },
  ];

  // Summary Stats
  reviewStats = signal<ReviewStat[]>([]);
  reviews = signal<AdminReview[]>([]);

  // Pagination
  currentPage = signal(1);
  totalItems = signal(0);
  pageSize = signal(5);

  totalPages = computed(() => Math.ceil(this.totalItems() / this.pageSize()));

  pages = computed(() => buildPageItems(this.currentPage(), this.totalPages()));

  // Form Reply
  replyingToId = signal<number | null>(null);
  replyContent = signal('');
  isSubmittingReply = signal(false);

  // Add Review Modal
  showAddModal = signal(false);

  openAddModal(): void {
    this.showAddModal.set(true);
  }

  closeAddModal(): void {
    this.showAddModal.set(false);
  }

  onReviewCreated(): void {
    this.showAddModal.set(false);
    this.loadReviews();
    this.loadReviewStats();
  }

  constructor() {
    afterNextRender(() => {
      this.loadReviews();
      this.loadReviewStats();
    })
  }

  /**
   * Tải danh sách review từ server (có phân trang, tìm kiếm, lọc rating, sắp xếp)
   */
  loadReviews() {
    this.isLoading.set(true);
    this.reviewService.getReviews({
      page: this.currentPage(),
      pageSize: this.pageSize(),
      search: this.searchQuery(),
      rating: this.selectedRating(),
      sort: this.selectedSort()
    }).subscribe({
      next: (res) => {
        if (res.success) {
          this.reviews.set(res.data);
          if (res.pagination) {
            this.totalItems.set(res.pagination.totalItems);
            this.currentPage.set(res.pagination.currentPage);
            this.pageSize.set(res.pagination.pageSize);
          }
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set("Không thể tải danh sách review");
        this.isLoading.set(false);
      }
    })
  }

  /**
   * Tải các thẻ thống kê tổng quan (Review Stats)
   */
  loadReviewStats(): void {
    this.reviewService.getReviewStats().subscribe({
      next: (res) => {
        if (res.success) {
          const d = res.data;
          this.reviewStats.set([
            {
              icon: 'rate_review', label: 'Tổng số review',
              value: new Intl.NumberFormat('en-US').format(d.totalReviews),
              description: 'Tổng số review',
              badgeText: d.trends.reviewsTrendPercent > 0
                ? `+${d.trends.reviewsTrendPercent}%`
                : `${d.trends.reviewsTrendPercent}%`,
              badgeColor: d.trends.reviewsTrendPercent >= 0 ? 'green' : 'red',
            },
            {
              icon: 'star', label: 'Điểm đánh giá',
              value: d.averageRating.toFixed(1),
              description: 'Điểm đánh giá trung bình',
              badgeText: 'Trung bình', badgeColor: 'zinc',
            },
            {
              icon: 'movie', label: 'Phim được review',
              value: new Intl.NumberFormat('en-US').format(d.moviesWithReviews),
              description: 'Phim được review',
              badgeText: 'Active', badgeColor: 'green-dot',
            },
            {
              icon: 'reply', label: 'Tổng phản hồi',
              value: new Intl.NumberFormat('en-US').format(d.totalReplies),
              description: 'Tổng phản hồi',
              badgeText: d.trends.repliesTrendPercent > 0
                ? `+${d.trends.repliesTrendPercent}%`
                : `${d.trends.repliesTrendPercent}%`,
              badgeColor: d.trends.repliesTrendPercent >= 0 ? 'green' : 'red',
            },
          ]);
        }
      },
    });
  }

  /**
   * Gọi khi người dùng nhập nội dung vào ô Search
   */
  onSearchChange(): void {
    this.currentPage.set(1);
    this.loadReviews();
  }
  /**
   * Gọi khi chọn lọc theo số sao (Rating)
   */
  onRatingChange(): void {
    this.currentPage.set(1);
    this.loadReviews();
  }

  /**
   * Gọi khi chọn tiêu chí sắp xếp trong Dropdown
   */
  onSortChange(): void {
    this.currentPage.set(1);
    this.loadReviews();
  }

  // ACTION

  /**
   * Chuyển trang (Pagination)
   */
  goToPage(page: number | null): void {
    if (page !== null && page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      this.loadReviews();
    }
  }

  /**
   * Xóa một review gốc (bao gồm tất cả replies bên trong)
   */
  deleteReview(review: AdminReview) {
    if (!confirm(`Xóa review của "${review.userName}" về phim "${review.movieTitle}"?`)) return;

    // Optimistic: xóa khỏi UI trước
    this.reviews.update(list => list.filter(r => r.id !== review.id));
    this.totalItems.update(n => Math.max(0, n - 1));

    this.reviewService.deleteReview(review.id).subscribe({
      next: () => {
        this.notif.show(NotificationType.SUCCESS, `Đã xóa review của "${review.userName}"`);
        this.loadReviewStats();
      },
      error: () => {
        this.notif.show(NotificationType.ERROR, 'Không thể xóa review');
        this.loadReviews();
      }
    })
  }

  /**
   * Xóa một phản hồi (reply) con của một review gốc
   * Sử dụng cơ chế Optimistic UI: Xóa khỏi giao diện trước rồi gọi API
   */
  deleteReply(review: AdminReview, reply: AdminReply) {
    if (!confirm(`Xóa reply của "${reply.userName}" về review của "${review.userName}"?`)) return;

    // Optimistic: xóa reply khỏi UI trước
    this.reviews.update(list =>
      list.map(r => r.id === review.id
        ? { ...r, replied: (r.replied || []).filter(rp => rp.id !== reply.id) }
        : r
      )
    );

    this.reviewService.deleteReply(reply.id).subscribe({
      next: () => {
        this.notif.show(NotificationType.SUCCESS, `Đã xóa reply của "${reply.userName}"`);
        this.loadReviewStats();
      },
      error: () => {
        this.notif.show(NotificationType.ERROR, 'Không thể xóa reply');
        this.loadReviews();
      }
    })
  }

  /**
   * Mở form trả lời trực tiếp cho một review gốc
   */
  openReplyForm(reviewId: number) {
    this.replyingToId.set(reviewId);
    this.replyContent.set('');
  }

  /**
   * Đóng form trả lời
   */
  cancelReply(): void {
    this.replyingToId.set(null);
    this.replyContent.set('');
  }

  /**
   * Gửi nội dung trả lời (Reply) lên server
   */
  submitReply() {
    const reviewId = this.replyingToId();
    const content = this.replyContent().trim();

    if (!reviewId || !content) {
      return;
    }

    this.isSubmittingReply.set(true);

    this.reviewService.replyToReview(reviewId, { content }).subscribe({
      next: (res) => {
        if (res.success) {
          const newReply: AdminReply = res.data;
          this.reviews.update(list =>
            list.map(r => r.id === reviewId
              ? { ...r, replied: [...(r.replied || []), newReply] }
              : r
            )
          );
          this.notif.show(NotificationType.SUCCESS, 'Phản hồi đã được gửi thành công');
          this.cancelReply();
          this.loadReviewStats();
        }
        this.isSubmittingReply.set(false);
      },
      error: () => {
        this.notif.show(NotificationType.ERROR, 'Không thể gửi phản hồi');
        this.isSubmittingReply.set(false);
      }
    })
  }

  // Helpers
  getBadgeClasses(color: string): string {
    switch (color) {
      case 'green': return 'bg-green-950/30 text-green-400';
      case 'green-dot': return 'bg-green-950/30 text-green-400';
      case 'red': return 'bg-red-600/10 text-red-500';
      case 'amber': return 'bg-amber-500/10 text-amber-500';
      default: return 'bg-zinc-800 text-zinc-400';
    }
  }

  getIconColorClass(color: string): string {
    switch (color) {
      case 'green': return 'text-green-400';
      case 'green-dot': return 'text-green-400';
      case 'red': return 'text-red-500';
      case 'amber': return 'text-amber-500';
      default: return 'text-zinc-400';
    }
  }

  getHoverBorderClass(color: string): string {
    switch (color) {
      case 'green': return 'hover:border-green-500/30';
      case 'green-dot': return 'hover:border-green-500/30';
      case 'red': return 'hover:border-red-500/30';
      case 'amber': return 'hover:border-amber-500/30';
      default: return 'hover:border-zinc-600/30';
    }
  }

  getStarArray(rating: number): boolean[] {
    return Array.from({ length: 10 }, (_, i) => i < rating);
  }
  getInitial(name: string): string {
    return name.charAt(0).toUpperCase();
  }
  dismissError(): void {
    this.errorMessage.set('');
  }
}
