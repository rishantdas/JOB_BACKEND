import mongoose from "mongoose";
import validator from "validator";

// Define the schema for an application
const applicationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your Name!"],  // Name is required
    minLength: [3, "Name must contain at least 3 Characters!"],  // Minimum length for name is 3 characters
    maxLength: [30, "Name cannot exceed 30 Characters!"],  // Maximum length for name is 30 characters
  },
  email: {
    type: String,
    required: [true, "Please enter your Email!"],  // Email is required
    validate: [validator.isEmail, "Please provide a valid Email!"],  // Validate that email is in proper format
  },
  coverLetter: {
    type: String,
    required: [true, "Please provide a cover letter!"],  // Cover letter is required
  },
  phone: {
    type: Number,
    required: [true, "Please enter your Phone Number!"],  // Phone number is required
  },
  address: {
    type: String,
    required: [true, "Please enter your Address!"],  // Address is required
  },
  resume: {
    public_id: {
      type: String, 
      required: true,  // Public ID of the resume is required
    },
    url: {
      type: String, 
      required: true,  // URL of the resume is required
    },
  },
  applicantID: {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,  // Reference to the user (applicant) is required
    },
    role: {
      type: String,
      enum: ["Job Seeker"],  // Role must be "Job Seeker"
      required: true,
    },
  },
  employerID: {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,  // Reference to the user (employer) is required
    },
    role: {
      type: String,
      enum: ["Employer"],  // Role must be "Employer"
      required: true,
    },
  },
});

// Create the Application model using the schema
export const Application = mongoose.model("Application", applicationSchema);
