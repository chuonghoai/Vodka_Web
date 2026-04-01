import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment.development";
import { ApiResponse } from "../models/api-response.model";
import { CreateTagRequest, TagDetail, TagStats, UpdateTagRequest } from "../models/tag.model";
import { API_ENDPOINTS } from "./api-endpoints/api.endpoints";

@Injectable({providedIn: 'root'})
export class TagService {

    private http = inject(HttpClient)
    private baseUrl = environment.apiUrl;

    /**
     * Admin Get All Tags
     * GET: /api/admin/tags
     */
    getTags(params:{
        page: number;
        pageSize: number;
        search?: string;
        sort?: string;
    }): Observable<ApiResponse<TagDetail[]>> {

        let httpParams = new HttpParams();
        if (params.page) httpParams = httpParams.set('page', params.page.toString());
        if (params.pageSize) httpParams = httpParams.set('pageSize', params.pageSize.toString());
        if (params.search) httpParams = httpParams.set('search', params.search);
        if (params.sort) httpParams = httpParams.set('sort', params.sort);

        return this.http.get<ApiResponse<TagDetail[]>>(
            `${this.baseUrl}/api/admin/tags`, {params}
        );
    }

    /**
     * Admin Stats Tag
     * GET: /api/admin/tags/stats
     */
    getTagStats(): Observable<ApiResponse<TagStats>>{
        return this.http.get<ApiResponse<TagStats>>(
            `${this.baseUrl}${API_ENDPOINTS.ADMIN.TAG_STATS}`
        )
    }

    /**
     * Admin Create Tag
     * POST: /api/admin/tags
     */
    createTag(data: CreateTagRequest): Observable<ApiResponse<TagDetail>> {
        return this.http.post<ApiResponse<TagDetail>>(
            `${this.baseUrl}${API_ENDPOINTS.ADMIN.TAGS}`, data
        );
    }

    /**
     * Admin Update Tag
     * PUT: /api/admin/tags/:id
     */

    updateTag(id: number, data: UpdateTagRequest): Observable<ApiResponse<TagDetail>>{
        return this.http.put<ApiResponse<TagDetail>>(
            `${this.baseUrl}${API_ENDPOINTS.ADMIN.TAG_BY_ID(id)}`,
            data
        )
    }

    /**
     * Admin Delete Tag
     */

    deleteTag(id: number): Observable<ApiResponse<void>>{
        return this.http.delete<ApiResponse<void>>(
            `${this.baseUrl}${API_ENDPOINTS.ADMIN.TAG_BY_ID(id)}`
        )
    }



}