const { StatusCodes } = require("http-status-codes");

const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong try again later"
  };

  if (err.name === "SequelizeUniqueConstraintError") {
    customError.msg = err.errors[0].message;
    customError.msg =
      customError.msg.charAt(0).toUpperCase() + customError.msg.slice(1);

    if (customError.msg.slice(0, 5) === "Email") {
      customError.msg = "Email address must be unique";
    }

    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  if (err.name === "SequelizeValidationError") {
    customError.msg = err.errors[0].message;
    if (customError.msg.slice(-4) === "null") {
      customError.msg = customError.msg.replace(/\./g, " ");
      // console.log(customError.msg);
    }
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  return res.status(customError.statusCode).json({ msg: customError.msg });
};

module.exports = errorHandlerMiddleware;
