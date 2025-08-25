import { PrismaClient, SubmissionStatus } from "@prisma/client";
import { runCheck50 } from "@/helper/submission.helper";
const prisma = new PrismaClient();

import fs from "fs";
export const submitActivity = async (
  activityId: number,
  subjectId: number,
  submissionFilePath: string,
  userId: number
) => {
  const subjectActivity = await prisma.subjectActivity.findUnique({
    where: { subjectId_activityId: { subjectId, activityId } },
    select: {
      isClosed: true,
      activity: { select: { check50Slug: true } },
    },
  });

  if (!subjectActivity) {
    throw new Error("Activity not found");
  }

  if (subjectActivity.isClosed) {
    throw new Error("⏰ Time's up — you can’t submit your code anymore.");
  }

  if (!subjectActivity) {
    throw new Error("Activity not found");
  }
  if (subjectActivity.isClosed) {
    throw new Error("⏰ Time's up — you can’t submit your code anymore.");
  }

  const { grade, status, feedback } = await runCheck50(
    subjectActivity.activity.check50Slug,
    submissionFilePath
  );
  const fileBuffer = fs.readFileSync(submissionFilePath);
  if (status !== "pending") {
    const submissionResults = await prisma.submission.create({
      data: {
        status: status as SubmissionStatus,
        feedback: feedback,
        grade: grade,
        fileData: fileBuffer,
        fileName: submissionFilePath,

        isSubmitted: true,

        user: {
          connect: {
            id: userId,
          },
        },
        subjectActivity: {
          connect: {
            subjectId_activityId: {
              subjectId: subjectId,
              activityId: activityId,
            },
          },
        },
      },
    });

    return submissionResults;
  } else {
    throw new Error("Failed: ");
  }
};

export const resubmit = async (
  subjectId: number,
  activityId: number,
  submissionId: number,
  newFileName: string
) => {
  const check = await prisma.submission.findUnique({
    where: {
      id: submissionId,
    },
    select: {
      deletedAt: true,
    },
  });
  if (check?.deletedAt) {
    throw new Error("You already submittedt this.");
  }
  // Check subjectActivity validity
  const subjectActivity = await prisma.subjectActivity.findUnique({
    where: { subjectId_activityId: { subjectId, activityId } },
    select: {
      isClosed: true,
      activity: { select: { check50Slug: true } },
    },
  });

  if (!subjectActivity) {
    throw new Error("Activity not found");
  }

  if (subjectActivity.isClosed) {
    throw new Error("⏰ Time's up — you can’t submit your code anymore.");
  }

  if (!subjectActivity) {
    throw new Error("Activity not found");
  }

  const { grade, status, feedback } = await runCheck50(
    subjectActivity.activity.check50Slug,
    newFileName
  );
  const fileBuffer = fs.readFileSync(newFileName);
  return await prisma.submission.update({
    where: { id: submissionId },
    data: {
      status: status as SubmissionStatus,
      feedback,
      grade,
      fileData: fileBuffer,
      fileName: newFileName,
      isSubmitted: true,
      deletedAt: null,
      createdAt: new Date(),
    },
  });
};

export const getSubmissionById = async (submissionId: number) => {
  const submission = await prisma.submission.findUnique({
    where: {
      id: submissionId,
    },
    select: {
      id: true,
      grade: true,
      feedback: true,
      status: true,
      fileData: true,
      professorFeedback: true,
      createdAt: true,
    },
  });

  return submission
};
