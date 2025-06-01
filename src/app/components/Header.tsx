"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { MessageOutlined, PlusCircleOutlined } from "@ant-design/icons";
import AvatarDropdown from "./AvatarDropdown";

interface HeaderProps {
  user: any;
  logout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, logout }) => {
  const router = useRouter();
  const pathname = usePathname();

  const isMessages = pathname === "/messages";
  return (
    <header
      style={{
        paddingLeft: "clamp(1rem, 2vw, 10rem)",
        paddingRight: "clamp(0rem, 2vw, 10rem)",
      }}
      className="sticky top-0 z-50 bg-white shadow flex justify-between items-center"
    >
      <div
        style={{ maxWidth: "1280px", width: "100%" }}
        className="mx-auto flex justify-between items-center"
      >
        <button
          onClick={() => router.push("/")}
          className="text-2xl sm:text-3xl font-bold text-[#50C878] cursor-pointer focus:outline-none hover:text-[#3fa963]"
        >
          SanGig
        </button>

        <div className="flex items-center ml-auto ">
          {/* Small screens - user logged in */}
          {user && (
            <div className="flex sm:hidden items-center gap-1">
              <button
                onClick={() => router.push("/post")}
                className={`p-2 text-3xl cursor-pointer transition border-b-2 ${
                  pathname === "/post"
                    ? "border-[#50C878] text-[#50C878]"
                    : "border-transparent text-gray-400 hover:border-[#50C878]"
                }`}
              >
                <PlusCircleOutlined />
              </button>
              <span
                onClick={() => router.push("/messages")}
                className={`p-2 text-3xl cursor-pointer transition border-b-2 ${
                  isMessages
                    ? "border-[#50C878] text-[#50C878]"
                    : "border-transparent text-gray-400 hover:border-[#50C878]"
                }`}
              >
                <MessageOutlined />
              </span>
              <AvatarDropdown logout={logout} />
            </div>
          )}

          {/* Small screens - no user */}
          {!user && (
            <div className="flex sm:hidden items-center gap-3">
              <button
                onClick={() => router.push("/sign-in")}
                className="bg-[#50C878] my-2 cursor-pointer text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#3fa963] transition"
              >
                Post a job
              </button>
            </div>
          )}

          {/* Desktop screens */}
          <div className="hidden sm:flex items-center gap-3">
            {user ? (
              <>
                <span
                  onClick={() => router.push("/messages")}
                  className={`p-3 text-3xl cursor-pointer transition border-b-2 ${
                    isMessages
                      ? "border-[#50C878] text-[#50C878]"
                      : "border-transparent text-gray-400 hover:border-[#50C878]"
                  }`}
                >
                  <MessageOutlined />
                </span>
                <AvatarDropdown logout={logout} />
                <div className="h-8 border-l-2 border-gray-300 mx-4 mr-6" />
                <button
                  onClick={() => router.push("/post")}
                  className="bg-[#50C878] cursor-pointer text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#3fa963] transition"
                >
                  Post a job
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => router.push("/sign-in")}
                  className="cursor-pointer bg-[#50C878] my-3 text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#3fa963] transition"
                >
                  Sign in
                </button>
                <button
                  onClick={() => router.push("/sign-in")}
                  className="px-2 py-2 font-semibold hover:text-[#3fa963] transition cursor-pointer"
                >
                  Post a job
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
