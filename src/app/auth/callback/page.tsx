"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { LoadingOutlined } from "@ant-design/icons";
export default function AuthCallbackSimple() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // This will automatically handle the callback and set the session
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("Error getting session:", error.message);
          router.replace("/sign-in");
          return;
        }

        if (session) {
          // Clean up localStorage
          window.localStorage.removeItem("emailForSignIn");
          router.replace("/");
        } else {
          // No session found, redirect to sign-in
          router.replace("/sign-in");
        }
      } catch (error) {
        console.error("Callback error:", error);
        router.replace("/sign-in");
      }
    };

    // Add a small delay to ensure URL params are processed
    const timer = setTimeout(handleCallback, 100);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="p-4 flex justify-center text-gray-500">
      <LoadingOutlined style={{ fontSize: 24 }} spin />
    </div>
  );
}
