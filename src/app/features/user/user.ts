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
import { handleHttpError } from '../../shared/util/exception.handle';
import { UserState } from '../../core/states/user.state';
import { AvatarCropperComponent } from './components/avatar-cropper/avatar-cropper';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, FormsModule, MovieListComponent, ProfileInfoComponent, UserReviewsComponent, AvatarCropperComponent],
  templateUrl: './user.html'
})
export class UserComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private userService = inject(UserService);
  private notiService = inject(NotificationService)
  private userState = inject(UserState)

  activeTab = signal<'history' | 'favorites' | 'reviews'>('history');

  // State edit profile
  isEditingProfile = signal<boolean>(false);
  editFullName = signal<string>('');
  editAvatarUrl = signal<string>('');
  imageChangedEvent = signal<any>(null);

  // Modal change password
  isChangePasswordModalOpen = signal<boolean>(false);
  isChangingPassword = signal<boolean>(false);
  openChangePasswordModal() {
    console.log(this.userProfile());
    this.isChangePasswordModalOpen.set(true);
  }

  // User info
  userProfile = signal<User | null>(null);
  isLoadingProfile = signal<boolean>(true);
  isLoadingFavorites = signal<boolean>(false);
  isLoadingHistory = signal<boolean>(false);
  isLoadingReviews = signal<boolean>(false);

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

  // Init
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

  // Listen event start edit profile
  handleEditStart() {
    this.isEditingProfile.set(true);
    this.editFullName.set(this.userProfile()?.fullName || '');
    this.editAvatarUrl.set(this.userProfile()?.avatarUrl || '');
  }

  // Listen event cancel edit profile
  handleEditCancel() {
    this.isEditingProfile.set(false);
  }

  // Button change avatar
  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      this.imageChangedEvent.set(event);
    }
  }

  // receive avatar from cropper
  handleAvatarCropped(base64Image: string) {
    this.editAvatarUrl.set(base64Image);
    this.imageChangedEvent.set(null);
  }

  // Handle edit profile
  handleSaveProfile(profileInfoData: any) {
    const payload = {
      displayName: this.editFullName(),
      avatarUrl: this.editAvatarUrl(),
      email: this.userProfile()?.email || '',
      status: 'active',
      ...profileInfoData
    }

    this.isEditingProfile.set(false);

    const avatarUrl = payload.avatarUrl;
    if (avatarUrl && avatarUrl.startsWith('data:image/')) {
      console.log('Phát hiện ảnh mới, đang chờ cấu hình MediaService...');
      this.callUpdateProfileApi(payload);
    } else {
      this.callUpdateProfileApi(payload);
    }
  }

  // Call api edit profile
  private callUpdateProfileApi(payload: any) {
    this.userService.updateProfile(payload).subscribe({
      next: (res) => {
        if (res.success) {
          this.notiService.show(NotificationType.SUCCESS, 'Cập nhật thông tin thành công!');
          this.loadUserProfile(false);

          if (res.data) {
            const userData = res.data.updatedUser ? res.data.updatedUser : res.data;
            this.userProfile.set(userData);
            this.userState.updateUser(userData);
          }
        } else {
          this.notiService.show(NotificationType.ERROR, res.message || 'Cập nhật thất bại!');
        }
      },
      error: (err) => {
        this.notiService.show(NotificationType.ERROR, handleHttpError(err));
      }
    });
  }

  // Call api change password
  submitChangePassword(oldPass: string, newPass: string, confirmPass: string) {
    if (!oldPass || !newPass || !confirmPass) {
      this.notiService.show(NotificationType.WARNING, 'Vui lòng điền đầy đủ thông tin mật khẩu!');
      return;
    }
    if (newPass !== confirmPass) {
      this.notiService.show(NotificationType.WARNING, 'Mật khẩu mới và xác nhận không khớp!');
      return;
    }

    this.isChangingPassword.set(true);
    this.userService.changePassword(oldPass, newPass, confirmPass).subscribe({
      next: (res: any) => {
        this.isChangingPassword.set(false);
        if (res.success) {
          this.notiService.show(NotificationType.SUCCESS, 'Đổi mật khẩu thành công!');
          this.isChangePasswordModalOpen.set(false);
        } else {
          this.notiService.show(NotificationType.ERROR, res.message || 'Đổi mật khẩu thất bại!');
        }
      },
      error: (err) => {
        this.isChangingPassword.set(false);
        this.notiService.show(NotificationType.ERROR, handleHttpError(err));
      }
    });
  }

  // Call api load user profile
  loadUserProfile(showLoading: boolean = true) {
    if (showLoading) this.isLoadingProfile.set(true);

    this.userService.getProfile().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.userProfile.set(res.data);
          this.userState.updateUser(res.data);
        }
        if (showLoading) this.isLoadingProfile.set(false);
      },
      error: (err) => {
        console.error('Lỗi khi tải thông tin cá nhân:', err.error.message);
        if (showLoading) this.isLoadingProfile.set(false);
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

  // Call api load reviews
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
