import { lazy } from "react";
import { Route } from "react-router-dom";

import {
  CLIENTSPRIVATE,
  DISPATCHPRIVATE,
  LOGOUT,
  MYACCOUNTPRIVATE,
  ORDERSPRIVATE,
  PRIVATEUSERS,
  PRODUCTSPRIVATE,
  USERSPRIVATE,
} from "./Paths";
import { ProtectedRouteUsers } from "./ProtectedRouteUsers";
const ProductsPrivate = lazy(() => import("../views/private/ProductsPrivate"));
const UsersPrivate = lazy(() => import("../views/private/UsersPrivate"));
const ClientsPrivate = lazy(() => import("../views/private/ClientsPrivate"));
const MyAccountPrivate = lazy(
  () => import("../views/private/configuration-user/MyAccountPrivate")
);
import Logout from "../views/private/Logout";
import PrivateUsers from "../views/private/PrivateUsers";
import OrdersPrivate from "../views/private/OrdersPrivate";
import DispatchPrivate from "../views/private/DispatchPrivate";

export const PrivateRoutes = () => {
  return (
    <>
      <Route path={PRIVATEUSERS} element={<ProtectedRouteUsers />}>
        <Route index element={<PrivateUsers />} />
        <Route path={MYACCOUNTPRIVATE} element={<MyAccountPrivate />} />
        <Route path={ORDERSPRIVATE} element={<OrdersPrivate />} />
        <Route path={DISPATCHPRIVATE} element={<DispatchPrivate />} />
        <Route path={USERSPRIVATE} element={<UsersPrivate />} />
        <Route path={CLIENTSPRIVATE} element={<ClientsPrivate />} />
        <Route path={PRODUCTSPRIVATE} element={<ProductsPrivate />} />
        <Route path={LOGOUT} element={<Logout />} />
      </Route>
    </>
  );
};
