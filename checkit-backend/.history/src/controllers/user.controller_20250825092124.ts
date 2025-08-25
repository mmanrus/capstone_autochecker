import * as userService from "../services/user.service";
import { Response, Request } from "express";

/**
 * @description
 * Creates a new user.
 */
export const createUser = async (req: Request, res: Response) => {
  const { email, password, fullname, username, role } = req.body;

  // The condition here has been corrected to use '||' between all variables.
  if (!email || !password || !fullname || !username || !role) {
    return res.status(400).json({
      error:
        "Missing required fields: email, password, fullname, username, and role",
    });
  }

  try {
    const newUser = await userService.createUser({
      email,
      password,
      fullname,
      username,
      role,
    });
    res.status(201).json(newUser);
  } catch (error: any) {
    // We've also updated this block to give a more specific error for unique constraints.
    if (error.code === "P2002") {
      const target = error.meta?.target;
      if (target.includes("email")) {
        return res
          .status(409)
          .json({ error: "A user with this email already exists." });
      }
      if (target.includes("username")) {
        return res
          .status(409)
          .json({ error: "A user with this username already exists." });
      }
      return res.status(409).json({
        error: "A unique field already exists.",
      });
    }
    console.error("Error creating user:", error); // It's a good practice to log the error.
    res.status(500).json({
      error: "An internal server error occurred.",
    });
  }
};

/**
 * Handles the token refresh request.
 * It expects the refresh token to be in a secure HttpOnly cookie.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
export const getNewAccessToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({
      error: "Unauthorized: No refresh token provided",
    });
  }
  try {
    const newAccessToken = await userService.refreshAccessToken(refreshToken);

    if (!newAccessToken) {
      // If the refresh token is invalid or expired, handle accordingly
      return res.status(401).json({
        error: "Unauthorized: Invalid or expired refresh token",
      });
    }
    res.status(200).json({
      newAccessToken,
    });
  } catch (error) {
    console.error("Error getting new Access token", error);
    return res.status(500).json({
      error: "Internal server error has occured",
    });
  }
};

/**
 * @description
 * Logs a user in and returns user details on success.
 */
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    const user = await userService.loginUser({email, password});
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }
    // Authentication successful, return the user details (without the password)
    res.status(200).json(user);
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ error: "An internal server error occurred." });
  }
};
