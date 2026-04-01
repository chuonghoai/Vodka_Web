export interface CloudinarySignature {
    signature: string;
    timestamp: number;
    cloud_name: string;
    api_key: string;
    folder: string;
    tags: string;
}

export interface CloudinaryUploadResponse {
    secure_url: string;
    public_id: string;
    duration?: number;
    format?: string;
    width?: number;
    height?: number;
    bytes?: number;
    resource_type?: string;
}