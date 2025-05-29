"use client";
import React from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import Header from "../components/Header";

export default function Profile() {
  const { user, loading, logout } = useAuth();

  // Replace with real user data
  const userData = {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    skills: ["JavaScript", "React", "Node.js"],
    education: "B.Sc. in Computer Science, XYZ University",
    about:
      "Passionate software developer with experience building full-stack web applications.",
    workExperience: "Software Engineer at ABC Corp (2020–2024)",
  };

  return (
    <>
      <Header user={user} logout={logout} loading={loading} />

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
            <h2 className="text-2xl font-semibold">{userData.name}</h2>
            <p className="text-gray-600">{userData.email}</p>
            <p className="text-gray-600">{userData.phone}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">About</h3>
            <p className="text-gray-700">{userData.about}</p>
          </div>
          <div>
            <h3 className="font-semibold">Skills</h3>
            <ul className="list-disc list-inside text-gray-700">
              {userData.skills.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold">Education</h3>
            <p className="text-gray-700">{userData.education}</p>
          </div>

          <div>
            <h3 className="font-semibold">Work Experience</h3>
            <p className="text-gray-700">{userData.workExperience}</p>
          </div>
        </div>
      </div>
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
            <h2 className="text-2xl font-semibold">{userData.name}</h2>
            <p className="text-gray-600">{userData.email}</p>
            <p className="text-gray-600">{userData.phone}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">About</h3>
            <p className="text-gray-700">{userData.about}</p>
          </div>
          <div>
            <h3 className="font-semibold">Skills</h3>
            <ul className="list-disc list-inside text-gray-700">
              {userData.skills.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold">Education</h3>
            <p className="text-gray-700">{userData.education}</p>
          </div>

          <div>
            <h3 className="font-semibold">Work Experience</h3>
            <p className="text-gray-700">{userData.workExperience}</p>
          </div>
        </div>
      </div>
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
            <h2 className="text-2xl font-semibold">{userData.name}</h2>
            <p className="text-gray-600">{userData.email}</p>
            <p className="text-gray-600">{userData.phone}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">About</h3>
            <p className="text-gray-700">{userData.about}</p>
          </div>
          <div>
            <h3 className="font-semibold">Skills</h3>
            <ul className="list-disc list-inside text-gray-700">
              {userData.skills.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold">Education</h3>
            <p className="text-gray-700">{userData.education}</p>
          </div>

          <div>
            <h3 className="font-semibold">Work Experience</h3>
            <p className="text-gray-700">{userData.workExperience}</p>
          </div>
        </div>
      </div>
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
            <h2 className="text-2xl font-semibold">{userData.name}</h2>
            <p className="text-gray-600">{userData.email}</p>
            <p className="text-gray-600">{userData.phone}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">About</h3>
            <p className="text-gray-700">{userData.about}</p>
          </div>
          <div>
            <h3 className="font-semibold">Skills</h3>
            <ul className="list-disc list-inside text-gray-700">
              {userData.skills.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold">Education</h3>
            <p className="text-gray-700">{userData.education}</p>
          </div>

          <div>
            <h3 className="font-semibold">Work Experience</h3>
            <p className="text-gray-700">{userData.workExperience}</p>
          </div>
        </div>
      </div>
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
            <h2 className="text-2xl font-semibold">{userData.name}</h2>
            <p className="text-gray-600">{userData.email}</p>
            <p className="text-gray-600">{userData.phone}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">About</h3>
            <p className="text-gray-700">{userData.about}</p>
          </div>
          <div>
            <h3 className="font-semibold">Skills</h3>
            <ul className="list-disc list-inside text-gray-700">
              {userData.skills.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold">Education</h3>
            <p className="text-gray-700">{userData.education}</p>
          </div>

          <div>
            <h3 className="font-semibold">Work Experience</h3>
            <p className="text-gray-700">{userData.workExperience}</p>
          </div>
        </div>
      </div>
    </>
  );
}
