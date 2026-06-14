import { TeacherStatus } from "app/models/enums/TeacherStatus";
export interface TeacherResponse {
  id: number;

  name: string;
  email: string;
  mobile: string;
  schoolId: number;

  designation: string;
  qualification: string;
  subject: string;   // 🔥 ADD THIS

  status: TeacherStatus;
}