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
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <p className="text-lg text-gray-700 mb-4">
          Welcome to SanGig – Gig jobs made simple.
        </p>
        {!loading && user && (
          <p className="text-green-600 font-medium">
            You are signed in as <strong>{user.email}</strong>.
          </p>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 text-center py-3 border-t text-sm text-gray-500">
        © {new Date().getFullYear()} SanGig. All rights reserved.
      </footer>
    </div>
  );
}
