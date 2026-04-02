import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment.development";
import { AdminReply, AdminReplyRequest, AdminReview, CreateReviewRequest, ReviewStats } from "../../models/admin-review.modal";
import { ApiResponse } from "../../models/api-response.model";
import { API_ENDPOINTS } from "../api-endpoints/api.endpoints";

@Injectable({ providedIn: 'root' })
export class AdminReviewService {
    private http = inject(HttpClient);
    private baseUrl = environment.apiUrl;

    /**
     * Admin Get All Review → Lấy danh sách review kèm phân trang, tìm kiếm, lọc theo rating và sắp xếp
     * GET: /api/admin/reviews?page=&pageSize=&search=&rating=&sort=
     */
    getReviews(params: {
        page: number;
        pageSize: number;
        search?: string;
        rating?: string;
        sort?: string;

    }): Observable<ApiResponse<AdminReview[]>> {
        let httpParams = new HttpParams();
        if (params.page) httpParams = httpParams.set('page', params.page.toString());
        if (params.pageSize) httpParams = httpParams.set('pageSize', params.pageSize.toString());
        if (params.search) httpParams = httpParams.set('search', params.search);
        if (params.rating && params.rating !== 'all') {
            httpParams = httpParams.set('rating', params.rating);
        }
        if (params.sort) httpParams = httpParams.set('sort', params.sort);

        return this.http.get<ApiResponse<AdminReview[]>>(
            `${this.baseUrl}${API_ENDPOINTS.ADMIN.REVIEWS}`, { params }
        )
    }


    /**
     * Get Stats Review: Lấy thông kê về hệ thống review
     * GET: /api/admin/reviews/stats
     */
    getReviewStats(): Observable<ApiResponse<ReviewStats>> {
        return this.http.get<ApiResponse<ReviewStats>>(
            `${this.baseUrl}${API_ENDPOINTS.ADMIN.REVIEW_STATS}`
        )
    }

    /**
     * Admin Delete Review: Xóa toàn bộ của một review gốc (Bao gồm các repies tương ứng)
     * DELETE: /api/admin/reviews/:id
     */
    deleteReview(id: number): Observable<ApiResponse<void>> {
        return this.http.delete<ApiResponse<void>>(
            `${this.baseUrl}${API_ENDPOINTS.ADMIN.REVIEW_BY_ID(id)}`
        )
    }

    /**
     * Admin Delete Reply By Id: Chỉ xóa 1 reply của một review gốc
     * DELETE: /api/admin/reviews/replies/:id
     */
    deleteReply(id: number): Observable<ApiResponse<void>> {
        return this.http.delete<ApiResponse<void>>(
            `${this.baseUrl}${API_ENDPOINTS.ADMIN.REPLY_BY_ID(id)}`
        )
    }

    /**
     * Admin Reply Review: Admin trả lời trực tiếp một review từ giao diện User/Guest
     * POST: /api/admin/reviews/:id/reply
     */
    replyToReview(id: number, data: AdminReplyRequest): Observable<ApiResponse<AdminReply>> {
        return this.http.post<ApiResponse<AdminReply>>(
            `${this.baseUrl}${API_ENDPOINTS.ADMIN.REVIEW_REPLY(id)}`,
            data
        )
    }

    /**
     * Admin Create Review: Admin tự đăng review bằng Account Admin
     * POST: /api/admin/reviews
     */
    createReview(data: CreateReviewRequest): Observable<ApiResponse<AdminReview>> {
        return this.http.post<ApiResponse<AdminReview>>(
            `${this.baseUrl}${API_ENDPOINTS.ADMIN.CREATE_REVIEW}`, data
        )
    }

}