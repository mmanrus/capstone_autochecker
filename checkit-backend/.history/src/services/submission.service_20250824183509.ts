import { PrismaClient } from "@prisma/client";
import { run_check50 } from "@/helper/submission.helper";
const prisma = new PrismaClient();

export const submitActivity = async (
  activityId: number,
  subjectId: number,
  submissionData: any,
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
          title: true,
          check50Slug: true,
          createdAt: true,
          // you can also include instructions if you have a field for it
        },
      },
      timeOpen: true,
      timeClose: true,
      isClosed: true,
    },
  });
};
