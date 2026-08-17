import { Header } from "antd/es/layout/layout";
import { useState } from "react";
import { MenuHamburgerIcon } from "../ui/icons/MenuHamburgerIcon";
import { AppLogoVersion } from "./components/AppLogoVersion";
import { SideBarDrawer } from "./SideBarDrawer";

export const MobileHeader = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="block md:hidden sticky top-0 z-30">
      {/* @ts-ignore */}
      <Header
        style={{
          background: "#ffffff",
          padding: "0 16px",
          height: "60px",
          lineHeight: "60px",
          borderBottom: "1px solid #e5e7eb",
        }}
        className="flex items-center justify-between"
      >
        {/* Logo */}
        <div className="flex items-center gap-1">
          <AppLogoVersion />
        </div>

        {/* Button hamburger */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Abrir menú"
            className="flex items-center justify-center p-2 rounded-lg text-slate-700 hover:bg-slate-100 active:bg-slate-200 transition-colors cursor-pointer"
            onClick={() => setIsOpen(true)}
          >
            <MenuHamburgerIcon className="w-6 h-6 text-slate-800" />
          </button>
        </div>

        <SideBarDrawer isOpen={isOpen} setIsOpen={setIsOpen} />
      </Header>
    </div>
  );
};
