export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    GOOGLE_LOGIN: '/api/auth/google',
    REGISTER_SEND_OTP: '/api/auth/register/send-otp',
    REGISTER: '/api/auth/register',
    FORGOT_SEND_OTP: '/api/auth/forgot-password/send-otp',
    FORGOT_VERIFY_OTP: '/api/auth/forgot-password/verify-otp',
    FORGOT_RESET: '/api/auth/forgot-password/reset',
  },
  USER: {
    PROFILE: '/api/users/me/profile',
  },
  MOVIES: {
    FEATURED: '/api/movies/featured',
    NEW_RELEASES: '/api/movies/new-releases',
    TRENDING: '/api/movies/trending',
    HISTORY: '/api/movies/history',
    RECENTLY_UPDATED: '/api/movies/recently-updated',
    HIGHLY_RATED: '/api/movies/highly-rated',
    BY_GENRE: (genreName: string) => `/api/movies/genre/${encodeURIComponent(genreName)}`,
    BY_ID: (id: number) => `/api/movies/${encodeURIComponent(id)}`,
    WATCH: (episodeId: number) => `/api/movies/watch/${episodeId}`,
    BY_FILTER: '/api/movies/filter',
  },
  GENRES: {
    GET_ALL: '/api/genres',
  },
  TAGS: {
    GET_ALL: '/api/tags',
  },
  REVIEWS: {
    BY_MOVIE: (movieId: number) => `/api/movies/${movieId}/reviews`,
    NEW: '/api/movies/reviews'
  }
};
