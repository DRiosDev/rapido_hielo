import { Role } from "../types/roles";
import {
  CLIENTSPRIVATE,
  DASHBOARDPRIVATE,
  DISPATCHPRIVATE,
  INVENTORYMOVEMENTS,
  LOGOUT,
  MYACCOUNTPRIVATE,
  ORDERSPRIVATE,
  PRIVATEUSERS,
  PRODUCTSPRIVATE,
  USERSPRIVATE,
} from "./Paths";

//funcion que nos sirve para usarla en private routes
//cuando el usuario inicia sesion, de acuerdo a su rol, se le asigna una ruta por defecto
export const defaultRoutesByRole: Record<Role, string> = {
  [Role.OWNER]: DASHBOARDPRIVATE,
  [Role.ADMIN]: DASHBOARDPRIVATE,
  [Role.NORMAL]: PRODUCTSPRIVATE,
};

//rutas que tienen permisos de acceso por rol
export const routePermissions: Record<Role, string[]> = {
  //rutas dueño
  [Role.OWNER]: [
    DASHBOARDPRIVATE,
    ORDERSPRIVATE,
    DISPATCHPRIVATE,
    USERSPRIVATE,
    CLIENTSPRIVATE,
    PRODUCTSPRIVATE,
    INVENTORYMOVEMENTS,
    MYACCOUNTPRIVATE,
    PRIVATEUSERS,
    LOGOUT,
  ],

  //rutas admin
  [Role.ADMIN]: [
    DASHBOARDPRIVATE,
    ORDERSPRIVATE,
    DISPATCHPRIVATE,
    USERSPRIVATE,
    CLIENTSPRIVATE,
    PRODUCTSPRIVATE,
    INVENTORYMOVEMENTS,
    MYACCOUNTPRIVATE,
    PRIVATEUSERS,
    LOGOUT,
  ],

  //rutas normal
  [Role.NORMAL]: [PRODUCTSPRIVATE, DISPATCHPRIVATE, MYACCOUNTPRIVATE, PRIVATEUSERS, LOGOUT],
};
