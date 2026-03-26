export interface GenreRow {
    id: number;
    name: string;
    slug: string;
    movieCount: number;
    createdAt: string;
}

export interface GenreStat {
    icon: string;
    label: string;
    value: string;
    description: string;
    badgeText: string;
    badgeColor: string;
}