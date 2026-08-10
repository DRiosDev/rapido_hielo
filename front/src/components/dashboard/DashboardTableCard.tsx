import React from "react";
import { Card, Table, TableProps } from "antd";

export interface DashboardTableCardProps<T extends object> {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  columns: TableProps<T>["columns"];
  dataSource: T[];
  loading?: boolean;
  rowKey?: string | ((record: T) => string);
  pagination?: false | TableProps<T>["pagination"];
  extra?: React.ReactNode;
  className?: string;
}

export function DashboardTableCard<T extends object>({
  title,
  subtitle,
  icon,
  columns,
  dataSource,
  loading = false,
  rowKey = "id",
  pagination = false,
  extra,
  className = "",
}: DashboardTableCardProps<T>) {
  return (
    <Card
      bordered={false}
      loading={loading}
      className={`shadow-sm rounded-xl h-full flex flex-col justify-between ${className}`}
      title={
        <div className="flex items-center justify-between py-1">
          <div className="flex items-center gap-2.5">
            {icon && (
              <div className="p-2 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
                {icon}
              </div>
            )}
            <div>
              <h3 className="text-base font-semibold text-gray-800">{title}</h3>
              {subtitle && (
                <p className="text-xs text-gray-400 font-normal">{subtitle}</p>
              )}
            </div>
          </div>
          {extra && <div>{extra}</div>}
        </div>
      }
    >
      <div className="overflow-x-auto">
        <Table<T>
          rowKey={rowKey}
          columns={columns}
          dataSource={dataSource}
          pagination={pagination}
          size="small"
          className="dashboard-table-custom"
        />
      </div>
    </Card>
  );
}
