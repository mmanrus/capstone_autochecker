import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET as string;
const REFRESH_SECRET = process.env.REFRESH_SECRET as string;
/**
 * @description
 * Creates a new user in the database.
 * @param {object} userData - The user's data.
 * @returns {Promise<object>} The newly created user object without the password
 */

export const createUser = async (userData: any) => {
  const hashedPassword = await bcrypt.hash(userData.password, 10);

  const user = await prisma.user.create({
    data: {
      ...userData,
      password: hashedPassword,
    },
  });

  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

/**
 * @description
 * Authenticates a user by email and password and returns a JWT on success.
 * @param {string} email - The user's email.
 * @param {string} password - The plain-text password.
 * @returns {Promise<object|null>} An object with the user and the JWT if successful, or null if authentication fails.
 */

export const loginUser = async (data: any) => {
  const email = data.email;
  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (!user || !(await bcrypt.compare(data.password, user.password))) {
    return null;
  }
  const token = jwt.sign(
    {
      userId: user.id,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: "15m" }
  );

  const refresh_token = jwt.sign(
    {
      userId: user.id,
    },
    REFRESH_SECRET,
    { expiresIn: "7d" }
  );
  const { password, ...userWithoutPassword } = user;
  return { userWithoutPassword, token, refresh_token };
};

/**
 * @description
 * Verifies a JWT and returns the decoded payload.
 * @param {string} token - The JWT to verify.
 * @returns {object|null} The decoded token payload or null if verification fails.
 */
export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
};

/**
 * Refreshes an access token using a valid refresh token.
 * This function should be called when the access token expires.
 * @param {string} refreshToken - The refresh token from a secure cookie.
 * @returns {Promise<string|null>} A new access token, or null if the refresh token is invalid.
 */

export const refreshAccessToken = async (refreshToken: string) => {
  const decoded = jwt.verify(refreshToken, REFRESH_SECRET) as JwtPayload;
  const userId = decoded.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!user) {
    return null;
  }
  const newAccessToken = jwt.sign(
    {
      userId: user.userId,
    },
    JWT_SECRET,
    { expiresIn: "15m" }
  );
  return newAccessToken;
};
