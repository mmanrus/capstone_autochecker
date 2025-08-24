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

/**
 * @description
 * Updates an existing subject by its ID.
 * @param {number} id - The subject's unique ID.
 * @param {object} subjectData - The updated subject data.
 * @returns {Promise<object>} The updated subject object.
 */
export const updateSubject = async (id: number, subjectData: any) => {
  const updatedSubject = prisma.subject.update({
    where: { id },
    data: { ...subjectData },
  });

  return updatedSubject;
};

/**
 * @description
 * Deletes a subject from the database by its ID.
 * @param {number} id - The subject's unique ID.
 * @returns {Promise<object>} The deleted subject object.
 */
export const deleteSubject = async (id: number) => {
  return await prisma.subject.delete({
    where: { id },
  });
};
