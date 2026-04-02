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
import { MediaService } from '../../services/admin/media.service';

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
  private mediaService = inject(MediaService);

  activeTab = signal<'history' | 'favorites' | 'reviews'>('history');

  // State edit profile
  isEditingProfile = signal<boolean>(false);
  editFullName = signal<string>('');
  editAvatarUrl = signal<string>('');
  imageChangedEvent = signal<any>(null);

  // Modal change password
  isChangePasswordModalOpen = signal<boolean>(false);
  isChangingPassword = signal<boolean>(false);

  /**
   * Mở Modal Đổi mật khẩu
   */
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

  /**
   * Kích hoạt chế độ Chỉnh sửa hồ sơ cá nhân
   */
  handleEditStart() {
    this.isEditingProfile.set(true);
    this.editFullName.set(this.userProfile()?.fullName || '');
    this.editAvatarUrl.set(this.userProfile()?.avatarUrl || '');
  }

  /**
   * Hủy bỏ quá trình chỉnh sửa hồ sơ
   */
  handleEditCancel() {
    this.isEditingProfile.set(false);
  }

  /**
   * Lắng nghe sự kiện Upload File Avatar (chuyển vào Image Cropper)
   */
  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      this.imageChangedEvent.set(event);
    }
  }

  /**
   * Xử lý dữ liệu ảnh Base64 sau khi cắt từ AvatarCropper
   */
  handleAvatarCropped(base64Image: string) {
    this.editAvatarUrl.set(base64Image);
    this.imageChangedEvent.set(null);
  }

  /**
   * Tiện ích: Chuyển đổi mã Base64 sang File object gốc để upload
   */
  private base64ToFile(dataurl: string, filename: string): File {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  /**
   * Xử lý lưu thông tin Profile (Hỗ trợ upload ảnh đại diện lên Cloudinary)
   */
  async handleSaveProfile(profileInfoData: any) {
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
      console.log('Phát hiện ảnh mới, đang upload qua MediaService...');
      try {
        const file = this.base64ToFile(avatarUrl, `avatar_${Date.now()}.png`);
        const res = await this.mediaService.uploadToCloudinary(file, 'image');
        payload.avatarUrl = res.secure_url;
        this.callUpdateProfileApi(payload);
      } catch (err) {
        console.error(err);
        this.notiService.show(NotificationType.ERROR, 'Lỗi khi upload ảnh đại diện!');
      }
    } else {
      this.callUpdateProfileApi(payload);
    }
  }

  /**
   * Gọi API cập nhật thông tin User Profile vào cơ sở dữ liệu
   */
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

  /**
   * Gọi API thay đổi mật khẩu
   */
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

  /**
   * Tải thông tin người dùng hiện tại (Profile gốc)
   */
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
        console.error('Lỗi khi tải thông tin cá nhân:', err?.error?.message || err.message || err);
        if (showLoading) this.isLoadingProfile.set(false);
        this.userProfile.set(null);
        this.notiService.show(NotificationType.ERROR, `Lỗi: ${err}`);
      }
    });
  }

  /**
   * Gọi API tải danh sách phim Yêu thích (Favorites)
   */
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

  /**
   * Gọi API tải lịch sử xem phim
   */
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

  /**
   * Gọi API tải danh sách các đánh giá (Reviews) của người dùng
   */
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

  /**
   * Chuyển đổi giữa các tab (Lịch sử, Yêu thích, Đánh giá) thông qua queryParams
   */
  changeTab(tab: 'history' | 'favorites' | 'reviews') {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab: tab, page: 1 },
      queryParamsHandling: 'merge'
    });
  }

  /**
   * Chuyển trang cho tab Lịch sử Xem
   */
  onHistoryPageChange(page: number) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: page },
      queryParamsHandling: 'merge'
    });
  }

  /**
   * Chuyển trang cho tab Phim Yêu thích
   */
  onFavoritePageChange(page: number) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: page },
      queryParamsHandling: 'merge'
    });
  }

  /**
   * Chuyển trang cho phần Danh sách Đánh giá
   */
  onReviewPageChange(page: number) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: page },
      queryParamsHandling: 'merge'
    });
  }

  /**
   * Điều hướng nhanh vào khu vực Quản trị (Dành cho Admin)
   */
  navigateToAdmin() {
    this.router.navigate(['/admin']);
  }
}
