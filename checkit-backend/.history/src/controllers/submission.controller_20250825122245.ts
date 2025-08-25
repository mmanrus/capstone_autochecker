import * as submissionServices from "@/services/submission.service";
import { Request, Response } from "express";

export const submit = async (req: Request, res: Response) => {
  const activityId = parseInt(req.params.activityId);
  const subjectId = parseInt(req.params.activityId);
  const userId = parseInt(req.user?.userId!);
  const file = req.file
  const submissionFilePath = file?.path; 
  if (!submissionFile) {
    console.error("Submission File: ", submissionFile)
    return res.status(400).json({
      error: "No Submission file found"
    })
  }
  try {
    const submittedResult = await submissionServices.submitActivity(
      activityId,
      subjectId,
      submissionFile,
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

export const resubmit = async (req: Request, res: Response) => {
  const submissionId = parseInt(req.params.submissionId);
  const activityId = parseInt(req.params.activityId);
  const subjectId = parseInt(req.params.subjectId);
  const { newFile } = req.body;
  try {
    const resubmit = await submissionServices.resubmit(
      subjectId,
      activityId,
      submissionId,
      newFile
    );
    res.status(200).json(resubmit);
  } catch (error) {
    console.error("Error Resubmission:", error);
    res.status(500).json({
      error: "An internal server error occurred.",
    });
  }
};

export const getSubmissionById = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const submission = await submissionServices.getSubmissionById(parseInt(id));
    if (!submission) {
      return res.status(404).json("Submission not found");
    }
    res.status(200).json(submission);
  } catch (error) {
    console.error("Error getting submission data:", error);
    res.status(500).json({
      error: "An internal server error occurred.",
    });
  }
};

export const getAllSubmissionBySubjectId = async (
  req: Request,
  res: Response
) => {
  const subjectId = req.params.id;
  const userId = parseInt(req.user?.userId!);
  try {
    const submissions = await submissionServices.getAllSubmissionBySubjectId(
      userId,
      parseInt(subjectId)
    );

    res.status(200).json(submissions);
  } catch (error) {
    console.error("Error getting subject submissions:", error);
    res.status(500).json({
      error: "An internal server error occurred.",
    });
  }
};

export const getAllUserSubmission = async (req: Request, res: Response) => {
  const userId = parseInt(req.user?.userId!);
  try {
    const submissions = await submissionServices.getAllStudentSubmissions(
      userId
    );

    res.status(200).json(submissions);
  } catch (error) {
    console.error("Error getting all submission:", error);
    res.status(500).json({
      error: "An internal server error occurred.",
    });
  }
};

export const getAllStudentSubjectSubmission = async (
  req: Request,
  res: Response
) => {
  const id = req.params.id;
  try {
    const studentSubmissions =
      await submissionServices.getAllStudentSubjectSubmission(parseInt(id));
    res.status(200).json(studentSubmissions);
  } catch (error) {
    console.error("Error getting all submission:", error);
    res.status(500).json({
      error: "An internal server error occurred.",
    });
  }
};
