import { axiosInstance } from "../../axios/axiosInstance";
import { KpiData } from "../../components/ui/CardFirstDataDashboard";
import { DailySalesData } from "../../components/dashboard/WeeklySalesChart";
import { DispatchStatusData } from "../../components/dashboard/DispatchStatusChart";

export interface DashboardResponse {
  kpis: KpiData[];
  charts: {
    weekly_sales: DailySalesData[];
    dispatch_status: DispatchStatusData[];
  };
  tables: {
    top_products: Array<{
      id: string;
      name: string;
      salesCount: number;
      totalRevenue: number;
    }>;
    low_stock: Array<{
      id: string;
      name: string;
      currentStock: number;
      minStock: number;
      status: "critical" | "warning";
    }>;
    top_clients: Array<{
      id: string;
      name: string;
      totalOrders: number;
      totalSpent: number;
    }>;
  };
}

export const getDashboardData = async (): Promise<DashboardResponse> => {
  const { data } = await axiosInstance.get("/api/dashboard");
  return data;
};
