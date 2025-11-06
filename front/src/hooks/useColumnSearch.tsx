import { Button, DatePicker, Input, InputRef } from "antd";
import locale from "antd/es/date-picker/locale/es_ES";
import { FilterDropdownProps } from "antd/es/table";
import dayjs, { Dayjs } from "dayjs";
import { useRef, useState } from "react";
import { CalendarIcon } from "../components/ui/icons/CalendarIcon";
import { SearchIcon } from "../components/ui/icons/SearchIcon";
import { Colors } from "../constants/Colors";

const { RangePicker } = DatePicker;

type Dates = {
  start: Dayjs | null;
  finish: Dayjs | null;
};

type ColumnSearchProps = {
  dataIndex: string;
  isExact?: boolean;
  typeInput?: "input" | "rangepicker";
};

const useColumnSearch = <T extends object>(isLocalSearch?: boolean) => {
  const searchInput = useRef<InputRef | null>(null);
  const [dates, setDates] = useState<Dates>({ start: null, finish: null });

  const handleSearch = (confirm: FilterDropdownProps["confirm"]) => {
    confirm();
  };

  const handleReset = (clearFilters?: FilterDropdownProps["clearFilters"]) => {
    clearFilters?.();
  };

  const clearInputs = () => {
    setDates({ start: null, finish: null });
  };

  const getColumnSearchProps = (
    dataIndex: ColumnSearchProps["dataIndex"],
    isExact?: ColumnSearchProps["isExact"],
    typeInput?: ColumnSearchProps["typeInput"]
  ) => {
    return {
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
        close,
      }: FilterDropdownProps) => (
        <div
          style={{ padding: 8 }}
          className="block max-w-[265px]"
          onKeyDown={(e) => e.stopPropagation()}
        >
          {typeInput === "rangepicker" ? (
            <RangePicker
              inputReadOnly={true}
              format={"DD-MM-YYYY"}
              defaultValue={[dates.start, dates.finish]}
              disabledDate={(current) =>
                current && current > dayjs().endOf("day")
              }
              ref={searchInput}
              value={[dates.start, dates.finish]}
              locale={locale}
              onChange={(dates) => {
                try {
                  if (dates) {
                    setDates({
                      start: dates[0],
                      finish: dates[1],
                    });
                  }
                } catch (e) {
                  setDates({ start: null, finish: null });
                  handleReset(clearFilters);
                  confirm({ closeDropdown: true });
                }
              }}
              style={{ marginBottom: 8 }}
            />
          ) : (
            <Input
              ref={searchInput}
              placeholder="Buscar"
              value={selectedKeys[0]}
              onChange={(e) =>
                setSelectedKeys(e.target.value ? [e.target.value] : [])
              }
              onPressEnter={() => handleSearch(confirm)}
              style={{ marginBottom: 8, display: "block" }}
            />
          )}

          <div>
            <div className="flex gap-2">
              <Button
                type="primary"
                className="flex items-center"
                onClick={() => {
                  if (typeInput === "rangepicker") {
                    setSelectedKeys([dates.start, dates.finish]);
                    handleSearch(confirm);
                    return;
                  }
                  handleSearch(confirm);
                }}
                icon={<SearchIcon className="size-4" />}
                size="small"
                style={{ width: 90 }}
              >
                Buscar
              </Button>
              <Button
                onClick={() => {
                  handleReset(clearFilters);
                  setDates({ start: null, finish: null });
                  confirm({ closeDropdown: true });
                }}
                size="small"
                style={{ width: 90 }}
              >
                Reiniciar
              </Button>
            </div>
            <div className="mt-2">
              <Button
                type="link"
                size="small"
                onClick={() => {
                  close();
                }}
              >
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      ),
      filterIcon: (filtered: boolean) =>
        typeInput === "rangepicker" ? (
          <CalendarIcon
            className="size-4"
            strokeWidth={"1.5"}
            color={filtered ? Colors.primary : undefined}
          />
        ) : (
          <SearchIcon
            className="size-4"
            color={filtered ? Colors.primary : undefined}
          />
        ),
      ...(typeInput !== "rangepicker" &&
        isLocalSearch && {
          onFilter: (value: React.Key | boolean, record: T) => {
            const record_value = record[dataIndex] as unknown as string;
            const string_value = String(value);

            if (isExact) {
              return record_value
                ? record_value.toLowerCase() === string_value.toLowerCase()
                : false;
            }

            return record_value
              ? record_value.toLowerCase().includes(string_value.toLowerCase())
              : false;
          },
        }),
      filterDropdownProps: {
        onOpenChange(open: boolean) {
          if (open) {
            setTimeout(() => searchInput.current?.select(), 100);
          }
        },
      },
      render: (text: string) => text,
    };
  };

  return { getColumnSearchProps, clearInputs };
};

export default useColumnSearch;
