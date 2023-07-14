const express = require("express");
const router = express.Router();
const shareController = require("../controllers/fileSharing");

//sharing a file- link generation
router.post("/pdfs/:fileName/generate-link", shareController.share_pdf_control);

//accessing shared pdf file- through share link
router.get("/pdfs/info/:token", shareController.fetch_pdf_control);

//view shared pdf file
router.get("/view/pdf/:token", shareController.view_pdf_control);

module.exports = router;
