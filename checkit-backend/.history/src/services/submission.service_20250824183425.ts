import { PrismaClient } from "@prisma/client";
import { run_check50 } from '@/helper/submission.helper'
const prisma = new PrismaClient();

export const submitActivity = async (
  activityId: number,
  subjectId: number,
  submissionData: any,
  userId: number
) => {


};
