"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import Header from "./components/Header";
import { Drawer, Button, Space } from "antd";
type JobInfo = {
  id: string;
  type: string | null;
  title: string;
  company_name: string;
  language: string[] | null;
  location: string | null;
  job_type: string[] | null;
  pay: string | null;
  created_at: string;
};

type JobData = JobInfo & {
  number_of_openings: number | null;
  phone: string | null;
  email: string | null;
  views: number | null;
  description: string | null;
};

const PAGE_SIZE = 10;

export default function Home() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isMobile, setIsMobile] = useState(false);
  const [loadingHeader, setLoadingHeader] = useState(true);
  const [jobs, setJobs] = useState<JobInfo[]>([]);
  const [selectedJob, setSelectedJob] = useState<JobData | null>(null);
  const hasSelectedFirstJob = useRef(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const drawerContentRef = useRef<HTMLDivElement>(null);

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
    if (!hasSelectedFirstJob.current && jobs.length > 0 && !isMobile) {
      const jobInfo = jobs[0];
      const fullJob: JobData = {
        ...jobInfo,
        number_of_openings: null,
        phone: null,
        email: null,
        views: null,
        description: null,
      };
      setSelectedJob(fullJob);
      hasSelectedFirstJob.current = true;
    }
  }, [jobs, isMobile]);
  const fetchJobs = async () => {
    if (isLoading.current || !hasMore) return;
    isLoading.current = true;

    const from = pageRef.current * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    const { data, error } = await supabase
      .from("jobs")
      .select(
        "id, type, title, company_name, language, location, job_type, pay, created_at"
      )
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .order("id", { ascending: false })
      .range(from, to);

    if (error) {
      console.error("Error fetching jobs:", error);
    } else {
      console.log(data);
      if (!data || data.length === 0) {
        setHasMore(false);
      } else {
        setJobs((prev) => [...prev, ...data]);
        pageRef.current += 1;
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
        if (first.isIntersecting) fetchJobs();
      },
      { threshold: 1 }
    );

    const current = loaderRef.current;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, [hasMore]);
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isDrawerOpen]);
  const handleSelect = async (jobId: string) => {
    try {
      const { data, error } = await supabase
        .from("jobs")
        .select(
          "id, type, title, company_name, language, location, job_type, pay, created_at, user_id, description, number_of_openings, phone, email, views"
        )
        .eq("id", jobId)
        .single();

      if (error) {
        console.error("Failed to fetch job details:", error);
        return;
      }

      setSelectedJob(data);
      if (isMobile) {
        // On mobile, open a modal or drawer
        setIsDrawerOpen(true);
        return;
      }
    } catch (err) {
      console.error("Unexpected error fetching job details:", err);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header user={user} logout={logout} loading={loadingHeader} />

      {/* Main Body */}
      <main
        className={`
        flex-1 text-left
        py-4 sm:py-6
        px-4 sm:px-[clamp(1rem,2vw,10rem)]
      `}
      >
        <div className="mx-auto w-full max-w-[1200px] flex flex-col sm:flex-row gap-4">
          {/* Job list */}
          <div
            className={`${
              isMobile ? "w-full" : "w-2/5 max-w-[600px]"
            } flex flex-col`}
          >
            {jobs.map((job) => (
              <div
                key={job.id}
                onClick={() => handleSelect(job.id)}
                className={`border rounded-md p-4 mb-4 cursor-pointer
                ${
                  selectedJob?.id === job.id
                    ? "border-black"
                    : "border-gray-300"
                }
              `}
              >
                <h2 className="text-xl font-semibold">{job.title}</h2>
                <p className="text-gray-600">{job.company_name}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {job.location ?? "No location"} •{" "}
                  {job.pay ?? "Pay not specified"}
                </p>

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
            <div className="w-3/5 p-4 border border-gray-300 rounded-md h-[88vh] overflow-y-auto sticky top-21.5">
              <h2 className="text-2xl font-bold mb-4">{selectedJob.title}</h2>
              <p className="text-lg text-gray-700 mb-2">
                Company: {selectedJob.company_name}
              </p>
              <p className="mb-2">
                Location: {selectedJob.location ?? "No location"}
              </p>
              <p className="mb-2">Pay: {selectedJob.pay ?? "Not specified"}</p>
              <p className="mb-2">
                Openings: {selectedJob.number_of_openings ?? "N/A"}
              </p>
              <p className="mb-2">Contact: {selectedJob.phone ?? "N/A"}</p>
              <p className="mb-2">Email: {selectedJob.email ?? "N/A"}</p>
              <p className="mb-2">Views: {selectedJob.views ?? 0}</p>
              <p className="mb-4">{selectedJob.description}</p>

              <div className="text-xs text-gray-400">
                Posted on{" "}
                {new Date(selectedJob.created_at).toLocaleDateString()}
              </div>
            </div>
          )}
          {isMobile && selectedJob && (
            <Drawer
              title={"Job Detaills"}
              placement="bottom"
              height="100%"
              onClose={() => setIsDrawerOpen(false)}
              open={isDrawerOpen}
              extra={
                <Space>
                  <button
                    onClick={() => setIsDrawerOpen(false)}
                    className="bg-[#50C878]  font-semibold cursor-pointer text-white px-5 py-1.5 rounded-lg hover:bg-[#3fa963] transition"
                  >
                    Message
                  </button>
                </Space>
              }
            >
              <p>
                <strong>{selectedJob.title}</strong>
              </p>
              <p>
                <strong>Company:</strong> {selectedJob.company_name}
              </p>
              <p>
                <strong>Location:</strong> {selectedJob.location ?? "N/A"}
              </p>
              <p>
                <strong>Pay:</strong> {selectedJob.pay ?? "N/A"}
              </p>
              <p>
                <strong>Openings:</strong>{" "}
                {selectedJob.number_of_openings ?? "N/A"}
              </p>
              <p>
                <strong>Phone:</strong> {selectedJob.phone ?? "N/A"}
              </p>
              <p>
                <strong>Email:</strong> {selectedJob.email ?? "N/A"}
              </p>
              <p>
                <strong>Views:</strong> {selectedJob.views ?? 0}
              </p>
              <p className="mt-4">{selectedJob.description}</p>
            </Drawer>
          )}
        </div>
      </main>
    </div>
  );
}
