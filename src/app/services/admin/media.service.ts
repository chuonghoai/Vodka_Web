// File: src/app/services/media.service.ts
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


    // Get signature API key
    private async getSignature(): Promise<CloudinarySignature> {
        const response = await firstValueFrom(
            this.http.get<any>(`${this.apiUrl}${API_ENDPOINTS.ADMIN.SIGNATURE}`)
        );
        return response.data;
    }

    // Upload to cloudinary
    async uploadToCloudinary(file: File, resourceType: 'image' | 'video'): Promise<CloudinaryUploadResponse> {
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

            return response;
        } catch (error) {
            console.error('Lỗi khi upload Cloudinary:', error);
            throw error;
        }
    }
}