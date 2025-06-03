"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import Header from "../components/Header";

export default function Settings() {
  const { user, logout } = useAuth();
  const [newEmail, setNewEmail] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangeEmail = async () => {
    if (!newEmail) return;

    setLoading(true);
    setStatus("");

    try {
      // Update email in Supabase Auth
      const { error: authError } = await supabase.auth.updateUser({
        email: newEmail,
      });

      if (authError) {
        throw authError;
      }

      setStatus("Email updated. Please confirm via your inbox.");
      setNewEmail("");
    } catch (error: any) {
      setStatus(`${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <>
        <Header user={user} logout={logout} />
        <div className="max-w-2xl mx-auto px-4 py-8">
          <p className="text-center text-gray-600">
            Please sign in to change settings
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header user={user} logout={logout} />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-4">Settings</h2>
        <div className="mb-6">
          <label htmlFor="email" className="block mb-2 font-semibold">
            Change Email
          </label>
          <input
            type="email"
            id="email"
            className="border border-gray-300 p-2 rounded w-full max-w-md"
            placeholder={user.email}
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
          <button
            onClick={handleChangeEmail}
            className="mt-3 px-4 py-2 bg-[#50C878] text-white rounded hover:bg-[#3fa963] disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Email"}
          </button>
          {status && <p className="mt-3 text-sm text-gray-700">{status}</p>}
        </div>
      </div>
    </>
  );
}
