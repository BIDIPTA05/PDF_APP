const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const PDF = require("../models/pdf");
const PDFToken = require("../models/pdfTokens");
const User = require("../models/users");

const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

//sharing a pdf file
exports.share_pdf_control = async (req, res, next) => {
  try {
    const pdf = await PDF.findOne({ fileName: req.params.fileName });

    if (!pdf) {
      return res.status(404).json({ error: "PDF not found" });
    }

    const { email } = req.body;

    const pdfToken = new PDFToken({
      _id: new mongoose.Types.ObjectId(),
      email,
      pdf: pdf._id,
      token: uuidv4(),
      expiresAt: Date.now() + 24 * 60 * 60 * 1000 * 7, // 7 days
    });

    await pdfToken.save();

    res.status(200).json({
      status: "ok",
      data: {
        ...pdfToken.toJSON(),
      },
    });
  } catch (error) {
    console.error("Error generating share link:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//accessing shared pdf file- share link
exports.fetch_pdf_control = async (req, res, next) => {
  try {
    const token = req.params.token;

    const pdfToken = await PDFToken.findOne({ token })
      .populate("associatedUser")
      .populate({
        path: "pdf",
        populate: {
          path: "userId",
          select: "-password",
        },
      });

    if (!pdfToken) {
      return res.status(404).json({ error: "Invalid share link" });
    }

    res
      .json({
        status: "ok",
        data: {
          ...pdfToken.toJSON(),
        },
      })
      .status(200);
  } catch (error) {
    console.error("Error accessing shared PDF:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//view shared pdf file
exports.view_pdf_control = async (req, res, next) => {
  console.log("token", req.params.token);
  const { pdf } = await PDFToken.findOne({
    token: req.params.token,
  }).populate("pdf");
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
};

//
