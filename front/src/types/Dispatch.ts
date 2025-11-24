export interface Dispatch {
  id: string;
  key?: string | number;
  number_order: number;
  total: number;
  total_quantity: number;
  status: "pending_payment" | "paid" | "canceled" | "payment_under_review";
  date_dispatch: Date;
  time_dispatch: string;
  method_payment: number;
  status_dispatch: "pending_dispatch" | "in_route" | "delivered";
  created_at_show?: string;
}
