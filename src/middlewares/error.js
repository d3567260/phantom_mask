const httpStatus = require('http-status');
const { ValidationError, DatabaseError } = require('sequelize');
const config = require('../config/config');
const logger = require('../config/logger');
const ApiError = require('../utils/ApiError');

const errorConverter = (err, req, res, next) => {
  let error = err;
  if (!(error instanceof ApiError)) {
    if (error instanceof ValidationError) {
      const statusCode = httpStatus.BAD_REQUEST;
      const { message } = error;
      error = new ApiError(statusCode, message, false, err.stack);
    } else if (error instanceof DatabaseError) {
      const statusCode = httpStatus.INTERNAL_SERVER_ERROR;
      const message = 'Database error occurred.';
      error = new ApiError(statusCode, message, false, err.stack);
    } else {
      const statusCode = error.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
      const message = error.message || httpStatus[statusCode];
      error = new ApiError(statusCode, message, false, err.stack);
    }
  }
  next(error);
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err;
  if (config.env === 'production' && !err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
  }

  res.locals.errorMessage = err.message;

  const response = {
    code: statusCode,
    message,
    ...(config.env === 'development' && { stack: err.stack })
  };

  if (config.env === 'development') {
    logger.error(err);
  }

  res.status(statusCode).send(response);
};

module.exports = {
  errorConverter,
  errorHandler
};
