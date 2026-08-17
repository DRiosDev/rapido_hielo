import { Layout, Spin } from "antd";
import { Suspense } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { DesktopSideBar } from "../components/navegation/DesktopSideBar";
import { MobileHeader } from "../components/navegation/MobileHeader";
import { FooterDashboard } from "../components/ui/FooterDashboard";
import { useAuthUser } from "../store/useAuthUser";
import { LOGIN, UNAUTHORIZED } from "./Paths";
import { routePermissions } from "./permissionsRole";
import { NavBarDashboard } from "../components/navegation/NavBarDashboard";
import Meta from "../components/ui/Meta";
import { FloatButtonDashboard } from "../components/ui/FloatButtonDashboard";

const isDesktopSideBar = true;

export const ProtectedRouteUsers = () => {
  const { isAuthenticated, userLogged } = useAuthUser();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={LOGIN} replace state={{ from: location }} />;
  }

  if (!userLogged) {
    return null;
  }

  const allowerPaths = routePermissions[userLogged.role];

  if (allowerPaths && !allowerPaths.includes(location.pathname)) {
    // Si hay restricciones y el rol no está autorizado
    return <Navigate to={UNAUTHORIZED} replace />;
  }

  const { Content } = Layout;

  return (
    <>
      <Meta
        title="App"
        description="Solicita un enlace para restablecer tu contraseña."
      />

      <Layout>
        <MobileHeader />

        <Layout className="h-full bg-white">
          {isDesktopSideBar ? <DesktopSideBar /> : <NavBarDashboard />}

          {/* CONTENT */}
          <Content className="flex flex-col min-h-screen bg-white">
            <div className="flex-grow px-3 sm:px-6 mt-3 sm:mt-[22px]">
              <Suspense
                fallback={
                  <div className="flex justify-center w-full py-10">
                    <Spin />
                  </div>
                }
              >
                <Outlet />
              </Suspense>
            </div>
            <FooterDashboard />
          </Content>
        </Layout>
      </Layout>

      <FloatButtonDashboard />
    </>
  );
};
