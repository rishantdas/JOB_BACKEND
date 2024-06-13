import { catchAsyncErrors } from "../middlewares/catchAsyncError.js"; // Middleware to catch async errors
import ErrorHandler from "../middlewares/error.js"; // Custom error handler middleware
import { Application } from "../models/applicationSchema.js"; // Mongoose model for job applications
import { Job } from "../models/jobSchema.js"; // Mongoose model for jobs
import cloudinary from "cloudinary"; // Cloudinary library for file uploads

// Function to handle job application submission by job seekers
export const postApplication = catchAsyncErrors(async (req, res, next) => {
  const { role } = req.user;

  // Check if the user is an employer
  if (role === "Employer") {
    return next(
      new ErrorHandler("Employer not allowed to access this resource.", 400)
    );
  }

  // Check if resume file is uploaded
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Resume File Required!", 400));
  }

  const { resume } = req.files;
  const allowedFormats = ["image/png", "image/jpeg", "image/webp"];

  // Check if the uploaded file is of an allowed format
  if (!allowedFormats.includes(resume.mimetype)) {
    return next(
      new ErrorHandler("Invalid file type. Please upload a PNG file.", 400)
    );
  }

  // Upload resume to Cloudinary
  const cloudinaryResponse = await cloudinary.uploader.upload(
    resume.tempFilePath
  );

  // Handle Cloudinary upload errors
  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.error(
      "Cloudinary Error:",
      cloudinaryResponse.error || "Unknown Cloudinary error"
    );
    return next(new ErrorHandler("Failed to upload Resume to Cloudinary", 500));
  }

  // Extract necessary details from request body
  const { name, email, coverLetter, phone, address, jobId } = req.body;

  // Create applicant and employer ID objects
  const applicantID = {
    user: req.user._id,
    role: "Job Seeker",
  };

  // Check if jobId is provided
  if (!jobId) {
    return next(new ErrorHandler("Job not found!", 404));
  }

  // Fetch job details from database
  const jobDetails = await Job.findById(jobId);
  if (!jobDetails) {
    return next(new ErrorHandler("Job not found!", 404));
  }

  const employerID = {
    user: jobDetails.postedBy,
    role: "Employer",
  };

  // Validate all required fields
  if (
    !name ||
    !email ||
    !coverLetter ||
    !phone ||
    !address ||
    !applicantID ||
    !employerID ||
    !resume
  ) {
    return next(new ErrorHandler("Please fill all fields.", 400));
  }

  // Create a new application document in the database
  const application = await Application.create({
    name,
    email,
    coverLetter,
    phone,
    address,
    applicantID,
    employerID,
    resume: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
  });

  // Return success response
  res.status(200).json({
    success: true,
    message: "Application Submitted!",
    application,
  });
});

// Function for employers to get all applications for their posted jobs
export const employerGetAllApplications = catchAsyncErrors(
  async (req, res, next) => {
    const { role } = req.user;

    // Check if the user is a job seeker
    if (role === "Job Seeker") {
      return next(
        new ErrorHandler("Job Seeker not allowed to access this resource.", 400)
      );
    }

    // Fetch all applications where the employerID matches the current user's ID
    const { _id } = req.user;
    const applications = await Application.find({ "employerID.user": _id });

    // Return success response
    res.status(200).json({
      success: true,
      applications,
    });
  }
);

// Function for job seekers to get all their submitted applications
export const jobseekerGetAllApplications = catchAsyncErrors(
  async (req, res, next) => {
    const { role } = req.user;

    // Check if the user is an employer
    if (role === "Employer") {
      return next(
        new ErrorHandler("Employer not allowed to access this resource.", 400)
      );
    }

    // Fetch all applications where the applicantID matches the current user's ID
    const { _id } = req.user;
    const applications = await Application.find({ "applicantID.user": _id });

    // Return success response
    res.status(200).json({
      success: true,
      applications,
    });
  }
);

// Function for job seekers to delete one of their submitted applications
export const jobseekerDeleteApplication = catchAsyncErrors(
  async (req, res, next) => {
    const { role } = req.user;

    // Check if the user is an employer
    if (role === "Employer") {
      return next(
        new ErrorHandler("Employer not allowed to access this resource.", 400)
      );
    }

    // Fetch the application by ID
    const { id } = req.params;
    const application = await Application.findById(id);

    // Check if application exists
    if (!application) {
      return next(new ErrorHandler("Application not found!", 404));
    }

    // Delete the application document from the database
    await application.deleteOne();

    // Return success response
    res.status(200).json({
      success: true,
      message: "Application Deleted!",
    });
  }
);
