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
  subjectId?: number
) => {
  // Update the activity
  const updatedActivity = await prisma.activity.update({
    where: { id: activityId },
    data: { ...activityData },
  });

  // If timeData and subjectId are provided, update the join table
  if (timeData && subjectId) {
    await prisma.subjectActivity.update({
      where: {
        subjectId_activityId: {
          activityId,
          subjectId,
        },
      },
      data: { ...timeData },
    });
  }

  // Return updated activity and timeData if applicable
  return subjectId && timeData
    ? { updatedActivity, ...timeData }
    : updatedActivity;
};

export const deleteActivity = async (id: number) => {
  return await prisma.subject.delete({
    where: { id },
  });
};

export const getSubjectsActivities = async (subjectId: number) => {
  const activities = await prisma.subjectActivity.findMany({
    where: {
      subjectId,
    },
    select: {
      activity: {
        select: { id: true, title: true },
      },
      isClosed: true,
      timeOpen: true,
      timeClose: true,
    },
  });

  return activities;
};
