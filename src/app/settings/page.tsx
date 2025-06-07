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
    if (!newEmail) {
      setStatus("Please enter a new email address.");
      return;
    }

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

      setStatus(
        "To complete the email update, you must click the confirmation links sent to both your current and new email addresses."
      );
      setNewEmail("");
    } catch (error: any) {
      setStatus(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <>
        <Header user={user} logout={logout} />
        <div className="max-w-2xl mx-auto px-4 py-40">
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
        <h2 className="text-2xl font-bold mb-4">Account settings</h2>
        <div className="mb-2">
          <label htmlFor="email" className="block mb-2 font-semibold">
            Email address
          </label>
          <input
            type="email"
            id="email"
            className="border border-gray-300 rounded-lg px-3 py-2 w-full max-w-md font-base my-2 focus:outline-none focus:border-[#50C878]"
            placeholder={user.email}
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />

          {status && <p className="mt-3 text-sm text-gray-700">{status}</p>}
        </div>
        <button
          onClick={handleChangeEmail}
          className="mt-3 cursor-pointer px-4 py-2 bg-[#50C878] text-white rounded-lg hover:bg-[#3fa963] disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Email"}
        </button>
      </div>
    </>
  );
}
