import { Role } from "../types/roles";
import {
  CLIENTSPRIVATE,
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
  [Role.ADMIN]: ORDERSPRIVATE,
  [Role.NORMAL]: MYACCOUNTPRIVATE,
};

//rutas que tienen permisos de acceso por rol
export const routePermissions: Record<Role, string[]> = {
  //rutas admin
  [Role.ADMIN]: [
    ORDERSPRIVATE,
    USERSPRIVATE,
    CLIENTSPRIVATE,
    PRODUCTSPRIVATE,
    MYACCOUNTPRIVATE,
    PRIVATEUSERS,
    LOGOUT,
  ],

  //rutas normal
  [Role.NORMAL]: [MYACCOUNTPRIVATE, PRIVATEUSERS, LOGOUT],
};
