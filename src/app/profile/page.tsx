"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import Header from "../components/Header";
import { EditFilled } from "@ant-design/icons";
import EditProfileModal from "../components/EditProfileModal";

export type UserProfile = {
  id?: string; // optional here
  name?: string;
  about?: string;
  skills?: string;
  education?: string;
  experience?: string;
  created_at?: string;
};

export default function Profile() {
  const { user, logout } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, [user]);
  const handleSave = async (updatedProfile: UserProfile) => {
    if (!updatedProfile.id) {
      console.error("User ID is missing");
      return;
    }

    const { error } = await supabase
      .from("users")
      .update({
        name: updatedProfile.name,
        about: updatedProfile.about,
        skills: updatedProfile.skills,
        education: updatedProfile.education,
        experience: updatedProfile.experience,
      })
      .eq("id", updatedProfile.id);

    if (error) {
      console.error("Failed to update profile:", error.message);
    } else {
      console.log("Profile updated successfully.");
      setShowEditModal(false);
      setUserProfile(updatedProfile);
    }
  };

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("users")
        .select(
          "id, email, name, about, skills, education, experience, created_at"
        )
        .eq("id", user!.id)
        .single();

      if (error) throw error;
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
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gray-300 rounded-full" />
              <div>
                <div className="h-6 bg-gray-300 rounded w-32 mb-2" />

                <div className="h-3 bg-gray-200 rounded w-40 mt-1" />
              </div>
            </div>
            <div className="bg-gray-100 rounded-lg p-6 space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i}>
                  <div className="h-4 bg-gray-300 rounded w-24 mb-2" />
                  <div className="h-5 bg-gray-200 rounded w-full" />
                </div>
              ))}
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
        <div className="flex flex-col items-center justify-center text-center min-h-screen">
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchUserProfile}
            className="px-4 py-2 cursor-pointer bg-[#50c878] text-white rounded-full hover:bg-[#3fa963]"
          >
            Retry
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Header user={user} logout={logout} />
      <div className="max-w-3xl mx-auto px-2 sm:px-4 py-2 sm:py-8">
        <div className="flex items-center gap-1 sm:gap-4 sm:mb-6">
          <Image
            src="/default-avatar.png"
            alt="User Avatar"
            width={120}
            height={120}
            className="rounded-full  w-20 h-20 sm:w-[120px] sm:h-[120px]"
          />
          <div className="w-full ">
            {/* Make this div take full width */}
            <div className="flex justify-between items-center">
              <h2 className="text-2xl sm:text-3xl font-semibold sm:mb-0 mb-1">
                {userProfile?.name || "No name set"}
              </h2>

              {/* Show only on small and up */}
              <button
                onClick={() => setShowEditModal(true)}
                className=" text-base bg-[#50C878]  cursor-pointer text-white px-4 sm:mr-0 mr-2 py-1 sm:px-5 sm:py-2 rounded-full font-semibold hover:bg-[#3fa963] transition"
              >
                Edit
              </button>
            </div>
            <p className="sm:text-lg text-base text-gray-500">
              Member since{" "}
              {userProfile?.created_at
                ? new Date(userProfile.created_at).toLocaleDateString()
                : "Unknown"}
            </p>
          </div>
        </div>

        <div
          className="   border-0 sm:border sm:rounded-l-lg
            sm:[border-width:1.5px] sm:border-gray-300 rounded-lg p-4 sm:p-6 "
        >
          <div className="space-y-3">
            <ProfileField label="About" value={userProfile?.about} />
            <ProfileField label="Skills" value={userProfile?.skills} />
            <ProfileField label="Education" value={userProfile?.education} />
            <ProfileField label="Experience" value={userProfile?.experience} />
          </div>
        </div>
      </div>
      <EditProfileModal
        visible={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handleSave}
        userProfile={userProfile}
      />
    </>
  );
}

function ProfileField({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <label className="block sm:text-lg text-base font-semibold">
        {label}
      </label>
      <p className="text-gray-900 whitespace-pre-wrap">{value || "Empty"}</p>
    </div>
  );
}
