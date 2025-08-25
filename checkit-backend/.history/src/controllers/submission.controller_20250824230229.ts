import * as submissionServices from "@/services/submission.service";
import { Request, Response } from "express";

export const submit = async (req: Request, res: Response) => {
  const activityId = parseInt(req.params.activityId);
  const subjectId = parseInt(req.params.activityId);
  const userId = parseInt(req.user?.userId!);
  const { submissionFilePath } = req.body;

  try {
    const submittedResult = await submissionServices.submitActivity(
      activityId,
      subjectId,
      submissionFilePath,
      userId
    );
    res.status(200).json({
      submittedResult,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "An Internal server error has occured",
    });
  }
};

export const unsubmit = async (req: Request, res: Response) => {
  const submissionId = parseInt(req.params.id);
  try {
    await submissionServices.unsubmit(submissionId);
    res.status(200).send(); // 204 No Content for successful deletion
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({
        error: "Category not found.",
      });
    }
    console.error("Error Unsubmit:", error);
    res.status(500).json({
      error: "An internal server error occurred.",
    });
  }
};

export const resubmit = async (req: Request, res: Response) => {
  const submissionId = req.params.submissionId;
  const activityId = req.params.activityId;
  const subjectId = req.params.subjectId;
  const { newFile } = req.body;
  try {
  } catch (error) {
    console.error("Error Resubmission:", error);
    res.status(500).json({
      error: "An internal server error occurred.",
    });
  }
};
