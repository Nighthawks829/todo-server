require("express-async-errors");
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");
const cookieParser = require("cookie-parser");

const express = require("express");

// Import middleware
const notFoundMiddleware = require("../middleware/not-found");
const errorHandlerMiddleware = require("../middleware/error-handler");

function createServer() {
  const app = express();

  // Middleware setup
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  //   Secure middleware
  app.use(helmet());
  app.use(xss());

  //   Rate limiting middleware
  app.use(
    rateLimiter({
      WindowMs: 15 * 60 * 1000, // 15 minutes
      max: 100000 // limit each IP to 100000 request per window
    })
  );

  //   CORS configuration
  app.use(
    cors({
      origin: "http://192.168.0.110:3000",
      credentials: true
    })
  );

  // Test API
  app.get("/", (req, res) => {
    res.send("<h1>Hello World</h1>");
  });

  //   routes

  // Error handler middleware
  app.use(notFoundMiddleware);
  app.use(errorHandlerMiddleware);

  return app;
}

module.exports = createServer;
