import { Drawer } from "antd";
import { DataUser } from "./components/DataUser";
import { MenuSidebar } from "./components/MenuSidebar";
import { AppLogoVersion } from "./components/AppLogoVersion";

type SideBarDrawerProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

export const SideBarDrawer = ({ isOpen, setIsOpen }: SideBarDrawerProps) => {
  const closeDrawer = () => {
    setIsOpen(false);
  };

  return (
    <Drawer
      title={
        <div className="flex items-center gap-2 py-1">
          <AppLogoVersion />
        </div>
      }
      placement="left"
      width={280}
      onClose={() => setIsOpen(false)}
      open={isOpen}
      styles={{
        body: { padding: 0, display: "flex", flexDirection: "column" },
      }}
    >
      <div className="flex flex-col h-full">
        <div className="py-2">
          <MenuSidebar closeDrawer={closeDrawer} />
        </div>

        <div className="mt-auto">
          <div className="block">
            <DataUser closeDrawer={closeDrawer} />
          </div>
        </div>
      </div>
    </Drawer>
  );
};
