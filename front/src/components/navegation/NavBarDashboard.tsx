import { useState } from "react";
import { AppLogoVersion } from "./components/AppLogoVersion";
import { SideBarDrawer } from "./SideBarDrawer";
import { MenuHamburgerIcon } from "../ui/icons/MenuHamburgerIcon";

export const NavBarDashboard = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="hidden md:flex justify-between items-center py-2 px-3 sm:px-6 border-b border-gray-200">
        <div className="flex flex-1">
          {/* Button open menu */}
          <button
            onKeyDown={(e) => {
              e.preventDefault();
            }}
            className="gap-1 flex items-center"
            onClick={() => setIsOpen(true)}
          >
            <MenuHamburgerIcon
              className={"color_icon_menu_item tamaño_icon_menu_item"}
            />
            <span className="text-base font-normal ">Menú</span>
          </button>
        </div>

        {/* Logo */}
        <AppLogoVersion />

        {/* Espacio a la derecha para equilibrar visualmente */}
        <div className="flex justify-end gap-x-2 flex-1 items-center" />
      </div>

      <SideBarDrawer isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
};
