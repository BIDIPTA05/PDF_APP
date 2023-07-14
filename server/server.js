const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const User = require("./models/users");
const app = express();
const jwt = require("jsonwebtoken");
require("dotenv").config();
const userRoutes = require("./routes/users");
const pdfRoutes = require("./routes/pdf");
const fileSharingRoutes = require("./routes/fileSharing");

const PDF = require("./models/pdf");

// Connect to MongoDB
const DB = "mongodb://localhost:27017/?readPreference=primary";

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const user = await User.findOne({ _id: decoded.userId });
    if (!user) {
      throw new Error();
    }
    req.user = user;
    next();
  } catch (error) {
    console.error("Error verifying JWT token:", error);
    res.status(401).json({ error: "Unauthorized" });
  }
};

(async () => {
  try {
    await mongoose.connect(DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("DB connection successful");

    //cors
    app.use(cors());

    // Middlewares

    app.use(morgan("dev"));
    app.use(express.json()); // Parse JSON bodies
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    //User Routes
    app.use("/users", userRoutes);
    //PDF Routes
    app.use("/pdfs", pdfRoutes);
    //File Sharing Routes
    app.use("/fileSharing", fileSharingRoutes);

    app.get("/pdf/:fileName/comments", async (req, res) => {
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
    });

    const port = 3000;
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (err) {
    console.error(err);
  }
})();
