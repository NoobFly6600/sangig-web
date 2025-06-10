"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import Header from "../components/Header";
import { Descriptions } from "antd";

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
  const lang =
    typeof window !== "undefined" ? localStorage.getItem("language") : "en";
  const [formData, setFormData] = useState<JobFormData>({
    type: "individual",
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
  const postTypeOptions = ["individual", "recruiter", "company"];
  const jobTypeOptions = ["gig", "part", "full"];
  const locationTypeOptions = ["onsite", "remote"];

  // Translations for display
  const postTypeLabels: Record<string, Record<string, string>> = {
    en: {
      individual: "I'm hiring for myself",
      recruiter: "I'm a recruiter",
      company: "I'm hiring for my company",
    },
    zh: {
      individual: "个人雇佣",
      recruiter: "职业中介",
      company: "企业直聘",
    },
    fr: {
      individual: "Je recrute pour moi-même",
      recruiter: "Je suis un recruteur",
      company: "Je recrute pour mon entreprise",
    },
  };
  const jobTypeLabels: Record<string, Record<string, string>> = {
    en: {
      gig: "Gig",
      part: "Part-time",
      full: "Full-time",
    },
    zh: {
      gig: "零工",
      part: "兼职",
      full: "全职",
    },
    fr: {
      gig: "Mission",
      part: "Temps partiel",
      full: "Temps plein",
    },
  };

  const locationTypeLabels: Record<string, Record<string, string>> = {
    en: {
      onsite: "Onsite",
      remote: "Remote",
    },
    zh: {
      onsite: "线下",
      remote: "线上",
    },
    fr: {
      onsite: "Sur site",
      remote: "À distance",
    },
  };

  const t = {
    title:
      lang === "zh"
        ? "发布招聘"
        : lang === "fr"
        ? "Publier une offre"
        : "Post a job",
    postType:
      lang === "zh"
        ? "发布类别"
        : lang === "fr"
        ? "Type de publication"
        : "Post type",
    postTitle: lang === "zh" ? "标题" : lang === "fr" ? "Titre" : "Title",
    companyName:
      lang === "zh"
        ? "公司名称"
        : lang === "fr"
        ? "Nom de l'entreprise"
        : "Company name",
    numberOfOpenings:
      lang === "zh"
        ? "开放人数"
        : lang === "fr"
        ? "Nombre de postes"
        : "Number of openings",
    select: lang === "zh" ? "选择" : lang === "fr" ? "Sélectionner" : "Select",
    language:
      lang === "zh"
        ? "语言要求"
        : lang === "fr"
        ? "Langue requise"
        : "Language required",
    location: lang === "zh" ? "地点" : lang === "fr" ? "Lieu" : "Location",
    selectCity:
      lang === "zh"
        ? "选择城市"
        : lang === "fr"
        ? "Sélectionnez une ville"
        : "Select a city",
    jobType:
      lang === "zh" ? "工作类型" : lang === "fr" ? "Type d'emploi" : "Job type",
    pay: lang === "zh" ? "薪酬" : lang === "fr" ? "Salaire" : "Pay",
    description:
      lang === "zh"
        ? "职位描述"
        : lang === "fr"
        ? "Description du poste"
        : "Description",
    contactTitle:
      lang === "zh"
        ? "联系信息"
        : lang === "fr"
        ? "Coordonnées"
        : "Contact Information",
    contactText:
      lang === "zh"
        ? "为保护您的隐私，建议不要在职位发布中包含电话号码或电子邮件。在您准备好交换联系方式之前，请通过 SanGig 进行沟通。如遇任何索要金钱或敏感信息的行为，请立即举报"
        : lang === "fr"
        ? "Pour protéger votre vie privée, nous vous recommandons de ne pas inclure votre numéro de téléphone ou votre adresse e-mail dans l'annonce. Communiquez via SanGig jusqu'à ce que vous soyez prêt à partager vos coordonnées. Signalez toute personne demandant de l'argent ou des informations sensibles."
        : "To protect your privacy, we recommend not including your phone number or email in the job post. Communicate through SanGig until you’re comfortable sharing contact details. Report anyone who requests money or sensitive information.",
    phone: lang === "zh" ? "电话" : lang === "fr" ? "Téléphone" : "Phone",
    email: lang === "zh" ? "邮箱" : lang === "fr" ? "E-mail" : "Email",
  };
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
      <div className="max-w-3xl mx-auto px-4 pt-6 sm:pt-8 py-20 sm:py-40 space-y-6">
        <h1 className="text-xl font-semibold">{t.title}</h1>
        {/* Type */}
        <div>
          <label className="block font-medium  mb-1">{t.postType} *</label>
          <div className="flex gap-2 font-medium ">
            {postTypeOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => handleChange("type", opt)} // always sends English value
                className={`px-3 py-1 rounded-md border cursor-pointer ${
                  formData.type === opt
                    ? "bg-[#50c878] text-white"
                    : "border-gray-300"
                }`}
              >
                {postTypeLabels[lang || "en"][opt]}
              </button>
            ))}
          </div>
        </div>
        {/* Title */}
        <div>
          <label className="block font-medium mb-1">{t.postTitle} *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            className="w-full cursor-pointer border border-gray-300 rounded-md p-2 text-base focus:outline-none  focus:border-[#50C878]"
            required
          />
        </div>
        {/* Description */}
        <div>
          <label className="block font-medium mb-1">{t.description} *</label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            className="w-full cursor-pointer border border-gray-300 rounded-md p-2 text-base focus:outline-none  focus:border-[#50C878] min-h-[120px]"
            required
          />
        </div>
        {/* Company Name */}
        {formData.type === "company" && (
          <div>
            <label className="block font-medium mb-1">{t.companyName}</label>
            <input
              type="text"
              value={formData.company_name}
              onChange={(e) => handleChange("company_name", e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 text-base focus:outline-none focus:border-[#50C878]"
            />
          </div>
        )}
        {/* Number of Openings */}
        <div>
          <label className="block font-medium mb-1">{t.numberOfOpenings}</label>
          <select
            value={formData.number_of_openings}
            onChange={(e) => handleChange("number_of_openings", e.target.value)}
            className="w-full  cursor-pointer border border-gray-300 rounded-md p-2 text-base focus:outline-none  focus:border-[#50C878]"
          >
            <option value="">{t.select}</option>
            {[1, 2, 3, 4, 5, "10+"].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
        {/* Job Type */}
        <div>
          <label className="block font-medium mb-1">{t.jobType} *</label>
          <div className="flex gap-2 font-medium">
            {jobTypeOptions.map((type) => {
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
                  className={`px-3 py-1 rounded-md border cursor-pointer ${
                    selected ? "bg-[#50c878] text-white" : "border-gray-300"
                  }`}
                >
                  {jobTypeLabels[lang || "en"][type.replace("-", "")] || type}
                </button>
              );
            })}
          </div>
        </div>
        {/* Location */}
        <div>
          <label className="block font-medium mb-1">{t.location} *</label>
          <div className="flex gap-2 mb-2 font-medium">
            {locationTypeOptions.map((mode) => {
              const isSelected =
                (mode === "remote" && formData.location === "remote") ||
                (mode === "onsite" && formData.location !== "remote");

              return (
                <button
                  key={mode}
                  onClick={() =>
                    handleChange("location", mode === "remote" ? "remote" : "")
                  }
                  className={`px-3 py-1 rounded-md border cursor-pointer ${
                    isSelected ? "bg-[#50c878] text-white" : "border-gray-300"
                  }`}
                >
                  {locationTypeLabels[lang || "en"][mode] || mode}
                </button>
              );
            })}
          </div>

          {/* Show dropdown if NOT remote (either empty or city selected) */}
          {formData.location !== "remote" && (
            <select
              value={formData.location}
              onChange={(e) => handleChange("location", e.target.value)}
              className="w-full cursor-pointer border border-gray-300 rounded-md p-2 text-base focus:outline-none  focus:border-[#50C878]"
            >
              <option value="">{t.selectCity}</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          )}
        </div>
        {/* Language */}
        <div>
          <label className="block font-medium mb-1">{t.language} *</label>
          <div className="flex gap-2 font-medium ">
            {["English", "中文", "Français"].map((lang) => (
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
                className={`px-3 py-1 rounded-md border cursor-pointer ${
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

        {/* Pay */}
        <div>
          <label className="block font-medium mb-1">{t.pay} *</label>
          <input
            type="text"
            value={formData.pay}
            onChange={(e) => handleChange("pay", e.target.value)}
            className="w-full cursor-pointer border border-gray-300 rounded-md p-2 text-base focus:outline-none  focus:border-[#50C878]"
            required
          />
        </div>

        {/* Contact info */}
        <h2 className="text-lg font-semibold mb-1">{t.contactTitle}</h2>
        <p className="text-sm text-gray-600 mb-4">{t.contactText}</p>
        {/* Phone */}
        <div>
          <label className="block font-medium mb-1">{t.phone}</label>
          <input
            type="text"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            className="w-full cursor-pointer border border-gray-300 rounded-md p-2 text-base focus:outline-none  focus:border-[#50C878]"
          />
        </div>
        {/* Email */}
        <div>
          <label className="block font-medium mb-1">{t.email}</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className="w-full cursor-pointer border border-gray-300 rounded-md p-2 text-base focus:outline-none  focus:border-[#50C878]"
          />
        </div>
      </div>
    </>
  );
}
