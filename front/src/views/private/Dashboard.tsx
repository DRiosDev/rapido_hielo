import { message, Tag, TableProps } from "antd";
import { SectionPrivateHeader } from "../../components/ui/SectionPrivateHeader";
import {
  CardFirstDataDashboard,
  KpiData,
} from "../../components/ui/CardFirstDataDashboard";
import { IceIcon } from "../../components/ui/icons/IceIcon";
import { WeeklySalesChart } from "../../components/dashboard/WeeklySalesChart";
import { DispatchStatusChart } from "../../components/dashboard/DispatchStatusChart";
import { DashboardTableCard } from "../../components/dashboard/DashboardTableCard";
import { ShoppingBag, AlertTriangle, Trophy, Truck, DollarSign } from "lucide-react";
import { useDashboardData } from "../../services/dashboard/queries";

// Tipos para las tablas
interface TopProduct {
  id: string;
  name: string;
  salesCount: number;
  totalRevenue: number;
}

interface LowStockProduct {
  id: string;
  name: string;
  currentStock: number;
  minStock: number;
  status: "critical" | "warning";
}

interface TopClient {
  id: string;
  name: string;
  totalOrders: number;
  totalSpent: number;
}

const KPI_ICONS: Record<string, React.ReactNode> = {
  revenue: <DollarSign className="size-5 text-emerald-600" />,
  products_sold: <IceIcon className="size-5 text-blue-500" />,
  stock_value: <IceIcon className="size-5 text-cyan-600" />,
  active_dispatches: <Truck className="size-5 text-amber-500" />,
};

export default function Dashboard() {
  const [messageApi, contextHolder] = message.useMessage();

  const { data: dashboardData, isLoading } = useDashboardData();

  // Enriquecer los KPIs con sus íconos correspondientes
  const kpiCards: KpiData[] =
    dashboardData?.kpis?.map((kpi) => ({
      ...kpi,
      icon: KPI_ICONS[kpi.id] || <DollarSign className="size-5 text-gray-500" />,
      loading: isLoading,
    })) || [
      { id: "revenue", title: "Ventas Totales", value: 0, prefix: "$", loading: true },
      { id: "products_sold", title: "Productos Vendidos", value: 0, loading: true },
      { id: "stock_value", title: "Valor del Inventario", value: 0, prefix: "$", loading: true },
      { id: "active_dispatches", title: "Despachos Activos", value: 0, loading: true },
    ];

  // Configuración de Columnas para Tabla 1: Productos Más Vendidos
  const topProductsColumns: TableProps<TopProduct>["columns"] = [
    {
      title: "Producto",
      dataIndex: "name",
      key: "name",
      render: (text) => <span className="font-medium text-slate-700">{text}</span>,
    },
    {
      title: "Vendidos",
      dataIndex: "salesCount",
      key: "salesCount",
      align: "right",
      render: (val) => `${val?.toLocaleString("es-CL") || 0} sacos`,
    },
    {
      title: "Total",
      dataIndex: "totalRevenue",
      key: "totalRevenue",
      align: "right",
      render: (val) => (
        <span className="font-semibold text-emerald-600">
          ${val?.toLocaleString("es-CL") || 0}
        </span>
      ),
    },
  ];

  // Configuración de Columnas para Tabla 2: Productos con Bajo Stock
  const lowStockColumns: TableProps<LowStockProduct>["columns"] = [
    {
      title: "Producto",
      dataIndex: "name",
      key: "name",
      render: (text) => <span className="font-medium text-slate-700">{text}</span>,
    },
    {
      title: "Stock",
      dataIndex: "currentStock",
      key: "currentStock",
      align: "center",
      render: (val, record) => (
        <span className="font-bold">
          {val} <span className="text-gray-400 font-normal">/ {record.minStock}</span>
        </span>
      ),
    },
    {
      title: "Estado",
      dataIndex: "status",
      key: "status",
      align: "right",
      render: (status) =>
        status === "critical" ? (
          <Tag color="red" className="rounded-full px-2 font-medium">
            Crítico
          </Tag>
        ) : (
          <Tag color="orange" className="rounded-full px-2 font-medium">
            Bajo
          </Tag>
        ),
    },
  ];

  // Configuración de Columnas para Tabla 3: Top Clientes
  const topClientsColumns: TableProps<TopClient>["columns"] = [
    {
      title: "Cliente",
      dataIndex: "name",
      key: "name",
      render: (text) => <span className="font-medium text-slate-700">{text}</span>,
    },
    {
      title: "Pedidos",
      dataIndex: "totalOrders",
      key: "totalOrders",
      align: "center",
      render: (val) => <span className="font-semibold">{val}</span>,
    },
    {
      title: "Monto Total",
      dataIndex: "totalSpent",
      key: "totalSpent",
      align: "right",
      render: (val) => (
        <span className="font-semibold text-blue-600">
          ${val?.toLocaleString("es-CL") || 0}
        </span>
      ),
    },
  ];

  return (
    <>
      {contextHolder}
      <SectionPrivateHeader
        title="Panel administrativo"
        subtitle="Resumen general de ventas, inventario, despachos y clientes en tiempo real"
        existsButton={false}
      />

      {/* Grid de KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {kpiCards.map((item) => (
          <CardFirstDataDashboard key={item.id} data={item} />
        ))}
      </div>

      {/* Grid de Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        <div className="lg:col-span-7">
          <WeeklySalesChart
            data={dashboardData?.charts?.weekly_sales}
            loading={isLoading}
          />
        </div>
        <div className="lg:col-span-5">
          <DispatchStatusChart
            data={dashboardData?.charts?.dispatch_status}
            loading={isLoading}
          />
        </div>
      </div>

      {/* Grid de Tablas Resumen */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DashboardTableCard<TopProduct>
          title="Productos más vendidos"
          subtitle="Top ventas reales de este mes"
          icon={<ShoppingBag className="size-5 text-emerald-600" />}
          columns={topProductsColumns}
          dataSource={dashboardData?.tables?.top_products || []}
          loading={isLoading}
        />

        <DashboardTableCard<LowStockProduct>
          title="Bajo stock"
          subtitle="Productos que requieren reabastecimiento"
          icon={<AlertTriangle className="size-5 text-amber-600" />}
          columns={lowStockColumns}
          dataSource={dashboardData?.tables?.low_stock || []}
          loading={isLoading}
        />

        <DashboardTableCard<TopClient>
          title="Top clientes"
          subtitle="Clientes con mayor volumen de compra"
          icon={<Trophy className="size-5 text-blue-600" />}
          columns={topClientsColumns}
          dataSource={dashboardData?.tables?.top_clients || []}
          loading={isLoading}
        />
      </div>
    </>
  );
}




