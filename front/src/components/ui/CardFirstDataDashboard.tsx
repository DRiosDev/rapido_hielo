import React from "react";
import { Card, Statistic } from "antd";

export interface KpiData {
  id: string;
  title: string;
  value: number | string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  precision?: number;
  trend?: number;
  trendText?: string;
  icon?: React.ReactNode;
  loading?: boolean;
}

type CardFirstDataDashboardProps = {
  data: KpiData;
  className?: string;
};

export const CardFirstDataDashboard: React.FC<CardFirstDataDashboardProps> = ({
  data,
  className = "",
}) => {
  const {
    title,
    value,
    prefix,
    suffix,
    precision,
    trend,
    trendText,
    icon,
    loading = false,
  } = data;

  const isPositiveTrend = trend !== undefined ? trend >= 0 : undefined;

  return (
    <Card
      bordered={false}
      hoverable
      loading={loading}
      className={`shadow-sm rounded-xl transition-all duration-300 hover:shadow-md ${className}`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-500 text-sm font-medium">{title}</span>
        {icon && (
          <div className="p-2.5 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
            {icon}
          </div>
        )}
      </div>

      <Statistic
        value={value}
        prefix={prefix}
        suffix={suffix}
        precision={precision}
        valueStyle={{
          fontSize: "1.75rem",
          fontWeight: 700,
          color:
            isPositiveTrend !== undefined
              ? isPositiveTrend
                ? "#10B981"
                : "#EF4444"
              : "#1F2937",
        }}
      />

      {(trend !== undefined || trendText) && (
        <div className="mt-3 flex items-center gap-1.5 text-xs font-medium">
          {trend !== undefined && (
            <span
              className={`px-1.5 py-0.5 rounded ${
                isPositiveTrend
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-rose-50 text-rose-600"
              }`}
            >
              {isPositiveTrend ? `+${trend}%` : `${trend}%`}
            </span>
          )}
          {trendText && <span className="text-gray-400">{trendText}</span>}
        </div>
      )}
    </Card>
  );
};

