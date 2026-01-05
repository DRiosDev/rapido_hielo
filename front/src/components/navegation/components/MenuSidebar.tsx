import { Menu } from "antd";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthUser } from "../../../store/useAuthUser";
import {
  linkLogout,
  linksRoleAdmin,
  linksRoleNormal,
} from "../helpers/navigationLinks";
import { useSideBarHandlers } from "../hooks/useSideBarHandlers";
import { MenuItem } from "../types/menu";

type MenuSidebarProps = {
  closeDrawer?: () => void;
};

export const MenuSidebar = ({ closeDrawer }: MenuSidebarProps) => {
  const { isAuthenticated, userLogged } = useAuthUser();
  let navigate = useNavigate();
  const location = useLocation();

  const { defaultOpenKeys, handleClickAndClose } =
    useSideBarHandlers(linksRoleAdmin);

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    if (isAuthenticated && userLogged != null) {
      if (userLogged.role === "admin" || userLogged.role === "owner") {
        setMenuItems(linksRoleAdmin);
      } else {
        setMenuItems(linksRoleNormal);
      }
    }
  }, [isAuthenticated, userLogged]);

  return (
    <Menu
      className="px-2"
      defaultSelectedKeys={[location.pathname]}
      selectedKeys={[location.pathname]}
      defaultOpenKeys={defaultOpenKeys}
      disabledOverflow={false}
      selectable={false}
      onClick={(e) => {
        handleClickAndClose(e.key);
        navigate(e.key);

        if (closeDrawer) {
          closeDrawer();
        }
      }}
      mode="inline"
      items={[...menuItems, ...linkLogout]}
    />
  );
};
