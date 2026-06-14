// ================= UPDATE TEACHER DTO =================
export interface TeacherUpdateRequest {
  name: string;
  email: string;
  mobile: string;
  password?: string; // optional

  designation: string;
  qualification: string;
  subject: string;
}