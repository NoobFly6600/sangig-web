"use client";
import React from "react";
import {
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
  ScheduleOutlined,
} from "@ant-design/icons";
import { useAuth } from "@/context/AuthContext";

import type { MenuProps } from "antd";
import { Dropdown } from "antd";
import Image from "next/image";
import { useRouter } from "next/navigation";

const AvatarDropdown: React.FC<{ logout: () => void }> = ({ logout }) => {
  const router = useRouter();
  const { user } = useAuth();

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <div className="py-0 sm:py-2 text-base text-gray-500 sm:pr-20">
          {user?.email}
        </div>
      ),
      disabled: true,
    },
    {
      type: "divider",
    },
    {
      key: "2",
      label: (
        <div
          className="py-0 sm:py-2 text-base flex items-center gap-2"
          onClick={() => router.push("/profile")}
        >
          <UserOutlined className="text-[16px]" />
          Profile
        </div>
      ),
    },
    {
      type: "divider",
    },
    {
      key: "3",
      label: (
        <div
          className="py-0 sm:py-2 text-base flex items-center gap-2"
          onClick={() => router.push("/settings")}
        >
          <SettingOutlined className="text-[16px]" />
          Settings
        </div>
      ),
    },
    {
      type: "divider",
    },
    {
      key: "4",
      label: (
        <div className="py-0 sm:py-2 text-base flex items-center gap-2">
          <ScheduleOutlined className="text-[16px]" />
          Posted jobs
        </div>
      ),
    },
    {
      type: "divider",
    },
    {
      key: "5",
      label: (
        <div
          className="py-0 sm:py-2 text-base text-red-600 font-medium flex items-center gap-2"
          onClick={logout}
        >
          <LogoutOutlined className="text-[16px]" />
          Sign Out
        </div>
      ),
    },
  ];

  return (
    <Dropdown menu={{ items }} trigger={["hover"]} placement="bottomRight">
      <a onClick={(e) => e.preventDefault()}>
        <Image
          src="/default-avatar.png"
          alt="Account"
          width={45}
          height={45}
          className="rounded-full cursor-pointer w-9 h-9 sm:w-[45px] sm:h-[45px]"
        />
      </a>
    </Dropdown>
  );
};

export default AvatarDropdown;
