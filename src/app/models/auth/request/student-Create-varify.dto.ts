import { Gender } from "app/models/enums/Gender.enum";
export interface StudentVerifyOtpRequestDto {

  email: string;
  otp: string;

  password: string;

  schoolId: number;

  studentClassId: number;

  sectionId: number;

  academicYearId: number;   // 🔥 REQUIRED (tumhare JSON me hai)

  gender:Gender
}