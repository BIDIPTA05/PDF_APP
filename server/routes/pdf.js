const express = require("express");
const router = express.Router();
const pdfController = require("../controllers/pdf");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

//Creating a directory to store uploaded files
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // Store all files in a common directory
  },
  filename: function (req, file, cb) {
    const uniqueId = uuidv4();

    const originalFileName = file.originalname; // Use the original filename
    const fileName = `${uniqueId}_${originalFileName}`;
    cb(null, fileName);
  },
});
const fileFilter = (req, file, cb) => {
  // Check if the uploaded file is a PDF
  if (file.mimetype === "application/pdf") {
    cb(null, true); // Accept the file
  } else {
    cb(new Error("Invalid file type. Only PDF files are allowed."), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

//upload a pdf
router.post(
  "/upload",
  upload.single("pdfFile"),
  pdfController.upload_pdf_control
);

//fetch all pdf file
router.get("/:userId", pdfController.fetch_all_pdf_control);

//search a pdf file
router.get("/search/:userId", pdfController.search_pdf_control);

//fetch a pdf file
router.get("/:userId/:fileName", pdfController.fetch_single_pdf_control);

//delete a pdf file
router.delete("/:fileName", pdfController.delete_pdf_control);

//comment on a pdf file
router.post("/:fileName/comments", pdfController.comment_pdf_control);

//accessing comments
router.get("/comm", pdfController.view_pdf_view);

module.exports = router;
