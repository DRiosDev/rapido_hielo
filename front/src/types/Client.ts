export interface Client {
  id: string;
  key?: string | number;
  rut: string;
  name: string;
  lastname: string;
  email: string;
  address: string;
  status: "active" | "desactive";
  created_at_show?: string;
}
