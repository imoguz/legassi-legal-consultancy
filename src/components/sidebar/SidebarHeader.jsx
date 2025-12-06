"use client";

import {
  BellOutlined,
  SearchOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Input } from "antd";
import { usePathname } from "next/navigation";
import UserMenu from "../layouts/UserMenu";
import NotificationBell from "../common/NotificationBell";

const SidebarHeader = () => {
  const pathname = usePathname();

  return (
    <div className="flex items-center w-full px-10">
      <div className="ml-auto flex gap-8 items-center px-5">
        <NotificationBell />
        <UserMenu />
      </div>
    </div>
  );
};

export default SidebarHeader;
