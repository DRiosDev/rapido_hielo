export interface User {
  id: string;
  key?: string | number;
  name: string;
  lastname: string;
  email: string;
  status: "active" | "desactive";
  created_at_show?: string;
  role: string;
}
