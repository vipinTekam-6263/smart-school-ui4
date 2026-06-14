

import { NoticeTarget } from '../../enums/Notice-Target.enum';

export interface NoticeResponse {
  id: number;

  schoolId: number;
  schoolName: string;

  classId?: number;
  className?: string;

  sectionId?: number;
  sectionName?: string;

  title: string;
  description: string;

  noticeFor: NoticeTarget;

  isActive: boolean;

  startDate: string;
  endDate: string;

  createdBy: number;
  updatedBy: number;
}