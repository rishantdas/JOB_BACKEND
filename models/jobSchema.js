import mongoose from "mongoose";

// Define the schema for a job
const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide a title."], // Title is required
    minLength: [3, "Title must contain at least 3 Characters!"], // Minimum length validation
    maxLength: [30, "Title cannot exceed 30 Characters!"], // Maximum length validation
  },
  description: {
    type: String,
    required: [true, "Please provide description."], // Description is required
    minLength: [30, "Description must contain at least 30 Characters!"], // Minimum length validation
    maxLength: [500, "Description cannot exceed 500 Characters!"], // Maximum length validation
  },
  category: {
    type: String,
    required: [true, "Please provide a category."], // Category is required
  },
  country: {
    type: String,
    required: [true, "Please provide a country name."], // Country is required
  },
  city: {
    type: String,
    required: [true, "Please provide a city name."], // City is required
  },
  location: {
    type: String,
    required: [true, "Please provide location."], // Location is required
    minLength: [20, "Location must contain at least 20 characters!"], // Minimum length validation
  },
  fixedSalary: {
    type: Number,
    minLength: [4, "Salary must contain at least 4 digits"], // Minimum length validation for fixed salary
    maxLength: [9, "Salary cannot exceed 9 digits"], // Maximum length validation for fixed salary
  },
  salaryFrom: {
    type: Number,
    minLength: [4, "Salary must contain at least 4 digits"], // Minimum length validation for salary from
    maxLength: [9, "Salary cannot exceed 9 digits"], // Maximum length validation for salary from
  },
  salaryTo: {
    type: Number,
    minLength: [4, "Salary must contain at least 4 digits"], // Minimum length validation for salary to
    maxLength: [9, "Salary cannot exceed 9 digits"], // Maximum length validation for salary to
  },
  expired: {
    type: Boolean,
    default: false, // Default value for expired is false
  },
  jobPostedOn: {
    type: Date,
    default: Date.now, // Default value for jobPostedOn is the current date and time
  },
  postedBy: {
    type: mongoose.Schema.ObjectId, // Reference to the User model
    ref: "User",
    required: true, // postedBy is required
  },
});

// Export the Job model based on the jobSchema
export const Job = mongoose.model("Job", jobSchema);
