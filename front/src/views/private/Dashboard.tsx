import { message, Tag, TableProps } from "antd";
import { SectionPrivateHeader } from "../../components/ui/SectionPrivateHeader";
import {
  CardFirstDataDashboard,
  KpiData,
} from "../../components/ui/CardFirstDataDashboard";
import { AddIcon } from "../../components/ui/icons/AddIcon";
import { IceIcon } from "../../components/ui/icons/IceIcon";
import { WeeklySalesChart } from "../../components/dashboard/WeeklySalesChart";
import { DispatchStatusChart } from "../../components/dashboard/DispatchStatusChart";
import { DashboardTableCard } from "../../components/dashboard/DashboardTableCard";
import { ShoppingBag, AlertTriangle, Trophy } from "lucide-react";

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

export default function Dashboard() {
  const [messageApi, contextHolder] = message.useMessage();

  const kpiCards: KpiData[] = [
    {
      id: "revenue",
      title: "Ventas Totales",
      value: 12450,
      prefix: "$",
      precision: 2,
      trend: 12.5,
      trendText: "vs mes anterior",
      icon: <AddIcon className="size-5" />,
    },
    {
      id: "users",
      title: "Nuevos Usuarios",
      value: 1200,
      trend: 8.2,
      trendText: "vs mes anterior",
      icon: <AddIcon className="size-5" />,
    },
    {
      id: "stock",
      title: "Stock de Hielo",
      value: 450,
      suffix: " sacos",
      trend: -2.4,
      trendText: "vs semana pasada",
      icon: <IceIcon className="size-5" />,
    },
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
      render: (val) => `${val.toLocaleString("es-CL")} sacos`,
    },
    {
      title: "Total",
      dataIndex: "totalRevenue",
      key: "totalRevenue",
      align: "right",
      render: (val) => (
        <span className="font-semibold text-emerald-600">
          ${val.toLocaleString("es-CL")}
        </span>
      ),
    },
  ];

  const topProductsData: TopProduct[] = [
    { id: "1", name: "Hielo Cubo 5kg", salesCount: 1450, totalRevenue: 4350000 },
    { id: "2", name: "Hielo Cubo 2.5kg", salesCount: 980, totalRevenue: 1960000 },
    { id: "3", name: "Hielo Barra 20kg", salesCount: 320, totalRevenue: 2560000 },
    { id: "4", name: "Hielo Picado 10kg", salesCount: 210, totalRevenue: 1260000 },
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

  const lowStockData: LowStockProduct[] = [
    { id: "1", name: "Hielo Picado 10kg", currentStock: 12, minStock: 50, status: "critical" },
    { id: "2", name: "Hielo Cilindro 5kg", currentStock: 38, minStock: 100, status: "warning" },
    { id: "3", name: "Hielo Escamas 15kg", currentStock: 18, minStock: 60, status: "critical" },
    { id: "4", name: "Hielo Gourmet 2kg", currentStock: 45, minStock: 80, status: "warning" },
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
          ${val.toLocaleString("es-CL")}
        </span>
      ),
    },
  ];

  const topClientsData: TopClient[] = [
    { id: "1", name: "Distribuidora Santa Rosa", totalOrders: 42, totalSpent: 5420000 },
    { id: "2", name: "Supermercados El Sol", totalOrders: 31, totalSpent: 4150000 },
    { id: "3", name: "Restobar Costa Marina", totalOrders: 24, totalSpent: 2890000 },
    { id: "4", name: "Eventos VIP Santiago", totalOrders: 18, totalSpent: 2340000 },
  ];

  return (
    <>
      {contextHolder}
      <SectionPrivateHeader
        title="Panel administrativo"
        subtitle="Resumen general de ventas, inventario, despachos y clientes"
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
          <WeeklySalesChart />
        </div>
        <div className="lg:col-span-5">
          <DispatchStatusChart />
        </div>
      </div>

      {/* Grid de Tablas Resumen */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DashboardTableCard<TopProduct>
          title="Productos más vendidos"
          subtitle="Top ventas de este mes"
          icon={<ShoppingBag className="size-5 text-emerald-600" />}
          columns={topProductsColumns}
          dataSource={topProductsData}
        />

        <DashboardTableCard<LowStockProduct>
          title="Bajo stock"
          subtitle="Productos que requieren reabastecimiento"
          icon={<AlertTriangle className="size-5 text-amber-600" />}
          columns={lowStockColumns}
          dataSource={lowStockData}
        />

        <DashboardTableCard<TopClient>
          title="Top clientes"
          subtitle="Clientes con mayor volumen de compra"
          icon={<Trophy className="size-5 text-blue-600" />}
          columns={topClientsColumns}
          dataSource={topClientsData}
        />
      </div>
    </>
  );
}



