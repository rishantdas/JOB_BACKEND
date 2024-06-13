// Export a function called sendToken
export const sendToken = (user, statusCode, res, message) => {
    // Generate a JSON Web Token (JWT) using a method defined on the user object
    const token = user.getJWTToken();
  
    // Define options for the cookie
    const options = {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000 // Set cookie expiration time
      ),
      httpOnly: true, // Set httpOnly to true to prevent client-side JavaScript from accessing the cookie
      secure:true,
      sameSite:"None",
    };
  
    // Set the status code, create the cookie, and send the response
    res.status(statusCode)
      .cookie("token", token, options) // Set a cookie named "token" with the generated token and options
      .json({
        success: true, // Indicate the operation was successful
        user, // Include the user object in the response
        message, // Include a custom message in the response
        token, // Include the token in the response
      });
  };
  