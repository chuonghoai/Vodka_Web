import { Component, inject, OnInit, signal } from '@angular/core';
import { Genre } from '../../../models/genre.model';
import { HeaderService } from '../../../services/header.service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
})
export class Header implements OnInit {
  private headerService = inject(HeaderService);

  genres = signal<Genre[]>([]);
  selectedGenres = signal<string[]>([]);

  ngOnInit(): void {
    this.headerService.getGenres().subscribe(res => {
      if (res.success) this.genres.set(res.data);
    });
  }

  toggleGenreSelection(genreName: string) {
    const currentSelected = this.selectedGenres();
    if (currentSelected.includes(genreName)) {
      this.selectedGenres.set(currentSelected.filter(g => g !== genreName));
    } else {
      this.selectedGenres.set([...currentSelected, genreName]);
    }
  }

  applyFilter() {
    console.log('Các thể loại đang lọc:', this.selectedGenres());
    // TODO: Chuyển hướng sang trang tìm kiếm kèm query params
  }
}
