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


interface ActivityView {
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

