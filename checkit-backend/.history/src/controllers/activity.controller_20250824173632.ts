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
  const subjectId = parseInt(req.params.subjectId);
  const activityId = parseInt(req.params.activityId);

  try {
    const activity = await activityServices.getActivityById(
      subjectId,
      activityId
    );

    if (!activity) {
      return res
        .status(404)
        .json({ error: "Activity not found for this subject" });
    }

    return res.status(200).json(activity);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
export const getSubjectActivities = async (req: Request, res: Response) => {
  const subjectId = req.params.id;

  try {
    const activities = await activityServices.getSubjectActivities(
      parseInt(subjectId)
    );
    return res.status(200).json(activities);
  } catch (error: any) {
    console.error("Error finding Activities:", error); // It's a good practice to log the error.
    res.status(500).json({
      error: "An internal server error occurred.",
    });
  }
};

export const getStudentAllSubjectActivities = async (
  req: Request,
  res: Response
) => {
  const studentId = req.user?.id;

  try {
    const activities = await activityServices.getStudentAllSubjectActivities(
      parseInt(studentId!)
    );
    return res.status(200).json(activities);
  } catch (error) {
    console.error("Error finding all Activities:", error); // It's a good practice to log the error.
    res.status(500).json({
      error: "An internal server error occurred.",
    });
  }
};

export const getProfessorAllSubjectActivites = async (
  req: Request,
  res: Response
) => {
  const professorId = req.user?.id;

  try {
    const activities = await activityServices.getProfessorAllSubjectActivites(
      parseInt(professorId!)
    );
    return res.status(200).json(activities);
  } catch (error) {
    console.error("Error finding all Activities:", error); // It's a good practice to log the error.
    res.status(500).json({
      error: "An internal server error occurred.",
    });
  }
};
