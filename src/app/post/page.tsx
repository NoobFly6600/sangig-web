"use client";

import React, { RefObject, useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import Header from "../components/Header";
import { ICity, City } from "country-state-city";

const canadianCities = [
  "Toronto, ON",
  "Vancouver, BC",
  "Montreal, QC",
  "Calgary, AB",
  "Ottawa, ON",
  "Edmonton, AB",
  "Winnipeg, MB",
  "Quebec City, QC",
  "Hamilton, ON",
  "Kitchener, ON",
];

const usCities = [
  "New York, NY",
  "Los Angeles, CA",
  "Chicago, IL",
  "Houston, TX",
  "Phoenix, AZ",
  "Philadelphia, PA",
  "San Antonio, TX",
  "San Diego, CA",
  "Dallas, TX",
  "San Jose, CA",
];

type JobFormData = {
  type: string;
  title: string;
  company_name?: string;
  number_of_openings?: string;
  language: string[];
  location: string;
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
  const [searchCity, setSearchCity] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const postTypeOptions = ["individual", "recruiter", "company"];
  const languageTypeOptions = ["english", "chinese", "french"];
  const jobTypeOptions = ["gig", "part", "full"];
  const locationTypeOptions = ["onsite", "remote"];
  const [cities, setCities] = useState<ICity[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  type FieldKey =
    | "type"
    | "title"
    | "language"
    | "location"
    | "job_type"
    | "pay"
    | "description";

  const refs: Record<FieldKey, RefObject<HTMLDivElement | null>> = {
    type: useRef(null),
    title: useRef(null),
    language: useRef(null),
    location: useRef(null),
    job_type: useRef(null),
    pay: useRef(null),
    description: useRef(null),
  };
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
  const languageTypeLabels: Record<string, Record<string, string>> = {
    en: {
      english: "English",
      chinese: "Chinese",
      french: "French",
    },
    zh: {
      english: "英语",
      chinese: "中文",
      french: "法语",
    },
    fr: {
      english: "Anglais",
      chinese: "Chinois",
      french: "Français",
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
        ? "搜索城市名"
        : lang === "fr"
        ? "Rechercher une ville"
        : "Search a city",
    noResults:
      lang === "zh"
        ? "未找到匹配的城市，请输入城市名称"
        : lang === "fr"
        ? "Aucune ville trouvée. Essayez un autre nom."
        : "No matching cities found. Try searching by city name.",

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
        ? "为保护您的隐私，建议不要在职位发布中包含电话号码或电子邮件。在您准备好交换联系方式之前，请通过闪职进行沟通。如遇任何索要金钱或敏感信息的行为，请立即举报"
        : lang === "fr"
        ? "Pour protéger votre vie privée, nous vous recommandons de ne pas inclure votre numéro de téléphone ou votre adresse e-mail dans l'annonce. Communiquez via SanGig jusqu'à ce que vous soyez prêt à partager vos coordonnées. Signalez toute personne demandant de l'argent ou des informations sensibles."
        : "To protect your privacy, we recommend not including your phone number or email in the job post. Communicate through SanGig until you’re comfortable sharing contact details. Report anyone who requests money or sensitive information.",
    phone: lang === "zh" ? "电话" : lang === "fr" ? "Téléphone" : "Phone",
    email: lang === "zh" ? "邮箱" : lang === "fr" ? "E-mail" : "Email",
    submit: lang === "zh" ? "发布" : lang === "fr" ? "Publier" : "Post",
    draft:
      lang === "zh"
        ? "保存草稿"
        : lang === "fr"
        ? "Enregistrer le brouillon"
        : "Save draft",
    titleError:
      lang === "zh"
        ? "请输入标题"
        : lang === "fr"
        ? "Veuillez entrer un titre"
        : "Please enter a title",

    descriptionError:
      lang === "zh"
        ? "请输入描述"
        : lang === "fr"
        ? "Veuillez entrer une description"
        : "Please enter a description",

    jobTypeError:
      lang === "zh"
        ? "请选择工作类型"
        : lang === "fr"
        ? "Veuillez sélectionner un type d'emploi"
        : "Please select a job type",

    locationError:
      lang === "zh"
        ? "请输入有效的城市名称"
        : lang === "fr"
        ? "Veuillez sélectionner une ville valide"
        : "Please enter a valid city name",

    languageError:
      lang === "zh"
        ? "请选择语言要求"
        : lang === "fr"
        ? "Veuillez sélectionner une langue"
        : "Please select language requirements",

    payError:
      lang === "zh"
        ? "请输入薪资"
        : lang === "fr"
        ? "Veuillez entrer un salaire"
        : "Please enter the pay",

    generalError:
      lang === "zh"
        ? "请填写此字段"
        : lang === "fr"
        ? "Veuillez remplir ce champ"
        : "Please fill out this field",
    cityError:
      lang === "zh"
        ? "请从搜索结果中选择有效的城市"
        : lang === "fr"
        ? "Veuillez sélectionner une ville valide parmi les résultats de recherche"
        : "Please select a valid city from the search results",
  };
  const shortList =
    cities.length && cities[0].countryCode === "CA" ? canadianCities : usCities;

  const filteredCities =
    searchCity === ""
      ? shortList.map((city) => {
          const [name, stateCode] = city.split(", ");
          return { name, stateCode };
        })
      : cities
          .filter((c) =>
            c.name.toLowerCase().startsWith(searchCity.toLowerCase())
          )
          .map((c) => ({ name: c.name, stateCode: c.stateCode }));
  useEffect(() => {
    fetch("https://ipinfo.io/json?token=e6b79b3ab94f95")
      .then((res) => res.json())
      .then((data) => {
        if (data.country === "CA") {
          setCities(City.getCitiesOfCountry("CA") || []);
        } else {
          setCities(City.getCitiesOfCountry("US") || []);
        }
      })
      .catch(() => setCities([]));
  }, []);
  const handleChange = (field: keyof typeof formData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear the error when user starts typing
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      delete newErrors[field];
      return newErrors;
    });
  };
  const handleSubmit = async (status: "draft" | "active") => {
    if (!user?.id) {
      alert("Please sign in to post jobs.");
      return;
    }
    // Fields to validate
    const requiredFields: FieldKey[] = [
      "title",
      "description",
      "job_type",
      "location",
      "language",
      "pay",
    ];

    const newErrors: { [key in FieldKey]?: string } = {};

    // 1. General required field check
    for (const field of requiredFields) {
      const value = formData[field];
      if (
        value === "" ||
        (Array.isArray(value) && value.length === 0) ||
        value === null ||
        value === undefined
      ) {
        switch (field) {
          case "title":
            newErrors[field] = t.titleError;
            break;
          case "description":
            newErrors[field] = t.descriptionError;
            break;
          case "job_type":
            newErrors[field] = t.jobTypeError;
            break;
          case "location":
            newErrors[field] = t.locationError;
            break;
          case "language":
            newErrors[field] = t.languageError;
            break;
          case "pay":
            newErrors[field] = t.payError;
            break;
          default:
            newErrors[field] = t.generalError;
        }
      }
    }

    // 2. Extra logic for location — ensure selected city matches searchCity
    if (formData.location !== "remote" && formData.location !== searchCity) {
      newErrors.location = t.cityError;
    }

    setErrors(newErrors);

    // 3. Scroll to first error if any
    const firstInvalidField = Object.keys(newErrors)[0] as FieldKey | undefined;

    if (firstInvalidField && refs[firstInvalidField]) {
      refs[firstInvalidField]?.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return;
    }

    // Set status to active on submit
    const jobData = {
      ...formData,
      status, // ✅ directly set status here
      user_id: user.id,
    };
    const { data, error } = await supabase.from("jobs").insert([jobData]);

    if (error) {
      console.error("Failed to submit job:", error?.message, error);
      alert(error);
      return;
    }
    // Show success modal or alert
    alert("Success! Your job has been submitted.");

    // Here you can do further processing like sending data to backend later
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
        <div ref={refs.title}>
          <label className="block font-medium mb-1">{t.postTitle} *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            maxLength={50}
            className={`w-full cursor-pointer border rounded-md p-2 text-base focus:outline-none ${
              errors.title
                ? "border-red-300"
                : "border-gray-300 focus:border-[#50C878]"
            }`}
            required
          />
          <div className="text-sm text-gray-500 text-right mt-1">
            {formData.title.length} / 50
          </div>
          {errors.title && (
            <p className="text-sm text-red-400">{errors.title}</p>
          )}
        </div>
        {/* Description */}
        <div ref={refs.description}>
          <label className="block font-medium mb-1">{t.description} *</label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            maxLength={5000}
            className={`w-full cursor-pointer border rounded-md p-2 text-base focus:outline-none min-h-[120px] ${
              errors.description
                ? "border-red-300"
                : "border-gray-300 focus:border-[#50C878]"
            }`}
            required
          />
          <div className="text-sm text-gray-500 text-right">
            {formData.description.length} / 5000
          </div>
          {errors.description && (
            <p className="text-sm text-red-400 ">{errors.description}</p>
          )}
        </div>

        {/* Company Name */}
        {formData.type === "company" && (
          <div>
            <label className="block font-medium mb-1">{t.companyName}</label>
            <input
              type="text"
              maxLength={50}
              value={formData.company_name}
              onChange={(e) => handleChange("company_name", e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 text-base focus:outline-none focus:border-[#50C878]"
            />
            <div className="text-sm text-gray-500 text-right mt-1">
              {formData.company_name?.length} / 50
            </div>
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
            {[1, 2, 3, 4, 5, "5+"].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
        {/* Job Type */}
        <div ref={refs.job_type}>
          <label className="block font-medium mb-1">{t.jobType} *</label>
          <div className="flex gap-2 font-medium">
            {jobTypeOptions.map((type) => {
              const selected = formData.job_type.includes(type);

              return (
                <button
                  key={type}
                  onClick={() => {
                    if (selected) {
                      // Remove type from array
                      handleChange(
                        "job_type",
                        formData.job_type.filter((t) => t !== type)
                      );
                    } else {
                      // Add type to array
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

          {errors.job_type && (
            <p className="text-sm text-red-400 mt-1">{errors.job_type}</p>
          )}
        </div>

        {/* Location */}
        <div ref={refs.location}>
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

          {/* City dropdown */}
          {formData.location !== "remote" && (
            <div className="relative w-full">
              <input
                type="text"
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                onFocus={() => setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                placeholder={t.selectCity}
                className={`w-full border rounded-md p-2 text-base focus:outline-none ${
                  errors.location
                    ? "border-red-300"
                    : "border-gray-300 focus:border-[#50C878]"
                }`}
                autoComplete="off"
              />
              {showDropdown && (
                <ul className="absolute z-10 w-full max-h-48 overflow-auto bg-white border border-gray-300 rounded-md mt-1 shadow-md">
                  {filteredCities.length === 0 ? (
                    <li className="px-4 py-2 text-gray-500">{t.noResults}</li>
                  ) : (
                    filteredCities.map((cityObj) => {
                      const formatted = `${cityObj.name}, ${cityObj.stateCode}`;
                      return (
                        <li
                          key={formatted}
                          onClick={() => {
                            handleChange("location", formatted);
                            setSearchCity(formatted);
                            setShowDropdown(false);
                          }}
                          className="cursor-pointer px-4 py-2 hover:bg-[#50C878] hover:text-white"
                        >
                          {formatted}
                        </li>
                      );
                    })
                  )}
                </ul>
              )}
            </div>
          )}
          {errors.location && (
            <p className="text-sm text-red-400 mt-1">{errors.location}</p>
          )}
        </div>

        {/* Language */}
        <div ref={refs.language}>
          <label className="block font-medium mb-1">{t.language} *</label>
          <div className="flex gap-2 font-medium">
            {languageTypeOptions.map((langKey) => (
              <button
                key={langKey}
                onClick={() => {
                  if (formData.language.includes(langKey)) {
                    handleChange(
                      "language",
                      formData.language.filter((l) => l !== langKey)
                    );
                  } else {
                    handleChange("language", [...formData.language, langKey]);
                  }
                }}
                className={`px-3 py-1 rounded-md border cursor-pointer ${
                  formData.language.includes(langKey)
                    ? "bg-[#50c878] text-white"
                    : "border-gray-300"
                }`}
              >
                {languageTypeLabels[lang || "en"][langKey]}
              </button>
            ))}
          </div>
          {errors.language && (
            <p className="text-sm text-red-400 mt-1">{errors.language}</p>
          )}
        </div>

        {/* Pay */}
        <div ref={refs.pay}>
          <label className="block font-medium mb-1">{t.pay} *</label>
          <input
            type="text"
            maxLength={30}
            value={formData.pay}
            onChange={(e) => handleChange("pay", e.target.value)}
            className={`w-full cursor-pointer border rounded-md p-2 text-base focus:outline-none ${
              errors.pay
                ? "border-red-300"
                : "border-gray-300 focus:border-[#50C878]"
            }`}
            required
          />
          <div className="text-sm text-gray-500 text-right mt-1">
            {formData.pay.length} / 30
          </div>
          {errors.pay && <p className="text-sm text-red-400">{errors.pay}</p>}
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

        <div className="text-right mt-4">
          <button
            onClick={() => handleSubmit("draft")}
            className="mr-2 cursor-pointer text-lg font-semibold px-5 py-1.5 border text-gray-400 border-gray-300 rounded-md bg-white hover:bg-gray-100 transition"
          >
            {t.draft}
          </button>
          <button
            onClick={() => handleSubmit("active")}
            className="bg-[#50C878] text-lg font-semibold cursor-pointer text-white px-5 py-1.5 rounded-md hover:bg-[#3fa963] transition"
          >
            {t.submit}
          </button>
        </div>
      </div>
    </>
  );
}
