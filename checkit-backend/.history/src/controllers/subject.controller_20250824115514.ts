import * as subjectService from "@/services/subject.service";
import { Request, Response } from "express";

/**
 * @description
 * Creates a new Subject
 */
export const createSubject = async (req: Request, res: Response) => {
  const professorId = req.user?.userId;
  const { className, classCode, schedule } = req.body;

  if (!professorId) {
    return res.status(403).json({
      error: "Unauthorized: missing user ID",
    });
  }
  try {
    const newSubject = await subjectService.createSubject(
      {
        className,
        classCode,
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
    console.error("Error creating Branch:", error); // It's a good practice to log the error.
    res.status(500).json({
      error: "An internal server error occurred.",
    });
  }
};
