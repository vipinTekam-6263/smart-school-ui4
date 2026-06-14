export interface DistrictResponse {
  id: number;
  districtName: string;
  stateId: number;
  stateName?: string; // optional (agar backend bhej raha hai)
}