import React, { useRef, useState, useEffect } from "react";
import { FaVolumeUp, FaVolumeMute } from "react-icons/fa";

/* Film Roll Column */
const FilmRoll = ({ images, direction = "up", label }) => {
  // Preload images to prevent black gaps
  useEffect(() => {
    images.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [images]);

  return (
    <div className="relative h-full w-full overflow-hidden" aria-label={label}>
      <div
        className={`absolute w-full transform-gpu ${
          direction === "up" ? "animate-scroll-up" : "animate-scroll-down"
        } hover:[animation-play-state:paused] transition-transform duration-500`}
      >
        {[...images, ...images].map((img, i) => (
          <img
            key={i}
            src={img}
            alt="Net Lanka Travels gallery"
            className="w-full h-[220px] object-cover bg-gray-800 hover:scale-105 hover:shadow-lg transition-transform duration-300"
          />
        ))}
      </div>
    </div>
  );
};

/* Main Component */
export default function GalleryVideo() {
  const videoRef = useRef(null);
  const [muted, setMuted] = useState(true);

  const toggleAudio = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setMuted(videoRef.current.muted);
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  };

  const leftImages = Array.from(
    { length: 15 },
    (_, i) => `/images/sl${i + 1}.webp`
  );
  const rightImages = Array.from(
    { length: 15 },
    (_, i) => `/images/sl${i + 16}.webp`
  );

  return (
    <section
      className="relative h-[85vh] w-full bg-black overflow-hidden group"
      aria-labelledby="netlanka-gallery-heading"
    >
      <h2 id="netlanka-gallery-heading" className="sr-only">
        Net Lanka Travels Sri Lanka Tour Gallery Video
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 h-full">
        {/* LEFT FILM ROLL (hidden on mobile) */}
        <div className="hidden md:block">
          <FilmRoll
            images={leftImages}
            direction="up"
            label="Sri Lanka travel image film roll left"
          />
        </div>

        {/* CENTER VIDEO */}
        <div
          className="relative h-full w-full bg-black overflow-hidden cursor-pointer shadow-2xl"
          onClick={togglePlay}
        >
          {/* Static background image */}
          <img
            src="/images/stats.webp"
            alt="Sri Lanka scenic background"
            className="absolute inset-0 w-full h-full object-cover z-0"
          />

          {/* Main video */}
          <video
            ref={videoRef}
            src="https://res.cloudinary.com/dz7ucktb1/video/upload/v1767248625/netlanka_w4gjts.mp4"
            autoPlay
            loop
            muted={muted}
            playsInline
            preload="metadata"
            className="relative z-10 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            aria-describedby="video-description"
          />

          <p id="video-description" className="sr-only">
            Promotional travel video showcasing Sri Lanka destinations by Net
            Lanka Travels.
          </p>

          {/* Watermark */}
          <div className="pointer-events-none absolute top-6 left-1/2 -translate-x-1/2 z-20 text-yellow-200 text-lg md:text-xl font-serif tracking-wider drop-shadow-lg uppercase whitespace-nowrap">
            Net Lanka Travels
          </div>

          {/* Audio button */}
          <button
            onClick={(e) => {
              e.stopPropagation(); 
              toggleAudio();
            }}
            className="absolute bottom-5 right-5 z-30 bg-black/40 hover:bg-black/70 text-white p-3 rounded-full backdrop-blur-md transition-transform duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-yellow-300"
            aria-label={muted ? "Unmute video audio" : "Mute video audio"}
          >
            {muted ? <FaVolumeMute size={20} /> : <FaVolumeUp size={20} />}
          </button>
        </div>

        {/* RIGHT FILM ROLL (hidden on mobile) */}
        <div className="hidden md:block">
          <FilmRoll
            images={rightImages}
            direction="down"
            label="Sri Lanka travel image film roll right"
          />
        </div>
      </div>
    </section>
  );
}
