import { useEffect } from "react";
import { FaArrowUp } from "react-icons/fa";
import { useFloatingButtons } from "../context/FloatingButtonsContext";

export default function ScrollToTopButton() {
  const { isScrollVisible, setIsScrollVisible } = useFloatingButtons();

  useEffect(() => {
    const toggleVisibility = () => {
      setIsScrollVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, [setIsScrollVisible]);

  if (!isScrollVisible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-6 right-6 z-50 bg-black text-white p-3 rounded-full shadow-lg hover:bg-gray-900 transition"
      aria-label="Scroll to top"
    >
      <FaArrowUp size={18} />
    </button>
  );
}
