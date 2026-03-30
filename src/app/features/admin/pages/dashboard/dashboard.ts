import { afterNextRender, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ActivityDto, DashboardStats, TrendDto } from '../../../../models/dashboard.model';
import { DashboardService } from '../../../../services/dashboard.service';
import { KpiCardComponent } from '../../components/kpi-card/kpi-card';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [KpiCardComponent],
  templateUrl: './dashboard.html',
})
export class DashboardComponent {
  private router = inject(Router);
  private dashboardService = inject(DashboardService);

  //  State 
  isLoading = signal(true);
  errorMessage = signal('');

  //  KPI Data
  kpiData = signal<KpiData[]>([]);

  //  Chart Data 
  chartData = signal<{ height: number; value: string }[]>([]);
  chartDays = signal<string[]>([]);

  //  Top Movies 
  topMovies = signal<TopMovie[]>([]);

  //  Quick Actions 
  quickActions = [
    { icon: 'movie', label: 'Thêm phim', route: '/admin/movies' },
    { icon: 'fact_check', label: 'Duyệt review', route: '/admin/reviews' },
    { icon: 'manage_accounts', label: 'Quản lý user', route: '/admin/users' },
    { icon: 'tag', label: 'Thêm tag', route: '/admin/tags' },
    { icon: 'cloud_upload', label: 'Backup dữ liệu', route: '/admin/settings' },
    { icon: 'settings_applications', label: 'Cài đặt hệ thống', route: '/admin/settings' },
  ];

  //  Activity Log 
  activities = signal<ActivityView[]>([]);

  constructor() {
    afterNextRender(() => this.loadDashboard());
  }


  loadDashboard() {
    this.isLoading.set(true);
    this.errorMessage.set('');

    forkJoin({
      stats: this.dashboardService.getStats(),
      activities: this.dashboardService.getActivities(),
    }).subscribe({
      next: ({ stats, activities }) => {
        if (stats.success) {
          const d = stats.data;
          this.mapKpiData(d);
          this.mapTopMovies(d);
          this.mapChartData(d);
        }
        if (activities.success) {
          this.mapActivities(activities.data);
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Không thể tải dữ liệu dashboard');
        this.isLoading.set(false);
      },
    });
  }


  //  MAP: KPI Cards
  private mapKpiData(d: DashboardStats) {
    this.kpiData.set([
      {
        icon: 'movie', label: 'Tổng số phim',
        value: this.formatNumber(d.totalMovies),
        ...this.mapTrend(d.moviesTrend),
      },
      {
        icon: 'group', label: 'Tổng User',
        value: this.formatNumber(d.totalUsers),
        ...this.mapTrend(d.usersTrend),
      },
      {
        icon: 'rate_review', label: 'Tổng Review',
        value: this.formatNumber(d.totalReviews),
        ...this.mapTrend(d.reviewsTrend),
      },
      {
        icon: 'label', label: 'Thể loại / Tags',
        value: this.formatNumber(d.totalTags),
      },
      {
        icon: 'visibility', label: 'Tổng lượt xem',
        value: this.formatNumber(d.totalViews),
        ...this.mapTrend(d.viewsTrend),
      },
    ]);
  }

  //  MAP: Top Movies
  private mapTopMovies(d: DashboardStats) {
    if (!d.topMovies?.length) return;
    const maxView = d.topMovies[0].viewCount || 1;
    this.topMovies.set(
      d.topMovies.map(m => ({
        title: m.title,
        views: this.formatViewCount(m.viewCount),
        percent: Math.round((m.viewCount / maxView) * 100),
      }))
    );
  }

  //  MAP: Chart (Biểu đồ 7 ngày)
  private mapChartData(d: DashboardStats) {
    if (!d.dailyViews?.length) return;
    const maxCount = Math.max(...d.dailyViews.map(v => v.count)) || 1;

    this.chartData.set(
      d.dailyViews.map(v => ({
        height: Math.round((v.count / maxCount) * 100),
        value: this.formatViewCount(v.count),
      }))
    );

    this.chartDays.set(
      d.dailyViews.map(v => this.formatDayLabel(v.date))
    );
  }

  private mapActivities(list: ActivityDto[]) {
  this.activities.set(
    list.map(a => {
      const hasAvatar = !!a.actorAvatar;
      const isUpdated = a.updatedAt > a.createdAt;
      const action = isUpdated ? 'đã cập nhật' : 'đã tạo';
      const displayTime = isUpdated ? a.updatedAt : a.createdAt;

      return {
        type: hasAvatar ? 'avatar' : 'icon',
        avatarUrl: a.actorAvatar ?? undefined,
        iconName: hasAvatar ? undefined : 'notifications',
        iconBgColor: hasAvatar ? undefined : 'bg-red-600/10',
        iconTextColor: hasAvatar ? undefined : 'text-red-600',
        actor: a.actorName,
        action: `${action} ${a.entityType}`,
        target: a.targetName,
        targetClass: 'text-white font-medium',
        time: this.timeAgo(displayTime),
      } as ActivityView;
    })
  );
}


  //  HELPER
  /** Chuyển TrendDto → props cho KpiData */
  private mapTrend(trend?: TrendDto): { trend?: string; direction?: 'up' | 'down' } {
    if (!trend) return {};
    return { trend: trend.value, direction: trend.direction };
  }

  /** 1234 → "1,234" | 152000 → "152K" | 4200000 → "4.2M" */
  private formatNumber(n: number): string {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
    if (n >= 10_000) return Math.round(n / 1_000) + 'K';
    if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
    return n.toLocaleString('en-US');
  }

  /** 4200000 → "4.2M views" */
  private formatViewCount(n: number): string {
    return this.formatNumber(n) + ' views';
  }

  /** "2026-03-24" → "Mon" */
  private formatDayLabel(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  }

  private timeAgo(isoDate: string): string {
    const now = Date.now();
    const then = new Date(isoDate).getTime();
    const diffMs = now - then;
    const minutes = Math.floor(diffMs / 60000);

    if (minutes < 1)  return 'Vừa xong';
    if (minutes < 60) return `${minutes} phút trước`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} giờ trước`;
    
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} ngày trước`;
    
    return `${Math.floor(days / 30)} tháng trước`;
  }


  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  dismissError() {
    this.errorMessage.set('');
  }
}
