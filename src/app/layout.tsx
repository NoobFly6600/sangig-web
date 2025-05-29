import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";

import "./globals.css";

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jobs and Gigs in Canada and the USA | SanGig",
  description:
    "Job and Gig Search by SanGig. The #1 job site in Canada and the USA. Search millions of jobs from thousands of job boards, newspapers, classifieds and company websites on sangigs.com",
  keywords: [
    "job search",
    "SanGig",
    "sangig",
    "gig search",
    "jobs",
    "gigs",
    "side gigs",
    "search engine for jobs",
    "job search engine",
    "job listings",
    "search jobs",
    "career",
    "employment",
    "work",
    "find jobs",
    "rss jobs feed xml",
    "Canada",
    "canadian",
    "America",
    "USA",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={openSans.className}>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
