const User = require("../models/users");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();

//NEW USER CREATE
exports.create_user_control = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "Email already exists",
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err,
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              name: req.body.name,
              password: hash,
            });

            user
              .save()
              .then((result) => {
                console.log(result);
                res.status(201).json({
                  message: "User created successfully",
                });
              })
              .catch((err) => {
                console.log(err);
                res.status(500).json({
                  error: err,
                });
              });
          }
        });
      }
    });
};

//LOGIN USER
exports.login_user_control = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .exec()
    .then((user) => {
      console.log(user);
      if (user.length < 1) {
        return res.status(401).json({
          message: "Invalid Auth",
        });
      }
      bcrypt.compare(req.body.password, user.password, (err, result) => {
        console.log(err);
        if (err) {
          return res.status(401).json({
            error: err,
            message: "Invalid Auth",
          });
        }
        if (result) {
          //req.session.user_id = user._id;
          console.log(result);
          const token = jwt.sign(
            {
              email: user.email,
              userId: user._id,
            },
            process.env.JWT_KEY,
            { expiresIn: "1h" }
          );

          console.log(token);
          return res.status(200).json({
            message: "Successfully Logged in",
            token: token,
            userId: user._id,
          });
        }

        return res.status(401).json({
          message: "Invalid Auth",
        });
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({
        message: "unsuccessful attempt",
        error: err,
      });
    });
};

//USER DETAILS
exports.profile_user_control = (req, res, next) => {
  const id = req.body.id;
  User.findById(id)
    .select("name email _id")
    .exec()
    .then((user) => {
      if (user) {
        res.status(200).json({
          user: user,
        });
      } else {
        res.status(404).json({
          message: "No valid entry found for the provided ID",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: "Internal server error",
        error: err,
      });
    });
};

// exports.profile = async (req, res) => {
//   try {
//     console.log(req.body);
//     const user = await User.findById(req.body.id).populate("wishlist cart");
//     console.log(user);
//     res.status(200).json({
//       success: true,
//       message: "User details",
//       user,
//     });
//   } catch (err) {
//     res.status(400).json({
//       message: "Fetching user details failed",
//       error: err,
//     });
//   }
//};
