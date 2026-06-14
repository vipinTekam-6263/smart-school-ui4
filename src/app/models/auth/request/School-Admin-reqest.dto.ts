// src/app/models/auth/request/school-admin-registration-request.dto.ts
export interface SchoolAdminRegistrationRequest {
  id: string;             
  name: string;           
  rollNo: string;         
  admissionNo: string;    
  classId: string;        
  sectionId: string;     
  parentPhone: string;   
  dob?: string;           

}