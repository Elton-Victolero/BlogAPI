// [SECTION] Dependencies and Modules
const express = require("express");
const userController = require("../controllers/user.js");
const { verify, verifyAdmin } = require("../auth.js");

const router = express.Router();

// [SECTION] user-registration
router.post("/register", userController.registerUser);

// [SECTION] user-authentication
router.post("/login", userController.loginUser);

//[Section] get-user-details
router.get("/details", verify, userController.getUserDetails);

//[SECTION] update-profile
router.patch('/profile', verify, userController.updateProfile);

module.exports = router;