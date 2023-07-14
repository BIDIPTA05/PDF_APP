const mongoose = require("mongoose");

const PDFSchema = mongoose.Schema({
  fileName: String,
  displayName: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  accessTokens: [{ type: String, ref: "PDFToken" }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
});

module.exports = mongoose.model("PDF", PDFSchema);
