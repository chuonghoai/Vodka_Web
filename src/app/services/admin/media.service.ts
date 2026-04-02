// File: src/app/services/admin/media.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { firstValueFrom } from 'rxjs';
import { CloudinarySignature, CloudinaryUploadResponse } from '../../features/admin/models/cloudinary.model';
import { API_ENDPOINTS } from '../api-endpoints/api.endpoints';

@Injectable({ providedIn: 'root' })
export class MediaService {
    private http = inject(HttpClient);
    private apiUrl = environment.apiUrl;


    /**
     * Admin Get Cloudinary Signature
     * Lấy chữ ký điện tử (Signature) và API Key từ server để client có thể upload trực tiếp lên Cloudinary an toàn
     * GET /api/admin/media/signature
     */
    private async getSignature(): Promise<CloudinarySignature> {
        const response = await firstValueFrom(
            this.http.get<any>(`${this.apiUrl}${API_ENDPOINTS.ADMIN.SIGNATURE}`)
        );
        return response.data;
    }

    /**
     * Upload Data -> Cloudinary
     * Upload trực tiếp file lên Cloudinary, sau khi upload xong sẽ tự động gọi API Confirm để đánh dấu lưu trữ vĩnh viễn (xóa tag temp)
     */
    async uploadToCloudinary(file: File, resourceType: 'image' | 'video', movieId?: number): Promise<CloudinaryUploadResponse> {
        try {
            const sigData = await this.getSignature();

            const formData = new FormData();
            formData.append('file', file);
            formData.append('api_key', sigData.api_key);
            formData.append('timestamp', sigData.timestamp.toString());
            formData.append('signature', sigData.signature);
            formData.append('folder', sigData.folder);
            formData.append('tags', sigData.tags);

            const uploadUrl = `https://api.cloudinary.com/v1_1/${sigData.cloud_name}/${resourceType}/upload`;

            const response = await firstValueFrom(
                this.http.post<CloudinaryUploadResponse>(uploadUrl, formData)
            );

            // Gọi confirm API để xóa tag "tmp" nếu file sẽ không bị CRON xóa
            await this.confirmMedia(response, resourceType, movieId);

            return response;
        } catch (error) {
            console.error('Lỗi khi upload Cloudinary:', error);
            throw error;
        }
    }

    /**
     * Admin Confirm Cloudinary Media
     * Gửi webhook/báo cáo về Server là đã upload lên Cloudinary thành công -> Xóa tag "tmp", lưu trữ CSDL nếu cần
     * POST /api/admin/media/confirm
     */
    private async confirmMedia(
        uploadRes: CloudinaryUploadResponse,
        resourceType: string,
        movieId?: number
    ): Promise<void> {
        try {
            const confirmPayload: any = {
                publicId: uploadRes.public_id,
                secureUrl: uploadRes.secure_url,
                resourceType: resourceType,
                format: uploadRes.format || null,
                width: uploadRes.width || null,
                height: uploadRes.height || null,
                bytes: uploadRes.bytes || null,
                duration: uploadRes.duration || null,
            };

            if (movieId) {
                confirmPayload.movieId = movieId;
            }

            await firstValueFrom(
                this.http.post<any>(`${this.apiUrl}${API_ENDPOINTS.ADMIN.MEDIA_CONFIRM}`, confirmPayload)
            );
        } catch (error) {
            // Log lỗi nhưng không throw — file đã upload thành công,
            console.warn('Không thể confirm media (tag tmp chưa được xóa):', error);
        }
    }
}