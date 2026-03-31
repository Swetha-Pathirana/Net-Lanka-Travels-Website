import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useNavigate } from "react-router-dom";
import { Calendar, ArrowRight } from "lucide-react";
import Footer from "../components/Footer";
import { FiPhone, FiMail, FiCalendar, FiClock } from "react-icons/fi";
import {
  FaWhatsapp,
  FaFacebookF,
  FaXTwitter,
  FaLink,
  FaLinkedinIn,
} from "react-icons/fa6";

export default function ExperienceDetail() {
  const navigate = useNavigate();
  const [experience, setExperience] = useState(null);
  const [otherExperiences, setOtherExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showText, setShowText] = useState(false);
  const [contact, setContact] = useState({});
  const { slug } = useParams();
  const [pageUrl, setPageUrl] = useState("");
  const [showToast, setShowToast] = useState(false);
  const shareIcon =
    "w-8 h-8 sm:w-9 sm:h-9 text-sm sm:text-base rounded-full flex items-center justify-center text-white hover:scale-110 transition";

  /* ================= Scroll to Top ================= */
  useEffect(() => {
    if (!loading) {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, [loading]);

  /* ================= Fetch Experience ================= */
  useEffect(() => {
    setTimeout(() => setShowText(true), 200);
    const fetchExperience = async () => {
      try {
        const res = await axiosInstance.get(`/experience/slug/${slug}`);
        setExperience(res.data);

        const allRes = await axiosInstance.get(`/experience`);
        setOtherExperiences(allRes.data.filter((exp) => exp.slug !== slug));

        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchExperience();
  }, [slug]);

  /* ================= Fetch Contact ================= */
  useEffect(() => {
    axiosInstance
      .get("/contact")
      .then((res) => setContact(res.data || {}))
      .catch((err) => console.error(err));
  }, []);

  /* ================= Share URL ================= */
  useEffect(() => {
    setPageUrl(window.location.href);
  }, []);

  /* ================= Share Handler ================= */
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setShowToast(true);

      setTimeout(() => setShowToast(false), 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  if (loading) {
    return;
  }

  if (!experience) {
    return;
  }
  return (
    <>
      <div className=" flex flex-col min-h-screen font-poppins bg-white text-[#222]">
        {/* ---------------------------- HERO HEADER ---------------------------- */}
        <div
          className="w-full h-[360px] md:h-[560px] bg-cover bg-center relative flex items-center justify-center text-white"
          style={{
            backgroundImage: `url('${experience.heroImg || ""}')`,
            backgroundPosition: "center 25%",
          }}
        >
          <div className="absolute inset-0 bg-black/20"></div>
          <div
            className={`absolute bottom-6 md:bottom-10 right-4 md:right-10 max-w-[90%] md:w-[480px] bg-black/80 text-white p-4 md:p-6 backdrop-blur-sm shadow-lg border-none flex items-center justify-end transition-all duration-700 ease-out ${
              showText ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
            }`}
          >
            <h2 className="text-xl md:text-3xl leading-snug text-right mr-4">
              {experience.subtitle}
            </h2>
            <div className="w-[2px] bg-white h-10 md:h-12"></div>
          </div>
        </div>

        {/* ---------------------------- MAIN SECTION ---------------------------- */}
        <section className="w-full bg-[#F7FAFC] py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-16">
              <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-5">
                  {experience.title}
                </h2>

                <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-4 break-words">
                  {experience.mainDesc}
                </p>

                <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-4 break-words">
                  {experience.subDesc}
                </p>

                {/* BUTTONS */}
                <div className="mt-6 sm:mt-8 flex flex-wrap justify-center gap-4">
                  <button
                    onClick={() => navigate(`/experience`)}
                    className="
          bg-blue-600 hover:bg-blue-700 
          text-white font-semibold 
          px-6 py-3 rounded-lg 
          transition flex items-center gap-2
        "
                  >
                    Explore More
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => navigate("/tailor-made-tours")}
                    className="
          bg-[#ce2a40] hover:bg-[#ef0530] 
          text-white uppercase px-6 py-3 
          rounded-lg font-semibold 
          flex items-center gap-2 
          shadow-lg transition-colors duration-300 
          justify-center
        "
                  >
                    Tailor-make a Tour
                    <Calendar className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* SIDEBAR */}
            <div className="relative lg:sticky lg:top-24 h-fit">
              <div className="bg-white rounded-3xl p-8 shadow-lg space-y-8">
                {/* BLOG META */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold">Experience Details</h4>

                  <div className="flex items-center gap-3 text-gray-600 text-sm">
                    <FiCalendar className="text-blue-600" />
                    <span>
                      {new Date(experience.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-gray-600 text-sm">
                    <FiClock className="text-blue-600" />
                    <span>
                      {Math.ceil(
                        `${experience.mainDesc || ""} ${
                          experience.subDesc || ""
                        }`.split(" ").length / 200
                      )}{" "}
                      min read
                    </span>
                  </div>
                </div>

                {/* AUTHOR */}
                <div className="border-t pt-6 space-y-4">
                  <h4 className="font-semibold">Curated by</h4>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                      {experience.author?.name?.[0] || "N"}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {experience.author?.name || "Net Lanka Travels Team"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* TAGS */}
                {experience.tags?.length > 0 && (
                  <div className="border-t pt-6 space-y-3">
                    <h4 className="font-semibold">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {experience.tags.map((tag, idx) => (
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
                        experience.title
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

        {/* ---------------------------- SUB EXPERIENCES ---------------------------- */}
        <section className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
              Where you can experience
            </h3>
            <p className="text-gray-700 text-base md:text-lg max-w-3xl mx-auto">
              Explore the destinations where this unique experience comes to
              life, from hidden gems to iconic locales.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-8">
            {experience.subExperiences.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 w-[350px]"
              >
                <img
                  src={item.image}
                  alt={item.place}
                  className="w-full h-56 object-cover"
                />
                <div className="p-6">
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">
                    {item.place}
                  </h4>
                  <h4 className="text-l font-semibold text-gray-700 mb-2">
                    {item.location}
                  </h4>
                  <p className="text-gray-600 text-sm mb-3">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ---------------------------- LOCATION GALLERY ---------------------------- */}
        <section className="w-full py-12 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 text-center">
              Location Gallery
            </h2>
            <div className="flex flex-wrap justify-center">
              {experience.gallery.map((img, idx) => (
                <div
                  key={idx}
                  className="w-1/2 sm:w-1/3 lg:w-1/6 overflow-hidden"
                >
                  <img
                    src={img}
                    alt={`Gallery ${idx + 1}`}
                    className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------------------- TIPS & RELATED TOURS ---------------------------- */}
        <section className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-32 mt-10 lg:mt-16 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 pb-20">
          {/* Left - Tips + Button */}
          <div className="flex flex-col justify-between bg-[#b4c5df] p-6 sm:p-8 rounded-xl shadow-md">
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">
                Tips to Remember
              </h3>
              <ul className="list-disc list-inside space-y-2 sm:space-y-3 text-gray-700 text-sm sm:text-base">
                {experience.tips.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>

            <div className="mt-6 sm:mt-8 flex justify-center">
              <button
                onClick={() => navigate("/tailor-made-tours")}
                className="
          bg-[#ce2a40] hover:bg-[#ef0530]
          text-white uppercase px-4 sm:px-6 py-2 sm:py-3 
          rounded-full font-semibold flex items-center gap-2 text-sm sm:text-base
          shadow-lg transition-colors duration-300
          justify-center
        "
              >
                Start Planning Your Trip
                <Calendar className="w-4 sm:w-5 h-4 sm:h-5" />
              </button>
            </div>
          </div>

          {/* Right - Related Tours */}
          <div className="">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">
              Related Tours & Itineraries
            </h3>
            <p className="text-gray-700 text-sm sm:text-base text-center mb-6">
              Discover similar journeys and curated itineraries that include
              this unforgettable experience.
            </p>

            <Swiper
              modules={[Pagination, Autoplay]}
              spaceBetween={16}
              slidesPerView={1}
              loop
              autoplay={{ delay: 3000 }}
              breakpoints={{
                640: { slidesPerView: 1, spaceBetween: 16 },
                768: { slidesPerView: 2, spaceBetween: 20 },
              }}
            >
              {otherExperiences.map((exp, idx) => (
                <SwiperSlide key={idx}>
                  <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    <img
                      src={exp.heroImg}
                      alt={exp.title}
                      className="w-full h-40 sm:h-48 object-cover"
                    />
                    <div className="p-4 sm:p-5">
                      <h4 className="text-lg sm:text-xl font-semibold text-gray-900">
                        {exp.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">
                        {exp.subtitle}
                      </p>
                      <a
                        href={`/experience/${exp.slug}`}
                        className="mt-2 sm:mt-3 inline-block text-[#8C1F28] font-semibold text-xs sm:text-sm hover:underline"
                      >
                        Read more
                      </a>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
