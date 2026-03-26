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

  ADMIN: {
    MOVIES: '/api/admin/movies',               // GET: danh sách + pagination
    MOVIE_BY_ID: (id: number) => `/api/admin/movies/${id}`,  // GET/PUT/DELETE
    MOVIE_STATS: '/api/admin/movies/stats',     // GET: summary stats

    // CRUD USER
    USERS: '/api/admin/users',
    USER_BY_ID: (id: number) => `/api/admin/users/${id}`,
    USER_STATS: '/api/admin/users/stats',
    USER_LOCK: (id: number) => `/api/admin/users/${id}/lock`,
    USER_RESET_PASSWORD: (id: number) => `/api/admin/users/${id}/reset-password`,

    // CRUD GENRE
    GENRES: '/api/admin/genres',
    GENRE_BY_ID: (id: number) => `/api/admin/genres/${id}`,
    GENRE_STATS: '/api/admin/genres/stats',

  },
  USER: {
    PROFILE: '/api/users/me/profile',
    FAVORITES: '/api/users/favorites',
    MOVIE_HISTORY: '/api/users/history',
    REVIEWS: '/api/users/reviews',
    CHANGE_PASSWORD: '/api/users/change-password',
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
    FAVORITE: (movieId: number) => `/api/movies/${movieId}/favorite`,
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
