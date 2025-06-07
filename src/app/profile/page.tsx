"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import Header from "../components/Header";
import { EditFilled } from "@ant-design/icons";
import EditProfileModal from "../components/EditProfileModal";

export type UserProfile = {
  id?: string; // optional here
  name?: string;
  avatar_url?: string;
  about?: string;
  skills?: string;
  education?: string;
  experience?: string;
};

export default function Profile() {
  const { user, logout } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, [user]);
  const handleAvatarUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    try {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();
      if (!authUser) return;

      // Check if user exists in database
      const { data: existingUser } = await supabase
        .from("users")
        .select("id")
        .eq("id", user.id)
        .single();

      // Get file extension properly
      const originalName = file.name;
      const lastDotIndex = originalName.lastIndexOf(".");
      const fileExtension =
        lastDotIndex > -1 ? originalName.substring(lastDotIndex + 1) : "";

      const timestamp = Date.now();
      const finalFileName = `avatar_${timestamp}.${fileExtension.toLowerCase()}`;
      const filePath = `${authUser.id}/${finalFileName}`;

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) return;

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      const avatarUrl = publicUrlData?.publicUrl;

      if (avatarUrl) {
        if (existingUser) {
          // User exists, update
          await supabase
            .from("users")
            .update({ avatar_url: avatarUrl })
            .eq("id", authUser.id);
        } else {
          // User doesn't exist, upsert
          await supabase.from("users").upsert({
            id: authUser.id,
            avatar_url: avatarUrl,
            email: authUser.email,
          });
        }

        fetchUserProfile();
      }
    } catch (error) {
      // Handle error silently or show user-friendly message
    }
  };

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
        .select("id, name, avatar_url, about, skills, education, experience")
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
        <div className="p-4 sm:p-0 flex items-center gap-1 sm:gap-4 sm:mb-6">
          <div
            className="mr-3 sm:mr-2 w-15 h-15 sm:w-[100px] sm:h-[100px] rounded-full overflow-hidden cursor-pointer flex-shrink-0"
            onClick={() => fileInputRef.current?.click()}
          >
            <Image
              src={userProfile?.avatar_url || "/default-avatar.png"}
              alt="User Avatar"
              width={100}
              height={100}
              className="w-full h-full object-cover"
            />
          </div>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleAvatarUpload}
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
                className=" text-base bg-[#50C878]  cursor-pointer text-white px-4 py-1 sm:px-5 sm:py-2 rounded-full font-semibold hover:bg-[#3fa963] transition"
              >
                Edit
              </button>
            </div>
            <p className="sm:text-lg text-base text-gray-500">
              Member since{" "}
              {user?.created_at
                ? new Date(user.created_at).toLocaleDateString()
                : "Unknown"}
            </p>
          </div>
        </div>

        <div
          className="border-0 sm:border sm:rounded-l-lg
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
