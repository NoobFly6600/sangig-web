"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import { auth } from "@/firebase/config";
import Header from "./components/Header";

export default function Home() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  useEffect(() => {
    const completeSignIn = async () => {
      if (isSignInWithEmailLink(auth, window.location.href)) {
        const email = window.localStorage.getItem("emailForSignIn");
        if (email) {
          try {
            await signInWithEmailLink(auth, email, window.location.href);
            window.localStorage.removeItem("emailForSignIn");
          } catch (error) {
            console.error(error);
          }
        }
      }
    };

    completeSignIn();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header user={user} logout={logout} loading={loading} />

      {/* Main Body */}
      <main
        style={{
          paddingLeft: "clamp(1rem, 2vw, 10rem)",
          paddingRight: "clamp(1rem, 2vw, 10rem)",
        }}
        className="flex-1 flex flex-col items-center justify-center py-6 text-center"
      >
        <div style={{ maxWidth: "1280px", width: "100%" }} className="mx-auto">
          <p className="text-lg text-gray-700 mb-4">
            Job and Gig Search by SanGig. The #1 job site in Canada and the USA.
            Search millions of jobs from thousands of job boards, newspapers,
            classifieds and company websites on sangigs.com
          </p>
          {!loading && user && (
            <p className="text-green-600 font-medium">
              You are signed in as <strong>{user.email}</strong>.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
