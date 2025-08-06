"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import Header from "./components/Header";

type Job = {
  id: string;
  type: string | null;
  title: string;
  company_name: string;
  language: string[] | null;
  location: string | null;
  job_type: string[] | null;
  pay: string | null;
  description: string | null;
  status: string;
  created_at: string;
};

const PAGE_SIZE = 10;

export default function Home() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isMobile, setIsMobile] = useState(false);
  const [loadingHeader, setLoadingHeader] = useState(true);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const hasSelectedFirstJob = useRef(false);

  const pageRef = useRef(0);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const isLoading = useRef(false);

  useEffect(() => {
    const timeout = setTimeout(() => setLoadingHeader(false), 300);
    return () => clearTimeout(timeout);
  }, []);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  useEffect(() => {
    if (!hasSelectedFirstJob.current && jobs.length > 0) {
      setSelectedJob(jobs[0]);
      hasSelectedFirstJob.current = true;
    }
  }, [jobs]);
  const fetchJobs = async () => {
    if (isLoading.current || !hasMore) return;
    isLoading.current = true;

    const from = pageRef.current * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    const { data, error } = await supabase
      .from("jobs")
      .select(
        "id, type, title, company_name, language, location, job_type, pay, description, status, created_at"
      )
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .order("id", { ascending: false }) // to avoid duplicates when timestamps are the same
      .range(from, to);

    if (error) {
      console.error("Error fetching jobs:", error);
    } else {
      if (!data || data.length === 0) {
        setHasMore(false);
      } else {
        setJobs((prev) => [...prev, ...data]);
        pageRef.current += 1; // ✅ increment page here
        if (data.length < PAGE_SIZE) setHasMore(false);
      }
    }

    isLoading.current = false;
  };

  useEffect(() => {
    fetchJobs(); // initial load
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting) {
          fetchJobs();
        }
      },
      { threshold: 1 }
    );

    const current = loaderRef.current;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, [loaderRef.current, hasMore]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header user={user} logout={logout} loading={loadingHeader} />

      {/* Main Body */}
      <main
        className={`
        flex-1 text-left
        py-0 sm:py-6
        px-0 sm:px-[clamp(1rem,2vw,10rem)]
      `}
      >
        <div className="mx-auto w-full max-w-[1200px] flex flex-col sm:flex-row gap-4">
          {/* Job list */}
          <div
            className={`${
              isMobile ? "w-full" : "w-1/3 max-w-[400px]"
            } flex flex-col`}
          >
            {jobs.map((job) => (
              <div
                key={job.id}
                onClick={() => setSelectedJob(job)}
                className={`border rounded-md p-4 mb-4 shadow-sm cursor-pointer
            ${
              selectedJob?.id === job.id
                ? "bg-blue-100 border-blue-500"
                : "bg-white"
            }
          `}
              >
                <h2 className="text-xl font-semibold">{job.title}</h2>
                <p className="text-gray-600">{job.company_name}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {job.location ?? "No location"} •{" "}
                  {job.pay ?? "Pay not specified"}
                </p>
                <p className="text-sm mt-2 truncate">{job.description}</p>
                <div className="text-xs text-gray-400 mt-2">
                  Posted on {new Date(job.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}

            {hasMore ? (
              <div ref={loaderRef} className="text-center text-gray-500 py-4">
                Loading more jobs...
              </div>
            ) : (
              <div className="text-center text-gray-400 py-4">
                No more jobs.
              </div>
            )}
          </div>

          {/* Detail view (only visible on desktop) */}
          {!isMobile && selectedJob && (
            <div className="w-2/3 p-4 border rounded-md shadow-sm h-[88vh] overflow-y-auto sticky top-21.5">
              <h2 className="text-2xl font-bold mb-4">{selectedJob.title}</h2>
              <p className="text-lg text-gray-700 mb-2">
                Company: {selectedJob.company_name}
              </p>
              <p className="mb-2">
                Location: {selectedJob.location ?? "No location"}
              </p>
              <p className="mb-2">Pay: {selectedJob.pay ?? "Not specified"}</p>
              <p className="mb-4">{selectedJob.description}</p>
              <p className="mb-4">{selectedJob.description}</p>
              <p className="mb-4">{selectedJob.description}</p>
              <p className="mb-4">{selectedJob.description}</p>
              <p className="mb-4">{selectedJob.description}</p>
              <p className="mb-4">{selectedJob.description}</p>
              <p className="mb-4">{selectedJob.description}</p>
              <p className="mb-4">{selectedJob.description}</p>
              <p className="mb-4">{selectedJob.description}</p>
              <p className="mb-4">{selectedJob.description}</p>
              <p className="mb-4">{selectedJob.description}</p>
              <p className="mb-4">{selectedJob.description}</p>
              <p className="mb-4">{selectedJob.description}</p>
              <p className="mb-4">{selectedJob.description}</p>
              <p className="mb-4">{selectedJob.description}</p>
              <p className="mb-4">{selectedJob.description}</p>
              <p className="mb-4">{selectedJob.description}</p>
              <p className="mb-4">{selectedJob.description}</p>
              <p className="mb-4">{selectedJob.description}</p>
              <p className="mb-4">{selectedJob.description}</p>
              <p className="mb-4">{selectedJob.description}</p>
              <p className="mb-4">{selectedJob.description}</p>
              <p className="mb-4">{selectedJob.description}</p>
              <p className="mb-4">{selectedJob.description}</p>
              <p className="mb-4">{selectedJob.description}</p>
              <p className="mb-4">{selectedJob.description}</p>
              <p className="mb-4">{selectedJob.description}</p>
              <p className="mb-4">{selectedJob.description}</p>
              <p className="mb-4">{selectedJob.description}</p>
              <p className="mb-4">{selectedJob.description}</p>
              <p className="mb-4">{selectedJob.description}</p>
              <p className="mb-4">{selectedJob.description}</p>
              <p className="mb-4">{selectedJob.description}</p>
              <p className="mb-4">{selectedJob.description}</p>
              <p className="mb-4">{selectedJob.description}</p>
              <p className="mb-4">{selectedJob.description}</p>
              <p className="mb-4">{selectedJob.description}</p>
              <p className="mb-4">{selectedJob.description}</p>
              <p className="mb-4">{selectedJob.description}</p>
              <p className="mb-4">{selectedJob.description}</p>
              <p className="mb-4">{selectedJob.description}</p>
              <p className="mb-4">{selectedJob.description}</p>
              <p className="mb-4">{selectedJob.description}</p>
              <p className="mb-4">{selectedJob.description}</p>
              <p className="mb-4">{selectedJob.description}</p>
              <p className="mb-4">{selectedJob.description}</p>
              <p className="mb-4">{selectedJob.description}</p>
              <p className="mb-4">{selectedJob.description}</p>
              <div className="text-xs text-gray-400">
                Posted on{" "}
                {new Date(selectedJob.created_at).toLocaleDateString()}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
