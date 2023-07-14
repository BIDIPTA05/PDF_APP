const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");

//CREATE AN USER
router.post("/signup", userController.create_user_control);

//LOGIN A USER
router.post("/login", userController.login_user_control);

router.post("/profile", userController.profile_user_control);

module.exports = router;
