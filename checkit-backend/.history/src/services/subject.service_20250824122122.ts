import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * @description
 * Creates a new Subject in the database.
 * @param {object} subjectData - The Subject's data (name, schedule, etc.).
 * @param {number} profesorId - The ID of the user who owns the Subject.
 * @returns {Promise<object>} The newly created Subject data.
 */
export const createSubject = async (subjectData: any, profesorId: number) => {
  const newSubject = await prisma.subject.create({
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
  const updatedSubject = await prisma.subject.update({
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

/**
 * @description
 * Fetch all subjects assigned to a specific professor.
 *
 * @param {number} professorId - The ID of the professor whose subjects we want to retrieve.
 * @returns {Promise<Array>} An array of subjects, each containing only the id, className, classCode, and schedule.
 *
 * @example
 * const subjects = await getAssignedSubjects(5);
 * console.log(subjects);
 */
export const getAssignedSubjects = async (professorId: number) => {
  const subjects = prisma.subject.findMany({
    where: { professorId },
    select: {
      id: true,
      name: true,
      code: true,
      schedule: true,
    },
  });

  return subjects;
};
/**
 * @description
 * Get all subjects that a specific student is enrolled in.
 *
 * @param {number} studentId - The ID of the student.
 * @returns {Promise<Array>} Array of subjects the student is enrolled in.
 */
export const getEnrolledSubjects = async (studentId: number) => {
  const subjects = await prisma.subject.findMany({
    where: {
      students: {
        some: {
          id: studentId,
        },
      },
    },
    select: {
      id: true,
      className: true,
      classCode: true,
      schedule: true,
      professor: {
        select: {
          id: true,
          fullName: true,
        },
      },
    },
  });
  return subjects;
};

/**
 * @description
 * Retrieve a single subject by its ID, including basic information about the subject
 * and the professor assigned to it.
 *
 * @param {number} id - The ID of the subject to retrieve.
 * @returns {Promise<object | null>} An object containing the subject's id, className, classCode,
 * schedule, and professor details (id and fullName), or null if the subject is not found.
 *
 * @example
 * const subject = await getSubjectById(1);
 * console.log(subject);
 */
export const getSubjectById = async (id: number) => {
  const subject = await prisma.subject.findUnique({
    where: { id },
    select: {
      id: true,
      className: true,
      classCode: true,
      schedule: true,
      professor: {
        select: {
          id: true,
          fullName: true,
        },
      },
    },
  });
  return subject;
};
