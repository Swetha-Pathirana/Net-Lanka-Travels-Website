const express = require("express");
const Team = require("../models/Team");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
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
    let folder = "team";
    if (file.fieldname === "teamImage") folder += "/teamImage";
    else folder += "/members";
    return {
      folder,
      resource_type: file.mimetype.startsWith("video") ? "video" : "image",
      allowed_formats: ["jpg", "jpeg", "png", "mp4", "mov", "webm", "webp"],
    };
  },
});

const upload = multer({ storage, limits: { fileSize: 100 * 1024 * 1024 } });

// GET team (single doc)
router.get("/", async (req, res) => {
  try {
    const team = await Team.findOne();
    res.json(team || {});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// CREATE / UPDATE team
router.post("/", adminAuth, upload.any(), async (req, res) => {
  try {
    if (!req.body.data) throw new Error("No data provided");

    let data =
      typeof req.body.data === "string"
        ? JSON.parse(req.body.data)
        : req.body.data;

    let team = await Team.findOne();

    if (data.members && Array.isArray(data.members)) {
      const memberFiles = req.files.filter((f) =>
        f.fieldname.startsWith("members")
      );
      data.members = data.members.map((member, idx) => {
        const file = memberFiles.find(
          (f) => f.fieldname === `members[${idx}][image]`
        );
        const existingMember = team?.members[idx] || {};
        return {
          name: member.name,
          role: member.role,
          description: member.description || "",
          image: file ? file.path : member.image || existingMember.image || "",
        };
      });
    }

    // Handle main team image
    const teamImageFile = req.files.find((f) => f.fieldname === "teamImage");
    if (teamImageFile) data.teamImage = teamImageFile.path;
    else if (team && !data.teamImage) data.teamImage = team.teamImage;

    if (!team) {
      team = await Team.create(data);
    } else {
      Object.assign(team, data);
      await team.save();
    }

    res.json(team);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE a member by index
router.delete("/member/:index", adminAuth, async (req, res) => {
  try {
    const idx = parseInt(req.params.index, 10);
    if (isNaN(idx)) throw new Error("Invalid index");

    const team = await Team.findOne();
    if (!team) return res.status(404).json({ message: "Team not found" });

    if (team.members[idx]) team.members.splice(idx, 1);
    await team.save();
    res.json(team);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
