import React, { useEffect, useRef, useState, useMemo } from "react";
import { axiosInstance } from "../lib/axios";

export default function VideoSection() {
  const videoRef = useRef(null);

  const [homeInfo, setHomeInfo] = useState({
    title: "",
    subtitle: "",
    description: "",
    video: "",
  });

  const videoUrl = useMemo(() => homeInfo.video, [homeInfo.video]);

  // Fetch home info
  useEffect(() => {
    axiosInstance.get("/home").then((res) => {
      if (res?.data?.info) {
        setHomeInfo(res.data.info);
      }
    });
  }, []);

  // Autoplay only if user allows motion
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    video.muted = true;
    video.playsInline = true;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {});
    }
  }, [videoUrl]);

  return (
    <section
      className="w-full bg-white py-16 md:py-28"
      aria-labelledby="video-section-title"
    >
      <div className="max-w-[1350px] mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 items-center gap-10">
        {/* LEFT CONTENT */}
        <div className="lg:col-span-6">
          <div className="max-w-[680px]">
            {homeInfo.subtitle && (
              <h2
                id="video-section-title"
                className="text-xs tracking-widest uppercase mb-5 text-gray-400"
              >
                {homeInfo.subtitle}
              </h2>
            )}

            {homeInfo.title && (
              <h3 className="font-extrabold mb-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight text-gray-900">
                {homeInfo.title}
              </h3>
            )}

            {homeInfo.description && (
              <p className="text-base sm:text-lg text-gray-500 leading-relaxed text-justify">
                {homeInfo.description}
              </p>
            )}
          </div>
        </div>

        {/* RIGHT VIDEO */}
        <div className="lg:col-span-6 flex justify-center lg:justify-end">
          {videoUrl && (
            <figure className="relative w-full max-w-[720px] aspect-video rounded-2xl overflow-hidden shadow-xl border border-black/5">
              <video
                ref={videoRef}
                src={videoUrl}
                muted
                loop
                playsInline
                preload="metadata"
                poster="/images/daytours.webp"
                className="w-full h-full object-cover"
                aria-describedby="video-description"
              >
                <track
                  kind="captions"
                  src="/captions/netlanka.vtt"
                  srcLang="en"
                  label="English captions"
                  default
                />
              </video>

              {/* Overlay */}
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-black/10 pointer-events-none"
                aria-hidden="true"
              />

              {/* Watermark */}
              <figcaption
                id="video-description"
                className="absolute bottom-4 right-5 text-white text-xs sm:text-sm font-semibold opacity-70 pointer-events-none select-none"
              >
                Net Lanka Travels – Discover Sri Lanka
              </figcaption>
            </figure>
          )}
        </div>
      </div>
    </section>
  );
}
