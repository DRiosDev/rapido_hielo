import { message, Popconfirm, Space, Table, Tooltip } from "antd";
import { useRef } from "react";
import { CheckIcon } from "../../components/ui/icons/CheckIcon";
import { ClearFiltersIcon } from "../../components/ui/icons/ClearFiltersIcon";
import { DeleteIcon } from "../../components/ui/icons/DeleteIcon";
import {
  ModalCUUser,
  ModalCUUserRef,
} from "../../components/ui/modals/ModalCUUser";
import { SectionPrivateHeader } from "../../components/ui/SectionPrivateHeader";
import useColumnSearch from "../../hooks/useColumnSearch";
import type { User } from "../../types/user";
// @ts-ignore
import type { ColumnsType } from "antd/es/table";
import { EmailWhatsappText } from "../../components/ui/EmailWhatsappText";
import { EditIcon } from "../../components/ui/icons/EditIcon";
import { Colors } from "../../constants/Colors";
import useTableFilters from "../../hooks/table/useTableFiltersV2";
import { useDeleteUser } from "../../services/users/mutation";
import { useUsers } from "../../services/users/queries";
import { ErrorResult } from "../../components/ui/ErrorResult";

export default function UsersPrivate() {
  const modalCURef = useRef<ModalCUUserRef>(null);
  const [messageApi, contextHolder] = message.useMessage();

  const { tableParams, tableKey, resetFilters, handleTableChange } =
    useTableFilters();

  const { data, isLoading, isError, error, isFetching, refetch, isBaseQuery } =
    useUsers(tableParams);

  const { getColumnSearchProps } = useColumnSearch();

  if (isError) {
    return <ErrorResult error={error} />;
  }

  const columns: ColumnsType<User> = [
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
      title: "Rol",
      dataIndex: "role",
      key: "role",
      render: (text: User["role"]) => {
        if (text === "admin") {
          return (
            <span
              className="inline-flex items-center gap-x-1.5
             py-1.5 px-3 rounded-full text-xs font-medium
             bg-yellow-200 text-yellow-700"
            >
              Administrador
            </span>
          );
        } else if (text === "owner") {
          return (
            <span
              className="inline-flex items-center gap-x-1.5
             py-1.5 px-3 rounded-full text-xs font-medium
             bg-blue-200 text-blue-700"
            >
              Dueño
            </span>
          );
        } else if(text === "normal"){
          return (
            <span
              className="inline-flex items-center gap-x-1.5
             py-1.5 px-3 rounded-full text-xs font-medium
             bg-orange-200 text-orange-700"
            >
              Normal
            </span>
          );
        }
      },
      filters: [
        {
          value: "normal",
          text: "Normal",
        },
        {
          text: "Administrador",
          value: "admin",
        },
      ],
    },
    {
      title: "Estado",
      dataIndex: "status",
      key: "status",
      width: 130,
      render: (text: User["status"]) => {
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
      render: (id: User["id"], record: User) => (
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

  const deleteUser = useDeleteUser();

  const changeStatus = async (key: User["id"]) => {
    deleteUser.mutate(key, {
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
    });
  };

  return (
    <>
      {contextHolder}
      <SectionPrivateHeader
        title="Usuarios"
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

      <Table<User>
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
        loading={isLoading || isFetching || deleteUser?.isPending}
        scroll={{ x: 1000 }}
      />

      <ModalCUUser
        ref={modalCURef}
        refetch={isBaseQuery ? undefined : refetch}
        onAddSuccess={isBaseQuery ? undefined : resetFilters}
      />
    </>
  );
}
