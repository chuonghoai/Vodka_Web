interface UserRow {
    id: number;
    fullName: string;
    email: string;
    avatarUrl: string;
    provider: 'Google' | 'Email';
    gender: string;
    dateOfBirth: string;
    status: 'Active' | 'Inactive';
    phone?: string;
    moviesWatched?: number;
    reviewsCount?: number;
}

interface UserStat {
    icon: string;
    label: string;
    value: string;
    description: string;
    badgeText: string;
    badgeColor: string;
}