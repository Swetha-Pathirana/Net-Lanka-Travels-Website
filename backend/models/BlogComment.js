const mongoose = require("mongoose");

const BlogCommentSchema = new mongoose.Schema({
  blogId: { type: mongoose.Schema.Types.ObjectId, ref: "Blog", required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  rating: { type: Number, default: 0 },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.BlogComment || mongoose.model("BlogComment", BlogCommentSchema);
