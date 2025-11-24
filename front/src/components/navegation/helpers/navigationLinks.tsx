import { ReactNode } from "react";
import {
  CLIENTSPRIVATE,
  DISPATCHPRIVATE,
  LOGOUT,
  ORDERSPRIVATE,
  PRODUCTSPRIVATE,
  USERSPRIVATE,
} from "../../../routes/Paths";
import { LogoutIcon } from "../../ui/icons/LogoutIcon";
import { UserIcon } from "../../ui/icons/UserIcon";
import { MenuItem } from "../types/menu";
import { IceIcon } from "../../ui/icons/IceIcon";
import { ClientIcon } from "../../ui/icons/ClientIcon";
import { MenuHamburgerIcon } from "../../ui/icons/MenuHamburgerIcon";

function getItem(
  label: ReactNode,
  key: string,
  icon?: ReactNode,
  children?: MenuItem[],
  type?: string
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

/* RUTAS ADMIN */
/* RUTAS ADMIN */
/* RUTAS ADMIN */
/* RUTAS ADMIN */
/* RUTAS ADMIN */
/* RUTAS ADMIN */
export const linksRoleAdmin = [
  getItem(
    <p className="title_menu_item">Ordenes</p>,
    ORDERSPRIVATE,
    //Icons
    <div className="contenedor_icon_menu_item">
      <MenuHamburgerIcon
        className={"color_icon_menu_item tamaño_icon_menu_item"}
      />
    </div>
  ),
  getItem(
    <p className="title_menu_item">Despachos</p>,
    DISPATCHPRIVATE,
    //Icons
    <div className="contenedor_icon_menu_item">
      <MenuHamburgerIcon
        className={"color_icon_menu_item tamaño_icon_menu_item"}
      />
    </div>
  ),
  getItem(
    <p className="title_menu_item">Usuarios</p>,
    USERSPRIVATE,
    //Icons
    <div className="contenedor_icon_menu_item">
      <UserIcon styles={"color_icon_menu_item tamaño_icon_menu_item"} />
    </div>
  ),
  getItem(
    <p className="title_menu_item">Clientes</p>,
    CLIENTSPRIVATE,
    //Icons
    <div className="contenedor_icon_menu_item">
      <ClientIcon className={"color_icon_menu_item tamaño_icon_menu_item"} />
    </div>
  ),
  getItem(
    <p className="title_menu_item">Productos</p>,
    PRODUCTSPRIVATE,
    //Icons
    <div className="contenedor_icon_menu_item">
      <IceIcon className={"color_icon_menu_item tamaño_icon_menu_item"} />
    </div>
  ),
];

/* RUTAS NORMAL */
/* RUTAS NORMAL */
/* RUTAS NORMAL */
/* RUTAS NORMAL */
/* RUTAS NORMAL */
/* RUTAS NORMAL */
export const linksRoleNormal = [
  /*   getItem(
    <p className="title_menu_item">Productos</p>,
    PRODUCTSPRIVATE,
    //Icons
    <div className="contenedor_icon_menu_item">
      <UserIcon styles={"color_icon_menu_item tamaño_icon_menu_item"} />
    </div>
  ), */
];

export const linkLogout = [
  getItem(
    <p className="title_menu_item hover:bg-[#F0F0F0]">Cerrar sesión</p>,
    LOGOUT,
    <div className="contenedor_icon_menu_item">
      <LogoutIcon className={"color_icon_menu_item tamaño_icon_menu_item"} />
    </div>
  ),
];
