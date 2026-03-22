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

  // Movies info
  mockMovies: Movie[] = [
    { id: 1, title: 'Lật Mặt 7: Một Điều Ước', releaseYear: 2024, rating: 8.5, posterUrl: 'https://picsum.photos/id/1/300/400', genre: [{id: 1, name: 'Tâm lý', slug: 'tam-ly'}], tags: [{id: 1, name: 'Full HD'}] },
    { id: 2, title: 'Mai', releaseYear: 2024, rating: 7.9, posterUrl: 'https://picsum.photos/id/2/300/400', genre: [{id: 2, name: 'Tình cảm', slug: 'tinh-cam'}], tags: [{id: 1, name: 'Chiếu rạp'}] },
    { id: 3, title: 'Quỷ Cẩu', releaseYear: 2023, rating: 8.0, posterUrl: 'https://picsum.photos/id/3/300/400', genre: [{id: 3, name: 'Kinh dị', slug: 'kinh-di'}], tags: [] },
  ];

  historyMovies = signal<Movie[]>([]);
  historyPage = signal(1);
  historyTotalPages = signal(5);

  favoriteMovies = signal<Movie[]>([]);
  favoritePage = signal(1);
  favoriteTotalPages = signal(3);

  // Reviews info
  myReviews = signal<any[]>([
    {
      id: "r1",
      content: "Phim rất hay, cảm động rơi nước mắt. Hình ảnh đẹp, diễn viên diễn xuất thần.",
      rating: 9.0,
      createdAt: "2024-03-21T10:00:00Z",
      movie: {
        id: 1,
        title: "Lật Mặt 7: Một Điều Ước",
        posterUrl: "https://picsum.photos/id/1/300/400",
        tags: [{id: 't1', name: 'Chiếu rạp'}, {id: 't2', name: 'Full HD'}]
      }
    },
    {
      id: "r2",
      content: "Nội dung hơi dễ đoán nhưng nhạc phim xuất sắc.",
      rating: 7.5,
      createdAt: "2024-02-15T14:30:00Z",
      movie: {
        id: 2,
        title: "Mai",
        posterUrl: "https://picsum.photos/id/2/300/400",
        tags: [{id: 't1', name: 'Chiếu rạp'}]
      }
    }
  ]);
  reviewPage = signal(1);
  reviewTotalPages = signal(2);

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const tab = params['tab'];
      if (tab === 'history' || tab === 'favorites' || tab === 'reviews') {
        this.activeTab.set(tab);
      }
    });

    this.loadUserProfile();

    this.historyMovies.set([...this.mockMovies]);
    this.favoriteMovies.set([this.mockMovies[1], this.mockMovies[2]]);
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
        console.error('Lỗi khi tải thông tin cá nhân:', err);
        this.isLoadingProfile.set(false);
        this.notiService.show(NotificationType.ERROR, `Lỗi: ${err}`);
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
    this.activeTab.set(tab);

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab },
      queryParamsHandling: 'merge'
    });
  }

  onHistoryPageChange(page: number) {
    this.historyPage.set(page);
    // TODO: Call API GET /api/users/history?page=page
  }

  onFavoritePageChange(page: number) {
    this.favoritePage.set(page);
    // TODO: Call API GET /api/users/favorites?page=page
  }

  onReviewPageChange(page: number) {
    this.reviewPage.set(page);
    // TODO: Call API GET /api/users/reviews?page=page
  }
}
