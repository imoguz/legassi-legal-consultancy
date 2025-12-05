"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, Dropdown } from "antd";
import { logout } from "@/rtk/features/authSlice";
import { UserOutlined } from "@ant-design/icons";
import { getAuthVerifyFromToken } from "@/utils/helpers";
import { USER_MENU_ITEMS } from "@/utils/constants";
import { useLogoutMutation } from "@/rtk/api/authApi";

const UserMenu = () => {
  const user = useSelector((state) => state.auth.user);
  const router = useRouter();
  const dispatch = useDispatch();
  const [logoutMutation, { isLoading }] = useLogoutMutation();
  useEffect(() => {
    getAuthVerifyFromToken();
  }, []);

  const handleMenuClick = async ({ key }) => {
    switch (key) {
      case "profile":
        router.push("/profile");
        break;
      case "settings":
        router.push("/dashboard/settings");
        break;
      case "logout":
        await logoutMutation().unwrap();
        router.push("/");
        break;
      default:
        break;
    }
  };

  return (
    <Dropdown
      menu={{ items: USER_MENU_ITEMS, onClick: handleMenuClick }}
      placement="bottomRight"
      trigger={["click"]}
    >
      <Avatar
        shape="circle"
        size="small"
        icon={<UserOutlined />}
        style={{ backgroundColor: "#87d068" }}
        className="cursor-pointer"
        src={user?.profilePicture || null}
      />
    </Dropdown>
  );
};

export default UserMenu;
