// types/express/index.d.ts
import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: string | JwtPayload; // <- customize if you know your payload type
      role?: string 
     }
  }
}