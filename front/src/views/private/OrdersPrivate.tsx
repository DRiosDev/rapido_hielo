import { Dropdown, message, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { useRef } from "react";
import { ClearFiltersIcon } from "../../components/ui/icons/ClearFiltersIcon";
import { ClientMoreIcon } from "../../components/ui/icons/ClientMoreIcon";
import { EyeIcon } from "../../components/ui/icons/EyeIcon";
import { MoreHorizontalIcon } from "../../components/ui/icons/MoreHorizontalIcon";
import {
  ModalVClient,
  ModalVClientRef,
} from "../../components/ui/modals/ModalVClient";
import {
  ModalViewVaucher,
  ModalViewVaucherRef,
} from "../../components/ui/modals/ModalViewVaucher";
import { SectionPrivateHeader } from "../../components/ui/SectionPrivateHeader";
import { formatPrice } from "../../helpers/formatPrice";
import useTableFilters from "../../hooks/table/useTableFiltersV2";
import useColumnSearch from "../../hooks/useColumnSearch";
import { OrderWithClient } from "../../services/orders/api";
import { useOrders } from "../../services/orders/queries";
import { Order } from "../../types/Order";
import {
  ModalShowOrderItems,
  ModalShowOrderItemsRef,
} from "../../components/ui/modals/ModalShowOrderItems";

export default function OrdersPrivate() {
  const modalVClientRef = useRef<ModalVClientRef>(null);
  const modalVVaucher = useRef<ModalViewVaucherRef>(null);
  const ModalSOrderItems = useRef<ModalShowOrderItemsRef>(null);

  const [messageApi, contextHolder] = message.useMessage();

  const { tableParams, tableKey, resetFilters, handleTableChange } =
    useTableFilters();

  const { data, isLoading, isError, error, isFetching, refetch, isBaseQuery } =
    useOrders(tableParams);

  const { getColumnSearchProps } = useColumnSearch();

  console.log(data);

  const columns: ColumnsType<OrderWithClient> = [
    {
      title: "Número orden",
      dataIndex: "number_order",
      key: "number_order",
      width: 170,
      ...getColumnSearchProps("number_order"),
      sorter: true,
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (text: number) => <p>{formatPrice(text)}</p>,
      sorter: true,
    },
    {
      title: "Total productos",
      dataIndex: "total_quantity",
      key: "total_quantity",
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
      title: "RUT cliente",
      key: "client_rut",
      render: (_, record) => <span>{record.client?.rut}</span>,
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
      title: "Acciones",
      dataIndex: "id",
      key: "id",

      width: 100,
      render: (id: Order["id"], record) => (
        <Dropdown
          trigger={["click"]}
          menu={{
            items: [
              /* Usuarios */
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
              /* Vaucher */
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
              /* mas info */
              {
                key: "3",
                label: (
                  <button
                    className="flex items-center w-full gap-2 py-1"
                    onClick={() => {
                      if (record.items) {
                        ModalSOrderItems.current?.childFunction(record.items);
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
    },
  ];

  return (
    <>
      {contextHolder}
      <SectionPrivateHeader title="Ordenes" existsButton={false} />

      <div className="flex flex-col items-end gap-2 mb-3">
        <button
          className="flex justify-center gap-2 text-text-secondary"
          onClick={() => resetFilters()}
        >
          <ClearFiltersIcon className="flex size-5" />
          Limpiar filtros
        </button>
      </div>

      <Table<OrderWithClient>
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

      <ModalVClient ref={modalVClientRef} />
      <ModalViewVaucher ref={modalVVaucher} />
      <ModalShowOrderItems ref={ModalSOrderItems} />
    </>
  );
}
