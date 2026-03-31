import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { IoIosArrowForward } from "react-icons/io";
import { FaStar } from "react-icons/fa";
import {
  FaWhatsapp,
  FaFacebookF,
  FaXTwitter,
  FaLink,
  FaLinkedinIn,
} from "react-icons/fa6";
import { FiPhone, FiMail, FiCalendar, FiClock } from "react-icons/fi";
import { toast } from "react-toastify";
import Footer from "../components/Footer";

export default function BlogDetail() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [otherBlogs, setOtherBlogs] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showText, setShowText] = useState(false);
  const [contact, setContact] = useState({});
  const [pageUrl, setPageUrl] = useState("");
  const [showToast, setShowToast] = useState(false);

  const [comment, setComment] = useState({
    name: "",
    email: "",
    rating: 0,
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const shareIcon =
    "w-8 h-8 sm:w-9 sm:h-9 text-sm sm:text-base rounded-full flex items-center justify-center text-white hover:scale-110 transition";

  /* ================= FETCH BLOG ================= */
  useEffect(() => {
    setShowText(false);

    const fetchBlog = async () => {
      try {
        const res = await axiosInstance.get(`/blog/slug/${slug}`);
        setBlog(res.data);

        const allRes = await axiosInstance.get(`/blog`);
        setOtherBlogs(allRes.data.blogs.filter((b) => b.slug !== slug));

        const commentsRes = await axiosInstance.get(
          `/blog-comments/${res.data._id}`
        );
        if (commentsRes.data.success) {
          setComments(commentsRes.data.comments);
        }

        setLoading(false);
        setTimeout(() => setShowText(true), 500);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  /* ================= CONTACT ================= */
  useEffect(() => {
    axiosInstance
      .get("/contact")
      .then((res) => setContact(res.data || {}))
      .catch(console.error);
  }, []);

  /* ================= SHARE URL ================= */
  useEffect(() => {
    setPageUrl(window.location.href);
  }, []);

  /* ================= SHARE HANDLER ================= */
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setShowToast(true);

      setTimeout(() => setShowToast(false), 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  /* ================= EARLY RETURNS ================= */
  if (loading) {
    return;
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Blog not found
      </div>
    );
  }

  /* ================= SAFE DATA ================= */
  const paragraphs = blog.content
    ? blog.content.split(/\n\s*\n/).filter(Boolean)
    : [];

  /* ================= COMMENT HANDLERS ================= */
  const handleCommentChange = (e) => {
    const { name, value } = e.target;
    setComment((p) => ({ ...p, [name]: value }));
  };

  const handleRating = (rate) => {
    setComment((p) => ({ ...p, rating: rate }));
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!comment.name || !comment.email || !comment.message) {
      toast.warning("Please fill in all required fields!");
      return;
    }

    setSubmitting(true);
    try {
      const res = await axiosInstance.post(
        `/blog-comments/${blog._id}`,
        comment
      );

      if (res.data.success) {
        toast.success("Comment submitted!");
        setComments((p) => [
          { ...comment, createdAt: new Date(), rating: comment.rating },
          ...p,
        ]);
        setComment({ name: "", email: "", rating: 0, message: "" });
      }
    } catch {
      toast.error("Failed to submit comment");
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <>
      <div className=" flex flex-col min-h-screen font-poppins bg-white text-[#222] overflow-x-hidden">
        {/* HERO */}
        <div
          className="w-full h-[360px] md:h-[560px] bg-cover bg-center relative flex items-center justify-center text-white mb-5"
          style={{
            backgroundImage: `url(${blog.heroImg || "/images/blog.webp"})`,
          }}
        >
          <div className="absolute inset-0 bg-black/20"></div>
          <div
            className={`absolute bottom-6 md:bottom-10 right-4 md:right-10 max-w-[90%] md:w-[400px] bg-black/80 text-white p-4 md:p-6 backdrop-blur-sm shadow-lg border-none flex items-center justify-end transition-all duration-700 ease-out ${
              showText ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
            }`}
          >
            <h2 className="text-xl md:text-3xl leading-snug text-right mr-4">
              {blog.subtitle}
            </h2>
            <div className="w-[2px] bg-white h-10 md:h-12"></div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <section className="w-full bg-[#F7FAFC] py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* LEFT CONTENT */}
            <div className="lg:col-span-2 space-y-16">
              <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-5">
                  {blog.title}
                </h2>

                {paragraphs.map((para, idx) => (
                  <p
                    key={idx}
                    className="text-gray-700 text-base sm:text-lg leading-relaxed mb-4 break-words"
                  >
                    {para}
                  </p>
                ))}
              </div>
            </div>

            {/* SIDEBAR */}
            <div className="relative lg:sticky lg:top-24 h-fit">
              <div className="bg-white rounded-3xl p-8 shadow-lg space-y-8">
                {/* BLOG META */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold">Blog Details</h4>

                  <div className="flex items-center gap-3 text-gray-600 text-sm">
                    <FiCalendar className="text-blue-600" />
                    <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center gap-3 text-gray-600 text-sm">
                    <FiClock className="text-blue-600" />
                    <span>
                      {Math.ceil(paragraphs.join(" ").split(" ").length / 200)}{" "}
                      min read
                    </span>
                  </div>
                </div>

                {/* AUTHOR */}
                <div className="border-t pt-6 space-y-4">
                  <h4 className="font-semibold">Author</h4>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                      {blog.author?.name?.[0] || "T"}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {blog.author?.name || "Travel Content Writer"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* TAGS */}
                {blog.tags?.length > 0 && (
                  <div className="border-t pt-6 space-y-3">
                    <h4 className="font-semibold">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {blog.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* SHARE */}
                <div className="border-t pt-6 space-y-4">
                  <h4 className="font-semibold">Share</h4>

                  <div className="flex flex-wrap items-center gap-3 text-lg">
                    {/* WhatsApp */}
                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(
                        pageUrl
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className={`${shareIcon} bg-green-500`}
                      title="Share on WhatsApp"
                    >
                      <FaWhatsapp />
                    </a>

                    {/* Facebook */}
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                        pageUrl
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className={`${shareIcon} bg-blue-600`}
                      title="Share on Facebook"
                    >
                      <FaFacebookF />
                    </a>

                    {/* X (Twitter) */}
                    <a
                      href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                        pageUrl
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className={`${shareIcon} bg-black`}
                      title="Share on X"
                    >
                      <FaXTwitter />
                    </a>

                    {/* LinkedIn */}
                    <a
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                        pageUrl
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className={`${shareIcon} bg-[#0077b5]`}
                      title="Share on LinkedIn"
                    >
                      <FaLinkedinIn />
                    </a>

                    {/* Email */}
                    <a
                      href={`mailto:?subject=${encodeURIComponent(
                        blog.title
                      )}&body=${encodeURIComponent(pageUrl)}`}
                      className={`${shareIcon} bg-gray-700`}
                      title="Share via Email"
                    >
                      <FiMail />
                    </a>

                    {/* Copy */}
                    <button
                      onClick={handleCopyLink}
                      className={`${shareIcon} bg-gray-900`}
                      title="Copy link"
                    >
                      <FaLink />
                    </button>
                  </div>
                </div>

                {/* NEED HELP */}
                {contact && (
                  <div className="border-t pt-6 space-y-4">
                    <h4 className="font-semibold">Need Help?</h4>

                    <div className="flex gap-3 items-center text-gray-600">
                      <FiPhone className="text-blue-600" />
                      <a
                        href={`tel:${contact.phone}`}
                        className="hover:text-blue-600"
                      >
                        {contact.phone}
                      </a>
                    </div>

                    <div className="flex gap-3 items-center text-gray-600">
                      <FaWhatsapp className="text-green-600" />
                      <a
                        href={`https://wa.me/${contact.whatsapp?.replace(
                          /\D/g,
                          ""
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-green-600"
                      >
                        {contact.whatsapp}
                      </a>
                    </div>

                    <div className="flex gap-3 items-center text-gray-600">
                      <FiMail className="text-blue-600" />
                      <a
                        href={`mailto:${contact.emails?.[0]}`}
                        className="hover:text-blue-600"
                      >
                        {contact.emails?.[0]}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* TOAST */}
          {showToast && (
            <div className="fixed bottom-6 right-6 z-50 bg-black text-white px-4 py-2 rounded-lg shadow-lg">
              Link copied ✅
            </div>
          )}
        </section>

        {/* ---------------------------- BLOG GALLERY ---------------------------- */}
        {blog.galleryImgs && blog.galleryImgs.length > 0 && (
          <section className="w-full py-12 bg-white">
            <div className="max-w-7xl mx-auto px-6">
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 text-center">
                Blog Gallery
              </h2>

              <div className="flex flex-wrap justify-center">
                {blog.galleryImgs.slice(0, 5).map((img, idx) => (
                  <div
                    key={idx}
                    className="w-1/2 sm:w-1/3 lg:w-1/6 overflow-hidden"
                  >
                    <img
                      src={img}
                      alt={`Blog Gallery ${idx + 1}`}
                      className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* COMMENTS SECTION */}
        <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-10 lg:px-32 mt-8 sm:mt-10 lg:mt-16 flex flex-col md:flex-row gap-8 lg:gap-16 pb-16 sm:pb-20 overflow-hidden">
          {/* COMMENT FORM */}
          <div className="md:w-1/2 bg-gray-50 rounded-xl shadow-md p-5 sm:p-8">
            <h3 className="text-xl sm:text-3xl font-bold text-gray-900 mb-5 text-center">
              Leave a Comment
            </h3>

            <form
              onSubmit={handleCommentSubmit}
              className="flex flex-col gap-4"
            >
              <label className="font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                name="name"
                value={comment.name}
                onChange={handleCommentChange}
                placeholder="Your Name"
                required
                className="border px-4 py-2.5 rounded text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#2E5B84]"
              />
              <label className="font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={comment.email}
                onChange={handleCommentChange}
                placeholder="Your Email"
                required
                className="border px-4 py-2.5 rounded text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#2E5B84]"
              />
              <div className="flex flex-col space-y-1">
                <label className="font-medium text-gray-700">Rate</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      size={24}
                      className={`cursor-pointer ${
                        comment.rating >= star
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                      onClick={() => handleRating(star)}
                    />
                  ))}
                  <span className="ml-2 text-gray-600 font-medium">
                    {comment.rating} / 5
                  </span>
                </div>
              </div>
              <label className="font-medium text-gray-700">Comment</label>
              <textarea
                name="message"
                value={comment.message}
                onChange={handleCommentChange}
                placeholder="Your Comment"
                rows={4}
                required
                className="border px-4 py-2.5 rounded text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#2E5B84]"
              />
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto bg-[#2E5B84] text-white px-6 py-3 rounded hover:bg-[#1E3A60] transition"
              >
                {submitting ? "Submitting..." : "Submit Comment"}
              </button>
            </form>
          </div>

          {/* COMMENTS SWIPER */}
          <div className="md:w-1/2 flex flex-col justify-center">
            {comments.length === 0 ? (
              <p className="text-gray-600 text-center">
                No comments yet. Be the first to comment!
              </p>
            ) : (
              <div className="relative w-full overflow-hidden">
                <Swiper
                  modules={[Autoplay, Navigation]}
                  navigation={{ prevEl: ".c-prev", nextEl: ".c-next" }}
                  autoplay={{ delay: 2500, disableOnInteraction: false }}
                  loop={true}
                  slidesPerView={1}
                  className="rounded-2xl"
                >
                  {comments.map((c, idx) => (
                    <SwiperSlide key={idx}>
                      <div className="bg-[#f7f7f7] w-full max-w-full p-5 sm:p-8 rounded-2xl shadow-lg flex flex-col items-center text-center gap-3 sm:gap-4">
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-indigo-600 text-white rounded-full flex items-center justify-center text-2xl sm:text-3xl font-bold">
                            {c.name[0].toUpperCase()}
                          </div>
                          <h4 className="font-semibold break-words text-center">
                            {c.name}
                          </h4>

                          <p className="text-gray-500 text-sm">
                            {new Date(c.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-1 text-yellow-400">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <FaStar
                              key={star}
                              className={
                                c.rating >= star
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }
                            />
                          ))}
                        </div>
                        <p className="text-gray-700 leading-relaxed break-words">
                          {c.message}
                        </p>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            )}
          </div>
        </section>

        {/* RELATED BLOGS */}
        <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-14 overflow-hidden">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-10 text-center">
            Related Blogs
          </h3>
          <Swiper
            modules={[Pagination, Autoplay]}
            slidesPerView={1}
            spaceBetween={16}
            loop
            autoplay={{ delay: 2500, disableOnInteraction: false }}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            pagination={{ clickable: true }}
            className="w-full"
          >
            {otherBlogs.map((b, idx) => (
              <SwiperSlide key={idx}>
                <div className="bg-white w-full max-w-full rounded-xl shadow-md hover:shadow-xl transition overflow-hidden cursor-pointer flex flex-col h-full">
                  <img
                    src={b.heroImg}
                    alt={b.title}
                    className="w-full h-48 sm:h-56 md:h-60 object-cover"
                  />
                  <div className="p-5 flex flex-col flex-1">
                    <h4 className="text-lg sm:text-xl font-semibold text-gray-900">
                      {b.title}
                    </h4>
                    <p className="text-gray-500 text-sm sm:text-base mt-2 flex-1">
                      {b.subtitle}
                    </p>
                    <a
                      href={`/blog/${b.slug}`}
                      className="mt-4 inline-flex items-center text-[#8C1F28] font-semibold hover:underline"
                    >
                      Read More <IoIosArrowForward className="ml-1" />
                    </a>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>
      </div>
      <Footer />
    </>
  );
}
