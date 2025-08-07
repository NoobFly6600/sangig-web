// src/app/job-detail/[id]/page.tsx
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Job = {
  id: string;
  type: string | null;
  title: string;
  company_name: string;
  language: string[] | null;
  location: string | null;
  job_type: string[] | null;
  pay: string | null;
  created_at: string;
  user_id: string;
  description: string | null;
  number_of_openings: number | null;
  phone: string | null;
  email: string | null;
  views: number | null;
};

interface JobDetailPageProps {
  params: {
    id: string;
  };
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { id } = await params;

  const { data: job, error } = await supabase
    .from("jobs")
    .select(
      "id, type, title, company_name, language, location, job_type, pay, created_at, user_id, description, number_of_openings, phone, email, views"
    )
    .eq("id", id)
    .single();

  if (error || !job) {
    notFound();
  }

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{job.title}</h1>
      <p className="text-lg mb-2">Company: {job.company_name}</p>
      <p className="mb-2">Location: {job.location ?? "No location"}</p>
      <p className="mb-2">Pay: {job.pay ?? "Not specified"}</p>
      <p className="mb-2">Openings: {job.number_of_openings ?? "N/A"}</p>
      <p className="mb-2">Contact: {job.phone ?? "N/A"}</p>
      <p className="mb-2">Email: {job.email ?? "N/A"}</p>
      <p className="mb-2">Views: {job.views ?? 0}</p>
      <p className="mb-4">{job.description}</p>
      <div className="text-xs text-gray-400">
        Posted on {new Date(job.created_at).toLocaleDateString()}
      </div>
    </main>
  );
}
