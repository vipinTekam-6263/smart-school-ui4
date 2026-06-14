  import { NoticeResponse } from "./Notice-Response.dto";
  import { ExamResponseScheduleDTO } from "./Exam-response.dto";
  export interface SchoolDashboardStats {
   totalStudents: number;
  totalTeachers: number;

  totalAttendanceToday: number;
  presentToday: number;
  absentToday: number;

  pendingHomework: number;
  activeNotices: number;
  }