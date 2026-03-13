import { Component, inject, OnInit, signal } from '@angular/core';
import { Genre } from '../../../models/genre.model';
import { HeaderService } from '../../../services/header.service';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-header',
  imports: [RouterModule],
  templateUrl: './header.html',
})
export class Header implements OnInit {
  private headerService = inject(HeaderService);
  private authService = inject(AuthService);

  genres = signal<Genre[]>([]);
  selectedGenres = signal<string[]>([]);
  isMobileMenuOpen = signal<boolean>(false);
  currentUser = this.authService.currentUser;

  ngOnInit(): void {
    this.headerService.getGenres().subscribe(res => {
      if (res.success) this.genres.set(res.data);
    });
  }

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

  logout() {
    this.authService.logout();
    this.isMobileMenuOpen.set(false);
  }
}
