"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  GlobalOutlined,
  MessageOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import AvatarDropdown from "./AvatarDropdown";
import { Modal } from "antd";

interface HeaderProps {
  user: any;
  logout: () => void;
  loading?: boolean; // optional prop
}

const Header: React.FC<HeaderProps> = ({ user, logout, loading }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [languageModalOpen, setLanguageModalOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  useEffect(() => {
    const langFromStorage = localStorage.getItem("language");
    const browserLang = navigator.language;

    const resolvedLang =
      langFromStorage ||
      (browserLang.startsWith("zh")
        ? "zh"
        : browserLang.startsWith("fr")
        ? "fr"
        : "en");

    setSelectedLanguage(resolvedLang);

    // Store it if not already stored
    if (!langFromStorage) {
      localStorage.setItem("language", resolvedLang);
    }
  }, []);
  return (
    <header
      style={{
        paddingLeft: "clamp(1rem, 2vw, 10rem)",
        paddingRight: "clamp(0rem, 2vw, 10rem)",
      }}
      className="sticky  top-0 z-50 bg-white shadow flex justify-between items-center"
    >
      <div
        style={{ maxWidth: "1200px", width: "100%" }}
        className="mx-auto flex justify-between items-center"
      >
        <button
          onClick={() => router.push("/")}
          className="py-2 text-2xl sm:text-3xl font-bold text-[#50C878] cursor-pointer focus:outline-none hover:text-[#3fa963]"
        >
          {selectedLanguage === "zh" ? "闪职" : "Sangig"}
        </button>

        <div className="flex items-center ml-auto">
          {loading ? (
            <></>
          ) : (
            <>
              <div className="flex items-center gap-1 sm:gap-3 ">
                {user ? (
                  <>
                    <span
                      onClick={() => router.push("/messages")}
                      className={`p-2 pt-2.5 sm:pt-3.5 sm:p-3 text-2xl sm:text-3xl cursor-pointer transition border-b-2 ${
                        pathname === "/messages"
                          ? "border-[#50C878] text-[#50C878]"
                          : "border-transparent text-gray-400 hover:border-[#50C878]"
                      }`}
                    >
                      <MessageOutlined />
                    </span>
                    <AvatarDropdown logout={logout} />
                    <div className="h-7 sm:h-9 border-l-2 border-gray-300 mx-2 mr-4 sm:mx-4 sm:mr-6" />
                    <button
                      onClick={() => router.push("/post")}
                      className="bg-[#50C878] text-white cursor-pointer transition hover:bg-[#3fa963]
                      px-3 py-1 text-base font-medium
                      sm:px-5 sm:py-1.5 sm:text-lg sm:font-semibold
                      rounded-lg"
                    >
                      {selectedLanguage === "zh"
                        ? "招人"
                        : selectedLanguage === "fr"
                        ? "Recruter"
                        : "Recruit"}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setLanguageModalOpen(true)}
                      className="px-2 py-1 text-base font-medium mr-1 
                      sm:px-3 sm:py-1.5 sm:text-lg sm:font-semibold rounded-lg  text-gray-400 hover:text-black hover:bg-gray-100 transition cursor-pointer"
                    >
                      {selectedLanguage === "zh"
                        ? "中"
                        : selectedLanguage === "fr"
                        ? "Fr"
                        : "En"}
                    </button>

                    <button
                      onClick={() => router.push("/sign-in")}
                      className="bg-[#50C878] text-white cursor-pointer transition hover:bg-[#3fa963]
                      px-3 py-1 my-2 text-base font-medium
                      sm:px-5 sm:py-1.5 sm:my-3 sm:text-lg sm:font-semibold
                      rounded-lg"
                    >
                      {selectedLanguage === "zh"
                        ? "登录"
                        : selectedLanguage === "fr"
                        ? "Se connecter"
                        : "Sign in"}
                    </button>
                    <button
                      onClick={() => router.push("/sign-in")}
                      className=" px-2 py-1 text-base font-medium
                      sm:px-4 sm:py-1.5 sm:text-lg sm:font-semibold
                      hover:text-[#3fa963] transition cursor-pointer"
                    >
                      {selectedLanguage === "zh"
                        ? "招人"
                        : selectedLanguage === "fr"
                        ? "Recruter"
                        : "Recruit"}
                    </button>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      <Modal
        title={
          selectedLanguage === "zh"
            ? "选择语言"
            : selectedLanguage === "fr"
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
    </header>
  );
};

export default Header;
