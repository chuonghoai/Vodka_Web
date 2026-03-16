import { inject, Injectable, signal, PLATFORM_ID } from "@angular/core";
import { isPlatformBrowser } from '@angular/common';
import { Genre } from "../models/genre.model";
import { Tag } from "../models/tag.model";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment.development";
import { API_ENDPOINTS } from "./api-endpoints/api.endpoints";

@Injectable({ providedIn: 'root' })
export class FilterService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private baseUrl = environment.apiUrl;

  genres = signal<Genre[]>([]);
  tags = signal<Tag[]>([]);

  constructor() {
    this.initMetadata();
  }

  private initMetadata() {
    if (isPlatformBrowser(this.platformId)) {
      const storedG = localStorage.getItem('genres');
      const storedT = localStorage.getItem('tags');
      if (storedG) this.genres.set(JSON.parse(storedG));
      if (storedT) this.tags.set(JSON.parse(storedT));

      this.http.get<any>(`${this.baseUrl}${API_ENDPOINTS.GENRES.GET_ALL}`).subscribe(res => {
        if (res.success) {
          this.genres.set(res.data);
          localStorage.setItem('genres', JSON.stringify(res.data));
        }
      });
      this.http.get<any>(`${this.baseUrl}${API_ENDPOINTS.TAGS.GET_ALL}`).subscribe(res => {
        if (res.success) {
          this.tags.set(res.data);
          localStorage.setItem('tags', JSON.stringify(res.data));
        }
      });
    }
  }

  getNameById(id: string): string {
    const allMetadata = [...this.genres(), ...this.tags()];
    const found = allMetadata.find(item => item.id === id);
    return found ? found.name : 'Đề Xuất';
  }
}
