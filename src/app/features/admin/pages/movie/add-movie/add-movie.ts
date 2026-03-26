import { Component, OnInit, signal, computed, inject, OnDestroy, Renderer2, HostListener } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

interface EpisodeForm {
  id?: number;
  episodeNumber: number;
  title: string;
  description: string;
  videoUrl: string;       
  videoFile?: File;       
  thumbnailUrl: string;
  duration: number;
}

interface SeasonForm {
  id?: number;
  seasonNumber: number;
  title: string;
  episodes: EpisodeForm[];
}

interface MovieForm {
  id?: number;
  title: string;
  description: string;
  releaseYear: number;
  posterUrl: string;
  bannerUrl: string;
  posterFile?: File; 
  bannerFile?: File; 
  movieType: 'SINGLE' | 'SERIES';
  genres: any[];
  tags: any[];
  videoUrl?: string;
  videoFile?: File;
  duration?: number;
  seasons: SeasonForm[];
}

interface ContextMenuState {
  visible: boolean; x: number; y: number; type: 'season' | 'episode' | null; seasonIndex: number; episodeIndex?: number;
}

@Component({
  selector: 'app-add-movie',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './add-movie.html',
})
export class AddMovieComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private renderer = inject(Renderer2);
  private document = inject(DOCUMENT);

  isEditMode = signal<boolean>(false);
  movieId = signal<number | null>(null);

  movieForm = signal<MovieForm>({
    title: '', description: '', releaseYear: new Date().getFullYear(),
    posterUrl: '', bannerUrl: '', movieType: 'SERIES',
    genres: [], tags: [], seasons: []
  });

  selectedSeasonIndex = signal<number>(0);
  selectedEpisodeIndex = signal<number>(0);
  showGenreModal = signal(false);
  showTagModal = signal(false);
  contextMenu = signal<ContextMenuState>({ visible: false, x: 0, y: 0, type: null, seasonIndex: -1 });

  // State hỗ trợ UX
  dragState = signal({ poster: false, banner: false, video: false });
  zoomedImage = signal<string | null>(null);

  availableGenres = signal<{id: number, name: string}[]>([
    { id: 1, name: 'Hành động' }, { id: 2, name: 'Tâm lý' }, { id: 3, name: 'Kinh dị' }, { id: 4, name: 'Viễn tưởng' }
  ]);
  availableTags = signal<{id: string, name: string}[]>([
    { id: 'phim-bo', name: 'Phim bộ' }, { id: 'phim-le', name: 'Phim lẻ' }, { id: 'chieu-rap', name: 'Chiếu rạp' }, { id: 'doc-quyen', name: 'Độc quyền' }
  ]);

  private videoQueue: { file: File, callback: (res: { duration: number, thumbnail: string }) => void }[] = [];
  private isProcessingVideo = false;

  currentEpisode = computed(() => {
    const form = this.movieForm();
    if (form.movieType === 'SERIES' && form.seasons.length > 0) {
      const season = form.seasons[this.selectedSeasonIndex()];
      if (season && season.episodes.length > 0) {
        return season.episodes[this.selectedEpisodeIndex()];
      }
    }
    return null;
  });

  displayBanner = computed(() => {
    const banner = this.movieForm().bannerUrl;
    const poster = this.movieForm().posterUrl;
    return banner && banner.trim() !== '' ? banner : (poster || 'assets/images/default-banner.jpg');
  });

  ngOnInit() {
    this.renderer.addClass(this.document.body, 'hide-admin-sidebar');
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode.set(true);
      this.movieId.set(Number(idParam));
      this.loadMockDataForEdit(Number(idParam));
    } else {
      this.initNewMovie();
    }
  }

  ngOnDestroy() {
    this.renderer.removeClass(this.document.body, 'hide-admin-sidebar');
    if (this.movieForm().posterUrl.startsWith('blob:')) URL.revokeObjectURL(this.movieForm().posterUrl);
    if (this.movieForm().bannerUrl.startsWith('blob:')) URL.revokeObjectURL(this.movieForm().bannerUrl);
  }

  @HostListener('document:click')
  onDocumentClick() { if (this.contextMenu().visible) this.closeContextMenu(); }

  initNewMovie() {
    this.movieForm.update(form => ({ ...form, seasons: [{ seasonNumber: 1, title: 'Phần 1', episodes: [this.createNewEpisode(1)] }] }));
  }

  createNewEpisode(episodeNumber: number): EpisodeForm {
    return { episodeNumber, title: `Tập ${episodeNumber}`, description: '', videoUrl: '', thumbnailUrl: '', duration: 0 };
  }

  loadMockDataForEdit(id: number) {
    const mockData: MovieForm = {
      id: id, title: 'Stranger Things', description: 'Một nhóm bạn trẻ phát hiện ra những bí ẩn siêu nhiên tại thị trấn Hawkins.',
      releaseYear: 2016, posterUrl: 'https://picsum.photos/300/450', bannerUrl: 'https://picsum.photos/1200/400',
      movieType: 'SERIES', genres: [{ id: 4, name: 'Viễn tưởng' }], tags: [{ id: 'phim-bo', name: 'Phim bộ' }],
      seasons: [{ id: 101, seasonNumber: 1, title: 'Phần 1', episodes: [{ id: 1001, episodeNumber: 1, title: 'Sự biến mất của Will Byers', description: 'Will biến mất...', videoUrl: 'https://video.url/ep1.mp4', thumbnailUrl: 'https://picsum.photos/seed/ep1/200/100', duration: 45 }] }]
    };
    this.movieForm.set(mockData);
  }

  /* ---- LOGIC CHỌN/KÉO THẢ & QUẢN LÝ ẢNH ---- */
  onDragOver(event: DragEvent, type: 'poster' | 'banner' | 'video') {
    event.preventDefault(); this.dragState.update(s => ({ ...s, [type]: true }));
  }
  onDragLeave(event: DragEvent, type: 'poster' | 'banner' | 'video') {
    event.preventDefault(); this.dragState.update(s => ({ ...s, [type]: false }));
  }
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

  removePoster(event: Event) {
    event.stopPropagation();
    if (this.movieForm().posterUrl.startsWith('blob:')) URL.revokeObjectURL(this.movieForm().posterUrl);
    this.movieForm.update(f => ({ ...f, posterUrl: '', posterFile: undefined }));
  }

  removeBanner(event: Event) {
    event.stopPropagation();
    if (this.movieForm().bannerUrl.startsWith('blob:')) URL.revokeObjectURL(this.movieForm().bannerUrl);
    this.movieForm.update(f => ({ ...f, bannerUrl: '', bannerFile: undefined }));
  }

  /* ---- CONTEXT MENU LOGIC ---- */
  openContextMenu(event: MouseEvent, type: 'season' | 'episode', seasonIndex: number, episodeIndex?: number) {
    event.preventDefault(); this.contextMenu.set({ visible: true, x: event.clientX, y: event.clientY, type, seasonIndex, episodeIndex });
  }
  closeContextMenu() { this.contextMenu.update(c => ({ ...c, visible: false })); }
  deleteFromContextMenu() {
    const ctx = this.contextMenu();
    if (ctx.type === 'season') {
      if (confirm(`Xóa toàn bộ Phần ${this.movieForm().seasons[ctx.seasonIndex].seasonNumber} và các tập phim bên trong?`)) {
        this.movieForm.update(form => { form.seasons.splice(ctx.seasonIndex, 1); return { ...form }; });
        this.selectedSeasonIndex.set(Math.max(0, this.movieForm().seasons.length - 1));
        this.selectedEpisodeIndex.set(0);
      }
    } else if (ctx.type === 'episode' && ctx.episodeIndex !== undefined) {
      if (confirm('Xóa tập phim này?')) {
        this.movieForm.update(form => { form.seasons[ctx.seasonIndex].episodes.splice(ctx.episodeIndex!, 1); return { ...form }; });
      }
    }
    this.closeContextMenu();
  }

  /* ---- LOGIC THỂ LOẠI & TAG ---- */
  removeGenre(id: number) { this.movieForm.update(f => ({ ...f, genres: f.genres.filter(g => g.id !== id) })); }
  removeTag(id: string) { this.movieForm.update(f => ({ ...f, tags: f.tags.filter(t => t.id !== id) })); }
  toggleGenre(genre: any) { const c = this.movieForm().genres; const e = c.find(g => g.id === genre.id); if (e) this.removeGenre(genre.id); else this.movieForm.update(f => ({ ...f, genres: [...c, genre] })); }
  toggleTag(tag: any) { const c = this.movieForm().tags; const e = c.find(t => t.id === tag.id); if (e) this.removeTag(tag.id); else this.movieForm.update(f => ({ ...f, tags: [...c, tag] })); }
  isGenreSelected(id: number) { return this.movieForm().genres.some(g => g.id === id); }
  isTagSelected(id: string) { return this.movieForm().tags.some(t => t.id === id); }

  /* ---- SEASON / EPISODE LOGIC ---- */
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
  selectSeason(index: number) { this.selectedSeasonIndex.set(index); this.selectedEpisodeIndex.set(0); }
  selectEpisode(index: number) { this.selectedEpisodeIndex.set(index); }

  /* ---- XỬ LÝ VIDEO BẰNG QUEUE ---- */
  onVideoSelected(event: any, episode?: EpisodeForm) {
    const file = event.target?.files?.[0] || event.dataTransfer?.files?.[0];
    if (!file || !file.type.startsWith('video/')) return;
    
    this.queueVideoProcessing(file, (res) => {
      const objectUrl = URL.createObjectURL(file);
      if (episode) {
        episode.videoFile = file; episode.videoUrl = objectUrl; episode.thumbnailUrl = res.thumbnail; episode.duration = res.duration;
        // FIX BUG: Ép Signal cập nhật để giao diện load ngay Thumbnail & Thời lượng không bị trễ
        this.movieForm.update(f => ({ ...f }));
      } else {
        this.movieForm.update(f => ({ ...f, videoFile: file, videoUrl: objectUrl, duration: res.duration }));
      }
    });
  }

  removeVideo(episode?: EpisodeForm) {
    if (episode) {
      if(episode.videoUrl.startsWith('blob:')) URL.revokeObjectURL(episode.videoUrl);
      episode.videoFile = undefined; episode.videoUrl = ''; episode.thumbnailUrl = ''; episode.duration = 0;
    } else {
      if(this.movieForm().videoUrl?.startsWith('blob:')) URL.revokeObjectURL(this.movieForm().videoUrl!);
      this.movieForm.update(f => ({ ...f, videoFile: undefined, videoUrl: '', duration: 0 }));
    }
  }

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
    } catch (err) { console.error('Lỗi phân tích video:', err); }
    this.isProcessingVideo = false;
    this.processNextVideo(); 
  }
  private extractVideoMetadata(file: File): Promise<{ duration: number, thumbnail: string }> {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata'; video.src = URL.createObjectURL(file);
      video.onloadedmetadata = () => { video.currentTime = Math.min(1, video.duration / 2); };
      video.onseeked = () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth; canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
        const thumbnail = canvas.toDataURL('image/jpeg', 0.6); 
        const durationMin = Math.ceil(video.duration / 60);
        URL.revokeObjectURL(video.src);
        resolve({ duration: durationMin, thumbnail });
      };
      video.onerror = (e) => reject(e);
    });
  }

  saveMovie() {
    const form = this.movieForm();
    if (!form.title || !form.posterUrl) {
      alert('Vui lòng nhập Tên phim và chọn Poster (Bắt buộc)!'); return;
    }
    console.log('Payload Data:', form);
    alert('Lưu thành công! Check console để xem data submit API');
    this.router.navigate(['/admin/movies']);
  }
}