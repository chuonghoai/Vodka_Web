export interface MovieRow {
    id: number;
    movieCode: string;
    title: string;
    posterUrl: string;
    genre: string;
    releaseYear: number;
    rating: number;
    views: number;
    favorites: number;
    createdAt: string;
}

export interface SummaryStats {
    label: string;
    value: string;
    trend: string;
}