const express = require("express");
const router = express.Router();
const rateLimiter = require("express-rate-limit");
const { login, logout } = require("../controllers/auth");

require("dotenv").config();

// 1000 request in development. 100 requests for production environment
const apiLimiter = rateLimiter({
  windowMs: process.env.RATE_WINDOWMS,
  max: process.env.RATE_MAX,
  message: {
    msg: "Too many request from this IP. Please try again after 15 minutes"
  }
});

router.post("/login", apiLimiter, login);
router.post("/logout", apiLimiter, logout);

module.exports = router;
