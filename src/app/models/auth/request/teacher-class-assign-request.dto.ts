export interface TeacherClassAssignRequestDto {

  // 👨‍🏫 Teacher
  teacherId: number;

  // 🏫 Class
  classId: number;

  // 🏫 School
  schoolId: number;

  // 📚 Section
  sectionId: number;

  // 📘 Subject
  subject: string;

  // 📅 Academic Year
  academicYearId: number;
}