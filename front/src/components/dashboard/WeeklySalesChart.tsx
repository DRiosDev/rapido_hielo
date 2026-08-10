import React from "react";
import { Card } from "antd";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";

export interface DailySalesData {
  day: string;
  sales: number;
  orders: number;
}

type WeeklySalesChartProps = {
  data?: DailySalesData[];
  title?: string;
  loading?: boolean;
};

const defaultWeeklyData: DailySalesData[] = [
  { day: "Lun", sales: 1250000, orders: 24 },
  { day: "Mar", sales: 1800000, orders: 35 },
  { day: "Mié", sales: 1450000, orders: 28 },
  { day: "Jue", sales: 2100000, orders: 42 },
  { day: "Vie", sales: 2900000, orders: 58 },
  { day: "Sáb", sales: 3400000, orders: 65 },
  { day: "Dom", sales: 1950000, orders: 38 },
];

const formatCurrency = (val: number) =>
  `$${val.toLocaleString("es-CL")}`;

export const WeeklySalesChart: React.FC<WeeklySalesChartProps> = ({
  data = defaultWeeklyData,
  title = "Ventas Semanales",
  loading = false,
}) => {
  const totalSales = data.reduce((acc, curr) => acc + curr.sales, 0);
  const totalOrders = data.reduce((acc, curr) => acc + curr.orders, 0);

  return (
    <Card
      bordered={false}
      loading={loading}
      className="shadow-sm rounded-xl h-full flex flex-col justify-between"
      title={
        <div className="flex items-center justify-between py-1">
          <div>
            <h3 className="text-base font-semibold text-gray-800">{title}</h3>
            <p className="text-xs text-gray-400 font-normal">
              Ventas acumuladas de los últimos 7 días
            </p>
          </div>
          <div className="text-right">
            <span className="text-lg font-bold text-emerald-600 block">
              {formatCurrency(totalSales)}
            </span>
            <span className="text-xs text-gray-400">
              {totalOrders} pedidos totales
            </span>
          </div>
        </div>
      }
    >
      <div className="w-full h-72 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748B", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748B", fontSize: 11 }}
              tickFormatter={(v) => `$${(v / 1000000).toFixed(1)}M`}
            />
            <Tooltip
              cursor={{ fill: "#F8FAFC" }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload as DailySalesData;
                  return (
                    <div className="bg-slate-900 text-white text-xs p-3 rounded-lg shadow-lg">
                      <p className="font-semibold text-slate-300 mb-1">{item.day}</p>
                      <p className="text-emerald-400 font-bold">
                        Ventas: {formatCurrency(item.sales)}
                      </p>
                      <p className="text-slate-300">
                        Pedidos: {item.orders}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="sales" radius={[6, 6, 0, 0]} maxBarSize={40}>
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={index === data.length - 2 ? "#0EA5E9" : "#38BDF8"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
