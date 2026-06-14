import { RoleType } from '../../enums/role-type.enum';

export interface DistrictAdminResponse {
  id: number;
  name: string;
  mobile: string;
  email: string;

  role: RoleType;
  status: string; // AdminStatus → string rakh sakte ho

  stateName: string;
  districtName: string;

  isActive: boolean;
  isDeleted: boolean;

  createdAt: string;  // LocalDateTime → string
  updatedAt: string;  // LocalDateTime → string
}