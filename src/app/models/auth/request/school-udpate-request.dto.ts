import { SchoolStatus } from "app/models/enums/school-type.enum";
export interface SchoolUpdateRequest {
  schoolName?: string;
  address?: string;
  status?: SchoolStatus;
}