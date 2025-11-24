import React from "react";
import { SectionPrivateHeader } from "../../components/ui/SectionPrivateHeader";
import { message, Table } from "antd";
import { ClearFiltersIcon } from "../../components/ui/icons/ClearFiltersIcon";
import useTableFilters from "../../hooks/table/useTableFiltersV2";
import { useDispatches } from "../../services/dispatches/queries";
import useColumnSearch from "../../hooks/useColumnSearch";
import { ColumnsType } from "antd/es/table";
import { Dispatch } from "../../types/Dispatch";
import { Order } from "../../types/Order";
import { axiosInstance } from "../../axios/axiosInstance";

export default function DispatchPrivate() {
  const [messageApi, contextHolder] = message.useMessage();

  const { tableParams, tableKey, resetFilters, handleTableChange } =
    useTableFilters();

  const { data, isLoading, isError, error, isFetching, refetch, isBaseQuery } =
    useDispatches(tableParams);

  const { getColumnSearchProps } = useColumnSearch();

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: Dispatch[]) => {
      console.log("Seleccionadas:", selectedRowKeys, selectedRows);
    },
  };

  const columns: ColumnsType<Dispatch> = [
    {
      title: "Número orden",
      dataIndex: "number_order",
      key: "number_order",
      width: 170,
      ...getColumnSearchProps("number_order"),
      sorter: true,
    },
    {
      title: "Cliente",
      key: "client_name",
      render: (_, record) => (
        <span>{`${record.client?.name} ${record.client?.lastname}`}</span>
      ),
    },
    {
      title: "Total productos",
      dataIndex: "total_quantity",
      key: "total_quantity",
      sorter: true,
    },
    {
      title: "Estado",
      dataIndex: "status",
      key: "status",
      width: 160,
      render: (text: Order["status"]) => {
        if (text === "paid") {
          return (
            <span
              className="inline-flex items-center gap-x-1.5
               py-1.5 px-3 rounded-full text-xs font-medium
               bg-green-100 text-green-500"
            >
              Pagada
            </span>
          );
        } else if (text === "payment_under_review") {
          return (
            <span
              className="inline-flex items-center gap-x-1.5 py-1.5
               px-3 rounded-full text-xs font-medium bg-red-100 text-yellow-500"
            >
              Pago en revisión
            </span>
          );
        } else if (text === "pending_payment") {
          return (
            <span
              className="inline-flex items-center gap-x-1.5 py-1.5
               px-3 rounded-full text-xs font-medium bg-red-100 text-orange-500"
            >
              Pago pendiente
            </span>
          );
        }
      },
      filters: [
        {
          text: "Pagada",
          value: "paid",
        },
        {
          text: "Pago pendiente",
          value: "pending_payment",
        },
        {
          text: "Pago en revisión",
          value: "payment_under_review",
        },
        {
          text: "Cancelada",
          value: "canceled",
        },
      ],
    },
    {
      title: "Dia de despacho",
      dataIndex: "date_dispatch",
      key: "date_dispatch",
      sorter: true,
    },
    {
      title: "Hora de despacho",
      dataIndex: "time_dispatch",
      key: "time_dispatch",
      sorter: true,
    },
    {
      title: "Despacho",
      dataIndex: "status_dispatch",
      key: "status_dispatch",
      sorter: true,
      render: (text: Dispatch["status_dispatch"]) => {
        if (text === "delivered") {
          return (
            <span
              className="inline-flex items-center gap-x-1.5
               py-1.5 px-3 rounded-full text-xs font-medium
               bg-green-100 text-green-500"
            >
              Entregada
            </span>
          );
        } else if (text === "in_route") {
          return (
            <span
              className="inline-flex items-center gap-x-1.5 py-1.5
               px-3 rounded-full text-xs font-medium bg-red-100 text-yellow-500"
            >
              En ruta
            </span>
          );
        } else if (text === "pending_dispatch") {
          return (
            <span
              className="inline-flex items-center gap-x-1.5 py-1.5
               px-3 rounded-full text-xs font-medium bg-red-100 text-orange-500"
            >
              Despacho pendiente
            </span>
          );
        }
      },
      filters: [
        {
          text: "Entegado",
          value: "delivered",
        },
        {
          text: "En ruta",
          value: "in_route",
        },
        {
          text: "pendiente de despacho",
          value: "pending_dispatch",
        },
      ],
    },
    {
      title: "Metodo de pago",
      dataIndex: "method_payment",
      key: "method_payment",
      sorter: true,
      render: (text: Dispatch["method_payment"]) => {
        if (text === 1) {
          return (
            <span
              className="inline-flex items-center gap-x-1.5
               py-1.5 px-3 rounded-full text-xs font-medium
               bg-gray-100 text-gray-500"
            >
              Pago efectivo
            </span>
          );
        } else if (text === 2) {
          return (
            <span
              className="inline-flex items-center gap-x-1.5 py-1.5
               px-3 rounded-full text-xs font-medium bg-gray-100 text-gray-500"
            >
              Pago transferencia
            </span>
          );
        }
      },
    },
    /* {
      title: "Acciones",
      dataIndex: "id",
      key: "id",

      width: 100,
      render: (id: Order["id"], record) => (
        <Dropdown
          trigger={["click"]}
          menu={{
            items: [
              //Usuarios 
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
              //Vaucher 
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
              },
              // mas info 
              {
                key: "3",
                label: (
                  <button
                    className="flex items-center w-full gap-2 py-1"
                    onClick={() => {
                      if (record.items) {
                        ModalSOrderItems.current?.childFunction(record.id);
                      }
                    }}
                  >
                    <EyeIcon className="size-5 text-text-primary" />
                    <span>Productos</span>
                  </button>
                ),
              },
            ],
          }}
        >
          <a onClick={(e) => e.preventDefault()}>
            <MoreHorizontalIcon className="size-6 text-text-primary" />
          </a>
        </Dropdown>
      ),
    }, */
  ];

  return (
    <>
      <SectionPrivateHeader title="Despachos" existsButton={false} />

      <div className="flex flex-col items-end gap-2 mb-3">
        <button
          className="flex justify-center gap-2 text-text-secondary"
          onClick={() => resetFilters()}
        >
          <ClearFiltersIcon className="flex size-5" />
          Limpiar filtros
        </button>
      </div>

      <Table<Dispatch>
        rowSelection={rowSelection}
        columns={columns}
        dataSource={data?.data}
        key={tableKey}
        pagination={{
          current: tableParams?.pagination.current,
          pageSize: tableParams?.pagination.pageSize,
          total: data?.total,
          pageSizeOptions: [10],
        }}
        onChange={handleTableChange}
        loading={isLoading}
        scroll={{ x: 1000 }}
      />
    </>
  );
}
