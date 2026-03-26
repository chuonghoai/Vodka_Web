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
    movie: {
        value: number;
        trend: number;
    },
    rating: {
        value: number;
        trend: number;
    },
    views: {
        value: number;
        trend: number;
    },
    favorites: {
        value: number;
        trend: number;
    }
}