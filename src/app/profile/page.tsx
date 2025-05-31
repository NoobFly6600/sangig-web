"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import Header from "../components/Header";

interface UserProfile {
  id: string;
  email: string;
  name: string;
  created_at: string;
}

export default function Profile() {
  const { user, logout } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("users")
        .select("id, email, name, created_at")
        .eq("id", user!.id)
        .single();

      if (error) {
        throw error;
      }

      setUserProfile(data);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setError("Failed to load profile data");
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
            Please sign in to view your profile.
          </p>
        </div>
      </>
    );
  }

  if (loading) {
    return (
      <>
        <Header user={user} logout={logout} />
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 bg-gray-300 rounded-full"></div>
              <div>
                <div className="h-6 bg-gray-300 rounded w-32 mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-48"></div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header user={user} logout={logout} />
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchUserProfile}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Try Again
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header user={user} logout={logout} />

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Image
            src="/default-avatar.png"
            alt="User Avatar"
            width={80}
            height={80}
            className="rounded-full"
          />
          <div>
            <h2 className="text-2xl font-semibold">
              {userProfile?.name || "No name set"}
            </h2>
            <p className="text-gray-600">{userProfile?.email || user.email}</p>
            <p className="text-sm text-gray-500">
              Member since{" "}
              {userProfile?.created_at
                ? new Date(userProfile.created_at).toLocaleDateString()
                : "Unknown"}
            </p>
          </div>
        </div>

        {/* You can add more profile sections here */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4">Profile Information</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <p className="text-gray-900">{userProfile?.name || "Not set"}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <p className="text-gray-900">
                {userProfile?.email || user.email}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Account Created
              </label>
              <p className="text-gray-900">
                {userProfile?.created_at
                  ? new Date(userProfile.created_at).toLocaleDateString()
                  : "Unknown"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
