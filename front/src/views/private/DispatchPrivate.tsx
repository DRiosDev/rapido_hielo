import React from "react";
import { SectionPrivateHeader } from "../../components/ui/SectionPrivateHeader";
import { message, Table, Select, Button, DatePicker, Dropdown } from "antd";
import { ClearFiltersIcon } from "../../components/ui/icons/ClearFiltersIcon";
import { ClientMoreIcon } from "../../components/ui/icons/ClientMoreIcon";
import { EyeIcon } from "../../components/ui/icons/EyeIcon";
import { MoreHorizontalIcon } from "../../components/ui/icons/MoreHorizontalIcon";
import { ModalShowOrderItems, ModalShowOrderItemsRef } from "../../components/ui/modals/ModalShowOrderItems";
import { ModalVClient, ModalVClientRef } from "../../components/ui/modals/ModalVClient";
import { ModalViewVaucher, ModalViewVaucherRef } from "../../components/ui/modals/ModalViewVaucher";
import { ModalDeliverySlots, ModalDeliverySlotsRef } from "../../components/ui/modals/ModalDeliverySlots";
import useTableFilters from "../../hooks/table/useTableFiltersV2";
import { useDispatches } from "../../services/dispatches/queries";
import { updateDispatchStatus } from "../../services/dispatches/api";
import { useAuthUser } from "../../store/useAuthUser";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import useColumnSearch from "../../hooks/useColumnSearch";
import { ColumnsType } from "antd/es/table";
import { Dispatch } from "../../types/Dispatch";
import { Order } from "../../types/Order";

export default function DispatchPrivate() {
  const { userLogged } = useAuthUser();
  const isAdminOrOwner = userLogged?.role === "admin" || userLogged?.role === "owner";

  const [messageApi, contextHolder] = message.useMessage();
  const modalVClientRef = React.useRef<ModalVClientRef>(null);
  const modalVVaucher = React.useRef<ModalViewVaucherRef>(null);
  const ModalSOrderItems = React.useRef<ModalShowOrderItemsRef>(null);
  const modalDeliverySlotsRef = React.useRef<ModalDeliverySlotsRef>(null);

  const [selectedDispatches, setSelectedDispatches] = React.useState<Dispatch[]>([]);
  const [dateFilter, setDateFilter] = React.useState<string | null>(null);

  const { tableParams, tableKey, resetFilters, handleTableChange } =
    useTableFilters();

  const { data, isLoading, refetch } = useDispatches(tableParams);
  const { getColumnSearchProps } = useColumnSearch();

  const rowSelection = {
    onChange: (_: React.Key[], selectedRows: Dispatch[]) => {
      setSelectedDispatches(selectedRows);
    },
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateDispatchStatus(orderId, newStatus);
      messageApi.success("Estado de despacho actualizado.");
      refetch();
    } catch (error) {
      messageApi.error("Error al actualizar el estado de despacho.");
    }
  };

  const handleExportPDF = () => {
    if (selectedDispatches.length === 0) {
      messageApi.warning("Seleccione al menos un despacho para exportar.");
      return;
    }

    const doc = new jsPDF();
    doc.text("Reporte de Despachos Diarios", 14, 15);

    const tableColumn = ["N Orden", "Cliente", "Direccion", "Horario", "Items"];
    const tableRows: any[] = [];

    selectedDispatches.forEach((dispatch) => {
      const clientName = dispatch.client ? `${dispatch.client.name} ${dispatch.client.lastname}` : "Cliente";
      const address = dispatch.address_dispatch || "No especificada";

      tableRows.push([
        dispatch.number_order,
        clientName,
        address,
        dispatch.time_dispatch || "",
        dispatch.total_quantity,
      ]);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("despachos.pdf");
  };

  const filteredData = React.useMemo(() => {
    if (!data?.data) return [];
    if (!dateFilter) return data.data;
    return data.data.filter((d) => d.date_dispatch === dateFilter);
  }, [data?.data, dateFilter]);

  const columns: ColumnsType<Dispatch> = [
    {
      title: "Número orden",
      dataIndex: "number_order",
      key: "number_order",
      width: 150,
      ...getColumnSearchProps("number_order"),
      sorter: true,
    },
    {
      title: "Cliente",
      key: "client_name",
      render: (_, record) => (
        <span>{record.client ? `${record.client.name} ${record.client.lastname}` : "-"}</span>
      ),
    },
    {
      title: "Total productos",
      dataIndex: "total_quantity",
      key: "total_quantity",
      sorter: true,
    },
    {
      title: "Estado Pago",
      dataIndex: "status",
      key: "status",
      width: 150,
      render: (text: Order["status"]) => {
        if (text === "paid") {
          return (
            <span className="inline-flex items-center py-1 px-2.5 rounded-full text-xs font-medium bg-green-100 text-green-600">
              Pagada
            </span>
          );
        } else if (text === "payment_under_review") {
          return (
            <span className="inline-flex items-center py-1 px-2.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-600">
              Pago en revisión
            </span>
          );
        } else if (text === "pending_payment") {
          return (
            <span className="inline-flex items-center py-1 px-2.5 rounded-full text-xs font-medium bg-orange-100 text-orange-600">
              Pago pendiente
            </span>
          );
        }
        return <span>{text}</span>;
      },
    },
    {
      title: "Día despacho",
      dataIndex: "date_dispatch",
      key: "date_dispatch",
      sorter: true,
    },
    {
      title: "Hora despacho",
      dataIndex: "time_dispatch",
      key: "time_dispatch",
      sorter: true,
    },
    {
      title: "Estado Despacho",
      dataIndex: "status_dispatch",
      key: "status_dispatch",
      width: 165,
      render: (text: Dispatch["status_dispatch"], record) => {
        const currentVal = (text === "pending_dispatch" || text === "pending") ? "pending" : text;
        return (
          <Select
            value={currentVal}
            onChange={(newStatus) => handleStatusChange(record.id, newStatus)}
            size="small"
            style={{ width: 140 }}
            options={[
              { value: "pending", label: "Pendiente" },
              { value: "prepared", label: "Preparado" },
              { value: "in_route", label: "En ruta" },
              { value: "delivered", label: "Entregado" },
            ]}
          />
        );
      },
      filters: [
        { text: "Entregado", value: "delivered" },
        { text: "En ruta", value: "in_route" },
        { text: "Preparado", value: "prepared" },
        { text: "Pendiente", value: "pending" },
      ],
    },
    {
      title: "Método pago",
      dataIndex: "method_payment",
      key: "method_payment",
      sorter: true,
      render: (text: Dispatch["method_payment"]) => (
        <span className="inline-flex items-center py-1 px-2.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
          {Number(text) === 1 ? "Pago en tienda" : "Transferencia"}
        </span>
      ),
    },
    {
      title: "Acciones",
      dataIndex: "id",
      key: "id",
      width: 90,
      render: (id: Order["id"], record) => {
        const menuItems = [];

        if (isAdminOrOwner) {
          menuItems.push(
            {
              key: "1",
              label: (
                <button
                  className="flex items-center w-full gap-2 py-1"
                  onClick={() => {
                    const clientId = record.client?.id;
                    if (clientId) {
                      modalVClientRef.current?.childFunction(clientId);
                    }
                  }}
                >
                  <ClientMoreIcon className="size-5 text-text-primary" />
                  <span>Cliente</span>
                </button>
              ),
            },
            {
              key: "2",
              label: (
                <button
                  className="flex items-center w-full gap-2 py-1"
                  onClick={() => {
                    modalVVaucher.current?.childFunction(id);
                  }}
                >
                  <ClientMoreIcon className="size-5 text-text-primary" />
                  <span>Vaucher</span>
                </button>
              ),
            }
          );
        }

        menuItems.push({
          key: "3",
          label: (
            <button
              className="flex items-center w-full gap-2 py-1"
              onClick={() => {
                ModalSOrderItems.current?.childFunction(record.id);
              }}
            >
              <EyeIcon className="size-5 text-text-primary" />
              <span>Productos</span>
            </button>
          ),
        });

        return (
          <Dropdown trigger={["click"]} menu={{ items: menuItems }}>
            <a onClick={(e) => e.preventDefault()}>
              <MoreHorizontalIcon className="size-6 text-text-primary" />
            </a>
          </Dropdown>
        );
      },
    },
  ];

  return (
    <>
      {contextHolder}
      <SectionPrivateHeader
        title="Despachos"
        existsButton={isAdminOrOwner}
        buttonText="Rangos horarios"
        buttonFunction={() => modalDeliverySlotsRef.current?.openModal()}
      />

      <div className="flex flex-col sm:flex-row justify-between items-center mb-3">
        <div className="flex gap-2 items-center">
          <DatePicker
            placeholder="Filtrar por fecha"
            onChange={(_, dateString) => setDateFilter(Array.isArray(dateString) ? dateString[0] : dateString)}
          />
          <Button type="primary" onClick={handleExportPDF}>
            Exportar a PDF
          </Button>
        </div>
        <button
          className="flex justify-center gap-2 text-text-secondary mt-3 sm:mt-0"
          onClick={() => {
            setDateFilter(null);
            resetFilters();
          }}
        >
          <ClearFiltersIcon className="flex size-5" />
          Limpiar filtros
        </button>
      </div>

      <Table<Dispatch>
        rowSelection={rowSelection}
        columns={columns}
        dataSource={filteredData}
        key={tableKey}
        pagination={{
          current: tableParams?.pagination.current,
          pageSize: tableParams?.pagination.pageSize,
          total: dateFilter ? filteredData.length : data?.total,
          pageSizeOptions: [10],
        }}
        onChange={handleTableChange}
        loading={isLoading}
        scroll={{ x: 1000 }}
      />

      {isAdminOrOwner && <ModalVClient ref={modalVClientRef} />}
      {isAdminOrOwner && <ModalViewVaucher ref={modalVVaucher} refetchData={refetch} />}
      <ModalShowOrderItems ref={ModalSOrderItems} />
      {isAdminOrOwner && <ModalDeliverySlots ref={modalDeliverySlotsRef} />}
    </>
  );
}
