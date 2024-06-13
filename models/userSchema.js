import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Define the user schema with validation
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your Name!"], // Name is required
    minLength: [3, "Name must contain at least 3 Characters!"], // Minimum length validation
    maxLength: [30, "Name cannot exceed 30 Characters!"], // Maximum length validation
  },
  email: {
    type: String,
    required: [true, "Please enter your Email!"], // Email is required
    validate: [validator.isEmail, "Please provide a valid Email!"], // Validate email format
  },
  phone: {
    type: Number,
    required: [true, "Please enter your Phone Number!"], // Phone number is required
  },
  password: {
    type: String,
    required: [true, "Please provide a Password!"], // Password is required
    minLength: [8, "Password must contain at least 8 characters!"], // Minimum length validation
    maxLength: [32, "Password cannot exceed 32 characters!"], // Maximum length validation
    select: false, // Do not select the password field by default
  },
  role: {
    type: String,
    required: [true, "Please select a role"], // Role is required
    enum: ["Job Seeker", "Employer"], // Role can only be 'Job Seeker' or 'Employer'
  },
  createdAt: {
    type: Date,
    default: Date.now, // Set default value for creation date
  },
});

// Encrypt the password before saving the user document
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next(); // If the password is not modified, skip encryption
  }
  this.password = await bcrypt.hash(this.password, 10); // Encrypt the password with bcrypt
});

// Compare the entered password with the hashed password in the database
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password); // Return the comparison result
};

// Generate a JWT token for the user
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES || '7d', // Set token expiration from environment variable or default to '7d'
  });
};

// Export the User model
export const User = mongoose.model("User", userSchema);
