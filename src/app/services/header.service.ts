import { inject, Injectable } from "@angular/core";
import { Genre } from "../models/genre.model";
import { Observable, delay, of } from 'rxjs';
import { ApiResponse } from "../models/api-response.model";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment.development";
import { API_ENDPOINTS } from "./api-endpoints/api.endpoints";

@Injectable({
  providedIn: 'root'
})
export class HeaderService{
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  getGenres(): Observable<ApiResponse<Genre[]>> {
    return this.http.get<ApiResponse<Genre[]>>(`${this.baseUrl}${API_ENDPOINTS.GENRES.GET_ALL}`);
  }
}
