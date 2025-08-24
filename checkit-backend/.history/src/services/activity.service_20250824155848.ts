import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createActivity = async (
  activityData: any,
  professorId: number,
  subjectId: number
) => {
  if (!subjectId) {
    const newActivity = await prisma.activity.create({
      data: {
        ...activityData,
        professor: {
          connect: {
            id: professorId,
          },
        },
      },
    });
    return newActivity;
  } else {
    const newActivity = await prisma.activity.create({
      data: {
        ...activityData,
        professor: {
          connect: {
            id: professorId,
          },
        },
      },
    });
    const exists = await prisma.subjectActivity.findUnique({
      where: {
        subjectId_activityId: {
          subjectId,
          activityId: newActivity.id,
        },
      },
    });
    if (exists) {
      throw new Error("This activity is already assigned to the subject.");
    }
    await prisma.subjectActivity.create({
      data: {
        subjectId: subjectId,
        activityId: newActivity.id,
      },
    });
    return newActivity;
  }
};
