const User = require("../models/users");
const PDF = require("../models/pdf");
const Comment = require("../models/comments");
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

//uplaod pdf file
exports.upload_pdf_control = async (req, res, next) => {
  try {
    const file = req.file;
    const userId = req.body.userId;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    // Associate the uploaded file with the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const pdf = new PDF({
      fileName: file.filename,
      displayName: file.originalname,
      userId: new mongoose.Types.ObjectId(userId),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      accessTokens: uuidv4(),
    });

    await pdf.save();

    // Return the file ID to the client
    res.status(200).json({
      status: "ok",
      fileName: file.fileName,
      displayName: file.displayName,
      userId: file.userId,
      createdAt: file.createdAt,
      updatedAt: file.updatedAt,
      accessTokens: file.accessTokens,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//fetch all pdf file
exports.fetch_all_pdf_control = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    // Find the PDFs associated with the user
    const pdfs = await PDF.find({ userId });

    res.status(200).json({ pdfs });
  } catch (error) {
    console.error("Error fetching PDF files:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//search a pdf file
exports.search_pdf_control = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    console.log("userId", userId);
    const searchQuery = req.query.q; // Get the search query from the request query parameters

    const filteredPDFs = await PDF.find({
      userId: new mongoose.Types.ObjectId(userId),
      displayName: { $regex: searchQuery, $options: "i" }, // Use a regular expression to perform a case-insensitive search
    });

    res.status(200).json({ pdfs: filteredPDFs });
  } catch (error) {
    console.error("Error searching PDF files:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//fetch a single pdf file
exports.fetch_single_pdf_control = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const fileName = req.params.fileName;
    console.log(fileName);

    // Find the user by their ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find the PDF file in the user's documents
    const pdf = await PDF.findOne({ userId, fileName });
    if (!pdf) {
      return res.status(404).json({ error: "PDF file not found" });
    }

    // Get the file path
    const filePath = path.join(uploadDir, pdf.fileName);

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "PDF file not found" });
    }

    // Read the file and send it as a response
    const fileContent = fs.readFileSync(filePath);
    res.contentType("application/pdf");
    res.send(fileContent);
  } catch (error) {
    console.error("Error fetching PDF file:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//delete a pdf file
exports.delete_pdf_control = async (req, res, next) => {
  try {
    const fileName = req.params.fileName;
    const userId = req.body.userId;

    // Find the PDF by fileName and userId
    const pdf = await PDF.findOneAndRemove({ fileName, userId });

    if (!pdf) {
      return res.status(404).json({ error: "PDF not found" });
    }

    // Delete the file from the file system or storage
    const filePath = path.join(uploadDir, fileName);
    fs.unlinkSync(filePath);

    res.status(200).json({ message: "PDF file deleted successfully" });
  } catch (error) {
    console.error("Error deleting PDF file:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//comment on a pdf file
exports.comment_pdf_control = async (req, res, next) => {
  try {
    const { fileName } = req.params;
    const { email, message } = req.body;

    // Find the PDF by pdfId
    const pdf = await PDF.findOne({ fileName });

    if (!pdf) {
      return res.status(404).json({ error: "PDF not found" });
    }

    // Create a new comment
    const comment = new Comment({
      _id: new mongoose.Types.ObjectId(),
      email: email,
      pdf: pdf._id,
      message,
    });

    // Save the comment
    await comment.save();

    // Push the comment's id into the replies array of the PDF
    pdf.comments.push(comment._id);
    await pdf.save();

    res.status(200).json(comment);
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//viewing comments on a pdf file
exports.view_pdf_view = async (req, res, next) => {
  console.log("first");
  try {
    const { fileName } = req.params;

    // Find the PDF by fileName and populate the comments field
    const pdf = await PDF.findOne({ fileName }).populate("comments");

    if (!pdf) {
      return res.status(404).json({ error: "PDF not found" });
    }

    res.status(200).json({ comments: pdf.comments });
  } catch (error) {
    console.error("Error retrieving comments:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
