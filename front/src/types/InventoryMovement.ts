import { Product } from "./Product";
import { User } from "./User";

export interface InventoryMovement {
  id: string;
  key?: string;
  fk_product_id: string;
  fk_user_id?: string;
  action: "add" | "subtract" | "adjustment";
  quantity: number;
  previous_stock: number;
  new_stock: number;
  reason?: string;
  created_at_show: string;
  product?: Product;
  user?: User;
}
