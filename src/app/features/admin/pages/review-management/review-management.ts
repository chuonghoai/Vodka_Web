import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { Review, ReplyReview } from '../../../../models/movie.model';

interface ReviewStat {
  icon: string;
  label: string;
  value: string;
  description: string;
  badgeText: string;
  badgeColor: string;
}

interface ReviewWithMovie extends Review {
  movieTitle: string;
}

@Component({
  selector: 'app-review-management',
  standalone: true,
  imports: [FormsModule, NgClass],
  templateUrl: './review-management.html',
})
export class ReviewManagementComponent {
  // Filters
  searchQuery = signal('');
  selectedRating = signal('all');
  selectedTime = signal('30days');

  // Summary Stats
  reviewStats = signal<ReviewStat[]>([
    {
      icon: 'rate_review',
      label: 'Tổng số review',
      value: '890',
      description: 'Tổng số review',
      badgeText: '+12%',
      badgeColor: 'green',
    },
    {
      icon: 'star',
      label: 'Điểm đánh giá',
      value: '4.2',
      description: 'Điểm đánh giá trung bình',
      badgeText: 'Trung bình',
      badgeColor: 'zinc',
    },
    {
      icon: 'movie',
      label: 'Phim được review',
      value: '156',
      description: 'Phim được review',
      badgeText: 'Active',
      badgeColor: 'green-dot',
    },
    {
      icon: 'reply',
      label: 'Tổng phản hồi',
      value: '342',
      description: 'Tổng phản hồi',
      badgeText: '+8%',
      badgeColor: 'green',
    },
  ]);

  // Review data with movie info
  reviews = signal<ReviewWithMovie[]>([
    {
      id: 1,
      userName: 'NguyenVanA',
      avatarUrl: '',
      rating: 5,
      content: 'Tuyệt phẩm điện ảnh! Hình ảnh và âm thanh của phim thực sự đưa người xem vào một thế giới hoàn toàn khác. Arrakis chưa bao giờ chân thực đến thế.',
      createdAt: '23/03/2026',
      movieTitle: 'Dune: Part Two',
      replied: [
        { id: 101, userName: 'Admin', content: 'Cảm ơn bạn đã chia sẻ cảm nhận, rất vui khi bạn hài lòng với trải nghiệm này.', createdAt: '23/03/2026' },
        { id: 102, userName: 'NguyenVanA', content: 'Cảm ơn admin đã phản hồi, mình sẽ tiếp tục ủng hộ!', createdAt: '24/03/2026' },
      ],
    },
    {
      id: 2,
      userName: 'TranThiB',
      avatarUrl: '',
      rating: 4,
      content: 'Phim rất sâu sắc và kịch tính dù chủ yếu là các màn đối thoại. Tuy nhiên thời lượng hơi dài khiến mình đôi chỗ thấy mệt mỏi.',
      createdAt: '23/03/2026',
      movieTitle: 'Oppenheimer',
      replied: [
        { id: 103, userName: 'Admin', content: 'Cảm ơn bạn, ý kiến của bạn rất có giá trị với cộng đồng yêu phim.', createdAt: '23/03/2026' },
      ],
    },
    {
      id: 3,
      userName: 'LeVanC',
      avatarUrl: '',
      rating: 2,
      content: 'Hơi thất vọng so với phần 1. Cảm giác nhịp phim bị rời rạc và không tạo được ấn tượng mạnh mẽ như kỳ vọng ban đầu.',
      createdAt: '22/03/2026',
      movieTitle: 'Joker 2',
      replied: [],
    },
    {
      id: 4,
      userName: 'PhamMinhD',
      avatarUrl: '',
      rating: 1,
      content: 'Không thích phong cách phim lần này. Quá tối và nặng nề, không phù hợp với sở thích cá nhân của tôi về dòng phim siêu anh hùng.',
      createdAt: '22/03/2026',
      movieTitle: 'The Batman',
      replied: [],
    },
    {
      id: 5,
      userName: 'HoangThiE',
      avatarUrl: '',
      rating: 5,
      content: 'Một cái kết hào hùng và mãn nhãn! Sự kiện crossover lớn nhất lịch sử điện ảnh. Xứng đáng chờ đợi bao lâu nay.',
      createdAt: '21/03/2026',
      movieTitle: 'Avengers: Secret Wars',
      replied: [],
    },
  ]);

  // Pagination
  currentPage = signal(1);
  totalItems = signal(890);
  pageSize = signal(5);


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

  // Filtered reviews
  filteredReviews = computed(() => {
    let result = this.reviews();
    const query = this.searchQuery().toLowerCase();
    if (query) {
      result = result.filter(
        r => r.movieTitle.toLowerCase().includes(query) ||
             r.userName.toLowerCase().includes(query) ||
             r.content.toLowerCase().includes(query)
      );
    }
    const rating = this.selectedRating();
    if (rating !== 'all') {
      result = result.filter(r => r.rating === Number(rating));
    }
    return result;
  });

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
    return Array.from({ length: 5 }, (_, i) => i < rating);
  }

  getInitial(name: string): string {
    return name.charAt(0).toUpperCase();
  }

  // Actions
  goToPage(page: number | null) {
    if (page !== null && page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  deleteReview(review: ReviewWithMovie) {
    if (confirm(`Xóa review của "${review.userName}" về "${review.movieTitle}"?`)) {
      this.reviews.update(list => list.filter(r => r.id !== review.id));
    }
  }

  deleteReply(review: ReviewWithMovie, reply: ReplyReview) {
    if (confirm(`Xóa phản hồi của "${reply.userName}"?`)) {
      this.reviews.update(list =>
        list.map(r => {
          if (r.id === review.id) {
            return { ...r, replied: (r.replied || []).filter(rp => rp.id !== reply.id) };
          }
          return r;
        })
      );
    }
  }
}
