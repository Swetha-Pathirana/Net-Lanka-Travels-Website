const express = require("express");
const router = express.Router();
const Newsletter = require("../models/Newsletter");
const sendEmail = require("../utils/mailer");
const DayTour = require("../models/DayTour");
const RoundTour = require("../models/RoundTour");
const Event = require("../models/Event");
const QuickTaxi = require("../models/QuickTaxi");

// ---------------- SUBSCRIBE TO NEWSLETTER ----------------
router.post("/", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email)
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });

    // Always save email (allow duplicates)
    const subscriber = await Newsletter.create({ email });

    // ---------------- EMAIL TO ADMIN ----------------
    const adminEmail = process.env.EMAIL_USER;
    await sendEmail({
      to: adminEmail,
      subject: "New Newsletter Subscriber",
      html: `
        <div style="font-family: Arial, sans-serif; color:#1a1a1a;">
          <h2 style="color:#0d203a;">New Subscriber</h2>
          <p>Email: <strong>${email}</strong></p>
          <p>Subscribed on: ${subscriber.createdAt.toLocaleString()}</p>
        </div>
      `,
    });

    // ---------------- FETCH LATEST ITEMS ----------------
    const [dayTours, roundTours, events, taxis] = await Promise.all([
      DayTour.find().sort({ createdAt: -1 }).limit(3),
      RoundTour.find().sort({ createdAt: -1 }).limit(3),
      Event.find().sort({ date: -1 }).limit(3),
      QuickTaxi.find().sort({ createdAt: -1 }).limit(4),
    ]);

    // ---------------- HELPER TO RENDER ITEMS ----------------
    const renderItems = (items, type) => {
      if (!items.length) return `<p>No ${type} available at the moment.</p>`;
      return items
        .map(
          (item) => `
        <div style="border:1px solid #ddd; padding:10px; margin-bottom:10px; border-radius:8px;">
          <img src="${item.img}" alt="${
            item.title
          }" style="width:100%; max-width:300px; border-radius:5px;" />
          <h4 style="margin:5px 0; color:#0d203a;">${item.title}</h4>
          ${item.location ? `<p>Location: ${item.location}</p>` : ""}
          ${item.days ? `<p>Duration: ${item.days}</p>` : ""}
          ${
            item.seats
              ? `<p>Seats: ${item.seats}, AC: ${item.ac ? "Yes" : "No"}</p>`
              : ""
          }
          ${
            item.date
              ? `<p>Date: ${new Date(item.date).toLocaleDateString()}</p>`
              : ""
          }
          ${item.desc ? `<p>${item.desc}</p>` : ""}
        </div>
      `
        )
        .join("");
    };

    // ---------------- USER EMAIL WITH IMAGES ----------------
    const userHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <title>Net Lanka Travels Newsletter</title>
    </head>
    <body style="margin:0; padding:0; background:#f4f6f8; font-family:Arial, sans-serif;">
    
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center">
    
            <!-- MAIN CONTAINER -->
            <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; margin:20px 0; border-radius:10px; overflow:hidden;">
    
              <!-- HEADER -->
              <tr>
                <td style="background:#0d203a; padding:25px; text-align:center;">
                  <h1 style="color:#ffffff; margin:0;">Net Lanka Travels</h1>
                  <p style="color:#cfd8e3; margin:5px 0 0;">Explore Sri Lanka With Comfort & Trust</p>
                </td>
              </tr>
    
              <!-- INTRO -->
              <tr>
                <td style="padding:25px;">
                  <h2 style="color:#0d203a;">Welcome to Our Travel Community ✨</h2>
                  <p style="color:#555;">
                    Thank you for subscribing to <strong>Net Lanka Travels</strong>.
                    Here are our latest tours, events, and transport services curated just for you.
                  </p>
                </td>
              </tr>
    
              <!-- DAY TOURS -->
              <tr>
                <td style="padding:0 25px;">
                  <h3 style="color:#0d203a;">🌴 Day Tours</h3>
                  ${dayTours
                    .map(
                      (t) => `
                    <div style="border:1px solid #e5e7eb; border-radius:8px; margin-bottom:15px; overflow:hidden;">
                      <img src="${t.img}" alt="${t.title}" style="width:100%; height:200px; object-fit:cover;">
                      <div style="padding:15px;">
                        <h4 style="margin:0; color:#0d203a;">${t.title}</h4>
                        <p style="margin:5px 0; color:#666;">📍 ${t.location}</p>
                        <p style="margin:0; color:#555;">${t.desc}</p>
                      </div>
                    </div>
                  `
                    )
                    .join("")}
                </td>
              </tr>
    
              <!-- ROUND TOURS -->
              <tr>
                <td style="padding:0 25px;">
                  <h3 style="color:#0d203a;">🧭 Round Tours</h3>
                  ${roundTours
                    .map(
                      (t) => `
                    <div style="border:1px solid #e5e7eb; border-radius:8px; margin-bottom:15px; overflow:hidden;">
                      <img src="${t.img}" alt="${t.title}" style="width:100%; height:200px; object-fit:cover;">
                      <div style="padding:15px;">
                        <h4 style="margin:0; color:#0d203a;">${t.title}</h4>
                        <p style="margin:5px 0; color:#666;">📍 ${t.location}</p>
                        <p style="margin:5px 0; color:#666;">⏱ ${t.days}</p>
                        <p style="margin:0; color:#555;">${t.desc}</p>
                      </div>
                    </div>
                  `
                    )
                    .join("")}
                </td>
              </tr>
    
              <!-- EVENTS -->
              <tr>
                <td style="padding:0 25px;">
                  <h3 style="color:#0d203a;">🎉 Events</h3>
                  ${events
                    .map(
                      (e) => `
                    <div style="border:1px solid #e5e7eb; border-radius:8px; margin-bottom:15px; overflow:hidden;">
                      <img src="${e.img}" alt="${
                        e.title
                      }" style="width:100%; height:200px; object-fit:cover;">
                      <div style="padding:15px;">
                        <h4 style="margin:0; color:#0d203a;">${e.title}</h4>
                        <p style="margin:5px 0; color:#666;">📍 ${
                          e.location
                        }</p>
                        <p style="margin:5px 0; color:#666;">📅 ${new Date(
                          e.date
                        ).toLocaleDateString()}</p>
                        <p style="margin:0; color:#555;">${e.desc || ""}</p>
                      </div>
                    </div>
                  `
                    )
                    .join("")}
                </td>
              </tr>
    
              <!-- QUICK TAXI -->
              <tr>
                <td style="padding:0 25px;">
                  <h3 style="color:#0d203a;">🚖 Quick Taxi Services</h3>
                  ${taxis
                    .map(
                      (t) => `
                    <div style="border:1px solid #e5e7eb; border-radius:8px; margin-bottom:15px; overflow:hidden;">
                      <div style="padding:15px;">
                        <h4 style="margin:0; color:#0d203a;">${t.name}</h4>
                        <p style="margin:5px 0; color:#666;">
                          🪑 Seats: ${t.seats} |
                          ❄ AC: ${t.ac ? "Yes" : "No"} |
                          ⚙ ${t.transmission}
                        </p>
                        <p style="margin:0; color:#555;">
                          Comfortable, safe, and reliable transport for airport transfers,
                          city rides, and long-distance journeys.
                        </p>
                      </div>
                    </div>
                  `
                    )
                    .join("")}
                </td>
              </tr>
    
              <!-- CTA -->
              <tr>
                <td align="center" style="padding:30px;">
                  <a href="https://netlankatravels.com/"
                     style="background:#0d203a; color:#ffffff; padding:14px 30px;
                            text-decoration:none; border-radius:30px; font-weight:bold;">
                    Explore More Tours
                  </a>
                </td>
              </tr>
    
              <!-- FOOTER -->
              <tr>
                <td style="background:#f1f5f9; padding:20px; text-align:center; font-size:13px; color:#666;">
                  © ${new Date().getFullYear()} Net Lanka Travels • Sri Lanka <br/>
                  You are receiving this email because you subscribed to our newsletter.
                </td>
              </tr>
    
            </table>
          </td>
        </tr>
      </table>
    
    </body>
    </html>
    `;

    await sendEmail({
      to: email,
      subject: "Your Subscription to Net Lanka Travels",
      html: userHtml,
    });

    res.status(201).json({
      success: true,
      message: "Subscribed successfully. Check your email for latest updates!",
      subscriber,
    });
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
      error: error.message,
    });
  }
});

// ---------------- GET ALL SUBSCRIBERS (ADMIN) ----------------
router.get("/", async (req, res) => {
  try {
    const subscribers = await Newsletter.find().sort({ createdAt: -1 });
    res.json({ success: true, subscribers });
  } catch (error) {
    console.error("Get subscribers error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
