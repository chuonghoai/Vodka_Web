import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieListComponent } from '../home/components/movie-list/movie-list';
import { ProfileInfoComponent } from './components/profile-info/profile-info';
import { UserReviewsComponent } from './components/user-reviews/user-reviews';
import { Movie } from '../../models/movie.model';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { NotificationService } from '../../services/notification.service';
import { NotificationType } from '../../models/notification.model';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, MovieListComponent, ProfileInfoComponent, UserReviewsComponent],
  templateUrl: './user.html'
})
export class UserComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private userService = inject(UserService);
  private notiService = inject(NotificationService)

  activeTab = signal<'history' | 'favorites' | 'reviews'>('history');

  // User info
  userProfile = signal<User | null>(null);
  isLoadingProfile = signal<boolean>(true);
  isLoadingFavorites = signal<boolean>(false);
  isLoadingHistory = signal<boolean>(false);
  isLoadingReviews = signal<boolean>(false);

  // Movies info
  mockMovies: Movie[] = [
    { id: 1, title: 'Lật Mặt 7: Một Điều Ước', releaseYear: 2024, rating: 8.5, posterUrl: 'https://picsum.photos/id/1/300/400', genre: [{id: 1, name: 'Tâm lý', slug: 'tam-ly'}], tags: [{id: 1, name: 'Full HD'}] },
    { id: 2, title: 'Mai', releaseYear: 2024, rating: 7.9, posterUrl: 'https://picsum.photos/id/2/300/400', genre: [{id: 2, name: 'Tình cảm', slug: 'tinh-cam'}], tags: [{id: 1, name: 'Chiếu rạp'}] },
    { id: 3, title: 'Quỷ Cẩu', releaseYear: 2023, rating: 8.0, posterUrl: 'https://picsum.photos/id/3/300/400', genre: [{id: 3, name: 'Kinh dị', slug: 'kinh-di'}], tags: [] },
  ];

  // History info
  historyMovies = signal<Movie[]>([]);
  historyPage = signal(1);
  historyTotalPages = signal(5);

  // Favorites info
  favoriteMovies = signal<Movie[]>([]);
  favoritePage = signal(1);
  favoriteTotalPages = signal(3);

  // Reviews info
  myReviews = signal<any[]>([]);
  reviewPage = signal(1);
  reviewTotalPages = signal(1);

  ngOnInit() {
    this.loadUserProfile();
    this.route.queryParams.subscribe(params => {
      const tab = params['tab'] || 'history';
      const page = parseInt(params['page'], 10) || 1;

      if (tab === 'history' || tab === 'favorites' || tab === 'reviews') {
        this.activeTab.set(tab);
      }

      if (this.activeTab() === 'favorites') {
        this.favoritePage.set(page);
        this.loadFavorites(page);
      }
      else if (this.activeTab() === 'history') {
        this.historyPage.set(page);
        this.loadHistory(page);
      }
      else if (this.activeTab() === 'reviews') {
        this.reviewPage.set(page);
        this.loadReviews(page);
      }
    });
  }

  // Call api load user profile
  loadUserProfile() {
    this.isLoadingProfile.set(true);
    this.userService.getProfile().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.userProfile.set(res.data);
        }
        this.isLoadingProfile.set(false);
      },
      error: (err) => {
        console.error('Lỗi khi tải thông tin cá nhân:', err.error.message);
        this.isLoadingProfile.set(false);
        this.userProfile.set(null);
        this.notiService.show(NotificationType.ERROR, `Lỗi: ${err}`);
      }
    });
  }

  // Call api load user favorites
  loadFavorites(page: number) {
    this.isLoadingFavorites.set(true);
    this.userService.getFavorites(page, 40).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.favoriteMovies.set(res.data);

          if (res.pagination) {
            this.favoritePage.set(res.pagination.currentPage);
            this.favoriteTotalPages.set(res.pagination.totalPages);
          }
        }
        this.isLoadingFavorites.set(false);
      },
      error: (err) => {
        console.error('Lỗi khi tải phim yêu thích:', err);
        this.favoriteMovies.set([]);
        this.isLoadingFavorites.set(false);
        this.notiService.show(NotificationType.ERROR, `Lỗi tải phim yêu thích: ${err}`);
      }
    });
  }

  // Call api load movie history
  loadHistory(page: number) {
    this.isLoadingHistory.set(true);
    this.userService.getHistory(page, 40).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.historyMovies.set(res.data);

          if (res.pagination) {
            this.historyPage.set(res.pagination.currentPage);
            this.historyTotalPages.set(res.pagination.totalPages);
          }
        }
        this.isLoadingHistory.set(false);
      },
      error: (err) => {
        console.error('Lỗi khi tải lịch sử:', err);
        this.historyMovies.set([]);
        this.isLoadingHistory.set(false);
      }
    });
  }

  loadReviews(page: number) {
    this.isLoadingReviews.set(true);
    this.userService.getReviews(page, 10).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.myReviews.set(res.data);

          if (res.pagination) {
            this.reviewPage.set(res.pagination.currentPage);
            this.reviewTotalPages.set(res.pagination.totalPages);
          }
        }
        this.isLoadingReviews.set(false);
      },
      error: (err) => {
        console.error('Lỗi khi tải đánh giá:', err);
        this.myReviews.set([]);
        this.isLoadingReviews.set(false);
      }
    });
  }

  // Button edit profile
  handleEditProfile() {
    // TODO: Mở modal hoặc navigate tới trang chỉnh sửa (Call /api/users/me/profile)
    console.log('Clicked Edit Profile');
  }

  // Button change tab
  changeTab(tab: 'history' | 'favorites' | 'reviews') {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab: tab, page: 1 },
      queryParamsHandling: 'merge'
    });
  }

  onHistoryPageChange(page: number) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: page },
      queryParamsHandling: 'merge'
    });
  }

  onFavoritePageChange(page: number) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: page },
      queryParamsHandling: 'merge'
    });
  }

  onReviewPageChange(page: number) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: page },
      queryParamsHandling: 'merge'
    });
  }
}
