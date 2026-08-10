import { Role } from "../types/roles";
import {
  CLIENTSPRIVATE,
  DASHBOARD,
  DISPATCHPRIVATE,
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
  [Role.OWNER]: DASHBOARD,
  [Role.ADMIN]: DASHBOARD,
  [Role.NORMAL]: PRODUCTSPRIVATE,
};

//rutas que tienen permisos de acceso por rol
export const routePermissions: Record<Role, string[]> = {
  //rutas dueño
  [Role.OWNER]: [
    DASHBOARD,
    ORDERSPRIVATE,
    DISPATCHPRIVATE,
    USERSPRIVATE,
    CLIENTSPRIVATE,
    PRODUCTSPRIVATE,
    MYACCOUNTPRIVATE,
    PRIVATEUSERS,
    LOGOUT,
  ],

  //rutas admin
  [Role.ADMIN]: [
    DASHBOARD,
    ORDERSPRIVATE,
    DISPATCHPRIVATE,
    USERSPRIVATE,
    CLIENTSPRIVATE,
    PRODUCTSPRIVATE,
    MYACCOUNTPRIVATE,
    PRIVATEUSERS,
    LOGOUT,
  ],

  //rutas normal
  [Role.NORMAL]: [PRODUCTSPRIVATE, MYACCOUNTPRIVATE, PRIVATEUSERS, LOGOUT],
};
