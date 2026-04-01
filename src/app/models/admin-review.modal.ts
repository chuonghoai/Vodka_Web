export interface AdminReview {
  id: number;
  userName: string;
  avatarUrl?: string;
  rating: number;
  content: string;
  createdAt: string;          
  movieId: number;           
  movieTitle: string;         
  replied?: AdminReply[];
}

export interface AdminReply {
  id: number;
  userName: string;
  avatarUrl?: string;
  content: string;
  createdAt: string;
}

export interface ReviewStats {
  totalReviews: number;         
  averageRating: number;        
  moviesWithReviews: number;    
  totalReplies: number;         
  trends: {
    reviewsTrendPercent: number;  
    repliesTrendPercent: number;  
  };
}


export interface AdminReplyRequest {
  content: string;
}

export interface CreateReviewRequest {
  movieId: number;
  rating: number;
  content: string;
}