// src/app/services/movie.service.ts
import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { Movie } from '../models/movie.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  // Dữ liệu giả lập
  private mockMovies: Movie[] = [
    {
      id: '1', title: 'Lật Mặt 7: Một Điều Ước', releaseYear: 2024, genre: ['Tâm lý', 'Gia đình'], rating: 8.5,
      posterUrl: 'https://tse4.mm.bing.net/th/id/OIP.hOvMO0OtHYVRdCxM2Wh6LgHaJQ?rs=1&pid=ImgDetMain&o=7&rm=3',
      bannerUrl: 'https://chotroisg.com/storage/app/public/photos/9/Blog/lat-mat-7-ly-hai/banner-lat-mat-7.png',
      tags: ['Chiếu rạp', 'Full HD'], description: 'Câu chuyện cảm động về tình mẫu tử và gia đình...'
    },
    {
      id: '2', title: 'Mai', releaseYear: 2024, genre: ['Tình cảm', 'Drama'], rating: 8.0,
      posterUrl: 'https://tse2.mm.bing.net/th/id/OIP.q9I1OSQLVMMSAC_--U4-owHaKf?rs=1&pid=ImgDetMain&o=7&rm=3',
      bannerUrl: 'https://tse1.mm.bing.net/th/id/OIP.-69KiookSVfZCNMlLmxq6gHaD0?w=800&h=413&rs=1&pid=ImgDetMain&o=7&rm=3',
      tags: ['Độc quyền', '4K']
    },
    {
      id: '3', title: 'Đào, Phở và Piano', releaseYear: 2024, genre: ['Lịch sử', 'Chiến tranh'], rating: 9.0,
      posterUrl: 'https://tse2.mm.bing.net/th/id/OIP.4bY_5n9G57QExFIXDkm46gHaKv?rs=1&pid=ImgDetMain&o=7&rm=3',
      bannerUrl: 'https://tse1.mm.bing.net/th/id/OIP.Gj42HHbARXlwukA4ElPgCwHaE8?w=600&h=400&rs=1&pid=ImgDetMain&o=7&rm=3',
      tags: ['Hot', 'Vietsub']
    },
    {
      id: '4', title: 'Godzilla x Kong', releaseYear: 2024, genre: ['Hành động', 'Viễn tưởng'], rating: 7.8,
      posterUrl: 'https://tse1.explicit.bing.net/th/id/OIP.aEGP2jw52nykZFBqRdj8FQHaLN?rs=1&pid=ImgDetMain&o=7&rm=3',
      tags: ['Bom tấn', 'Thuyết minh']
    },
    {
      id: '5', title: 'Móng Vuốt', releaseYear: 2024, genre: ['Kinh dị', 'Hành động'], rating: 6.5,
      posterUrl: 'https://tse3.mm.bing.net/th/id/OIP.KoSO7K7a8GgIt9PdjRJsiwHaKk?rs=1&pid=ImgDetMain&o=7&rm=3',
      tags: ['Rạp Việt', 'Mới']
    },
    {
      id: '4', title: 'Godzilla x Kong', releaseYear: 2024, genre: ['Hành động', 'Viễn tưởng'], rating: 7.8,
      posterUrl: 'https://tse1.explicit.bing.net/th/id/OIP.aEGP2jw52nykZFBqRdj8FQHaLN?rs=1&pid=ImgDetMain&o=7&rm=3',
      tags: ['Bom tấn', 'Thuyết minh']
    },
    {
      id: '4', title: 'Godzilla x Kong', releaseYear: 2024, genre: ['Hành động', 'Viễn tưởng'], rating: 7.8,
      posterUrl: 'https://tse1.explicit.bing.net/th/id/OIP.aEGP2jw52nykZFBqRdj8FQHaLN?rs=1&pid=ImgDetMain&o=7&rm=3',
      tags: ['Bom tấn', 'Thuyết minh']
    },
    {
      id: '4', title: 'Godzilla x Kong', releaseYear: 2024, genre: ['Hành động', 'Viễn tưởng'], rating: 7.8,
      posterUrl: 'https://tse1.explicit.bing.net/th/id/OIP.aEGP2jw52nykZFBqRdj8FQHaLN?rs=1&pid=ImgDetMain&o=7&rm=3',
      tags: ['Bom tấn', 'Thuyết minh']
    },
    {
      id: '4', title: 'Godzilla x Kong', releaseYear: 2024, genre: ['Hành động', 'Viễn tưởng'], rating: 7.8,
      posterUrl: 'https://tse1.explicit.bing.net/th/id/OIP.aEGP2jw52nykZFBqRdj8FQHaLN?rs=1&pid=ImgDetMain&o=7&rm=3',
      tags: ['Bom tấn', 'Thuyết minh']
    }
  ];

  // Tự động sinh ra 80 phim để test phân trang
  private extendedMockMovies: Movie[] = Array.from({ length: 1000 }).map((_, i) => {
    const base = this.mockMovies[i % this.mockMovies.length];
    return { ...base, id: (i + 1).toString(), title: `${base.title} - Phần ${i + 1}` };
  });

  // Fetch API
  getFeaturedMovies(): Observable<ApiResponse<Movie[]>> {
    return of({ success: true, message: 'Success', data: this.mockMovies.slice(0, 3) }).pipe(delay(500));
  }

  getNewReleases(page: number = 1, pageSize: number = 30): Observable<ApiResponse<Movie[]>> {
    let startIndex = 0;
    if (page === 2) startIndex = 30;

    const pagedData = this.extendedMockMovies.slice(startIndex, startIndex + pageSize);

    return of({
      success: true, message: 'Success', data: pagedData,
      pagination: { totalItems: 1000, totalPages: 100, currentPage: page, pageSize: pageSize }
    }).pipe(delay(500));
  }

  getTrendingMovies(limit: number = 10): Observable<ApiResponse<Movie[]>> {
    return of({ success: true, message: 'Success', data: [...this.mockMovies].reverse().slice(0, limit) }).pipe(delay(500));
  }

  getWatchedHistory(): Observable<ApiResponse<Movie[]>> {
    return of({ success: true, message: 'Success', data: this.mockMovies.slice(0, 2) }).pipe(delay(500));
  }

  getRecentlyUpdated(): Observable<ApiResponse<Movie[]>> {
    return of({ success: true, message: 'Success', data: [...this.mockMovies].slice(0, 3).reverse() }).pipe(delay(500));
  }

  getHighlyRated(): Observable<ApiResponse<Movie[]>> {
    const topMovies = this.mockMovies.filter(m => m.rating >= 8.0).sort((a, b) => b.rating - a.rating);
    return of({ success: true, message: 'Success', data: topMovies }).pipe(delay(500));
  }

  getMoviesByGenre(genre: string): Observable<ApiResponse<Movie[]>> {
    const genreMovies = this.mockMovies.filter(m => m.genre.includes(genre));
    return of({ success: true, message: 'Success', data: genreMovies }).pipe(delay(500));
  }
}
