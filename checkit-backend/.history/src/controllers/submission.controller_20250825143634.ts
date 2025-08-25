import * as submissionServices from "@/services/submission.service";
import { Request, Response } from "express";
import fs from "fs";
import { promisify } from "util";

const unlinkAsync = promisify(fs.unlink);

export const submit = async (req: Request, res: Response) => {
  const activityId = parseInt(req.params.activityId);
  const subjectId = parseInt(req.params.subjectId); // Corrected this line
  const userId = parseInt(req.user?.userId!);
  const file = req.file;
  const submissionFilePath = file?.path;

  if (!submissionFilePath) {
    console.error("Submission File: ", submissionFilePath);
    return res.status(400).json({
      error: "No Submission file found",
    });
  }

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

    // Delete the uploaded file if an error occurred
    try {
      if (submissionFilePath) {
        await unlinkAsync(submissionFilePath);
        console.log(`Deleted file: ${submissionFilePath}`);
      }
    } catch (unlinkError) {
      console.error(`Failed to delete file: ${submissionFilePath}`, unlinkError);
    }

    return res.status(500).json({
      error: "An Internal server error has occured",
    });
  }
};

export const resubmit = async (req: Request, res: Response) => {
  const submissionId = parseInt(req.params.submissionId);
  const activityId = parseInt(req.params.activityId);
  const subjectId = parseInt(req.params.subjectId);

  
  const file = req.file;
  const newFilePath = file?.path;

  if (!newFilePath) {
    return res.status(400).json({
      error: "No submission file found",
    });
  }

  // Submit Again
  try {

    // 1. Get the old submission (with fileData)
    const oldSubmission = await submissionServices.getSubmissionById(submissionId);

    // 2. Delete old file from disk
    if (oldSubmission?.fileName) {
      try {
        await unlinkAsync(oldSubmission.fileName);
        console.log(`Deleted old file: ${oldSubmission.fileName}`);
      } catch (unlinkError) {
        console.error(`Failed to delete old file: ${oldSubmission.fileName}`, unlinkError);
      }
    }

    const resubmit = await submissionServices.resubmit(
      subjectId,
      activityId,
      submissionId,
      newFilePath
    );
    res.status(200).json(resubmit);
  } catch (error) {
    console.error("Error Resubmission:", error);

    // Delete the uploaded file if an error occurred
    try {
      if (newFilePath) {
        await unlinkAsync(newFilePath);
        console.log(`Deleted file: ${newFilePath}`);
      }
    } catch (unlinkError) {
      console.error(`Failed to delete file: ${newFilePath}`, unlinkError);
    }

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
