export interface School {
  id: number;
  schoolName?: string;
}

export interface SchoolClass {
  id: number;
  name: string;
  isDeleted: boolean;
isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;

  createdBy?: number;
  updatedBy?: number;

  school: School;
}