import { NoticeTarget } from 'app/models/enums/Notice-Target.enum';

export interface NoticeRequest {
  schoolId: number;
  classId?: number;
  sectionId?: number;

  title: string;
  description: string;

  noticeFor: NoticeTarget;

  isActive?: boolean;

  startDate: string;   // LocalDate → string (yyyy-MM-dd)
  endDate: string;
}