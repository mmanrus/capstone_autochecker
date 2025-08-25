import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET as string;

/**
 * @description
 * Middleware to check for a valid JWT in the request header.
 */
export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      error: "Authentication token required",
    });
  }

  jwt.verify(token, JWT_SECRET, (error: any, user: any) => {
    if (error) {
      console.error("Error verifying token", error);
      return res.status(403).json({
        error: "Invalid or expired token",
      });
    }
    req.user = user;
    next();
  });
};

/**
 * @description
 * Middleware to check for a specific role(s).
 * @param {string|string[]} requiredRole - A single role string or an array of role strings.
 */
export const authorizeRole =
  (requiredRoles: any) => (req: Request, res: Response, next: any) => {
    const userRole = req.user?.role;

    // Check if requiredRoles is a string or an array
    const rolesArray = Array.isArray(requiredRoles)
      ? requiredRoles
      : [requiredRoles];

    // If the user's role is not included in the required roles array, deny access.
    if (!rolesArray.includes(userRole)) {
      return res.status(403).json({
        error: "You do not have the necessary permissions.",
      });
    }

    next();
  };

/**
 * @description
 * Middleware to check if the authenticated user is the owner of a specific resource.
 * It fetches the resource from the database and compares its ownerId with the
 * authenticated user's ID from the JWT payload.
 *
 * @param {string} modelName - The name of the Prisma model ('branch' or 'store').
 * @param {string} paramId - The name of the request parameter containing the resource ID ('id').
 */
export const authorizeUser = <
  T extends keyof PrismaClient // model name type
>(
  modelName: T,
  paramName: string
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.userId;
    const resourceId = parseInt(req.params[paramName]);

    if (!userId || isNaN(resourceId)) {
      return res.status(400).json({
        error: "Invalid request parameters or missing user information.",
      });
    }

    try {
      // Assert the delegate type explicitly
      const model = prisma[modelName] as any;

      const resource = await model.findUnique({
        where: { id: resourceId },
        select: { ownerId: true },
      });

      if (!resource) {
        return res.status(404).json({ error: `${String(modelName)} not found` });
      }

      if (resource.ownerId !== userId) {
        return res.status(403).json({
          error: "You do not have permission to access this resource",
        });
      }

      next();
    } catch (error) {
      console.error(`Error in authorizeUser for ${String(modelName)}:`, error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
};
