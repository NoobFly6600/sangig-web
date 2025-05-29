// components/Header.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { MessageFilled } from "@ant-design/icons";
import MenuDropDown from "./MenuDropDown"; // adjust path if needed
import AvatarDropdown from "./AvatarDropdown"; // adjust path if needed

interface HeaderProps {
  user: any;
  logout: () => void;
  loading: boolean;
}

const Header: React.FC<HeaderProps> = ({ user, logout, loading }) => {
  const router = useRouter();

  return (
    <header className="px-6 md:px-10 py-4 shadow flex justify-between items-center">
      <button
        onClick={() => router.push("/")}
        className="text-2xl md:text-3xl font-bold text-[#50C878] cursor-pointer focus:outline-none hover:opacity-80"
      >
        SanGig
      </button>

      {!loading && (
        <div className="flex items-center ml-auto">
          {!user && (
            <button
              onClick={() => router.push("/sign-in")}
              className="bg-[#50C878] text-white mr-3 px-4 py-2 rounded-lg hover:bg-[#3fa963] transition cursor-pointer ml-4"
            >
              Sign in
            </button>
          )}
          {/* Mobile dropdown */}
          <div className="md:hidden">
            <MenuDropDown />
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <span
                  onClick={() => router.push("/messages")}
                  className="text-3xl cursor-pointer text-gray-400 transition hover:text-[#50C878]"
                >
                  <MessageFilled />
                </span>
                <AvatarDropdown logout={logout} />
                <div className="h-8 border-l-2 border-gray-300 mx-1" />
                <button
                  onClick={() => router.push("/post")}
                  className="px-2 py-2 font-semibold hover:text-[#3fa963] transition cursor-pointer"
                >
                  Post a job
                </button>
              </>
            ) : (
              <button
                onClick={() => router.push("/sign-in")}
                className="px-2 py-2 font-semibold hover:text-[#3fa963] transition cursor-pointer"
              >
                Post a job
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
