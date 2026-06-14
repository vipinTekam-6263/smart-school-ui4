export interface AttendanceResponseDto {
  id: number;
  attendanceDate: string;
  status: string;
  remarks: string;
  studentClassId: number;
studentId:number;
  sectionId: number;   // 🔥 ADD THIS
  // 🔥 ADD THESE
  studentName: string;
  rollNumber: string;
}