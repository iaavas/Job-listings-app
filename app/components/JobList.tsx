"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import useFavoriteJobsStore from "../stores/favoriteJobsStore";

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  description: string;
}

const JobList: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { addFavoriteJob, removeFavoriteJob, isFavorite } =
    useFavoriteJobsStore();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(`/api/jobs?page=${page}&limit=6`);
        const data = await response.json();
        setJobs(data.jobs);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Failed to fetch jobs", error);
      }
    };

    fetchJobs();
  }, [page]);

  const toggleFavorite = (job: Job) => {
    if (isFavorite(job._id)) {
      removeFavoriteJob(job._id);
    } else {
      addFavoriteJob(job);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
        Job Listings
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <div
            key={job._id}
            className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    {job.title}
                  </h2>
                  <p className="text-gray-600">{job.company}</p>
                  <p className="text-sm text-gray-500 mb-4">{job.location}</p>
                </div>
                <button
                  onClick={() => toggleFavorite(job)}
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center
                    ${
                      isFavorite(job._id)
                        ? "bg-red-100 text-red-600"
                        : "bg-gray-100 text-gray-500"
                    }
                    hover:bg-opacity-80 transition-colors
                  `}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill={isFavorite(job._id) ? "currentColor" : "none"}
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>
              </div>

              <p className="text-gray-700 mb-4 line-clamp-3">
                {job.description}
              </p>

              <div className="flex justify-between items-center">
                <Link
                  href={`/jobs/${job._id}`}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-8 space-x-4">
        <button
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 hover:bg-blue-600"
        >
          Prev
        </button>
        <span className="self-center text-gray-700">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
          disabled={page === totalPages}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 hover:bg-blue-600"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default JobList;
