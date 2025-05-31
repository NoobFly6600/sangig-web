"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

import Header from "./components/Header";
import InfiniteScroll from "react-infinite-scroll-component";
import { LoadingOutlined, CloseOutlined } from "@ant-design/icons";
import { List, Drawer } from "antd";

const jobs = [
  {
    id: "1",
    title: "Frontend Developer",
    company: "TechNova Inc.",
    description:
      "We’re looking for a skilled Frontend Developer with experience in React and Tailwind CSS to help us build modern web applications.",
  },
  {
    id: "2",
    title: "Backend Engineer",
    company: "DataCloud Solutions",
    description:
      "Seeking a Backend Engineer proficient in Node.js and PostgreSQL. Experience with cloud deployment is a plus.",
  },
  {
    id: "3",
    title: "Product Designer",
    company: "Creative Minds Studio",
    description:
      "Join our team as a Product Designer to shape intuitive user experiences and clean UI interfaces. Figma experience required.",
  },
  {
    id: "4",
    title: "Marketing Specialist",
    company: "BrandSpark",
    description:
      "Looking for a Marketing Specialist to lead digital campaigns and analyze performance across social media platforms.",
  },
  {
    id: "5",
    title: "AI Research Intern",
    company: "NeuralWorks AI Lab",
    description:
      "Support cutting-edge AI projects in natural language processing and machine learning. Python and TensorFlow preferred.",
  },
  {
    id: "6",
    title: "Frontend Developer",
    company: "TechNova Inc.",
    description:
      "We’re looking for a skilled Frontend Developer with experience in React and Tailwind CSS to help us build modern web applications.",
  },
  {
    id: "7",
    title: "Backend Engineer",
    company: "DataCloud Solutions",
    description:
      "Seeking a Backend Engineer proficient in Node.js and PostgreSQL. Experience with cloud deployment is a plus.",
  },
  {
    id: "8",
    title: "Product Designer",
    company: "Creative Minds Studio",
    description:
      "Join our team as a Product Designer to shape intuitive user experiences and clean UI interfaces. Figma experience required.",
  },
  {
    id: "9",
    title: "Marketing Specialist",
    company: "BrandSpark",
    description:
      "Looking for a Marketing Specialist to lead digital campaigns and analyze performance across social media platforms.",
  },
  {
    id: "10",
    title: "AI Research Intern",
    company: "NeuralWorks AI Lab",
    description:
      "Support cutting-edge AI projects in natural language processing and machine learning. Python and TensorFlow preferred.",
  },
  {
    id: "11",
    title: "Frontend Developer",
    company: "TechNova Inc.",
    description:
      "We’re looking for a skilled Frontend Developer with experience in React and Tailwind CSS to help us build modern web applications.",
  },
  {
    id: "12",
    title: "Backend Engineer",
    company: "DataCloud Solutions",
    description:
      "Seeking a Backend Engineer proficient in Node.js and PostgreSQL. Experience with cloud deployment is a plus.",
  },
  {
    id: "13",
    title: "Product Designer",
    company: "Creative Minds Studio",
    description:
      "Join our team as a Product Designer to shape intuitive user experiences and clean UI interfaces. Figma experience required.",
  },
  {
    id: "14",
    title: "Marketing Specialist",
    company: "BrandSpark",
    description:
      "Looking for a Marketing Specialist to lead digital campaigns and analyze performance across social media platforms.",
  },
  {
    id: "15",
    title: "AI Research Intern",
    company: "NeuralWorks AI Lab",
    description:
      "Support cutting-edge AI projects in natural language processing and machine learning. Python and TensorFlow preferred.",
  },
  {
    id: "16",
    title: "Frontend Developer",
    company: "TechNova Inc.",
    description:
      "We’re looking for a skilled Frontend Developer with experience in React and Tailwind CSS to help us build modern web applications.",
  },
  {
    id: "17",
    title: "Backend Engineer",
    company: "DataCloud Solutions",
    description:
      "Seeking a Backend Engineer proficient in Node.js and PostgreSQL. Experience with cloud deployment is a plus.",
  },
  {
    id: "18",
    title: "Product Designer",
    company: "Creative Minds Studio",
    description:
      "Join our team as a Product Designer to shape intuitive user experiences and clean UI interfaces. Figma experience required.",
  },
  {
    id: "19",
    title: "Marketing Specialist",
    company: "BrandSpark",
    description:
      "Looking for a Marketing Specialist to lead digital campaigns and analyze performance across social media platforms.",
  },
  {
    id: "20",
    title: "AI Research Intern",
    company: "NeuralWorks AI Lab",
    description:
      "Support cutting-edge AI projects in natural language processing and machine learning. Python and TensorFlow preferred.",
  },
  {
    id: "21",
    title: "Frontend Developer",
    company: "TechNova Inc.",
    description:
      "We’re looking for a skilled Frontend Developer with experience in React and Tailwind CSS to help us build modern web applications.",
  },
  {
    id: "22",
    title: "Backend Engineer",
    company: "DataCloud Solutions",
    description:
      "Seeking a Backend Engineer proficient in Node.js and PostgreSQL. Experience with cloud deployment is a plus.",
  },
  {
    id: "23",
    title: "Product Designer",
    company: "Creative Minds Studio",
    description:
      "Join our team as a Product Designer to shape intuitive user experiences and clean UI interfaces. Figma experience required.",
  },
  {
    id: "24",
    title: "Marketing Specialist",
    company: "BrandSpark",
    description:
      "Looking for a Marketing Specialist to lead digital campaigns and analyze performance across social media platforms.",
  },
  {
    id: "25",
    title: "AI Research Intern",
    company: "NeuralWorks AI Lab",
    description:
      "Support cutting-edge AI projects in natural language processing and machine learning. Python and TensorFlow preferred.",
  },
  // Add more if needed for testing
];

const ITEMS_PER_PAGE = 10;

export default function Home() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [page, setPage] = useState(1);
  const [displayedJobs, setDisplayedJobs] = useState(
    jobs.slice(0, ITEMS_PER_PAGE)
  );
  const [selectedJob, setSelectedJob] = useState<(typeof jobs)[0] | null>(
    jobs[0]
  );
  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const fetchMoreJobs = () => {
    const nextPage = page + 1;
    const nextItems = jobs.slice(0, nextPage * ITEMS_PER_PAGE);
    setDisplayedJobs(nextItems);
    setPage(nextPage);
  };
  console.log(user);
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header user={user} logout={logout} />

      {/* Main Body */}
      <main
        className={`
        flex-1 text-left
        py-0 sm:py-6
        px-0 sm:px-[clamp(1rem,2vw,10rem)]
      `}
      >
        <div className="mx-auto w-full max-w-[1280px] flex flex-col sm:flex-row">
          {/* Job List */}
          <div
            id="scrollableDiv"
            className={`
            relative z-0 
            w-full sm:w-1/2 divide-y overflow-auto
            border-0 sm:border sm:rounded-l-lg
            sm:[border-width:1.5px] sm:border-gray-300
          `}
            style={{
              height: "85vh",
            }}
          >
            <InfiniteScroll
              dataLength={displayedJobs.length}
              next={fetchMoreJobs}
              hasMore={displayedJobs.length < jobs.length}
              loader={
                <div className="p-4 flex justify-center text-gray-500">
                  <LoadingOutlined style={{ fontSize: 24 }} spin />
                </div>
              }
              endMessage={
                <div className="p-4 text-center text-gray-400 text-sm">
                  SanGig Corporation © 2025
                </div>
              }
              scrollableTarget="scrollableDiv"
            >
              <List
                dataSource={displayedJobs}
                renderItem={(job) => (
                  <List.Item
                    key={job.id}
                    onClick={() => {
                      if (window.innerWidth < 768) {
                        setSelectedJob(job);
                        showDrawer();
                      } else {
                        setSelectedJob(job);
                      }
                    }}
                    className={`cursor-pointer group transition ${
                      selectedJob?.id === job.id ? "bg-gray-100" : ""
                    }`}
                  >
                    <div className="px-4 py-2 w-full">
                      <List.Item.Meta
                        title={
                          <span className="font-semibold text-lg group-hover:underline">
                            {job.title}
                          </span>
                        }
                        description={
                          <span className="text-sm text-gray-600">
                            {job.company}
                          </span>
                        }
                      />
                    </div>
                  </List.Item>
                )}
              />
            </InfiniteScroll>
          </div>
          {/* Detail View */}
          <div
            className="
            hidden sm:block sm:w-1/2
            sm:border-t sm:border-r sm:border-b
            sm:border-gray-300
            sm:rounded-r-lg
            sm:[border-top-width:1.5px]
            sm:[border-right-width:1.5px]
            sm:[border-bottom-width:1.5px]
          "
            style={{
              height: "85vh",
            }}
          >
            <div className="p-4">
              {selectedJob ? (
                <>
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-bold">{selectedJob.title}</h2>
                    <button
                      onClick={() => router.push("/messages")}
                      className="bg-[#50C878] text-white px-4 py-2 rounded-full font-semibold hover:bg-[#3fa963] transition cursor-pointer"
                    >
                      Message
                    </button>
                  </div>
                  <p className="text-gray-600 mb-2">{selectedJob.company}</p>
                  <p>{selectedJob.description}</p>
                </>
              ) : (
                <p className="text-gray-500">Select a job to view details.</p>
              )}
            </div>
          </div>
        </div>
        <Drawer
          placement="bottom"
          closable={false}
          onClose={onClose}
          open={open}
          getContainer={false}
          height="90vh"
          styles={{
            body: {
              padding: 0,
            },
            content: {
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
            },
          }}
        >
          <div className="flex items-center justify-between px-4 py-3 bg-white  sticky top-0 z-10">
            <button
              onClick={onClose}
              className="text-gray-500 cursor-pointer hover:text-black"
            >
              <CloseOutlined style={{ fontSize: "20px" }} />
            </button>
            <button
              onClick={() => router.push("/messages")}
              className="bg-[#50C878] text-white px-4 py-2 rounded-full font-semibold hover:bg-[#3fa963] transition cursor-pointer"
            >
              Message
            </button>
          </div>

          {/* Content */}
          <div
            className="overflow-y-auto z-0 px-4 pb-4"
            style={{ height: "calc(90vh - 56px)" }}
          >
            <h2 className="text-xl font-bold">{selectedJob?.title}</h2>
            <p className="text-gray-600 mb-2">{selectedJob?.company}</p>
            <p>{selectedJob?.description}</p>
            <h2 className="text-xl font-bold">{selectedJob?.title}</h2>
            <p className="text-gray-600 mb-2">{selectedJob?.company}</p>
            <p>{selectedJob?.description}</p>
            <h2 className="text-xl font-bold">{selectedJob?.title}</h2>
            <p className="text-gray-600 mb-2">{selectedJob?.company}</p>
            <p>{selectedJob?.description}</p>
            <h2 className="text-xl font-bold">{selectedJob?.title}</h2>
            <p className="text-gray-600 mb-2">{selectedJob?.company}</p>
            <p>{selectedJob?.description}</p>
            <h2 className="text-xl font-bold">{selectedJob?.title}</h2>
            <p className="text-gray-600 mb-2">{selectedJob?.company}</p>
            <p>{selectedJob?.description}</p>
            <h2 className="text-xl font-bold">{selectedJob?.title}</h2>
            <p className="text-gray-600 mb-2">{selectedJob?.company}</p>
            <p>{selectedJob?.description}</p>
            <h2 className="text-xl font-bold">{selectedJob?.title}</h2>
            <p className="text-gray-600 mb-2">{selectedJob?.company}</p>
            <p>{selectedJob?.description}</p>
            <h2 className="text-xl font-bold">{selectedJob?.title}</h2>
            <p className="text-gray-600 mb-2">{selectedJob?.company}</p>
            <p>{selectedJob?.description}</p>
            <h2 className="text-xl font-bold">{selectedJob?.title}</h2>
            <p className="text-gray-600 mb-2">{selectedJob?.company}</p>
            <p>{selectedJob?.description}</p>
            <h2 className="text-xl font-bold">{selectedJob?.title}</h2>
            <p className="text-gray-600 mb-2">{selectedJob?.company}</p>
            <p>{selectedJob?.description}</p>
            <h2 className="text-xl font-bold">{selectedJob?.title}</h2>
            <p className="text-gray-600 mb-2">{selectedJob?.company}</p>
            <p>{selectedJob?.description}</p>
          </div>
        </Drawer>
      </main>
    </div>
  );
}
