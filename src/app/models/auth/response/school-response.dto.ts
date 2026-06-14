
import { SchoolStatus } from "app/models/enums/school-type.enum";
export interface SchoolResponse {
  id: number;
  schoolName: string;
  code: string;
  address: string;
  districtId: number;
  status: SchoolStatus;
}