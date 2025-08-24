import * as activityServices from "@/services/activity.service";
import { Request, Response } from "express";

export const createActivity = async (req: Request, res: Response) => {
  const professorId = req.user?.userId;
  const { title, check50Slug, timeOpen, timeClose, subjectId } = req.body;
  if (!title) {
    return res.status(400).json({
      error: "Missing required fields: Activity title",
    });
  }
  if (!professorId) {
    return res.status(403).json({
      error: "Unauthorized: missing user ID",
    });
  }
  try {
    const newActivity = await activityServices.createActivity(
      {
        title,
        check50Slug,
      },
      parseInt(professorId),
      subjectId,
      { timeOpen, timeClose }
    );
    res.status(201).json({
      message: "Activity successfully created",
      data: newActivity,
    });
  } catch (error: any) {
    if (error.code === "P2002") {
      const target = error.meta?.target;
      // This check is specific to the branch model's unique constraints.
      if (target.includes("title")) {
        return res.status(409).json({
          error: "An Activity with this title exists",
        });
      }
      return res.status(409).json({
        error: "A unique field already exists.",
      });
    }
    console.error("Error creating Activity:", error); // It's a good practice to log the error.
    res.status(500).json({
      error: "An internal server error occurred.",
    });
  }
};

export const updateActivity = async (req: Request, res: Response) => {
  const { title, check50Slug, timeOpen, timeClose, subjectId } = req.body;
  const activityId = req.params.id;

  try {
    const updaActivity = await activityServices.updateActivity(
      {
        title,
        check50Slug,
      },

      parseInt(activityId),
      { timeOpen, timeClose },
      subjectId
    );

    res.status(200).json({
      message: "Successfully updated the Subject",
      updaActivity,
    });
  } catch (error: any) {
    if (error.code === "P2002") {
      const target = error.meta?.target;
      // This check is specific to the branch model's unique constraints.
      if (target.includes("title")) {
        return res.status(409).json({
          error: "An Activity with this title exists",
        });
      }
      return res.status(409).json({
        error: "A unique field already exists.",
      });
    }
    console.error("Error updating Activity:", error); // It's a good practice to log the error.
    res.status(500).json({
      error: "An internal server error occurred.",
    });
  }
};

export const getActivityById = async (req: Request, res: Response) => {
     
}

export const getSubjectActivities = async (req: Request, res: Response) => {
     const subjectId = req.params.id

     try {
          
     } catch (error: any) {
          console.error("Error finding Activity:", error); // It's a good practice to log the error.
          res.status(500).json({
            error: "An internal server error occurred.",
          });
     }
}