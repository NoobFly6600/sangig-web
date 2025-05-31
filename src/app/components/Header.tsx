"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { MessageFilled } from "@ant-design/icons";
import MenuDropDown from "./MenuDropDown";
import AvatarDropdown from "./AvatarDropdown";

interface HeaderProps {
  user: any;
  logout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, logout }) => {
  const router = useRouter();

  return (
    <header
      style={{
        paddingLeft: "clamp(1rem, 2vw, 10rem)",
        paddingRight: "clamp(1rem, 2vw, 10rem)",
      }}
      className="sticky top-0 z-50 bg-white py-3 sm:py-4 shadow flex justify-between items-center"
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

        <div className="flex items-center ml-auto">
          <button
            onClick={() => router.push(user ? "/post" : "/sign-in")}
            className="md:hidden bg-[#50C878] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#3fa963] transition cursor-pointer ml-4 mr-2 "
          >
            Post a job
          </button>

          {/* Mobile dropdown */}
          <div className="md:hidden">
            <MenuDropDown />
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center gap-5">
            {user ? (
              <>
                <span
                  onClick={() => router.push("/messages")}
                  className="text-3xl cursor-pointer text-gray-400 transition hover:text-gray-700"
                >
                  <MessageFilled />
                </span>
                <AvatarDropdown logout={logout} />
                <div className="h-8 border-l-2 border-gray-300 mr-2" />
                <button
                  onClick={() => router.push("/post")}
                  className="bg-[#50C878] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#3fa963] transition cursor-pointer"
                >
                  Post a job
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => router.push("/sign-in")}
                  className="bg-[#50C878] text-white font-semibold px-4 py-2 rounded-lg hover:bg-[#3fa963] transition cursor-pointer ml-4"
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
