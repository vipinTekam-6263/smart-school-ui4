import { StudentMiniDto } from "./StudentMiniDto";
import { NoticeResponse } from "./Notice-Response.dto";
import { ExamResponseScheduleDTO } from "./Exam-response.dto";
import { HomeworkDto } from "./HomeworkDto";
import { MarksDto } from "./MarksDto";

export interface ParentDashboardDto {

  studentName: string;
  className: string;
  sectionName: string;
  rollNo: string;

  totalDays: number;
  presentDays: number;
  absentDays: number;
  attendancePercentage: number;

  homeworks: HomeworkDto[];

  exams: ExamResponseScheduleDTO[];

  upcomingExamName: string;
  upcomingExamDate: Date;

  results: MarksDto[];

  totalSubjects: number;
  averageMarks: number;

  notices: NoticeResponse[];
  latestNoticeTitle: string;
}