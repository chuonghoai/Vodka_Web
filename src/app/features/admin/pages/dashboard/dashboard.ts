import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { KpiCardComponent } from '../../components/kpi-card/kpi-card';

interface KpiData {
  icon: string;
  label: string;
  value: string;
  trend?: string;
  direction?: 'up' | 'down';
  iconColor?: string;
}

interface TopMovie {
  title: string;
  views: string;
  percent: number;
}

interface Activity {
  type: 'avatar' | 'icon';
  avatarUrl?: string;
  iconName?: string;
  iconBgColor?: string;
  iconTextColor?: string;
  actor: string;
  action: string;
  target: string;
  targetClass?: string;
  time: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [KpiCardComponent],
  templateUrl: './dashboard.html',
})
export class DashboardComponent {
  constructor(private router: Router) {}

  // ─── KPI Data ───
  kpiData = signal<KpiData[]>([
    { icon: 'movie', label: 'Tổng số phim', value: '1,234', trend: '+12', direction: 'up' },
    { icon: 'group', label: 'User hoạt động', value: '5,678', trend: '+256', direction: 'up' },
    { icon: 'rate_review', label: 'Review mới', value: '89', trend: '-5', direction: 'down' },
    { icon: 'label', label: 'Thể loại', value: '24' },
    { icon: 'visibility', label: 'Lượt xem hôm nay', value: '15.2K', trend: '+18%', direction: 'up' },
  ]);

  // ─── Chart Data (7 ngày, giá trị % height) ───
  chartData = signal([
    { height: 40, value: '12.4K' },
    { height: 55, value: '16.8K' },
    { height: 45, value: '13.9K' },
    { height: 80, value: '24.1K' },
    { height: 65, value: '19.7K' },
    { height: 90, value: '27.3K' },
    { height: 75, value: '22.6K' },
  ]);
  chartDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // ─── Top Movies ───
  topMovies = signal<TopMovie[]>([
    { title: 'Avengers: Secret Wars', views: '4.2M views', percent: 95 },
    { title: 'Oppenheimer', views: '3.8M views', percent: 85 },
    { title: 'Dune: Part Two', views: '2.9M views', percent: 65 },
    { title: 'Spider-Man 4', views: '2.1M views', percent: 45 },
    { title: 'The Batman II', views: '1.8M views', percent: 35 },
  ]);

  // ─── Quick Actions ───
  quickActions = [
    { icon: 'movie', label: 'Thêm phim', route: '/admin/movies' },
    { icon: 'fact_check', label: 'Duyệt review', route: '/admin/reviews' },
    { icon: 'manage_accounts', label: 'Quản lý user', route: '/admin/users' },
    { icon: 'tag', label: 'Thêm tag', route: '/admin/tags' },
    { icon: 'cloud_upload', label: 'Backup dữ liệu', route: '/admin/settings' },
    { icon: 'settings_applications', label: 'Cài đặt hệ thống', route: '/admin/settings' },
  ];

  // ─── Activity Log ───
  activities = signal<Activity[]>([
    {
      type: 'avatar',
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7Jg8eFVQwEhtnNt2Fr-kBrgzZn_ROq4v9LAfzUDQkSovDZl2N2mCOA17kyLYD1RQlJCgSwSzjMp4c9aESqdk091ZNI--uCepHiAO5vK8s53CbUXfMpgDc_wjmbHVclA62vEVI_OWE0ogmnt_gMX4Lz0QBCr8yaP0GrmjAI3kOJwl1CkepEaIjPCUfz8yhYWb2QLAwBKh6CViDW1OUI2qIm3E76cmmy0w3J_h6U1dtjZ6B-O9oDnD-G19UkVN0Vg9AS6OM8zW_wQ',
      actor: 'Admin',
      action: 'đã thêm phim',
      target: "'Avengers: Secret Wars'",
      targetClass: 'text-red-500 font-medium',
      time: '5 phút trước',
    },
    {
      type: 'icon',
      iconName: 'rate_review',
      iconBgColor: 'bg-red-600/10',
      iconTextColor: 'text-red-600',
      actor: 'Minh Hoang',
      action: 'đã đăng một review mới cho',
      target: 'Oppenheimer',
      targetClass: 'text-white italic',
      time: '12 phút trước',
    },
    {
      type: 'avatar',
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDEuBOGyf5Mu21oOmqaCoWWX2XXz3KBSujF99HVHk4Lxvm-gDFyziIIjsHlbLiq2NIu7d3avkR3y9eK3CjPp-qdb4ZywyVINhmj99p10OEsqDEB-I1MOWgs6jhNouMb0n2MSGsBz3uAOwio_SkGh6FgcIi4P8ISt2DoV6hEXaUsb_2YybugbdnvhrHfraOyptdhPPUzD09HP7Ic1VB2zggd0ZV65lEyWpTm2huVQh6mw6s9SoN-SYEHmnOw95CK2stlMaLgxnAe8Q',
      actor: 'Moderator Linh',
      action: 'đã cập nhật thể loại',
      target: 'Hành động',
      targetClass: 'text-white',
      time: '2 giờ trước',
    },
    {
      type: 'icon',
      iconName: 'warning',
      iconBgColor: 'bg-amber-500/10',
      iconTextColor: 'text-amber-500',
      actor: 'Hệ thống',
      action: 'phát hiện',
      target: 'đăng nhập bất thường từ IP 1.2.3.4',
      targetClass: 'text-amber-500',
      time: '4 giờ trước',
    },
  ]);

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}
