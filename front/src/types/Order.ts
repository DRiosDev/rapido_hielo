export interface Order {
  id: string;
  key?: string | number;
  number_order: number;
  total: number;
  total_quantity: number;
  status: "pending_payment" | "paid" | "canceled" | "payment_under_review";
  created_at_show?: string;
}
