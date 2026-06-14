 // src/app/models/auth/response/page-response.dto.ts
export interface PageResponse<T> {
  content: T[];          // List of items
  pageNumber: number;    // Current page number
  pageSize: number;      // Number of items per page
  totalPages: number;    // Total pages
  isLast: boolean;       // Is last page?
  totalElements: number; // Total number of items
}