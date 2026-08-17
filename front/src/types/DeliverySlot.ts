export interface DeliverySlot {
  id: string;
  slot: string;
  status: "active" | "inactive";
  created_at?: string;
  updated_at?: string;
}
