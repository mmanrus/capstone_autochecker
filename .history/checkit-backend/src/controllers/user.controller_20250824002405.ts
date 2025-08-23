import * as userService from "../services/user.service";
import { Response, Request} from 'express'


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
