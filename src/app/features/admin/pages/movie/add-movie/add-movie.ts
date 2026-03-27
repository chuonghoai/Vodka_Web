// File: src/app/features/admin/pages/movie/add-movie/add-movie.ts
import { Component, OnInit, signal, computed, inject, OnDestroy, Renderer2, HostListener } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

// Services & Models
import { AdminMovieService } from '../../../../../services/admin/movie.service';
import { MediaService } from '../../../../../services/admin/media.service';
import { MovieForm, SeasonForm, EpisodeForm, ContextMenuState } from '../../../models/movie.model';
import { FilterService } from '../../../../../services/filter.service';
import { firstValueFrom } from 'rxjs';
import { DurationPipe } from '../../../../../shared/pipes/duration.pipe';

@Component({
  selector: 'app-add-movie',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, DurationPipe],
  templateUrl: './add-movie.html',
})
export class AddMovieComponent implements OnInit, OnDestroy {
  // --- INJECTIONS ---
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private renderer = inject(Renderer2);
  private document = inject(DOCUMENT);
  private adminMovieService = inject(AdminMovieService);
  private mediaService = inject(MediaService);
  private filterService = inject(FilterService);

  // =========================================================================
  // REGION 1: BIẾN LƯU TRỮ TRẠNG THÁI (STATE & DATA VARIABLES)
  // =========================================================================

  // 1.1 - BIẾN TRẠNG THÁI GIAO DIỆN CỤC BỘ (Không đẩy lên API)
  isEditMode = signal<boolean>(false);
  movieId = signal<number | null>(null);
  selectedSeasonIndex = signal<number>(0);
  selectedEpisodeIndex = signal<number>(0);
  showGenreModal = signal(false);
  showTagModal = signal(false);
  isUploadingData = signal<boolean>(false); // Trạng thái màn hình chờ khi nhấn Save

  contextMenu = signal<ContextMenuState>({ visible: false, x: 0, y: 0, type: null, seasonIndex: -1 });
  dragState = signal({ poster: false, banner: false, video: false });
  zoomedImage = signal<string | null>(null);

  // 1.2 - BIẾN CHỨA DỮ LIỆU DANH MỤC (Lấy từ API để render các ô Select)
  availableGenres = computed(() => this.filterService.genres());
  availableTags = computed(() => this.filterService.tags());

  // 1.3 - BIẾN LƯU TRỮ PAYLOAD CHÍNH (Chứa Data nhập liệu & File chờ upload)
  movieForm = signal<MovieForm>({
    title: '', description: '', releaseYear: new Date().getFullYear(),
    posterUrl: '', bannerUrl: '', movieType: 'SERIES',
    genres: [], tags: [], seasons: []
  });

  // Hàng đợi cục bộ để trích xuất thumbnail tránh treo máy
  private videoQueue: { file: File, callback: (res: { duration: number, thumbnail: string }) => void }[] = [];
  private isProcessingVideo = false;

  // =========================================================================
  // REGION 2: LIFECYCLE VÀ KHỞI TẠO
  // =========================================================================
  ngOnInit() {
    this.renderer.addClass(this.document.body, 'hide-admin-sidebar');

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode.set(true);
      this.movieId.set(Number(idParam));
      this.fetchMovieDetail(Number(idParam));
    } else {
      this.initNewMovie();
    }
  }

  ngOnDestroy() {
    this.renderer.removeClass(this.document.body, 'hide-admin-sidebar');
    if (this.movieForm().posterUrl.startsWith('blob:')) URL.revokeObjectURL(this.movieForm().posterUrl);
    if (this.movieForm().bannerUrl.startsWith('blob:')) URL.revokeObjectURL(this.movieForm().bannerUrl);
  }

  // =========================================================================
  // REGION 3: GIAO TIẾP MẠNG (API CALLS & UPLOAD LOGIC)
  // =========================================================================

  // 3.2 Fetch data Edit phim
  fetchMovieDetail(id: number) {
    this.adminMovieService.getMovieById(id).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.movieForm.set(res.data);
        }
      },
      error: (err) => console.error('Lỗi khi tải chi tiết phim:', err)
    });
  }
  // 3.3 Khối hàm Upload Media qua Cloudinary
  async processMediaUploads(): Promise<void> {
    const form = this.movieForm();

    if (form.posterFile) {
      const res = await this.mediaService.uploadToCloudinary(form.posterFile, 'image');
      form.posterUrl = res.secure_url;
      form.posterFile = undefined;
    }
    if (form.bannerFile) {
      const res = await this.mediaService.uploadToCloudinary(form.bannerFile, 'image');
      form.bannerUrl = res.secure_url;
      form.bannerFile = undefined;
    }

    if (form.movieType === 'SINGLE' && form.videoFile) {
      const res = await this.mediaService.uploadToCloudinary(form.videoFile, 'video');
      form.videoUrl = res.secure_url;
      // FIX: Giữ nguyên số giây, không chia 60 nữa
      form.duration = Math.round(res.duration || 0);
      form.videoFile = undefined;
    }

    if (form.movieType === 'SERIES') {
      for (const season of form.seasons) {
        for (const ep of season.episodes) {
          if (ep.videoFile) {
            const res = await this.mediaService.uploadToCloudinary(ep.videoFile, 'video');
            ep.videoUrl = res.secure_url;
            // FIX: Giữ nguyên số giây
            ep.duration = Math.round(res.duration || 0);
            ep.videoFile = undefined;
          }
        }
      }
    }
    this.movieForm.set(form);
  }

  // 3.4 Gửi dữ liệu Payload cuối cùng lên Backend
  async saveMovie() {
    const form = this.movieForm();
    if (!form.title || (!form.posterUrl && !form.posterFile)) {
      alert('Vui lòng nhập Tên phim và chọn Poster (Bắt buộc)!'); return;
    }

    this.isUploadingData.set(true);

    try {
      // 1. Upload Media lên Cloudinary
      await this.processMediaUploads();

      // 2. Clone payload để format dữ liệu trước khi gửi
      const finalPayload: any = { ...this.movieForm() };

      // Xóa các file local không cần gửi lên API
      delete finalPayload.posterFile;
      delete finalPayload.bannerFile;
      delete finalPayload.videoFile;
      delete finalPayload.thumbnailUrl; // Xóa thumbnail top-level của phim lẻ

      // 3. Format riêng cho Phim Lẻ (SINGLE): Đưa videoUrl và duration vào mảng seasons
      if (finalPayload.movieType === 'SINGLE') {
        finalPayload.seasons = [
          {
            seasonNumber: 1,
            title: 'Phần 1',
            episodes: [
              {
                episodeNumber: 1,
                title: finalPayload.title || 'Tập 1',
                description: finalPayload.description || '',
                videoUrl: finalPayload.videoUrl || '',
                duration: finalPayload.duration || 0
              }
            ]
          }
        ];

        // Sau khi đã đưa vào tập phim, xóa 2 trường này ở lớp ngoài cùng
        delete finalPayload.videoUrl;
        delete finalPayload.duration;
      }

      // 4. Lọc bỏ thumbnailUrl và videoFile ra khỏi TẤT CẢ các tập phim (Áp dụng cho cả SERIES và SINGLE)
      if (finalPayload.seasons && finalPayload.seasons.length > 0) {
        finalPayload.seasons = finalPayload.seasons.map((season: any) => ({
          ...season,
          episodes: season.episodes.map((ep: any) => {
            const epCopy = { ...ep };
            delete epCopy.thumbnailUrl; // Loại bỏ thumbnail trước khi lưu DB
            delete epCopy.videoFile;
            return epCopy;
          })
        }));
      }

      console.log('Payload gửi lên API:', finalPayload);

      // 5. Gửi API
      if (this.isEditMode() && this.movieId()) {
        await firstValueFrom(this.adminMovieService.updateMovie(this.movieId()!, finalPayload));
        alert('Cập nhật phim thành công!');
      } else {
        await firstValueFrom(this.adminMovieService.createMovie(finalPayload));
        alert('Thêm phim mới thành công!');
      }

      this.router.navigate(['/admin/movies']);
    } catch (error) {
      alert('Đã xảy ra lỗi trong quá trình upload hoặc lưu dữ liệu!');
      console.error(error);
    } finally {
      this.isUploadingData.set(false);
    }
  }

  // =========================================================================
  // REGION 4: XỬ LÝ DỮ LIỆU LOGIC (DATA MANIPULATION)
  // =========================================================================
  initNewMovie() {
    this.movieForm.update(form => ({ ...form, seasons: [{ seasonNumber: 1, title: 'Phần 1', episodes: [this.createNewEpisode(1)] }] }));
  }

  createNewEpisode(episodeNumber: number): EpisodeForm {
    return { episodeNumber, title: `Tập ${episodeNumber}`, description: '', videoUrl: '', thumbnailUrl: '', duration: 0 };
  }

  // Xử lý Thể loại / Tag
  removeGenre(id: number) { this.movieForm.update(f => ({ ...f, genres: f.genres.filter(g => g.id !== id) })); }
  removeTag(id: number) { this.movieForm.update(f => ({ ...f, tags: f.tags.filter(t => t.id !== id) })); }
  toggleGenre(genre: any) {
    const c = this.movieForm().genres;
    if (c.find(g => g.id === genre.id)) this.removeGenre(genre.id);
    else this.movieForm.update(f => ({ ...f, genres: [...c, genre] }));
  }

  toggleTag(tag: any) {
    const c = this.movieForm().tags;
    if (c.find(t => t.id === tag.id)) this.removeTag(tag.id);
    else this.movieForm.update(f => ({ ...f, tags: [...c, tag] }));
  }

  // Xử lý Quản lý Phim Bộ
  addSeason() {
    this.movieForm.update(form => {
      const newSeasonNum = form.seasons.length > 0 ? Math.max(...form.seasons.map(s => s.seasonNumber)) + 1 : 1;
      form.seasons.push({ seasonNumber: newSeasonNum, title: `Phần ${newSeasonNum}`, episodes: [this.createNewEpisode(1)] });
      return { ...form };
    });
    this.selectedSeasonIndex.set(this.movieForm().seasons.length - 1);
    this.selectedEpisodeIndex.set(0);
  }

  addEpisode() {
    this.movieForm.update(form => {
      const season = form.seasons[this.selectedSeasonIndex()];
      const newEpNum = season.episodes.length > 0 ? Math.max(...season.episodes.map(e => e.episodeNumber)) + 1 : 1;
      season.episodes.push(this.createNewEpisode(newEpNum));
      return { ...form };
    });
    this.selectedEpisodeIndex.set(this.movieForm().seasons[this.selectedSeasonIndex()].episodes.length - 1);
  }

  // =========================================================================
  // REGION 5: HELPERS CHO GIAO DIỆN (UI EVENTS & FORMATTING)
  // =========================================================================

  // 5.1 Computed Variables cho View HTML
  currentEpisode = computed(() => {
    const form = this.movieForm();
    if (form.movieType === 'SERIES' && form.seasons.length > 0) {
      const season = form.seasons[this.selectedSeasonIndex()];
      if (season && season.episodes.length > 0) return season.episodes[this.selectedEpisodeIndex()];
    }
    return null;
  });

  displayBanner = computed(() => {
    const banner = this.movieForm().bannerUrl;
    return banner && banner.trim() !== '' ? banner : (this.movieForm().posterUrl || 'assets/images/default-banner.jpg');
  });

  isGenreSelected(id: number) { return this.movieForm().genres.some(g => g.id === id); }
  isTagSelected(id: number) { return this.movieForm().tags.some(t => t.id === id); }
  selectSeason(index: number) { this.selectedSeasonIndex.set(index); this.selectedEpisodeIndex.set(0); }
  selectEpisode(index: number) { this.selectedEpisodeIndex.set(index); }

  // 5.2 Xử lý Drag/Drop Files cục bộ
  onDragOver(event: DragEvent, type: 'poster' | 'banner' | 'video') { event.preventDefault(); this.dragState.update(s => ({ ...s, [type]: true })); }
  onDragLeave(event: DragEvent, type: 'poster' | 'banner' | 'video') { event.preventDefault(); this.dragState.update(s => ({ ...s, [type]: false })); }
  onDrop(event: DragEvent, type: 'poster' | 'banner' | 'video', episode?: EpisodeForm) {
    event.preventDefault(); this.dragState.update(s => ({ ...s, [type]: false }));
    if (type === 'poster') this.onPosterSelected(event);
    else if (type === 'banner') this.onBannerSelected(event);
    else if (type === 'video') this.onVideoSelected(event, episode);
  }

  onPosterSelected(event: any) {
    const file = event.target?.files?.[0] || event.dataTransfer?.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const objectUrl = URL.createObjectURL(file);
    if (this.movieForm().posterUrl.startsWith('blob:')) URL.revokeObjectURL(this.movieForm().posterUrl);
    this.movieForm.update(f => ({ ...f, posterFile: file, posterUrl: objectUrl }));
  }

  onBannerSelected(event: any) {
    const file = event.target?.files?.[0] || event.dataTransfer?.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const objectUrl = URL.createObjectURL(file);
    if (this.movieForm().bannerUrl.startsWith('blob:')) URL.revokeObjectURL(this.movieForm().bannerUrl);
    this.movieForm.update(f => ({ ...f, bannerFile: file, bannerUrl: objectUrl }));
  }

  // 5.3 Queue xử lý Video trích xuất Thumbnail cục bộ
  onVideoSelected(event: any, episode?: EpisodeForm) {
    const file = event.target?.files?.[0] || event.dataTransfer?.files?.[0];
    if (!file || !file.type.startsWith('video/')) return;

    this.queueVideoProcessing(file, (res) => {
      const objectUrl = URL.createObjectURL(file);
      if (episode) {
        // Bổ sung thumbnailUrl: res.thumbnail
        episode.videoFile = file; episode.videoUrl = objectUrl; episode.duration = res.duration; episode.thumbnailUrl = res.thumbnail;
        this.movieForm.update(f => ({ ...f }));
      } else {
        // Bổ sung thumbnailUrl: res.thumbnail
        this.movieForm.update(f => ({ ...f, videoFile: file, videoUrl: objectUrl, duration: res.duration, thumbnailUrl: res.thumbnail }));
      }
    });
  }

  removePoster(event: Event) { event.stopPropagation(); this.movieForm.update(f => ({ ...f, posterUrl: '', posterFile: undefined })); }
  removeBanner(event: Event) { event.stopPropagation(); this.movieForm.update(f => ({ ...f, bannerUrl: '', bannerFile: undefined })); }
  removeVideo(episode?: EpisodeForm) {
    if (episode) {
      episode.videoFile = undefined; episode.videoUrl = ''; episode.duration = 0; episode.thumbnailUrl = '';
    }
    else {
      this.movieForm.update(f => ({ ...f, videoFile: undefined, videoUrl: '', duration: 0, thumbnailUrl: '' }));
    }
  }

  // 5.4 Context Menu Logic (Chuột phải)
  @HostListener('document:click')
  onDocumentClick() { if (this.contextMenu().visible) this.closeContextMenu(); }

  openContextMenu(event: MouseEvent, type: 'season' | 'episode', seasonIndex: number, episodeIndex?: number) {
    event.preventDefault(); this.contextMenu.set({ visible: true, x: event.clientX, y: event.clientY, type, seasonIndex, episodeIndex });
  }
  closeContextMenu() { this.contextMenu.update(c => ({ ...c, visible: false })); }

  deleteFromContextMenu() {
    const ctx = this.contextMenu();
    if (ctx.type === 'season' && confirm(`Xóa phần này?`)) {
      this.movieForm.update(form => { form.seasons.splice(ctx.seasonIndex, 1); return { ...form }; });
      this.selectedSeasonIndex.set(Math.max(0, this.movieForm().seasons.length - 1));
      this.selectedEpisodeIndex.set(0);
    } else if (ctx.type === 'episode' && confirm('Xóa tập phim này?')) {
      this.movieForm.update(form => { form.seasons[ctx.seasonIndex].episodes.splice(ctx.episodeIndex!, 1); return { ...form }; });
    }
    this.closeContextMenu();
  }

  // Helper cho xử lý metadata Video Cục Bộ
  private queueVideoProcessing(file: File, callback: (res: { duration: number, thumbnail: string }) => void) {
    this.videoQueue.push({ file, callback });
    this.processNextVideo();
  }

  private async processNextVideo() {
    if (this.isProcessingVideo || this.videoQueue.length === 0) return;
    this.isProcessingVideo = true;
    const task = this.videoQueue.shift()!;
    try {
      const result = await this.extractVideoMetadata(task.file);
      task.callback(result);
    } catch (err) { console.error(err); }
    this.isProcessingVideo = false;
    this.processNextVideo();
  }

  private extractVideoMetadata(file: File): Promise<{ duration: number, thumbnail: string }> {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.src = URL.createObjectURL(file);

      video.onloadedmetadata = () => {
        // Tua tới giây số 1 hoặc giữa video để lấy frame ảnh
        video.currentTime = Math.min(1, video.duration / 2);
      };

      video.onseeked = () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext('2d');
        ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);

        // 1. Tạo lại ảnh Thumbnail dạng Base64 để hiển thị lên khung HTML cục bộ
        const thumbnail = canvas.toDataURL('image/jpeg', 0.6);

        // 2. FIX: Lấy thời lượng tính bằng giây thay vì chia 60
        const durationSec = Math.round(video.duration);

        URL.revokeObjectURL(video.src);
        resolve({ duration: durationSec, thumbnail: thumbnail });
      };

      video.onerror = (e) => reject(e);
    });
  }
}