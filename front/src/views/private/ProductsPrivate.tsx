import { Button, message, Popconfirm, Space, Table, Tooltip } from "antd";
import { ColumnsType } from "antd/es/table";
import { History, Package } from "lucide-react";
import { useRef } from "react";
import { SectionPrivateHeader } from "../../components/ui/SectionPrivateHeader";
import { SinDatoBadget } from "../../components/ui/SinDatoBadget";
import { ArrowUpDownIcon } from "../../components/ui/icons/ArrowUpDownIcon";
import { CheckIcon } from "../../components/ui/icons/CheckIcon";
import { ClearFiltersIcon } from "../../components/ui/icons/ClearFiltersIcon";
import { DeleteIcon } from "../../components/ui/icons/DeleteIcon";
import { EditIcon } from "../../components/ui/icons/EditIcon";
import {
  DrawerProductMovements,
  DrawerProductMovementsRef,
} from "../../components/ui/modals/DrawerProductMovements";
import {
  ModalCUProduct,
  ModalCUProductRef,
} from "../../components/ui/modals/ModalCUProduct";
import {
  ModalConvertStock,
  ModalConvertStockRef,
} from "../../components/ui/modals/ModalConvertStock";
import {
  ModalUQuantity,
  ModalUQuantityRef,
} from "../../components/ui/modals/ModalUQuantity";
import { Colors } from "../../constants/Colors";
import { formatPrice } from "../../helpers/formatPrice";
import useTableFilters from "../../hooks/table/useTableFiltersV2";
import useColumnSearch from "../../hooks/useColumnSearch";
import { useDeleteProduct } from "../../services/products/mutation";
import { useProducts } from "../../services/products/queries";
import { Product } from "../../types/Product";

export default function ProductsPrivate() {
  const modalCURef = useRef<ModalCUProductRef>(null);
  const modalUQWuantityRef = useRef<ModalUQuantityRef>(null);
  const drawerMovementsRef = useRef<DrawerProductMovementsRef>(null);
  const modalConvertStockRef = useRef<ModalConvertStockRef>(null);

  const [messageApi, contextHolder] = message.useMessage();

  const { tableParams, tableKey, resetFilters, handleTableChange } =
    useTableFilters();

  const { data, isLoading, isError, error, isFetching, refetch, isBaseQuery } =
    useProducts(tableParams);

  const { getColumnSearchProps } = useColumnSearch();

  const columns: ColumnsType<Product> = [
    {
      title: "Nombre",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Descripción",
      dataIndex: "description",
      key: "description",
      render: (text: string) => (
        <p>{text ? text : <SinDatoBadget text="descripción" />}</p>
      ),
    },
    {
      title: "Peso (Kg)",
      dataIndex: "weight",
      key: "weight",
      render: (value) => {
        if (value == null || value === "") return "-";
        const num = Number(value);
        if (isNaN(num)) return "-";
        const fixed = Number(num.toFixed(1));
        return fixed % 1 === 0 ? fixed.toFixed(0) : fixed.toFixed(1);
      },
    },
    {
      title: "Precio",
      dataIndex: "price",
      key: "price",
      render: (text: number) => <p>{formatPrice(text)}</p>,
      sorter: true,
    },
    {
      title: "Stock",
      dataIndex: "quantity",
      key: "quantity",
      render: (text: number) => <p>{text}</p>,
      sorter: true,
    },
    {
      title: "Stock Mínimo",
      dataIndex: "min_stock",
      key: "min_stock",
      render: (val: number) => (val && val > 0 ? val : "-"),
    },
    {
      title: "Estado",
      dataIndex: "status",
      key: "status",
      width: 130,
      render: (text: Product["status"]) => {
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
      width: 140,
      render: (id: Product["id"], record: Product) => (
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

          {/* UPDATE STOCK */}
          <Tooltip
            placement="top"
            className="cursor-pointer"
            title="Actualizar stock"
          >
            <button
              onClick={() => {
                modalUQWuantityRef.current?.childFunction(id);
              }}
            >
              <ArrowUpDownIcon className="text-blue-500 size-6" />
            </button>
          </Tooltip>

          {/* HISTORIAL STOCK */}
          <Tooltip
            placement="top"
            className="cursor-pointer"
            title="Ver historial de stock"
          >
            <button
              onClick={() => {
                drawerMovementsRef.current?.childFunction(id, record.name);
              }}
            >
              <History className="text-slate-600 hover:text-slate-900 size-5" />
            </button>
          </Tooltip>

          {/* DELETE */}
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

  const deleteProduct = useDeleteProduct();

  const changeStatus = async (key: Product["id"]) => {
    deleteProduct.mutate(key, {
      onSuccess: () => {
        refetch();
        messageApi.success(
          `El estado del producto se ha cambiado correctamente.`,
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
        title="Productos"
        onButtonClick={() => modalCURef.current?.childFunction()}
      />

      <div className="flex items-center justify-between gap-2 mb-3">
        <Button
          type="default"
          icon={<Package className="size-4 text-blue-600" />}
          className="flex items-center gap-1.5 rounded-lg border-blue-200 text-blue-700 hover:bg-blue-50 font-medium"
          onClick={() => modalConvertStockRef.current?.openModal()}
        >
          Convertir / Empacar
        </Button>

        <button
          className="flex justify-center gap-2 text-text-secondary text-sm"
          onClick={() => resetFilters()}
        >
          <ClearFiltersIcon className="flex size-5" />
          Limpiar filtros
        </button>
      </div>

      <Table<Product>
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

      <ModalCUProduct ref={modalCURef} />
      <ModalUQuantity ref={modalUQWuantityRef} refetch={refetch} />
      <DrawerProductMovements ref={drawerMovementsRef} />
      <ModalConvertStock
        ref={modalConvertStockRef}
        products={data?.data || []}
        refetch={refetch}
      />
    </>
  );
}
