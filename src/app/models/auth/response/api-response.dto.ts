
export interface apiResponseDto<T>{
  message: string;
  status: boolean;
  data: T;
}

