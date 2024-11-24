require("express-async-errors");
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const cookieParser = require("cookie-parser");

const express = require("express");

// Import middleware
const notFoundMiddleware = require("../middleware/not-found");
const errorHandlerMiddleware = require("../middleware/error-handler");

// Import routes
const authRouter = require("../routes/auth");
const userRouter = require("../routes/user");
const taskRouter = require("../routes/task");

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
  // app.use(
  //   rateLimiter({
  //     WindowMs: 15 * 60 * 1000, // 15 minutes
  //     max: 100000 // limit each IP to 100000 request per window
  //   })
  // );

  //   CORS configuration
  app.use(
    cors({
      origin: "https://frontend.nighthawks0230.com",
      credentials: true
    })
  );

  app.use(function(req, res, next) {  
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});  

  // Test API
  app.get("/", (req, res) => {
    res.send("<h1>Hello World</h1>");
  });

  //   routes
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/user", userRouter);
  app.use("/api/v1/task", taskRouter);

  // Error handler middleware
  app.use(notFoundMiddleware);
  app.use(errorHandlerMiddleware);

  return app;
}

module.exports = createServer;
