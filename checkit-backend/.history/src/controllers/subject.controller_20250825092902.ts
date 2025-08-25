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
      error: "Missing required fields: subject Name or Schedule",
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
/**
 * @description
 * Updates an existing subject by ID. 
 * Accepts `name`, `schedule`, and `code` in the request body.
 * Returns 200 with the updated subject or an error if constraints fail.
 *
 * @example
 * PUT /subjects/:id
 * Body: { name: "Math 102", schedule: "TTh 1-2PM", code: "M102" }
 */
export const updateSubject = async (req: Request, res: Response) => {
  const { name, schedule, code } = req.body;
  const id = req.params.id;

  try {
    const updatedSubject = await subjectServices.updateSubject(parseInt(id), {
      name,
      schedule,
      code,
    });

    res.status(200).json({
      message: "Successfully updated the Subject",
      updatedSubject,
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
/**
 * @description
 * Deletes a subject by ID.
 * Returns 204 (no content) if successful, or 404 if not found.
 *
 * @example
 * DELETE /subjects/:id
 */
export const deleteSubject = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await subjectServices.deleteSubject(parseInt(id));
    res.status(204).send();
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({
        error: "Subject not found.",
      });
    }
    console.error("Error deleting Subject", error);
    res.status(500).json({
      error: "An internal server error has occured",
    });
  }
};
/**
 * @description
 * Retrieves all subjects assigned to the logged-in professor.
 * Returns 200 with the list of subjects or 404 if none are found.
 *
 * @example
 * GET /subjects/assigned
 */
export const getAssignedSubjects = async (req: Request, res: Response) => {
  const id = req.user?.userId;
  try {
    const subjects = await subjectServices.getAssignedSubjects(parseInt(id!));
    if (!subjects) {
      return res.status(404).json({
        error: "No Subjects Assigned found Create first",
      });
    }
    res.status(200).json(subjects);
  } catch (error: any) {
    console.error("Error getting your assigend Subjects:", error);
    res.status(500).json({
      error: "An internal server error has occured.",
    });
  }
};
/**
 * @description
 * Retrieves all subjects the logged-in student is enrolled in.
 * Returns 200 with the list of subjects or 404 if none are found.
 *
 * @example
 * GET /subjects/enrolled
 */
export const getEnrolledSubjects = async (req: Request, res: Response) => {
  const id = req.user?.userId;
  try {
    const subjects = await subjectServices.getEnrolledSubjects(parseInt(id!));
    if (!subjects) {
      return res.status(404).json({
        error: "No Subjects enrolled found, get Enrolled",
      });
    }
    res.status(200).json(subjects);
  } catch (error: any) {
    console.error("Error getting your enrolled Subjects:", error);
    res.status(500).json({
      error: "An internal server error has occured.",
    });
  }
};
/**
 * @description
 * Retrieves a subject by its ID.
 * Returns 200 with the subject details or 500 if an error occurs.
 *
 * @example
 * GET /subjects/:id
 */
export const getSubjectById = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const subject = await subjectServices.getSubjectById(parseInt(id));
    res.status(200).json(subject);
  } catch (error: any) {
    console.error("Error getting Subject:", error);
    res.status(500).json({
      error: "An internal server error has occured.",
    });
  }
};
