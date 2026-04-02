import { NgClass } from '@angular/common';
import { afterNextRender, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { AdminUserDetail, UserStats } from '../../../../models/user.model';
import { AdminUserService } from '../../../../services/admin-user.service';
import { buildPageItems } from '../../utils/pagination.utils';
import { NotificationService } from '../../../../services/notification.service';
import { NotificationType } from '../../../../models/notification.model';


@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [FormsModule, NgClass],
  templateUrl: './user-management.html',
})
export class UserManagementComponent {
  private adminUserService = inject(AdminUserService);
  private notif = inject(NotificationService);

  //  State
  isLoading = signal(true);
  errorMessage = signal('');
  //  Filters
  searchQuery = '';
  selectedStatus = '';
  selectedProvider = '';
  selectedGender = '';
  selectedSort = '';

  //  Stats
  userStats = signal<{
    icon: string; label: string; value: string;
    description: string; badgeText: string; badgeColor: string;
  }[]>([]);

  //  Users
  users = signal<AdminUserDetail[]>([]);

  //  Side Panel
  selectedUser = signal<AdminUserDetail | null>(null);
  showPanel = signal(false);

  constructor() {
    afterNextRender(() => this.loadData());
  }
  /**
   * Fetch toàn bộ dữ liệu (KPIs + Danh sách người dùng)
   */
  loadData() {
    this.isLoading.set(true);
    this.errorMessage.set('');
    forkJoin({
      stats: this.adminUserService.getUserStats(),
      users: this.adminUserService.getUsers({
        page: this.currentPage(),
        pageSize: this.pageSize(),
        search: this.searchQuery || undefined,
        status: this.selectedStatus || undefined,
        provider: this.selectedProvider || undefined,
        gender: this.selectedGender || undefined,
        sort: this.selectedSort || undefined,
      }),
    }).subscribe({
      next: ({ stats, users }) => {
        if (stats.success) {
          this.mapStats(stats.data);
        }
        if (users.success) {
          this.users.set(users.data);
          if (users.pagination) {
            this.totalItems.set(users.pagination?.totalItems ?? 0);

          }
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Không thể tải dữ liệu người dùng');
        this.isLoading.set(false);
      },
    });
  }

  /**
   * Kích hoạt hoặc Vô hiệu hóa tài khoản User
   */
  lockUser(user: AdminUserDetail) {
    const action = user.status === 'ACTIVE' ? 'vô hiệu hóa' : 'kích hoạt';
    if (confirm(`Bạn muốn ${action} tài khoản "${user.fullName}"?`)) {
      this.adminUserService.toggleLock(user.id).subscribe({
        next: (res) => {
          if (res.success) {
            const newStatus = user.status === 'ACTIVE' ? 'vô hiệu hóa' : 'đã kích hoạt';
            this.notif.show(NotificationType.SUCCESS, `Tài khoản "${user.fullName}" đã ${newStatus}`);
            this.loadData();
            if (this.selectedUser()?.id === user.id) this.closePanel();
          }
        },
        error: () => this.notif.show(NotificationType.ERROR, 'Không thể thay đổi trạng thái người dùng'),
      });
    }
  }

  //  Pagination 
  currentPage = signal(1);
  totalItems = signal(0);
  pageSize = signal(10);

  totalPages = computed(() => Math.ceil(this.totalItems() / this.pageSize()));

  pages = computed(() => buildPageItems(this.currentPage(), this.totalPages()));

  showingFrom = computed(() => (this.currentPage() - 1) * this.pageSize() + 1);
  showingTo = computed(() => Math.min(this.currentPage() * this.pageSize(), this.totalItems()));

  //  Helpers 
  getBadgeClasses(color: string): string {
    switch (color) {
      case 'emerald':
        return 'bg-emerald-500/10 text-emerald-500';
      case 'red':
        return 'bg-red-600/10 text-red-500';
      case 'blue':
        return 'bg-blue-500/10 text-blue-500';
      default:
        return 'bg-zinc-800 text-zinc-400';
    }
  }

  getDotClasses(color: string): string {
    switch (color) {
      case 'emerald':
        return 'bg-emerald-500 animate-pulse';
      case 'red':
        return 'bg-red-500';
      case 'blue':
        return 'bg-blue-500';
      default:
        return 'bg-zinc-500';
    }
  }

  getIconColorClass(color: string): string {
    switch (color) {
      case 'emerald':
        return 'text-emerald-500';
      case 'red':
        return 'text-red-500';
      case 'blue':
        return 'text-blue-500';
      default:
        return 'text-zinc-400';
    }
  }

  getHoverBorderClass(color: string): string {
    switch (color) {
      case 'emerald':
        return 'hover:border-emerald-500/30';
      case 'red':
        return 'hover:border-red-500/30';
      case 'blue':
        return 'hover:border-blue-500/30';
      default:
        return 'hover:border-red-600/30';
    }
  }


  formatNumber(num: number): string {
    return num.toLocaleString();
  }

  /**
   * Chuyển trang theo phân trang (Pagination)
   */
  goToPage(page: number | null) {
    if (page !== null && page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      this.loadData();   // Thêm dòng này để gọi API
    }
  }

  /**
   * Mở Side Panel để xem chi tiết User
   */
  viewUser(user: AdminUserDetail) {
    this.selectedUser.set(user);
    this.showPanel.set(true);
  }

  /**
   * Đóng Side Panel
   */
  closePanel() {
    this.showPanel.set(false);
    this.selectedUser.set(null);
  }
  /**
   * Submit tìm kiếm
   */
  onSearch() {
    this.currentPage.set(1);
    this.loadData();
  }

  /**
   * Submit lọc theo Filter
   */
  onFilterChange() {
    this.currentPage.set(1);
    this.loadData();
  }

  /**
   * Gọi API Reset Password cho User - mật khẩu sẽ được gửi tự động qua email
   */
  resetPassword(user: AdminUserDetail) {
    if (confirm(`Reset mật khẩu cho "${user.fullName}"?\nMật khẩu mới sẽ được gửi qua email: ${user.email}`)) {
      this.adminUserService.resetPassword(user.id).subscribe({
        next: (res) => {
          if (res.success) {
            this.notif.show(NotificationType.SUCCESS, `Đã reset mật khẩu và gửi về email: ${user.email}`);
          }
        },
        error: () => this.notif.show(NotificationType.ERROR, 'Không thể reset mật khẩu'),
      });
    }
  }

  /**
   * Render dữ liệu KPI Data thành mảng UI Stats
   */
  private mapStats(s: UserStats) {
    this.userStats.set([
      {
        icon: 'group', label: 'Tổng User',
        value: s.totalUsers.toLocaleString(),
        description: 'Tổng số người dùng hệ thống',
        badgeText: 'User Total', badgeColor: 'zinc',
      },
      {
        icon: 'person_play', label: 'Active',
        value: s.activeUsers.toLocaleString(),
        description: 'Tài khoản đang hoạt động',
        badgeText: 'ACTIVE', badgeColor: 'emerald',
      },
      {
        icon: 'block', label: 'Inactive',
        value: s.inactiveUsers.toLocaleString(),
        description: 'Tài khoản bị vô hiệu hóa',
        badgeText: 'INACTIVE', badgeColor: 'red',
      },
      {
        icon: 'person_add', label: 'Mới hôm nay',
        value: s.userNewToday.toLocaleString(),
        description: 'Lượt đăng ký mới hôm nay',
        badgeText: 'Today', badgeColor: 'blue',
      },
    ]);
  }
}
