interface TagRow {
  id: number;
  name: string;
  slug: string;
  movieCount: number;
  viewCount: number;
  createdAt: string;
  updatedAt?: string;
}

interface TagStat {
  icon: string;
  label: string;
  value: string;
  description: string;
  badgeText: string;
  badgeColor: string;
}