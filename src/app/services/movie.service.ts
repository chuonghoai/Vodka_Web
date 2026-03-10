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
      id: '1', title: 'Lật Mặt 7: Một Điều Ước', releaseYear: 2024, genre: 'Tâm lý, Gia đình', rating: 8.5,
      posterUrl: 'https://tse4.mm.bing.net/th/id/OIP.hOvMO0OtHYVRdCxM2Wh6LgHaJQ?rs=1&pid=ImgDetMain&o=7&rm=3',
      bannerUrl: 'https://chotroisg.com/storage/app/public/photos/9/Blog/lat-mat-7-ly-hai/banner-lat-mat-7.png',
      tags: ['Chiếu rạp', 'Full HD'],
      description: 'Câu chuyện cảm động về tình mẫu tử và gia đình...'
    },
    {
      id: '2', title: 'Mai', releaseYear: 2024, genre: 'Tình cảm, Drama', rating: 8.0,
      posterUrl: 'https://tse2.mm.bing.net/th/id/OIP.q9I1OSQLVMMSAC_--U4-owHaKf?rs=1&pid=ImgDetMain&o=7&rm=3',
      tags: ['Độc quyền', '4K']
    },
    {
      id: '3', title: 'Đào, Phở và Piano', releaseYear: 2024, genre: 'Lịch sử, Chiến tranh', rating: 9.0,
      posterUrl: 'https://tse2.mm.bing.net/th/id/OIP.4bY_5n9G57QExFIXDkm46gHaKv?rs=1&pid=ImgDetMain&o=7&rm=3',
      tags: ['Hot', 'Vietsub']
    },
    {
      id: '4', title: 'Godzilla x Kong', releaseYear: 2024, genre: 'Hành động, Viễn tưởng', rating: 7.8,
      posterUrl: 'https://tse1.explicit.bing.net/th/id/OIP.aEGP2jw52nykZFBqRdj8FQHaLN?rs=1&pid=ImgDetMain&o=7&rm=3',
      tags: ['Bom tấn', 'Thuyết minh']
    }
  ];

  // API lấy phim làm Banner chính
  getFeaturedMovie(): Observable<ApiResponse<Movie>> {
    return of({
      success: true,
      message: 'Success',
      data: this.mockMovies[0]
    }).pipe(delay(500));
  }

  // API lấy danh sách phim
  getMoviesList(): Observable<ApiResponse<Movie[]>> {
    return of({
      success: true,
      message: 'Success',
      data: this.mockMovies
    }).pipe(delay(500));
  }

  getWatchedHistory(): Observable<ApiResponse<Movie[]>> {
    return of({
      success: true,
      message: 'Success',
      // Lấy 3 phim đầu tiên để làm lịch sử xem
      data: this.mockMovies.slice(0, 3)
    }).pipe(delay(500));
  }
}
