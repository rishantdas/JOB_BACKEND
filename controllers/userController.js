import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import { User } from "../models/userSchema.js";
import ErrorHandler from "../middlewares/error.js";
import { sendToken } from "../utils/jwtToken.js";

// Register a new user
export const register = catchAsyncErrors(async (req, res, next) => {
  const { name, email, phone, password, role } = req.body;
  
  // Check if all required fields are provided
  if (!name || !email || !phone || !password || !role) {
    return next(new ErrorHandler("Please fill full form!")); // Pass error to error handler middleware
  }
  
  // Check if the email is already registered
  const isEmail = await User.findOne({ email });
  if (isEmail) {
    return next(new ErrorHandler("Email already registered!")); // Pass error to error handler middleware
  }
  
  // Create a new user with the provided data
  const user = await User.create({
    name,
    email,
    phone,
    password,
    role,
  });
  
  // Send a JWT token as a response
  sendToken(user, 201, res, "User Registered!"); // Status 201 for resource created
});

// Log in a user
export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password, role } = req.body;
  
  // Check if all required fields are provided
  if (!email || !password || !role) {
    return next(new ErrorHandler("Please provide email, password, and role.")); // Pass error to error handler middleware
  }
  
  // Find the user by email and include the password in the query
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid Email Or Password.", 400)); // Pass error to error handler middleware
  }
  
  // Compare the entered password with the stored hashed password
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email Or Password.", 400)); // Pass error to error handler middleware
  }
  
  // Check if the role matches
  if (user.role !== role) {
    return next(new ErrorHandler(`User with provided email and ${role} not found!`, 400)); // Pass error to error handler middleware
  }
  
  // Send a JWT token as a response
  sendToken(user, 200, res, "User Logged In!"); // Status 200 for successful request
});

// Log out a user
export const logout = catchAsyncErrors(async (req, res, next) => {
  res
    .status(201) // Status 201 for resource created/modified
    .cookie("token", "", {
      httpOnly: true, // Set httpOnly to true to prevent client-side JavaScript from accessing the cookie
    
      expires: new Date(Date.now()), // Set cookie expiration to now to effectively delete it
      secure:true,
      sameSite:"None",
    })
    .json({
      success: true, // Indicate the operation was successful
      message: "Logged Out Successfully.", // Custom message for the response
    });
});
export const getUser = catchAsyncErrors((req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});