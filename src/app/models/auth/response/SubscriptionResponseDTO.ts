export interface SubscriptionResponseDTO {
  id: number;

  // 🔥 School data
  schoolId: number;
  schoolName: string;

  // 🔥 Optional (backend se aa raha hai)
  districtName: string;

  // 🔗 Plan
  planId: number;
  planName: string;

  // 💰 Amount
  amount: number;

  // 📅 Dates
  startDate: string;
  endDate: string;

  // ⚙️ Status
  status: string;
}