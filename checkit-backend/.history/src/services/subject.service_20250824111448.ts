import { PrismaClient, Prisma } from "@prisma/client";
import { Subject } from "@/types/subject/type"
const prisma = new PrismaClient();


/**
 * @description
 * Creates a new Branch in the database.
 * @param {object} subjectData - The Branch's data (name, address, etc.).
 * @param {number} ownerId - The ID of the user who owns the branch.
 * @returns {Promise<object>} The newly created Branch data.
 */
export const createSubject = async (subjectData: Omit<Prisma.SubjectCreateInput, "professor">, profesorId: number) => {
  const newSubject = prisma.subject.create({
    data: {
      ...subjectData,
      professor: { connect: { id: profesorId}},
    },
  });

  return newSubject;
};

/**
 * @description
 * Updates an existing Subject by its ID.
 * @param {number} id - The subject's unique ID.
 * @param {object} subjectData - The updated Subject data.
 * @returns {Promise<object>} The updated Subject object.
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
