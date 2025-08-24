import * as subjectServices from "@/services/subject.service";
import { Request, Response } from "express";

/**
 * @description
 * Creates a new subject for the logged-in professor. 
 * Expects `className`, `classCode`, and `schedule` in the request body.
 * Responds with a 201 status and the created subject on success.
 * Returns 403 if the user ID is missing or 500 on errors.
 *
 * @param {Request} req - Express request with `req.user?.userId` and subject data in `req.body`.
 * @param {Response} res - Express response used to send success or error messages.
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
      error: "Missing required fields: Subject name or Schedule",
    });
  }
  if (!professorId) {
    return res.status(403).json({
      error: "Unauthorized: missing user ID",
    });
  }
  try {
    const newSubject = await subjectServices.createSubject(
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
  const { name, schedule, code } = req.body;
  const id = req.params.id;

  try {
    const updatedSubject = await subjectServices.updateSubject(
     parseInt(id), {
      name,
      schedule,
      code,
    });

    res.status(200).json({
     message: "Successfully updated the Subject",
     updatedSubject
    })
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

export const deleteSubject = async (req: Request, res: Response) => {
     const { id } = req.params
     try {
          await subjectServices
     } catch (error) {
          
     }
}