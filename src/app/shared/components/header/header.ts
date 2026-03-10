import { Component, inject, OnInit, signal } from '@angular/core';
import { Genre } from '../../../models/genre.model';
import { HeaderService } from '../../../services/header.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterModule],
  templateUrl: './header.html',
})
export class Header implements OnInit {
  private headerService = inject(HeaderService);

  genres = signal<Genre[]>([]);
  selectedGenres = signal<string[]>([]);

  // Trạng thái menu trên giao diện mobile
  isMobileMenuOpen = signal<boolean>(false);

  ngOnInit(): void {
    this.headerService.getGenres().subscribe(res => {
      if (res.success) this.genres.set(res.data);
    });
  }

  // Hàm mở/đóng menu mobile
  toggleMobileMenu() {
    this.isMobileMenuOpen.update(v => !v);
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
