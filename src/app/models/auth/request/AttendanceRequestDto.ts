export interface AttendanceRequestDto {
  studentClassId: number;
  studentId: number;      // 🔥 ADD
  sectionId: number;      // 🔥 ADD
  attendanceDate: string; // YYYY-MM-DD
  status: 'PRESENT' | 'ABSENT';
  remarks?: string;
}