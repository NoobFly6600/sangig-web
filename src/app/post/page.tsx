"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import Header from "../components/Header";

const cities = [
  "Toronto, ON",
  "Vancouver, BC",
  "Montreal, QC",
  "Calgary, AB",
  "Ottawa, ON",
];
type JobFormData = {
  type: string;
  title: string;
  company_name?: string;
  number_of_openings?: string;
  language: string[];
  location: string; // ✅ this holds either "remote" or "City, Province"
  job_type: string[];
  pay: string;
  description: string;
  phone?: string;
  email?: string;
  status?: string;
};

export default function Post() {
  const { user, logout } = useAuth();
  const [formData, setFormData] = useState<JobFormData>({
    type: "",
    title: "",
    company_name: "",
    number_of_openings: "",
    language: [],
    location: "",
    job_type: [],
    pay: "",
    description: "",
    phone: "",
    email: "",
    status: "",
  });

  const handleChange = <K extends keyof JobFormData>(
    key: K,
    value: JobFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  if (!user) {
    return (
      <>
        <Header user={user} logout={logout} />
        <div className="max-w-2xl mx-auto px-4 py-8">
          <p className="text-center text-gray-600">
            Please sign in to post jobs.
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header user={user} logout={logout} />
      <div className="max-w-3xl mx-auto px-2 sm:px-4 py-2 sm:py-8 space-y-6">
        <h1 className="text-xl font-semibold">Post a Job</h1>

        {/* Type */}
        <div>
          <label className="block font-medium mb-1">Type *</label>
          <div className="flex gap-2">
            {["individual", "recruiter", "company"].map((opt) => (
              <button
                key={opt}
                onClick={() => handleChange("type", opt)}
                className={`px-3 py-1 rounded-md border ${
                  formData.type === opt
                    ? "bg-[#50c878] text-white"
                    : "border-gray-300"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block font-medium mb-1">Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        {/* Company Name */}
        <div>
          <label className="block font-medium mb-1">Company Name</label>
          <input
            type="text"
            value={formData.company_name}
            onChange={(e) => handleChange("company_name", e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Number of Openings */}
        <div>
          <label className="block font-medium mb-1">Number of Openings</label>
          <select
            value={formData.number_of_openings}
            onChange={(e) => handleChange("number_of_openings", e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Select</option>
            {[1, 2, 3, 4, 5, "10+"].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        {/* Language */}
        <div>
          <label className="block font-medium mb-1">Language *</label>
          <div className="flex gap-2">
            {["english", "中文", "Français"].map((lang) => (
              <button
                key={lang}
                onClick={() => {
                  if (formData.language.includes(lang)) {
                    handleChange(
                      "language",
                      formData.language.filter((l) => l !== lang)
                    );
                  } else {
                    handleChange("language", [...formData.language, lang]);
                  }
                }}
                className={`px-3 py-1 rounded-md border ${
                  formData.language.includes(lang)
                    ? "bg-[#50c878] text-white"
                    : "border-gray-300"
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block font-medium mb-1">Location *</label>
          <div className="flex gap-2 mb-2">
            {["onsite", "remote"].map((mode) => (
              <button
                key={mode}
                onClick={() =>
                  handleChange("location", mode === "remote" ? "remote" : "")
                }
                className={`px-3 py-1 rounded-md border ${
                  (mode === "remote" && formData.location === "remote") ||
                  (mode === "onsite" && formData.location !== "remote")
                    ? "bg-[#50c878] text-white"
                    : "border-gray-300"
                }`}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>

          {/* Show dropdown if NOT remote (either empty or city selected) */}
          {formData.location !== "remote" && (
            <select
              value={formData.location}
              onChange={(e) => handleChange("location", e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Select a city</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Job Type */}
        <div>
          <label className="block font-medium mb-1">Job Type *</label>
          <div className="flex gap-2">
            {["gig", "part-time", "full-time"].map((type) => {
              const selected = formData.job_type.includes(type);

              return (
                <button
                  key={type}
                  onClick={() => {
                    if (selected) {
                      // remove type from array
                      handleChange(
                        "job_type",
                        formData.job_type.filter((t) => t !== type)
                      );
                    } else {
                      // add type to array
                      handleChange("job_type", [...formData.job_type, type]);
                    }
                  }}
                  className={`px-3 py-1 rounded-md border ${
                    selected ? "bg-[#50c878] text-white" : "border-gray-300"
                  }`}
                >
                  {type}
                </button>
              );
            })}
          </div>
        </div>

        {/* Pay */}
        <div>
          <label className="block font-medium mb-1">Pay *</label>
          <input
            type="text"
            value={formData.pay}
            onChange={(e) => handleChange("pay", e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block font-medium mb-1">Description *</label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            className="w-full border rounded px-3 py-2 min-h-[120px]"
            required
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block font-medium mb-1">Phone</label>
          <input
            type="text"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block font-medium mb-1">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>
      </div>
    </>
  );
}
