// Define a custom error class that extends the built-in Error class
class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message); // Call the parent class constructor with the message
    this.statusCode = statusCode; // Add a statusCode property to the error object
  }
}

// Define an error-handling middleware function
export const errorMiddleware = (err, req, res, next) => {
  err.message = err.message || "Internal Server Error"; // Set a default error message if one is not provided
  err.statusCode = err.statusCode || 500; // Set a default status code if one is not provided

  // Handle specific error types
  if (err.name === "CastError") {
    // Handle CastError (typically occurs when a resource is not found)
    const message = `Resource not found. Invalid ${err.path}`;
    err = new ErrorHandler(message, 400); // Create a new ErrorHandler instance with a custom message and status code
  }

  if (err.code === 11000) {
    // Handle MongoDB duplicate key error
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
    err = new ErrorHandler(message, 400); // Create a new ErrorHandler instance with a custom message and status code
  }

  if (err.name === "JsonWebTokenError") {
    // Handle invalid JSON Web Token error
    const message = `Json Web Token is invalid, Try again!`;
    err = new ErrorHandler(message, 400); // Create a new ErrorHandler instance with a custom message and status code
  }

  if (err.name === "TokenExpiredError") {
    // Handle expired JSON Web Token error
    const message = `Json Web Token is expired, Try again!`;
    err = new ErrorHandler(message, 400); // Create a new ErrorHandler instance with a custom message and status code
  }

  // Send the error response
  return res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

// Export the ErrorHandler class as the default export
export default ErrorHandler;
