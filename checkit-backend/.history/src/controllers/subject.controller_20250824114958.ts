import * as subjectService from "@/services/subject.service"
import { Request, Response} from "express"
/**
 * @description
 * Creates a new Subject
 */

export const createSubject = async (req: Request, res: Response) => {
     const professorId = req.user?.userId
     const { className, classCode, schedule, } = req.body

     if (!professorId) {
          return res.status(403).json({
               error: "Unauthorized: missing user ID" 
          })
     }
     try {
          const newSubject = await subjectService.createSubject({
               className,
               classCode,
               schedule,
          }, parseInt(professorId))
     } catch (error) {
          console.error("Error creating Subject", error)
     }

}  
