"use client";
import React, { useEffect, useState } from "react";
import {
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
  ScheduleOutlined,
  GlobalOutlined,
  TranslationOutlined,
} from "@ant-design/icons";
import { useAuth } from "@/context/AuthContext";

import type { MenuProps } from "antd";
import { Dropdown, Modal } from "antd";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const AvatarDropdown: React.FC<{ logout: () => void }> = ({ logout }) => {
  const lang = localStorage.getItem("language");

  const router = useRouter();
  const { user } = useAuth();
  const [languageModalOpen, setLanguageModalOpen] = React.useState(false);
  const [selectedLanguage, setSelectedLanguage] = React.useState(
    () => localStorage.getItem("language") || "en"
  );
  const [avatarUrl, setAvatarUrl] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAvatar();
  }, []);
  const t = {
    profile: lang === "zh" ? "个人资料" : lang === "fr" ? "Profil" : "Profile",
    settings:
      lang === "zh" ? "设置" : lang === "fr" ? "Paramètres" : "Settings",
    postedJobs:
      lang === "zh"
        ? "已发布的工作"
        : lang === "fr"
        ? "Offres publiées"
        : "Posted jobs",
    language: lang === "zh" ? "语言" : lang === "fr" ? "Langue" : "Language",
    signOut:
      lang === "zh"
        ? "退出登录"
        : lang === "fr"
        ? "Se déconnecter"
        : "Sign Out",
  };
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
    { type: "divider" },
    {
      key: "2",
      label: (
        <div
          className="py-0 sm:py-2 text-base flex items-center gap-2"
          onClick={() => router.push("/profile")}
        >
          <UserOutlined className="text-[16px]" />
          {t.profile}
        </div>
      ),
    },
    { type: "divider" },
    {
      key: "3",
      label: (
        <div
          className="py-0 sm:py-2 text-base flex items-center gap-2"
          onClick={() => router.push("/settings")}
        >
          <SettingOutlined className="text-[16px]" />
          {t.settings}
        </div>
      ),
    },
    { type: "divider" },
    {
      key: "4",
      label: (
        <div className="py-0 sm:py-2 text-base flex items-center gap-2">
          <ScheduleOutlined className="text-[16px]" />
          {t.postedJobs}
        </div>
      ),
    },
    { type: "divider" },
    {
      key: "5",
      label: (
        <div
          className="py-0 sm:py-2 text-base flex items-center gap-2"
          onClick={() => setLanguageModalOpen(true)}
        >
          <TranslationOutlined className="text-[16px]" />
          {t.language}
        </div>
      ),
    },
    { type: "divider" },
    {
      key: "6",
      label: (
        <div
          className="py-0 sm:py-2 text-base text-red-600 font-medium flex items-center gap-2"
          onClick={logout}
        >
          <LogoutOutlined className="text-[16px]" />
          {t.signOut}
        </div>
      ),
    },
  ];
  const fetchAvatar = async () => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("avatar_url")
        .eq("id", user!.id)
        .single();

      if (error) throw error;

      setAvatarUrl(data.avatar_url);
    } catch (error) {
      console.error("Failed to fetch avatar:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Dropdown menu={{ items }} trigger={["hover"]} placement="bottomRight">
        <a onClick={(e) => e.preventDefault()}>
          <div className=" w-[30px] h-[30px]  sm:w-[36px] sm:h-[36px]  mx-1.5 sm:mx-0  rounded-full overflow-hidden cursor-pointer flex-shrink-0">
            {!loading && (
              <Image
                src={avatarUrl || "/default-avatar.png"}
                alt="User Avatar"
                width={36}
                height={36}
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </a>
      </Dropdown>
      <Modal
        title={
          lang === "zh"
            ? "选择语言"
            : lang === "fr"
            ? "Choisir la langue"
            : "Select Language"
        }
        open={languageModalOpen}
        onCancel={() => setLanguageModalOpen(false)}
        footer={null}
        centered
        width={240}
      >
        <div className="space-y-2 ">
          {[
            { code: "en", label: "English" },
            { code: "zh", label: "中文" },
            { code: "fr", label: "Français" },
          ].map((lang) => (
            <div
              key={lang.code}
              onClick={() => {
                localStorage.setItem("language", lang.code);
                window.location.reload();
              }}
              className={`cursor-pointer px-4 py-2 rounded-md border text-center ${
                selectedLanguage === lang.code
                  ? "bg-[#50c878] text-white"
                  : "border-gray-300 text-gray-800 hover:bg-gray-100"
              }`}
            >
              {lang.label}
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
};

export default AvatarDropdown;
