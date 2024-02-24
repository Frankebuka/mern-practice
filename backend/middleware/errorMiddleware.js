const errorHandler = (statusCode, message) => {
  const error = new Error();
  error.statusCode = statusCode;
  error.message = message;
  return error;
};

const notFound = (req, res, next) => {
  const error = errorHandler(404, `Not Found - ${req.originalUrl}`);
  next(error);
};

const errorHandlerMiddleware = (err, req, res, next) => {
  const statusCode = err.status || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
};

export { errorHandler, notFound, errorHandlerMiddleware };
