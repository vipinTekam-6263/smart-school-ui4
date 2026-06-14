import { HomeworkDto } from './HomeworkDto';
import { NoticeResponse } from './Notice-Response.dto';
import { AttendanceResponseDto } from './AttendanceResponseDto';
import { ExamResponseScheduleDTO } from './Exam-response.dto';
export interface TeacherDashboardResponseDto {
  teacherName: string;
  schoolName: string;
  sectionName: string;

  homeworkList: HomeworkDto[];
  examList: ExamResponseScheduleDTO[];
  noticeList: NoticeResponse[];
  attendanceList: AttendanceResponseDto[];
}