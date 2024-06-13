import express from "express";
import { register, login, logout,getUser } from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/auth.js";

// Create a new express router instance
const router = express.Router();

// Route to handle user registration
// POST request to /register
// Calls the register function from userController.js
router.post("/register", register);

// Route to handle user login
// POST request to /login
// Calls the login function from userController.js
router.post("/login", login);

// Route to handle user logout
// GET request to /logout
// Middleware isAuthenticated ensures that the user is authenticated before calling the logout function from userController.js
router.get("/logout", isAuthenticated, logout);

// Export the router to be used in other parts of the application
router.get("/getuser", isAuthenticated, getUser);

export default router;
