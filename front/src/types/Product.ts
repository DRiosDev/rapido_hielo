export interface Product {
  id: string;
  key?: string | number;
  name: string;
  description: string;
  weight: number;
  price: string;
  quantity: number;
  min_stock?: number;
  is_limited?: boolean;
  is_sack?: boolean;
  status: "active" | "desactive";
  created_at_show?: string;
}
