const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const Contact = require("../models/Contact");
const adminAuth = require("../middleware/adminAuth");

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let folder = "contact/socialIcons";
    return {
      folder,
      resource_type: "image",
      allowed_formats: ["jpg", "jpeg", "png", "svg", "webp"],
    };
  },
});

const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// GET contact
router.get("/", async (req, res) => {
  try {
    let contact = await Contact.findOne();
    if (!contact) contact = await Contact.create({});
    res.json(contact);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE contact with icon upload
router.put("/", adminAuth, upload.array("socialIcons"), async (req, res) => {
  try {
    let contact = await Contact.findOne();
    if (!contact) contact = new Contact({});
    const data =
      typeof req.body.data === "string"
        ? JSON.parse(req.body.data)
        : req.body.data;
        if (data.socialMedia && Array.isArray(data.socialMedia)) {
          data.socialMedia = data.socialMedia.map((sm, idx) => {
            const file = req.files.find(f => f.originalname === sm.iconFileName);
            const existing = contact.socialMedia[idx] || {};
            return {
              platform: sm.platform,
              url: sm.url,
              icon: file ? file.path : existing.icon || "",
            };
          });
        }        
    Object.assign(contact, data);
    await contact.save();

    res.json({ success: true, contact });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
