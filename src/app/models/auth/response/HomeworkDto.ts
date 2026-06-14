export interface HomeworkDto {
  id: number;
  subject: string;
  description: string;
  dueDate: string;
  remainingDays: number;

  className?: string;
  sectionName?: string;
  teacherName?: string;
}