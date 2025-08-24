import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createActivity = async (
  activityData: any,
  professorId: number
) => {
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
};
