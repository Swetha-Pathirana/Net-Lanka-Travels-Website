import React, { useEffect, useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { axiosInstance } from "../lib/axios";
import { Link } from "react-router-dom";

export default function Stories() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId] = useState(null);
  
 useEffect(() => {
  const fetchOldestBlogs = async () => {
    try {
      const res = await axiosInstance.get("/blog");
      const blogs = Array.isArray(res.data?.blogs) ? res.data.blogs : [];

      // First added (oldest) 3 blogs
      const firstAddedBlogs = blogs
        .sort((a, b) => new Date(a.date) - new Date(b.date)) // oldest first
        .slice(0, 3);

      setStories(firstAddedBlogs);
    } catch (err) {
      console.error("Failed to fetch blogs:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchOldestBlogs();
}, []);

  return (
    <section
      className="w-full py-16 md:py-20 bg-gray-100"
      aria-labelledby="blog-section-title"
    >
      {/* Section Header */}
      <header className="text-center mb-12 md:mb-14 px-4">
        <p className="text-sm md:text-lg tracking-wide text-gray-500 font-semibold uppercase">
          Blog & Travel News
        </p>

        <h2
          id="blog-section-title"
          className="text-center text-2xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mt-3 mb-14">         
          Stories & Travel Experiences
        </h2>
      </header>

      {/* Blog Cards */}
      <div className="max-w-[1300px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 px-4 md:px-6">
        {loading
          ? // Skeleton Loading Placeholders
            [1, 2, 3].map((i) => (
              <div
                key={i}
                className="animate-pulse bg-gray-200 rounded-xl h-[400px]"
              ></div>
            ))
          : stories.length === 0
          ? // Empty state
            <p className="col-span-3 text-center text-gray-500 mt-10">
              No travel stories available at the moment.
            </p>
          : // Render stories
            stories.map((story) => (
              <article
                key={story._id}
                className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-1 flex flex-col focus-within:ring-2 focus-within:ring-[#8C1F28]"
              >
                <img
                  src={story.heroImg}
                  alt={`${story.title} - Sri Lanka travel blog`}
                  className="w-full h-64 sm:h-72 md:h-[330px] object-cover rounded-t-xl"
                  loading="lazy"
                  width={400}
                  height={330}
                />

<div className="p-6 flex flex-col flex-1">
 <h3 className="mt-2 text-2xl font-semibold text-gray-900 group-hover:text-[#8C1F28] transition-colors">
  {story.title ? (
    <>
      {story.title.split(" ").slice(0, Math.ceil(story.title.split(" ").length / 2)).join(" ")}
      <br />
      {story.title.split(" ").slice(Math.ceil(story.title.split(" ").length / 2)).join(" ")}
    </>
  ) : (
    "Blog Title"
  )}
</h3>

<p className="text-gray-500 text-sm mt-1">
                        {story.date
                          ? new Date(story.date).toLocaleDateString()
                          : "Date"}
                      </p>
                     <p
  className={`text-gray-600 text-sm mt-3 leading-relaxed text-justify transition-all duration-300 ${
    expandedId === story._id ? "" : "line-clamp-3"
  }`}
>
  
  {story.description ||
    "Short description of the blog goes here."}
</p>

                  <Link
                    to={`/blog/${story.slug}`}
                    aria-label={`Read more about ${story.title}`}
                    className="mt-4 inline-flex items-center gap-2 font-medium text-[#8C1F28] hover:underline text-sm sm:text-base px-2 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8C1F28]"
                  >
                    Read More <IoIosArrowForward size={18} />
                  </Link>
                </div>
              </article>
            ))}
      </div>
    </section>
  );
}
