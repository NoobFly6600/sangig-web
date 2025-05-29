"use client";

import React from "react";
import type { MenuProps } from "antd";
import { Dropdown } from "antd";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { MenuOutlined } from "@ant-design/icons";

interface MenuDropDownProps {
  setDrawerOpen?: (open: boolean) => void;
}

const MenuDropDown: React.FC<MenuDropDownProps> = ({ setDrawerOpen }) => {
  const router = useRouter();
  const { user, logout } = useAuth();

  // Define onClick handler for menu items
  const onClick: MenuProps["onClick"] = ({ key }) => {
    if (setDrawerOpen) setDrawerOpen(false);

    switch (key) {
      case "home":
        router.push("/");
        break;
      case "messages":
        router.push("/messages");
        break;
      case "profile":
        router.push("/profile");
        break;
      case "post":
        router.push(user ? "/post" : "/sign-in");
        break;
      case "posted":
        router.push("/post");
        break;
      case "sign-in":
        router.push("/sign-in");
        break;
      case "sign-out":
        logout();
        break;
    }
  };

  // Define menu items array
  const items: MenuProps["items"] = user
    ? [
        {
          key: "home",
          label: (
            <span className="py-2 pr-30 text-base flex items-center gap-2">
              Home
            </span>
          ),
        },
        {
          type: "divider",
        },
        {
          key: "messages",
          label: (
            <span className="py-2  text-base flex items-center gap-2">
              Messages
            </span>
          ),
        },
        {
          type: "divider",
        },
        {
          key: "profile",
          label: (
            <span className="py-2 text-base flex items-center gap-2">
              Profile
            </span>
          ),
        },
        {
          type: "divider",
        },
        {
          key: "post",
          label: (
            <span className="py-2 text-base flex items-center gap-2">
              Post a job
            </span>
          ),
        },
        {
          type: "divider",
        },
        {
          key: "posted",
          label: (
            <span className="py-2 text-base flex items-center gap-2">
              Posted jobs
            </span>
          ),
        },
        {
          type: "divider",
        },
        {
          key: "sign-out",
          label: (
            <span className="py-2 text-base flex items-center gap-2 text-red-500">
              Sign out
            </span>
          ),
        },
      ]
    : [
        {
          key: "home",
          label: (
            <span className="py-2 pr-30 text-base flex items-center gap-2">
              Home
            </span>
          ),
        },
        {
          type: "divider",
        },
        {
          key: "sign-in",
          label: (
            <span className="py-2  text-base flex items-center gap-2">
              Sign in
            </span>
          ),
        },
        {
          type: "divider",
        },
        {
          key: "post",
          label: (
            <span className="py-2 text-base flex items-center gap-2">
              Post a job
            </span>
          ),
        },
      ];

  return (
    <Dropdown
      menu={{ items, onClick }}
      trigger={["click"]}
      placement="bottomRight"
    >
      <a
        onClick={(e) => e.preventDefault()}
        className="text-xl cursor-pointer px-2 py-1 rounded-lg hover:bg-gray-100 inline-block"
      >
        <MenuOutlined />
      </a>
    </Dropdown>
  );
};

export default MenuDropDown;
