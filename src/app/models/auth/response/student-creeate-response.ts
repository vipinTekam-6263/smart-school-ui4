import { Gender } from "app/models/enums/Gender.enum";

export interface StudentResponseDto {

  id: number;

  // student basic info
  name: string;
  admissionNo: string;
  dob: string; // LocalDate → string (ISO format in Angular)
  gender: Gender;
  studentClass: string;
  
  sectionId: number;
  schoolId: number;
  rollNo: string;

  // status (you can also create enum later)
  status: string;

  // user info
  userId: number;
  email: string;
  mobile: string;
}