import { PrismaClient } from "@prisma/client"


const prisma = new PrismaClient


const createSubject = async (subjectData : any, proffesorId: number) => {
     const newSubject = prisma.subject.create({
          data: {
               ...subjectData,
               proffesorId: proffesorId
          }
     })
}