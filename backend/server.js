require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cron = require("node-cron");
const { checkBookings } = require("./cron/reminderCron");

// -------------------- CORS --------------------
const allowedOrigins = require("./config/cors.config");

// -------------------- APP --------------------
const app = express();
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));

// -------------------- STATIC --------------------
app.use("/uploads", express.static("uploads"));

// -------------------- ROOT API --------------------
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Tour Website Backend API is running",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date(),
  });
});

// -------------------- CRON --------------------
cron.schedule(
  "0 8 * * *",
  () => {
    checkBookings();
  },
  {
    timezone: "Asia/Colombo",
  }
);

// -------------------- IMPORT ROUTES --------------------

// Super Admin & Admin routes
const loginRoute = require("./routes/login"); // admin login
const passwordResetRoute = require("./routes/passwordReset");
const adminNotificationsRoute = require("./routes/adminNotifications");
const adminRoute = require("./routes/admin");
const superAdminRoute = require("./routes/superAdmin");
const superAdminRoutes = require("./routes/superAdminRoutes");
const adminRoutes = require("./routes/adminRoutes");
const tripadvisorReview = require("./routes/tripadvisorReviews");

// Other routes
const aboutRoute = require("./routes/about");
const teamRoute = require("./routes/team");
const journeyRoute = require("./routes/journey");
const communityRoute = require("./routes/communityImpact");
const destinationRoute = require("./routes/destination");
const experienceRoutes = require("./routes/experience");
const blogRoutes = require("./routes/blog");
const tailorMadeTourRoutes = require("./routes/tailorMadeTourRoutes");
const emailRoutes = require("./routes/emailRoutes");
const dayTourRoutes = require("./routes/dayTour");
const roundToursRouter = require("./routes/roundTours");
const contactRoute = require("./routes/contact");
const contactFormRoute = require("./routes/contactForm");
const homeRoute = require("./routes/home");
const BlogCommentRoute = require("./routes/blogComments");
const testimonialRoute = require("./routes/testimonials");
const reviewRoute = require("./routes/review");
const dayTourBookingRoute = require("./routes/dayTourBooking");
const roundTourBookingRoute = require("./routes/roundTourBooking");
const tourBookingRoute = require("./routes/tourBookings");
const tourReviewsRoutes = require("./routes/tourReviews");
const eventRoutes = require("./routes/event");
const eventTourBookingRoutes = require("./routes/eventTourBooking");
const quickTaxiRoute = require("./routes/quickTaxi");
const newsletterRoute = require("./routes/newsletter");

// -------------------- ROUTES --------------------

// -------------------- ADMIN LOGIN & AUTH --------------------
app.use("/api/admin", loginRoute);
app.use("/api/reset-password", passwordResetRoute);
app.use("/api/admin-notifications", adminNotificationsRoute);
app.use("/api/admin", adminRoute);
app.use("/api/admin", adminRoutes);
app.use("/api/super-admin", superAdminRoute);
app.use("/api/super-admin", superAdminRoutes);
app.use("/api/tripadvisor-reviews", tripadvisorReview);

// -------------------- OTHER ROUTES --------------------
app.use("/api/event-tour-booking", eventTourBookingRoutes);
app.use("/api/round-tours", roundToursRouter);
app.use("/api/day-tours", dayTourRoutes);
app.use("/api/about", aboutRoute);
app.use("/api/team", teamRoute);
app.use("/api/journey", journeyRoute);
app.use("/api/communityImpact", communityRoute);
app.use("/api/destination", destinationRoute);
app.use("/api/experience", experienceRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/tailor-made-tours", tailorMadeTourRoutes);
app.use("/api/send-email", emailRoutes);
app.use("/api/contact", contactRoute);
app.use("/api/contact-form", contactFormRoute);
app.use("/api/home", homeRoute);
app.use("/api/blog-comments", BlogCommentRoute);
app.use("/api/testimonials", testimonialRoute);
app.use("/api/reviews", reviewRoute);
app.use("/api/day-tour-booking", dayTourBookingRoute);
app.use("/api/round-tour-booking", roundTourBookingRoute);
app.use("/api/book-tour", tourBookingRoute);
app.use("/api/tour-reviews", tourReviewsRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/quick-taxi", quickTaxiRoute);
app.use("/api/newsletter", newsletterRoute);

// -------------------- CONNECT TO MONGODB --------------------
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// -------------------- START SERVER --------------------
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

