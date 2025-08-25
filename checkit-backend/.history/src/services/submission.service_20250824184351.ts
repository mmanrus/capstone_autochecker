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
  const results = runCheck50({ activity, submissionFilePath });
};
