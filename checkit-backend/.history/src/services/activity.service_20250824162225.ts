import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createActivity = async (
  activityData: any,
  professorId: number,
  subjectId: number,
  timeData: any
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
        timeOpen: timeData.timeOpen,
        timeClose: timeData.timeClose,
      },
    });
    return { newActivity, ...timeData };
  }
};

export const updateActivity = async (
  activityData: any,
  timeData: any,
  activityId: number,
  subjectId: number
) => {
  if (timeData) {
    const updatedActivity = await prisma.activity.update({
      where: { id: activityId },
      data: {
        ...activityData,
      },
    });
    const subject = await prisma.subjectActivity.update({
      where: {
        subjectId_activityId: {
          activityId: activityId,
          subjectId: subjectId
        },
      },
      data: { ...timeData}
    });
    return { updatedActivity, ...timeData };
  }
  const updatedActivity = await prisma.activity.update({
    where: { id: activityId },
    data: {
      ...activityData,
    },
  });
  return updatedActivity;
};
