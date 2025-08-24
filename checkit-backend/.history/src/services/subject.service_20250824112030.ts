import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * @description
 * Creates a new Subject in the database.
 * @param {object} subjectData - The Subject's data (name, schedule, etc.).
 * @param {number} profesorId - The ID of the user who owns the Subject.
 * @returns {Promise<object>} The newly created Subject data.
 */
export const createSubject = async (
  subjectData: any,
  profesorId: number
) => {
  const newSubject = prisma.subject.create({
    data: {
      ...subjectData,
      professor: { connect: { id: profesorId } },
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

export const getAssignedSubjects = async (professorId: number) => {
     const subjects = prisma.subject.findMany({
          where: { professorId },
          select : {
               id: true,
               className: true,
               classCode: true,
               schedule: true,
          }
     })

     return subjects
}