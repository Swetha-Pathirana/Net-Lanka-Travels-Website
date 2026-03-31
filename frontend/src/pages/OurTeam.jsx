import React, { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { axiosInstance } from "../lib/axios";

const OurTeam = () => {
  const [teamData, setTeamData] = useState({
    fullDescription: [],
    members: [],
    teamImage: "",
  });

  const [showText, setShowText] = useState(false);
const [currentPage] = useState(1);
// Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [currentPage]);
  useEffect(() => {
    setTimeout(() => setShowText(true), 200);

    const fetchTeam = async () => {
      try {
        const res = await axiosInstance.get("/team");
        if (res.data) {
          setTeamData(res.data);
        }
      } catch (err) {
        console.error("", err);
      }
    };

    fetchTeam();
  }, []);

  return (
    <div className="font-poppins bg-white text-[#222]">
      {/* ---------------------------- HERO HEADER ---------------------------- */}
      <div
        className="w-full h-[360px] md:h-[560px] bg-cover bg-center relative flex items-center justify-center text-white"
        style={{
          backgroundImage: "url('/images/team-header.webp')",
          backgroundPosition: "center 50%",
        }}
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div
          className={`absolute bottom-6 md:bottom-10 right-4 md:right-10 max-w-[90%] md:w-[520px] bg-black/80 text-white p-4 md:p-6 backdrop-blur-sm shadow-lg border-none flex items-center justify-end transition-all duration-700 ease-out ${
            showText ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <h2 className="text-xl md:text-3xl leading-snug text-right mr-4">
            Meet the Experts <br />
            Behind Your Sri Lankan Adventure
          </h2>
          <div className="w-[2px] bg-white h-10 md:h-12"></div>
        </div>
      </div>

      {/* ------------------- OUR TEAM INTRO ------------------- */}
      <section className="relative flex flex-col md:flex-row h-auto md:h-screen w-full overflow-hidden bg-white">
        {/* LEFT IMAGE WRAPPER */}
        <div className="w-full md:w-1/2 h-64 sm:h-80 md:h-full overflow-hidden rounded-r-[45%] relative">
          {teamData.teamImage && (
            <img
              src={teamData.teamImage}
              alt="Our Team"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
          )}
        </div>

        {/* Right Text */}
        <div className="w-full md:w-1/2 flex flex-col justify-center px-6 sm:px-10 md:px-20 mt-10 md:mt-0 text-center md:text-left">
          <p className="font-playfair text-xl sm:text-2xl md:text-3xl text-gray-700 mt-4 leading-snug tracking-[-0.5px] max-w-xl mx-auto md:mx-0">
            MEET THE EXPERTS
          </p>
          <h2 className="font-playfair text-3xl sm:text-5xl md:text-6xl font-bold leading-[1.05] tracking-[-1px] max-w-xl mx-auto md:mx-0 mt-2">
            Our Team
          </h2>

          <div className="w-12 sm:w-16 h-[2px] bg-[#D4AF37] mt-2 mb-4 mx-auto md:mx-0"></div>

          {/* Optional: render fullDescription paragraphs if needed */}
          {teamData.fullDescription?.map((item, idx) => (
            <p
              key={idx}
              className="font-inter text-sm sm:text-base leading-relaxed text-gray-800 max-w-5xl mx-auto tracking-tight mb-4"
            >
              {item.description}
            </p>
          ))}

          <div className="flex justify-center md:justify-start mt-4">
            <button
              onClick={() => {
                const element = document.getElementById("team-members");
                if (element) {
                  element.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="bg-[#1a73e8] hover:bg-[#155ab6] text-white uppercase px-6 py-3 rounded-full font-semibold flex items-center gap-2 text-sm shadow-lg transition-colors duration-300 justify-center"
            >
              Meet Our Team
              <Users className="w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ------------------- TEAM MEMBERS SECTION ------------------- */}
      <section
        id="team-members"
        className="mt-16 mb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {teamData.members?.map((member, idx) => (
            <div
              key={idx}
              className="relative group bg-white shadow-lg rounded-xl overflow-hidden"
            >
              {/* IMAGE */}
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* BUTTON */}
              <button
                onClick={() =>
                  setTeamData((prev) => ({ ...prev, activeIndex: idx }))
                }
                className="absolute bottom-0 left-0 w-full bg-black/60 text-white 
            font-semibold py-3 text-center backdrop-blur-sm hover:bg-black/70 transition"
              >
                Learn More
              </button>

              {/* SLIDE OVERLAY */}
              <div
                className={`absolute top-0 left-0 h-full bg-white/70 backdrop-blur-md shadow-xl 
              transition-all duration-500 overflow-hidden
              ${teamData.activeIndex === idx ? "w-full" : "w-0"}
            `}
              >
                <div className="p-6 h-full flex flex-col">
                  <button
                    onClick={() =>
                      setTeamData((prev) => ({ ...prev, activeIndex: null }))
                    }
                    className="self-end text-gray-700 hover:text-black text-2xl font-bold"
                  >
                    &times;
                  </button>

                  <h3 className="text-2xl font-semibold mb-2 text-gray-800">
                    {member.name}
                  </h3>

                  <p className="text-gray-600 font-medium mb-4">
                    {member.role}
                  </p>

                  <p className="text-gray-700 leading-relaxed">
                    {member.description || "No description available."}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default OurTeam;
