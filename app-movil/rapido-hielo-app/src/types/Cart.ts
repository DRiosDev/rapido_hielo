export interface Cart {
  id: string;
  key?: string | number;
  fk_client_id: string;
  status: "active" | "desactive";
  created_at_show?: string;
}

export interface CartItem {
  id: string;
  key?: string | number;
  fk_product_id: string;
  fk_cart_id: string;
  name_product: string;
  price_product: number;
  quantity_item: number;
  status: "active" | "desactive";
  created_at_show?: string;
}
