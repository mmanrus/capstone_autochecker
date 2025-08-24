import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createSubject = async (subjectData: any, proffesorId: number) => {
  const newSubject = prisma.subject.create({
    data: {
      ...subjectData,
      proffesorId: proffesorId,
    },
  });

  return newSubject;
};

export const updateSubject = async (id: number, subjectData: any) => {
  const updatedSubject = prisma.subject.update({
    where: { id },
    data: { ...subjectData },
  });

  return updatedSubject
};

