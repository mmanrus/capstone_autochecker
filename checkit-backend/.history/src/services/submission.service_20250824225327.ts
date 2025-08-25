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
  const activity = await prisma.subjectActivity.findUnique({
    where: {
      subjectId_activityId: {
        subjectId,
        activityId,
      },
    },
    select: {
      activity: {
        select: {
          id: true,
          check50Slug: true,
          // you can also include instructions if you have a field for it
        },
      },

      isClosed: true,
    },
  });
  if (!activity) {
    throw new Error("Activity not found");
  }
  if (activity.isClosed) {
    throw new Error(
      "Time's up you can't submit your code. Try again better next time."
    );
  }

  const { grade, status, feedback } = await runCheck50(
    activity.activity.check50Slug,
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

export const unsubmit = async (submissionId: number) => {
  await prisma.submission.update({
    where: { id: submissionId },
    data: {
      deletedAt: new Date(),
    },
  });
};

export const resubmit = async (
  subjectId: number,
  activityId: number,
  submissionId: number,
  newFile: Buffer,
  newFileName: string
) => {
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
  if (subjectActivity.isClosed) {
    throw new Error("⏰ Time's up — you can’t submit your code anymore.");
  }

  const { grade, status, feedback } = await runCheck50(
     subjectActivity.activity.check50Slug,
    newFileName
  );
  return await prisma.submission.update({
    where: { id: submissionId },
    data: {
      status: status as SubmissionStatus,
      feedback,
      grade,
      fileData: newFile,
      fileName: newFileName,
      isSubmitted: true,
      deletedAt: null,
      createdAt: new Date(),
    },
  });
};
