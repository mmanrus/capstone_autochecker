import jwt, { JwtPayload } from "jsonwebtoken"
import { PrismaClient } from "@prisma/client"
import { Request, Response, NextFunction } from "express"
const prisma = new PrismaClient
const JWT_SECRET = process.env.JWT_SECRET as string

/**
 * @description
 * Middleware to check for a valid JWT in the request header.
 */
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
     const authHeader = req.headers["authorization"]
     const token = authHeader && authHeader.split(" ")[1]

     if (token === null || !token) {
          return res.status(401).json({
               error: "Authentication token required"
          })
     }

     jwt.verify(token, JWT_SECRET, (error: any, user: any) => {
          if (error) {
               console.error("Error verifying token",error)
               return res.status(403).json({
                    error: "Invalid or expired token"
               })
          }

          req.user = user
          next()
     }) as JwtPayload
}

/**
 * @description
 * Middleware to check for a specific role(s).
 * @param {string|string[]} requiredRole - A single role string or an array of role strings.
 */

export const authorizeRole = (requiredRoles: any) => (req: Request, res: Response, next: any) => {
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