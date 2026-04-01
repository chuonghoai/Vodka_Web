export interface TrendDto {
  value: string;
  direction: 'up' | 'down';
}

export interface DashboardStats {
  totalMovies: number;
  moviesTrend?: TrendDto;
  totalUsers: number;
  usersTrend?: TrendDto;
  totalReviews: number;
  reviewsTrend?: TrendDto;
  totalTags: number;
  totalViews: number;
  viewsTrend?: TrendDto;
  topMovies: TopMovieDto[];
  dailyViews: DailyViewDto[];
}

export interface TopMovieDto {
  title: string;
  viewCount: number;
}

export interface DailyViewDto {
  date: string;   // "2026-03-24"
  count: number;
}


export interface ActivityDto {
  id: number;
  actorName: string;
  actorAvatar: string | null;
  entityType: string;   
  targetName: string;
  createdAt: string;         
  updatedAt: string;          
}