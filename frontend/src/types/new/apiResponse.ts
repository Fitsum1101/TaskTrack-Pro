export interface ApiResponse<T = unknown, M = unknown> {
	statusCode: number;
	data: T;
	message: string;
	success: boolean;
	meta?: M;
}

export interface PaginationMeta {
	page: number;
	limit: number;
	total: number;
	totalPages: number;
}
