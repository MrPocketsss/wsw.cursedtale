class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    this.errorMessage = message;

    Error.captureStackTrace(this, this.constructor);
  }
}

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.errorMessage,
    });

    // Programming or other unknown error
  } else {
    // 1.) Log error
    console.error('ERROR: ', err);

    // 2.) Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong',
    });
  }
};

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use anothe value!`;

  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;

  return new AppError(message, 400);
};

const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

export { catchAsync, AppError };
export default function errorHandler() {
  return (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    err.errorMessage = err.errorMessage || 'An error has occurred';

    if (process.env.NODE_ENV === 'development') {
      sendErrorDev(err, res);
    } else {
      // handle mongo errors
      let error = { ...err };
      if (error.name === 'CastError') error = handleCastErrorDB(error);
      if (error.code === 11000) error = handleDuplicateFieldsDB(error);
      if (error.name === 'ValidationError')
        error = handleValidationErrorDB(error);

      sendErrorProd(error, res);
    }
  };
}
