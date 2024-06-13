import { User } from "../models/userSchema.js";  // Importing the User model from the userSchema.js file
import { catchAsyncErrors } from "./catchAsyncError.js";  // Importing the catchAsyncErrors function to handle errors in async functions
import ErrorHandler from "./error.js";  // Importing a custom error handling class
import jwt from "jsonwebtoken";  // Importing the JSON Web Token library


// Exporting the isAuthenticated middleware function
export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  // Extract the token from the cookies in the request
  const { token } = req.cookies;

  // If no token is found, create a new ErrorHandler instance and pass it to the next middleware
  if (!token) {
    return next(new ErrorHandler("User Not Authorized", 400));
  }

  // Verify the token using the JWT_SECRET_KEY environment variable
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  // Find the user in the database using the ID from the decoded token and assign the user object to req.user
  req.user = await User.findById(decoded.id);

  // Proceed to the next middleware or route handler
  next();
});

/*
Explanation:
1. The middleware function `isAuthenticated` is designed to check if a user is authenticated.
2. It extracts the `token` from the request's cookies.
3. If no token is present, it creates a new `ErrorHandler` instance with the message "User Not Authorized" and a 401 status code, then passes it to the next middleware.
4. It verifies the token using the secret key stored in the environment variable `JWT_SECRET_KEY`. This returns the decoded payload of the token.
5. It finds a user in the database by the ID obtained from the decoded token and assigns the user object to `req.user`.
6. Calls the `next` function to pass control to the next middleware or route handler in the stack.
7. Any asynchronous errors are caught and passed to the next error handling middleware using the `catchAsyncErrors` utility.
*/
