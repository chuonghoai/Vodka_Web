import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MediaService {

  constructor() { }

  /**
   * Mock API upload ảnh lên Cloudinary
   * Trả về Observable chứa URL ảnh đã upload
   */
  uploadAvatar(base64Image: string): Observable<string> {
    console.log('MediaService: Đang upload ảnh (Base64)...');
    // Giả lập delay 1s
    // TODO: Sẽ cấu hình API upload Cloudinary ở đây sau
    return of(base64Image).pipe(delay(1000));
  }
}
