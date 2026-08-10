import { Button, Drawer, message, Table, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import { forwardRef, useImperativeHandle, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FileText } from "lucide-react";
import { useProductMovements } from "../../../services/inventoryMovements/queries";
import { InventoryMovement } from "../../../types/InventoryMovement";

export interface DrawerProductMovementsRef {
  childFunction: (productId: string, productName: string) => void;
}

export const DrawerProductMovements = forwardRef<DrawerProductMovementsRef, {}>(
  (_, ref) => {
    const [open, setOpen] = useState(false);
    const [productId, setProductId] = useState<string | undefined>(undefined);
    const [productName, setProductName] = useState<string>("");
    const [messageApi, contextHolder] = message.useMessage();

    useImperativeHandle(ref, () => ({
      childFunction: (id: string, name: string) => {
        setProductId(id);
        setProductName(name);
        setOpen(true);
      },
    }));

    const { data, isLoading } = useProductMovements(productId);

    const handleExportPDF = () => {
      const movements = data?.data || [];
      if (movements.length === 0) {
        messageApi.warning("No hay movimientos para este producto.");
        return;
      }

      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text(`Historial de Stock: ${productName}`, 14, 15);
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Fecha de emisión: ${new Date().toLocaleDateString("es-CL")}`, 14, 22);

      const tableColumn = [
        "Fecha",
        "Acción",
        "Cantidad",
        "Stock (Prev ➔ Nuevo)",
        "Responsable",
        "Motivo",
      ];

      const tableRows = movements.map((m) => {
        const actionText = m.action === "add" ? "Ingreso (+)" : "Egreso (-)";
        const qtyText = m.action === "add" ? `+${m.quantity}` : `-${m.quantity}`;
        const stockChange = `${m.previous_stock} ➔ ${m.new_stock}`;
        const userText = m.user?.name ? `${m.user.name} ${m.user.lastname || ""}`.trim() : "Administrador";
        const reasonText = m.reason || "-";

        return [
          m.created_at_show || "-",
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

      const sanitizedName = productName.toLowerCase().replace(/\s+/g, "_");
      doc.save(`movimientos_${sanitizedName}_${new Date().toISOString().slice(0, 10)}.pdf`);
    };

    const columns: ColumnsType<InventoryMovement> = [
      {
        title: "Fecha",
        dataIndex: "created_at_show",
        key: "created_at_show",
        render: (text) => <span className="text-xs text-gray-500">{text}</span>,
      },
      {
        title: "Acción",
        dataIndex: "action",
        key: "action",
        render: (action) =>
          action === "add" ? (
            <Tag color="green" className="rounded-full">
              Ingreso (+)
            </Tag>
          ) : (
            <Tag color="red" className="rounded-full">
              Egreso (-)
            </Tag>
          ),
      },
      {
        title: "Cantidad",
        dataIndex: "quantity",
        key: "quantity",
        align: "right",
        render: (val, record) => (
          <span
            className={`font-bold ${
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
        render: (_, record) => (
          <span className="text-xs font-medium">
            {record.previous_stock} ➔{" "}
            <span className="font-bold text-gray-800">{record.new_stock}</span>
          </span>
        ),
      },
      {
        title: "Motivo",
        dataIndex: "reason",
        key: "reason",
        render: (text) => <span className="text-xs text-gray-600">{text || "-"}</span>,
      },
      {
        title: "Usuario",
        dataIndex: "user",
        key: "user",
        render: (user) => (
          <span className="text-xs font-medium text-slate-700">
            {user?.name || "Administrador"}
          </span>
        ),
      },
    ];

    return (
      <Drawer
        title={
          <div className="flex items-center justify-between pr-4">
            <div>
              <h3 className="text-base font-semibold text-gray-800">
                Historial de Stock
              </h3>
              <p className="text-xs text-gray-400 font-normal">
                Producto: {productName}
              </p>
            </div>
            <Button
              type="primary"
              size="small"
              icon={<FileText className="size-3.5" />}
              onClick={handleExportPDF}
              className="flex items-center gap-1 bg-blue-600 font-medium"
            >
              PDF
            </Button>
          </div>
        }
        width={650}
        onClose={() => setOpen(false)}
        open={open}
        destroyOnClose
      >
        {contextHolder}
        <Table<InventoryMovement>
          columns={columns}
          dataSource={data?.data}
          loading={isLoading}
          rowKey="id"
          pagination={{
            total: data?.total,
            pageSize: 10,
          }}
          size="small"
        />
      </Drawer>
    );
  }
);
