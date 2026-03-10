import { Injectable } from "@angular/core";
import { Genre } from "../models/genre.model";
import { Observable, delay, of } from 'rxjs';
import { ApiResponse } from "../models/api-response.model";

@Injectable({
  providedIn: 'root'
})
export class HeaderService{
  private mockGenres: Genre[] = [
    { id: '1', name: 'Hành động' },
    { id: '2', name: 'Tâm lý' },
    { id: '3', name: 'Tình cảm' },
    { id: '4', name: 'Kinh dị' },
    { id: '5', name: 'Viễn tưởng' },
    { id: '6', name: 'Lịch sử' },
    { id: '7', name: 'Gia đình' },
    { id: '8', name: 'Drama' },
  ];

  getGenres(): Observable<ApiResponse<Genre[]>> {
    return of({ success: true, message: 'Success', data: this.mockGenres }).pipe(delay(300));
  }
}
