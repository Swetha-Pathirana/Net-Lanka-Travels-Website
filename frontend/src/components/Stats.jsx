import { useEffect, useState, useRef } from "react";
import { axiosInstance } from "../lib/axios";

export default function Stats() {
  const [statsData, setStatsData] = useState([]);
  const [counts, setCounts] = useState([]);
  const sectionRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  // Fetch stats from backend
  const fetchStats = async () => {
    try {
      const res = await axiosInstance.get("/home");
      if (res.data && Array.isArray(res.data.stats)) {
        setStatsData(res.data.stats);
        setCounts(res.data.stats.map(() => 0));
      }
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // Animate counts when section is in view
  useEffect(() => {
    if (!statsData.length) return;
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setHasAnimated(true);
        } else {
          setHasAnimated(false);
          setCounts(statsData.map(() => 0)); // reset counts when leaving
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [statsData]);

  // Count animation
  useEffect(() => {
    if (!hasAnimated) return;

    const durations = statsData.map((s) => s.count / 30 || 1);
    const intervals = statsData.map((stat, index) =>
      setInterval(() => {
        setCounts((prev) => {
          const updated = [...prev];
          if (updated[index] < stat.count) {
            updated[index] += Math.ceil(durations[index]);
            if (updated[index] > stat.count) updated[index] = stat.count;
          }
          return updated;
        });
      }, 30)
    );

    return () => intervals.forEach(clearInterval);
  }, [hasAnimated, statsData]);

  return (
    <section
      ref={sectionRef}
      aria-label="Net Lanka Travels statistics section"
      className="w-full bg-cover bg-center bg-fixed relative flex items-center py-16 md:py-20"
      style={{
        backgroundImage: "url('/images/stats.webp')",
      }}
    >
      <div aria-hidden="true" className="absolute inset-0"></div>

      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 text-center px-6 gap-8 md:gap-12">
        {statsData.map((stat, i) => (
          <div
            key={i}
            className="text-white flex flex-col items-center px-4 sm:px-6"
          >
            {/* Stat Icon/Image */}
            <div className="mb-4">
              <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-white flex items-center justify-center mx-auto shadow-lg">
                {stat.icon ? (
                  <img
                    src={stat.icon}
                    alt={stat.title}
                    className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 object-contain"
                  />
                ) : (
                  <span className="text-2xl sm:text-3xl md:text-4xl" aria-hidden="true">
                    🎯
                  </span>
                )}
              </div>
            </div>

            {/* Count */}
            <h2
              className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-extrabold flex items-center gap-1"
              aria-label={`${stat.title} count: ${counts[i]}`}
              role="status"
            >
              {counts[i].toLocaleString()}
              <span className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold">
                +
              </span>
            </h2>

            {/* Label */}
            <h3 className="text-base sm:text-lg md:text-lg lg:text-xl font-medium mt-2">
              {stat.title}
            </h3>
          </div>
        ))}
      </div>
    </section>
  );
}
