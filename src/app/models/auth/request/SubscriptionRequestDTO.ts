export interface SubscriptionRequestDTO {
  schoolId: number;   // 🔥 replace
  planId: number;
  startDate: string;
  endDate: string;
  status?: string;
}