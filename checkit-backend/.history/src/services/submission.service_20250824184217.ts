import { PrismaClient } from "@prisma/client";
import { runCheck50 } from "@/helper/submission.helper";
const prisma = new PrismaClient();

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
      timeOpen: true,
      timeClose: true,
      isClosed: true,
    },
  });
  const results = runCheck50({activity, submissionFilePath});
};
