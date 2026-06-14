// src/app/models/auth/response/school-admin-response.dto.ts
export interface SchoolAdminResponse {
  id: number;

  // User info
  userId: number;
  name: string;
  email: string;
  mobile: string;

  // School info
  schoolId: number;

  // Status
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING'; // AdminStatus enum ke according
}