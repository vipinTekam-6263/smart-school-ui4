import { Gender } from "app/models/enums/Gender.enum";

export interface StudentRegistrationRequestDto {

  // USER INFO
  name: string;
  email: string;
  mobile: string;
  password: string;

  // SCHOOL INFO
  schoolId: number;

  // ⚠️ IMPORTANT: backend expects STRING (NOT ID)
  studentClass: string;
  section: string;
}