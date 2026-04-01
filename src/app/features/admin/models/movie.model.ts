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

export interface EpisodeForm {
    id?: number;
    episodeNumber: number;
    title: string;
    description: string;
    videoUrl: string;
    videoFile?: File;
    duration: number;
    thumbnailUrl?: string;
}

export interface SeasonForm {
    id?: number;
    seasonNumber: number;
    title: string;
    episodes: EpisodeForm[];
}

export interface MovieForm {
    id?: number;
    title: string;
    description: string;
    releaseYear: number;
    movieType: 'SINGLE' | 'SERIES';
    posterUrl: string;
    bannerUrl: string;
    posterFile?: File;
    bannerFile?: File;
    genres: any[];
    tags: any[];
    videoUrl?: string;
    videoFile?: File;
    thumbnailUrl?: string;
    duration?: number;
    seasons: SeasonForm[];
}

export interface ContextMenuState {
    visible: boolean;
    x: number;
    y: number;
    type: 'season' | 'episode' | null;
    seasonIndex: number;
    episodeIndex?: number;
}