const express = require("express");
const router = express.Router();
const rateLimiter = require("express-rate-limit");
const {
  getUser,
  updateUser,
  deleteUser
} = require("../controllers/user");

require("dotenv").config();

const authenticateUser = require("../middleware/authenticationUser");

// 1000 request in development. 100 requests for production environment
const apiLimiter = rateLimiter({
  windowMs: process.env.RATE_WINDOWMS,
  max: process.env.RATE_MAX,
  message: {
    msg: "Too many request from this IP. Please try again after 15 minutes"
  }
});

router
  .route("/:id")
  .get(authenticateUser, getUser)
  .patch(authenticateUser, updateUser)
  .delete(authenticateUser, deleteUser);

module.exports = router;
