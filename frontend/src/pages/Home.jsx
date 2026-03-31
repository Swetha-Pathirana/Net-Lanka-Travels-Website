import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import VideoSection from "../components/VideoSection";
import Tours from "../components/Tours";
import Cards from "../components/Cards";
import Why from "../components/Why";
import Destination from "../components/Destination";
import TripAdvisor from "../components/TripAdvisor";
import Stats from "../components/Stats";
import Video1 from "../components/Video1";
import Stories from "../components/Stories";
import ExploreMapSection from "../components/ExploreMapSection";
import { Helmet } from "react-helmet-async";
import TailorMadePackages from "../components/TailorMadePackages";

export default function Home() {
  const [currentPage] = useState(1);
  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [currentPage]);
  return (
    <div>
      <Helmet>
        <title>Net Lanka Travels | Sri Lanka Tours & Taxi Services</title>
        <meta
          name="description"
          content="Net Lanka Travels offers private Sri Lanka tours, day trips, taxi services and custom travel packages with experienced local guides."
        />
        <link rel="canonical" href="https://www.netlankatravels.com/" />
      </Helmet>

      <div className="">
        <Header />
      </div>
      <VideoSection videoSrc="/tr1.mp4" />
      <Stats />
      <Cards />
      <Tours />
      <Why />
      <Destination />
      <Video1 />
      <TailorMadePackages/>
      <Stories />
      <ExploreMapSection />
      <TripAdvisor />
    </div>
  );
}
