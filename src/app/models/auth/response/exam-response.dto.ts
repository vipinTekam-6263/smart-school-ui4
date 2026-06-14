// exam-schedule.model.ts

export interface ExamResponseScheduleDTO {
  id: number;

  schoolId: number;
  schoolName: string;

  classId: number;
  className: string;

  sectionId: number;
  sectionName: string;

  academicYearId: number;
  academicYearName: string;

  examType: string;

  subject: string;

  examDate: string;

  startTime: string;
  endTime: string;

  maxMarks: number;
  passingMarks: number;

  isActive: boolean;
  marksEntryEnabled: boolean;
  resultPublished: boolean;

  createdBy: number;
  updatedBy: number;
}