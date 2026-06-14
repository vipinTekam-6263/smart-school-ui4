export interface CreateClassRequest {
  name: string;
  isActive?: boolean;
  school: {
    id: number;
  };
}