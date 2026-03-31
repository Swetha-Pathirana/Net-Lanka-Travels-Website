import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

import AdminProtectedRoute from "./components/admin/AdminProtectedRoute";
import Layout from "./components/Layout";
import ScrollToTopButton from "./components/ScrollToTopButton";

// User Pages
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import OurTeam from "./pages/OurTeam"; 
import OurJourney from "./pages/OurJourney";
import CommunityImpact from "./pages/CommunityImpact";
import Contact from "./pages/Contact";
import Destination from "./pages/Destination";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import Experiences from "./pages/Experiences";
import ExperienceDetail from "./pages/ExperienceDetail";
import DayTour from "./pages/DayTour";
import RoundTour from "./pages/RoundTour";
import TourDetail from "./pages/TourDetail";
import RoundTourDetail from "./pages/RoundTourDetail";
import TailorMadeTours from "./pages/TailorMadeTours";
import ScrollToTop from "./components/ScrollToTop";
import WhatsAppButton from "./components/WhatsAppButton";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import BookEventTour from "./components/BookEventTour";
import QuickTaxiButton from "./components/QuickTaxiButton";
import QuickTaxi from "./pages/QuickTaxi";
import { FloatingButtonsProvider } from "./context/FloatingButtonsContext";
import TermsConditions from "./pages/TermsConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";

// Common Pages (Admin & Super Admin)
import AdminLogin from "./pages/admin/Login";
import ForgotPassword from "./pages/admin/ForgotPassword";
import ChangePassword from "./pages/admin/ChangePassword";
import AdminManageAbout from "./pages/admin/ManageAbout";
import AdminManageTeam from "./pages/admin/ManageTeam";
import AdminManageJourney from "./pages/admin/ManageJourney";
import AdminManageCommunityImpact from "./pages/admin/ManageCommunityImpact";
import ManageDestination from "./pages/admin/ManageDestination";
import DestinationList from "./pages/destinations/DestinationList";
import AddDestination from "./pages/destinations/AddDestination";
import EditDestination from "./pages/destinations/EditDestination";
import BlogList from "./pages/blog/BlogList";
import AddBlog from "./pages/blog/AddBlog";
import EditBlog from "./pages/blog/EditBlog";
import BlogView from "./pages/blog/BlogView";
import AdminTailorMade from "./pages/admin/ManageTailorMadeTour";
import DayTourList from "./pages/daytour/DayTourList";
import AddDayTour from "./pages/daytour/AddDayTour";
import EditDayTour from "./pages/daytour/EditDayTour";
import RoundTourList from "./pages/roundtour/RoundTourList";
import AddRoundTour from "./pages/roundtour/AddRoundTour";
import EditRoundTour from "./pages/roundtour/EditRoundTour";
import ExperienceList from "./pages/experience/ExperienceList";
import AddExperience from "./pages/experience/AddExperience";
import EditExperience from "./pages/experience/EditExperience";
import ExperienceView from "./pages/experience/ExperienceView";
import EditContact from "./pages/contact/EditContact";
import ContactList from "./pages/contact/ContactList";
import AdminManageHome from "./pages/admin/ManageHome";
import BlogComments from "./pages/admin/BlogComments";
import TourReviews from "./pages/admin/TourReviews";
import TailorComments from "./pages/admin/TailorComments";
import EventList from "./pages/admin/EventList";
import AddEvent from "./pages/admin/AddEvent";
import EditEvent from "./pages/admin/EditEvent";
import QuickTaxiBookingAdmin from "./pages/admin/QuickTaxiBooking";
import TaxiList from "./pages/quickTaxi/TaxiList";
import AddTaxi from "./pages/quickTaxi/AddTaxi";
import EditTaxi from "./pages/quickTaxi/EditTaxi";

// Admin Pages
import AdminLayout from "./components/layouts/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminNotifications from "./pages/admin/AdminNotifications";

//Super Admin Pages
import SuperAdminLayout from "./components/layouts/SuperAdminLayout";
import SuperAdminDashboard from "./pages/admin/SuperAdminDashboard";
import SectionNotifications from "./pages/admin/SectionNotifications";
import AdminSectionRequest from "./pages/admin/AdminSectionRequest";
import DayTourBookingAdmin from "./pages/admin/DayTourBooking";
import RoundTourBookingAdmin from "./pages/admin/RoundTourBooking";
import CustomizeTourBookingAdmin from "./pages/admin/CustomizeTourBooking";
import EventTourBookingAdmin from "./pages/admin/EventTourBookingAdmin";
import AddAdmin from "./pages/admin/AddAdmin";
import AdminList from "./pages/admin/AdminList";
import ManageTripadvisorReviews from "./pages/admin/ManageTripadvisorReviews";

function App() {
  const location = useLocation();
  const [showSessionModal, setShowSessionModal] = useState(false);

  // Hide Navbar + Footer on admin & super admin pages
  const hideLayout =
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/super-admin");

  // Listen for 401 event from axios interceptor
  useEffect(() => {
    const handleSessionExpired = () => {
      setShowSessionModal(true);
      toast.error("Session expired. Please log in again.", {
        position: "top-right",
        autoClose: 4000,
      });
      // Clear tokens
      sessionStorage.removeItem("adminToken");
      sessionStorage.removeItem("superadminToken");
    };
    window.addEventListener("sessionExpired", handleSessionExpired);

    return () =>
      window.removeEventListener("sessionExpired", handleSessionExpired);
  }, []);

  return (
    <>
      {/* Toast for session expired */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <div className="flex flex-col min-h-screen">
        {!hideLayout && <Navbar />}

        <FloatingButtonsProvider>
          <ScrollToTop />
          {!hideLayout && <WhatsAppButton />}
          {!hideLayout && <QuickTaxiButton />}
          <ScrollToTopButton />
          <main className="flex-grow flex flex-col justify-start">
            <Routes>
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route
                path="/terms-and-conditions"
                element={<TermsConditions />}
              />

              {/* ---------------------------USER ROUTES--------------------------- */}
              <Route
                path="/"
                element={
                  <Layout>
                    <Home />
                  </Layout>
                }
              />
              <Route path="/about" element={<About />} />
              <Route
                path="/our-team"
                element={
                  <Layout>
                    <OurTeam />
                  </Layout>
                }
              />
              <Route path="/our-journey" element={<OurJourney />} />
              <Route
                path="/community-impact"
                element={
                  <Layout>
                    <CommunityImpact />
                  </Layout>
                }
              />
              <Route
                path="/contact"
                element={
                  <Layout>
                    <Contact />
                  </Layout>
                }
              />
              <Route
                path="/destinations"
                element={
                  <Layout>
                    <Destination />
                  </Layout>
                }
              />
              <Route
                path="/blog"
                element={
                  <Layout>
                    <Blog />
                  </Layout>
                }
              />
              <Route path="blog/:slug" element={<BlogDetail />} />
              <Route path="/experience" element={<Experiences />} />
              <Route path="/experience/:slug" element={<ExperienceDetail />} />
              <Route
                path="/day-tours"
                element={
                  <Layout>
                    <DayTour />
                  </Layout>
                }
              />
              <Route
                path="/round-tours"
                element={
                  <Layout>
                    <RoundTour />
                  </Layout>
                }
              />
              <Route path="/day-tour-detail/:slug" element={<TourDetail />} />
              <Route path="/round-tours/:slug" element={<RoundTourDetail />} />

              <Route path="/tailor-made-tours" element={<TailorMadeTours />} />
              <Route
                path="/events"
                element={
                  <Layout>
                    <Events />
                  </Layout>
                }
              />
              <Route path="/events/:slug" element={<EventDetail />} />
              <Route
                path="/book-event"
                element={
                  <Layout>
                    <BookEventTour />
                  </Layout>
                }
              />
              <Route
                path="/quick-taxi"
                element={
                  <Layout>
                    <QuickTaxi />
                  </Layout>
                }
              />

              {/* ---------------------------ADMIN, SUPER ADMIN LOGIN--------------------------- */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin/forgot-password"
                element={<ForgotPassword />}
              />
              <Route
                path="/admin/change-password"
                element={<ChangePassword />}
              />
              <Route
                path="/super-admin/change-password"
                element={<ChangePassword />}
              />

              {/* ---------------------------SUPER ADMIN ROUTES--------------------------- */}
              <Route
                path="/super-admin"
                element={
                  <AdminProtectedRoute>
                    <SuperAdminLayout />
                  </AdminProtectedRoute>
                }
              >
                {/* Dashboard */}
                <Route path="dashboard" element={<SuperAdminDashboard />} />

                {/* Section Requests & Notifications */}
                <Route
                  path="section-request"
                  element={<AdminSectionRequest />}
                />
                <Route
                  path="section-notifications"
                  element={<SectionNotifications />}
                />

                {/* Our Story */}
                <Route path="manage-about" element={<AdminManageAbout />} />
                <Route path="manage-team" element={<AdminManageTeam />} />
                <Route path="manage-journey" element={<AdminManageJourney />} />
                <Route
                  path="manage-community"
                  element={<AdminManageCommunityImpact />}
                />

                {/* Destinations */}
                <Route
                  path="manage-destination"
                  element={<ManageDestination />}
                />
                <Route path="destinations" element={<DestinationList />} />
                <Route path="destinations/new" element={<AddDestination />} />
                <Route
                  path="destinations/edit/:id"
                  element={<EditDestination />}
                />

                {/* Experiences */}
                <Route path="experiences" element={<ExperienceList />} />
                <Route path="experiences/new" element={<AddExperience />} />
                <Route
                  path="experiences/edit/:id"
                  element={<EditExperience />}
                />
                <Route
                  path="experiences/view/:id"
                  element={<ExperienceView />}
                />

                {/* Blogs */}
                <Route path="blogs" element={<BlogList />} />
                <Route path="blogs/new" element={<AddBlog />} />
                <Route path="blogs/edit/:id" element={<EditBlog />} />
                <Route path="blogs/view/:id" element={<BlogView />} />

                {/* Tailor Made Tours */}
                <Route path="tailor-made-tours" element={<AdminTailorMade />} />

                {/* Day Tours */}
                <Route path="day-tours" element={<DayTourList />} />
                <Route path="day-tours/new" element={<AddDayTour />} />
                <Route path="day-tours/edit/:id" element={<EditDayTour />} />

                {/* Events */}
                <Route path="events" element={<EventList />} />
                <Route path="events/new" element={<AddEvent />} />
                <Route path="events/edit/:id" element={<EditEvent />} />

                {/* Round Tours */}
                <Route path="round-tours" element={<RoundTourList />} />
                <Route path="round-tours/new" element={<AddRoundTour />} />
                <Route
                  path="round-tours/edit/:id"
                  element={<EditRoundTour />}
                />

                {/* Contacts */}
                <Route path="contacts" element={<ContactList />} />
                <Route path="contacts/edit" element={<EditContact />} />

                {/* Home */}
                <Route path="manage-home" element={<AdminManageHome />} />

                {/* Comments & Reviews */}
                <Route path="blog-comments" element={<BlogComments />} />
                <Route path="tour-reviews" element={<TourReviews />} />
                <Route path="tailor-comments" element={<TailorComments />} />
                <Route
  path="tripadvisor-reviews"
  element={<ManageTripadvisorReviews />}
/>

                {/* Bookings */}
                <Route
                  path="day-tour-booking"
                  element={<DayTourBookingAdmin />}
                />
                <Route
                  path="event-tour-booking"
                  element={<EventTourBookingAdmin />}
                />
                <Route
                  path="round-tour-booking"
                  element={<RoundTourBookingAdmin />}
                />
                <Route
                  path="customize-tour"
                  element={<CustomizeTourBookingAdmin />}
                />
                <Route
                  path="quick-taxi-booking"
                  element={<QuickTaxiBookingAdmin />}
                />

                {/* Quick Taxi */}
                <Route path="taxis" element={<TaxiList />} />
                <Route path="taxis/new" element={<AddTaxi />} />
                <Route path="taxis/edit/:id" element={<EditTaxi />} />

                {/* Admin Management */}
                <Route path="add-admin" element={<AddAdmin />} />
                <Route path="admins" element={<AdminList />} />
              </Route>

              {/* ---------------------------ADMIN ROUTES--------------------------- */}
              <Route
                path="/admin"
                element={
                  <AdminProtectedRoute>
                    <AdminLayout />
                  </AdminProtectedRoute>
                }
              >
                {/* Dashboard */}
                <Route path="dashboard" element={<AdminDashboard />} />

                {/* Our Story */}
                <Route path="manage-about" element={<AdminManageAbout />} />
                <Route path="manage-team" element={<AdminManageTeam />} />
                <Route path="manage-journey" element={<AdminManageJourney />} />
                <Route
                  path="manage-community"
                  element={<AdminManageCommunityImpact />}
                />

                {/* Destinations */}
                <Route
                  path="manage-destination"
                  element={<ManageDestination />}
                />
                <Route path="destinations" element={<DestinationList />} />
                <Route path="destinations/new" element={<AddDestination />} />
                <Route
                  path="destinations/edit/:id"
                  element={<EditDestination />}
                />

                {/* Experiences */}
                <Route path="experiences" element={<ExperienceList />} />
                <Route path="experiences/new" element={<AddExperience />} />
                <Route
                  path="experiences/edit/:id"
                  element={<EditExperience />}
                />
                <Route
                  path="experiences/view/:id"
                  element={<ExperienceView />}
                />

                {/* Blogs */}
                <Route path="blogs" element={<BlogList />} />
                <Route path="blogs/new" element={<AddBlog />} />
                <Route path="blogs/edit/:id" element={<EditBlog />} />
                <Route path="blogs/view/:id" element={<BlogView />} />

                {/* Tailor Made Tours */}
                <Route path="tailor-made-tours" element={<AdminTailorMade />} />

                {/* Day Tours */}
                <Route path="day-tours" element={<DayTourList />} />
                <Route path="day-tours/new" element={<AddDayTour />} />
                <Route path="day-tours/edit/:id" element={<EditDayTour />} />

                {/* Events */}
                <Route path="events" element={<EventList />} />
                <Route path="events/new" element={<AddEvent />} />
                <Route path="events/edit/:id" element={<EditEvent />} />

                {/* Round Tours */}
                <Route path="round-tours" element={<RoundTourList />} />
                <Route path="round-tours/new" element={<AddRoundTour />} />
                <Route
                  path="round-tours/edit/:id"
                  element={<EditRoundTour />}
                />

                {/* Comments & Reviews */}
                <Route path="blog-comments" element={<BlogComments />} />
                <Route path="tour-reviews" element={<TourReviews />} />
                <Route path="tailor-comments" element={<TailorComments />} />

                {/* Quick Taxi */}
                <Route
                  path="quick-taxi-booking"
                  element={<QuickTaxiBookingAdmin />}
                />
                <Route path="taxis" element={<TaxiList />} />
                <Route path="taxis/new" element={<AddTaxi />} />
                <Route path="taxis/edit/:id" element={<EditTaxi />} />

                {/* Notifications */}
                <Route path="notifications" element={<AdminNotifications />} />
              </Route>
            </Routes>
          </main>
        </FloatingButtonsProvider>
      </div>

      {/* Session Expired Modal */}
      {showSessionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-80 text-center shadow-lg">
            <h2 className="text-lg font-bold mb-4">Session Expired</h2>
            <p className="mb-6">
              Your session has expired. Please log in again.
            </p>
            <button
              onClick={() => (window.location.href = "/admin/login")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Go to Login
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
