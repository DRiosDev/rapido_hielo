import { Popconfirm, Space, Table, Tooltip } from "antd";
import { SectionPrivateHeader } from "../../components/ui/SectionPrivateHeader";
import { useClients } from "../../services/clients/queries";
import useTableFilters from "../../hooks/table/useTableFiltersV2";
import { Client } from "../../types/Client";
import { ColumnsType } from "antd/es/table";
import useColumnSearch from "../../hooks/useColumnSearch";
import { EmailWhatsappText } from "../../components/ui/EmailWhatsappText";
import { EditIcon } from "../../components/ui/icons/EditIcon";
import { DeleteIcon } from "../../components/ui/icons/DeleteIcon";
import { Colors } from "../../constants/Colors";
import { CheckIcon } from "../../components/ui/icons/CheckIcon";
import { useRef } from "react";
import {
  ModalCUClient,
  ModalCUClientRef,
} from "../../components/ui/modals/ModalCUClient";
import { ClearFiltersIcon } from "../../components/ui/icons/ClearFiltersIcon";

export default function ClientsPrivate() {
  const modalCURef = useRef<ModalCUClientRef>(null);

  const { tableParams, tableKey, resetFilters, handleTableChange } =
    useTableFilters();

  const { data, isLoading, isError, error, isFetching, refetch, isBaseQuery } =
    useClients(tableParams);

  const { getColumnSearchProps } = useColumnSearch();

  const columns: ColumnsType<Client> = [
    {
      title: "Rut",
      dataIndex: "rut",
      key: "rut",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Nombre",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Apellido",
      dataIndex: "lastname",
      key: "lastname",
      ...getColumnSearchProps("lastname"),
    },
    {
      title: "Correo electrónico",
      dataIndex: "email",
      width: 250,
      key: "email",
      ...getColumnSearchProps("email"),
      render: (text: string) => <EmailWhatsappText value={text} type="email" />,
    },
    {
      title: "Dirección",
      dataIndex: "address",
      key: "address",
      width: 250,
    },
    {
      title: "Estado",
      dataIndex: "status",
      key: "status",
      width: 130,
      render: (text: Client["status"]) => {
        if (text === "active") {
          return (
            <span
              className="inline-flex items-center gap-x-1.5
               py-1.5 px-3 rounded-full text-xs font-medium
               bg-green-100 text-green-500"
            >
              Activado
            </span>
          );
        } else {
          return (
            <span
              className="inline-flex items-center gap-x-1.5 py-1.5
               px-3 rounded-full text-xs font-medium bg-red-100 text-red-500"
            >
              Desactivado
            </span>
          );
        }
      },
      filters: [
        {
          text: "Activados",
          value: "active",
        },
        {
          text: "Desactivados",
          value: "desactive",
        },
      ],
    },
    {
      title: "Acciones",
      dataIndex: "id",
      key: "id",

      width: 100,
      render: (id: Client["id"], record: Client) => (
        <Space size="middle">
          {/* EDIT */}
          <Tooltip placement="top" className="cursor-pointer" title="Editar">
            <button
              onClick={() => {
                modalCURef.current?.childFunction(id, record);
              }}
            >
              <EditIcon className="text-yellow-500 size-6" />
            </button>
          </Tooltip>

          {record.status === "active" ? (
            <Tooltip
              placement="top"
              className="cursor-pointer"
              title="Desactivar"
            >
              <div>
                <Popconfirm
                  title="¿Estás seguro/a que deseas desactivar a este usuario/a?"
                  okText="Sí, desactivar"
                  cancelText="No, cancelar"
                  cancelButtonProps={{
                    style: { borderRadius: 12 },
                  }}
                  okButtonProps={{
                    style: {
                      backgroundColor: "#ef4444",
                      border: 0,
                    },
                  }}
                  placement="left"
                  onConfirm={() => {
                    changeStatus(id);
                  }}
                >
                  <button>
                    <DeleteIcon className="text-red-500 size-6" />
                  </button>
                </Popconfirm>
              </div>
            </Tooltip>
          ) : (
            <Tooltip placement="top" className="cursor-pointer" title="Activar">
              <div>
                <Popconfirm
                  title="¿Estás seguro/a que deseas activar a este usuario/a?"
                  okText="Sí, activar"
                  cancelText="No, cancelar"
                  placement="left"
                  cancelButtonProps={{
                    style: { borderRadius: 12 },
                  }}
                  okButtonProps={{
                    style: {
                      backgroundColor: Colors.primary,
                      border: 0,
                    },
                  }}
                  onConfirm={() => {
                    changeStatus(id);
                  }}
                >
                  <button>
                    <CheckIcon className="text-green-500 size-6" />
                  </button>
                </Popconfirm>
              </div>
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  const changeStatus = async (key: Client["id"]) => {
    /* deleteUser.mutate(key, {
      onSuccess: () => {
        refetch();
        messageApi.success(
          `El estado del usuario/a se ha cambiado correctamente.`
        );
      },
      // Si salio mal, añades ese item a la cache
      onError: () => {
        messageApi.error("Ups, algo salió mal. Intenta nuevamente.");
      },
    }); */
  };

  return (
    <>
      <SectionPrivateHeader
        title="Clientes"
        onButtonClick={() => modalCURef.current?.childFunction()}
      />

      <div className="flex flex-col items-end gap-2 mb-3">
        <button
          className="flex justify-center gap-2 text-text-secondary"
          onClick={() => resetFilters()}
        >
          <ClearFiltersIcon className="flex size-5" />
          Limpiar filtros
        </button>
      </div>

      <Table<Client>
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

      <ModalCUClient ref={modalCURef} />
    </>
  );
}
