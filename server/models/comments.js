const mongoose = require("mongoose");
const User = require("./users");

const commentSchema = mongoose.Schema(
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
    message: {
      type: String,
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
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

commentSchema.virtual("user", {
  ref: "User",
  localField: "email",
  foreignField: "email",
  justOne: true,
  options: {
    select: "-password",
  },
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
