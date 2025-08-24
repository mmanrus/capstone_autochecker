import * as subjectService from "@/services/subject.service";
import { Request, Response } from "express";

/**
 * @description
 * Controller to create a new subject in the system.
 * 
 * This endpoint expects a logged-in professor (user) and extracts their user ID
 * from the request object. The subject details (className, classCode, schedule)
 * are taken from the request body.
 * 
 * The function calls the subject service to create a new subject associated with 
 * the professor. If successful, it responds with a 201 status code and a message
 * confirming creation, optionally returning the newly created subject object.
 * 
 * Error handling:
 * - Returns 403 if the user ID is missing (unauthorized access).
 * - Catches and logs any errors that occur during creation.
 *
 * @param {Request} req - Express request object, expecting `req.user?.userId` and `req.body` with subject data.
 * @param {Response} res - Express response object, used to send the result or error.
 * 
 * @example
 * POST /subjects
 * Body: { className: "Math 101", classCode: "M101", schedule: "MWF 9-10AM" }
 * Response: { message: "Subject successfully created", data: { id: 1, className: "Math 101", ... } }
 */
export const createSubject = async (req: Request, res: Response) => {
  const professorId = req.user?.userId;
  const { name, code, schedule } = req.body;
  if (!name && !schedule) {
     return res.status(400).json({
          error: "Missing required fields: Subject name or Schedule"
     })
  }
  if (!professorId) {
    return res.status(403).json({
      error: "Unauthorized: missing user ID",
    });
  }
  try {
    const newSubject = await subjectService.createSubject(
      {
          name,
        code,
        schedule,
      },
      parseInt(professorId)
    );
    res.status(201).json({
      message: "Subject successfully created",
      data: newSubject,
    });
  } catch (error: any) {
    if (error.code === "P2002") {
      const target = error.meta?.target;
      // This check is specific to the branch model's unique constraints.
      if (target.includes("name")) {
        return res.status(409).json({
          error: "A Subject with this name exists",
        });
      }
      return res.status(409).json({
        error: "A unique field already exists.",
      });
    }
    console.error("Error creating Subject:", error); // It's a good practice to log the error.
    res.status(500).json({
      error: "An internal server error occurred.",
    });
  }
};


export const updateSubject = async (req: Request, res: Response) => {
     const { subjectName, subjectSchedule, subjectCode} = req.body
     const id = req.params.id

     try {

     }
}