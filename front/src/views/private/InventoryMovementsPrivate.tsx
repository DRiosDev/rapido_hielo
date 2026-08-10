import React, { useState } from "react";
import { Button, message, Table, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FileText } from "lucide-react";
import { SectionPrivateHeader } from "../../components/ui/SectionPrivateHeader";
import useTableFilters from "../../hooks/table/useTableFiltersV2";
import { useInventoryMovements } from "../../services/inventoryMovements/queries";
import { InventoryMovement } from "../../types/InventoryMovement";

export default function InventoryMovementsPrivate() {
  const [selectedMovements, setSelectedMovements] = useState<InventoryMovement[]>([]);
  const [messageApi, contextHolder] = message.useMessage();

  const { tableParams, tableKey, handleTableChange } = useTableFilters();

  const { data, isLoading } = useInventoryMovements({
    current: tableParams?.pagination.current,
    pageSize: tableParams?.pagination.pageSize,
  });

  const rowSelection = {
    onChange: (_selectedRowKeys: React.Key[], selectedRows: InventoryMovement[]) => {
      setSelectedMovements(selectedRows);
    },
  };

  const handleExportPDF = () => {
    const movementsToExport =
      selectedMovements.length > 0 ? selectedMovements : data?.data || [];

    if (movementsToExport.length === 0) {
      messageApi.warning("No hay movimientos de inventario para exportar.");
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Reporte de Movimientos de Inventario", 14, 15);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Fecha de emisión: ${new Date().toLocaleDateString("es-CL")}`, 14, 22);

    const tableColumn = [
      "Fecha",
      "Producto",
      "Acción",
      "Cantidad",
      "Stock (Prev ➔ Nuevo)",
      "Responsable",
      "Motivo",
    ];

    const tableRows = movementsToExport.map((m) => {
      const actionText = m.action === "add" ? "Ingreso (+)" : "Egreso (-)";
      const qtyText = m.action === "add" ? `+${m.quantity}` : `-${m.quantity}`;
      const stockChange = `${m.previous_stock} ➔ ${m.new_stock}`;
      const userText = m.user?.name ? `${m.user.name} ${m.user.lastname || ""}`.trim() : "Administrador";
      const reasonText = m.reason || "-";

      return [
        m.created_at_show || "-",
        m.product?.name || "Producto desconocido",
        actionText,
        qtyText,
        stockChange,
        userText,
        reasonText,
      ];
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 28,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [30, 41, 59] },
    });

    doc.save(`movimientos_inventario_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const columns: ColumnsType<InventoryMovement> = [
    {
      title: "Fecha",
      dataIndex: "created_at_show",
      key: "created_at_show",
      width: 180,
      render: (text) => <span className="text-xs text-gray-500 font-medium">{text}</span>,
    },
    {
      title: "Producto",
      dataIndex: "product",
      key: "product",
      render: (product) => (
        <span className="font-semibold text-gray-800">
          {product?.name || "Producto desconocido"}
        </span>
      ),
    },
    {
      title: "Acción",
      dataIndex: "action",
      key: "action",
      width: 120,
      render: (action) =>
        action === "add" ? (
          <Tag color="green" className="rounded-full px-2.5 font-medium">
            Ingreso (+)
          </Tag>
        ) : (
          <Tag color="red" className="rounded-full px-2.5 font-medium">
            Egreso (-)
          </Tag>
        ),
    },
    {
      title: "Cantidad",
      dataIndex: "quantity",
      key: "quantity",
      align: "right",
      width: 110,
      render: (val, record) => (
        <span
          className={`font-bold text-base ${
            record.action === "add" ? "text-emerald-600" : "text-rose-600"
          }`}
        >
          {record.action === "add" ? `+${val}` : `-${val}`}
        </span>
      ),
    },
    {
      title: "Stock Previo ➔ Nuevo",
      key: "stock_change",
      align: "center",
      width: 180,
      render: (_, record) => (
        <span className="text-sm font-medium">
          {record.previous_stock} ➔{" "}
          <span className="font-bold text-slate-800">{record.new_stock}</span>
        </span>
      ),
    },
    {
      title: "Motivo / Detalle",
      dataIndex: "reason",
      key: "reason",
      render: (text) => (
        <span className="text-xs text-slate-600">
          {text || "-"}
        </span>
      ),
    },
    {
      title: "Responsable",
      dataIndex: "user",
      key: "user",
      render: (user) => (
        <span className="text-xs font-medium text-slate-700">
          {user?.name || "Administrador del Sistema"}
        </span>
      ),
    },
  ];

  return (
    <>
      {contextHolder}
      <SectionPrivateHeader
        title="Historial de Inventario"
        subtitle="Registro completo y auditoría de cambios de stock de productos"
        existsButton={false}
      />

      <div className="flex justify-end mb-3">
        <Button
          type="primary"
          icon={<FileText className="size-4" />}
          className="flex items-center gap-1.5 rounded-lg bg-blue-600 font-medium"
          onClick={handleExportPDF}
        >
          Exportar a PDF
        </Button>
      </div>

      <Table<InventoryMovement>
        rowSelection={rowSelection}
        columns={columns}
        dataSource={data?.data}
        key={tableKey}
        pagination={{
          current: tableParams?.pagination.current,
          pageSize: tableParams?.pagination.pageSize,
          total: data?.total,
          pageSizeOptions: [10, 20, 50],
        }}
        onChange={handleTableChange}
        loading={isLoading}
        rowKey="id"
        className="shadow-sm rounded-xl overflow-hidden bg-white"
        scroll={{ x: 800 }}
      />
    </>
  );
}
