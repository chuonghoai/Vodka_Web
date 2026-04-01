export interface User {
  id: number;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  phone: string;
  email: string;
  avatarUrl: string;
  provider?: string;
  role?: string;
}


export interface AdminUserDetail extends User{
  status: 'ACTIVE' | 'INACTIVE';
  movieWatched: number;
  reviewCount: number;
  createdAt: string;
}

export interface UserStats {

  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  userNewToday: number;
  
}