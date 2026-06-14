import { ExamType } from '../../enums/exam-type.enum';
export interface ExamScheduleRequest {
  schoolId: number;
  classId: number;
  sectionId: number;
  academicYearId: number;

  examType: ExamType;

  subject: string;

  examDate: string;   // yyyy-MM-dd
  startTime: string;  // HH:mm:ss
  endTime: string;

  maxMarks: number;
  passingMarks?: number;

  isActive?: boolean;
  marksEntryEnabled?: boolean;
  resultPublished?: boolean;
}