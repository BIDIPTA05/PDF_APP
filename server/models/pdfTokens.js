const mongoose = require("mongoose");
const pdf = require("./pdf");
const User = require("./users");

const pdfTokenSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    email: {
      type: String,
      required: true,
    },
    pdf: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PDF",
      required: true,
    },
    token: { type: String, required: true },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    virtuals: {
      associatedUser: {
        options: {
          ref: "User",
          localField: "email",
          foreignField: "email",
          justOne: true,
          options: {
            select: "-password",
          },
        },
      },
    },
    toJSON: { virtuals: true },
  }
);

module.exports = mongoose.model("PDFToken", pdfTokenSchema);
