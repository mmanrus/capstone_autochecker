import { PrismaClient } from '@prisma/client'
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient()

/**
 * @description
 * Creates a new user in the database.
 * @param {object} userData - The user's data.
 * @returns {Promise<object>} The newly created user object without the password
 */

export const createUser = async (userData: any) => {
     const hashedPassword = await bcrypt.hash(userData.password, 10)

     const user = await prisma.user.create({
          data: {
               ...userData,
               password: hashedPassword
          }
     })
}