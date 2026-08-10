import React from "react";
import { Card } from "antd";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";

export interface DispatchStatusData {
  status: string;
  count: number;
  color: string;
}

type DispatchStatusChartProps = {
  data?: DispatchStatusData[];
  title?: string;
  loading?: boolean;
};

const defaultDispatchData: DispatchStatusData[] = [
  { status: "Entregado", count: 42, color: "#10B981" },
  { status: "En ruta", count: 18, color: "#0EA5E9" },
  { status: "Preparado", count: 12, color: "#F59E0B" },
  { status: "Pendiente", count: 6, color: "#94A3B8" },
];

export const DispatchStatusChart: React.FC<DispatchStatusChartProps> = ({
  data = defaultDispatchData,
  title = "Estado de Despachos (Hoy)",
  loading = false,
}) => {
  const totalDispatches = data.reduce((acc, curr) => acc + curr.count, 0);

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
              Resumen de órdenes del día actual
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
            Total: {totalDispatches} órdenes
          </span>
        </div>
      }
    >
      {/* Horizontal Bar Chart */}
      <div className="w-full h-44 pt-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={data}
            margin={{ top: 0, right: 20, left: 15, bottom: 0 }}
          >
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="status"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#475569", fontSize: 13, fontWeight: 500 }}
              width={80}
            />
            <Tooltip
              cursor={{ fill: "#F8FAFC" }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload as DispatchStatusData;
                  const percentage = totalDispatches > 0
                    ? ((item.count / totalDispatches) * 100).toFixed(1)
                    : 0;
                  return (
                    <div className="bg-slate-900 text-white text-xs p-2.5 rounded-lg shadow-lg">
                      <p className="font-semibold text-slate-200">{item.status}</p>
                      <p className="font-bold text-sky-400 mt-0.5">
                        {item.count} órdenes ({percentage}%)
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="count" radius={[0, 6, 6, 0]} maxBarSize={24}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Status Breakdown Legend / Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-gray-100">
        {data.map((item) => {
          const percentage = totalDispatches > 0
            ? Math.round((item.count / totalDispatches) * 100)
            : 0;
          return (
            <div key={item.status} className="p-2 rounded-lg bg-slate-50 text-center">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <span
                  className="size-2 rounded-full inline-block"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs text-gray-500 font-medium">{item.status}</span>
              </div>
              <p className="text-base font-bold text-gray-800">{item.count}</p>
              <span className="text-[10px] text-gray-400">{percentage}%</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
