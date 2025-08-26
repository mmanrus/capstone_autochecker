import { PrismaClient } from "@prisma/client";
import { createCheck50 } from "@/helper/testSuite.helper";
import { TestSuiteType, TestCasesType } from "@/types/";
const prisma = new PrismaClient();

export const createTestSuite = async (
  testData: TestSuiteType,
  userId: number
) => {
  const check50Slug = await createCheck50(testData, "create");

  const newTestSuite = await prisma.testSuite.create({
    data: {
      title: testData.title,
      filename: testData.filename,
      description: testData.description,
      check50Slug: check50Slug,
      userId: userId,
      testCases: {
        createMany: {
          data: testData.testCases.map((testCase, index) => ({
            input: testCase.input,
            output: testCase.output,
            helper: testCase.helper,
            description: testCase.description,
            order: index,
            // No need to set testSuiteId here, Prisma handles it
          })),
        },
      },
    },
    include: {
      testCases: true,
    },
  });

  return newTestSuite;
};

export const updateTestSuite = async (
  testData: TestSuiteType,
  testId: number
) => {
  const test = await prisma.testSuite.findFirst({
    where: { id: testId },
    select: {
      title: true,
      filename: true,
    },
  });
  if (!test) {
    throw new Error("Test suite not found.");
  }

  const { title, filename } = test;
  const { testCases } = testData;
  await createCheck50({ title, filename, testCases }, "update");

  const updatedTestSuite = await prisma.$transaction(async (tx) => {
    await tx.testSuite.update({
      where: { id: testId },
      data: {
        description: testData.description,
      },
    });

    await tx.testCases.deleteMany({
      where: { testSuiteId: testId },
    });

    const createPromises = testCases.map(
      (testCase: TestCasesType, index: number) =>
        tx.testCases.create({
          data: {
            testSuiteId: testId,
            input: testCase.input,
            output: testCase.output,
            helper: testCase.helper,
            description: testCase.description,
            order: index,
          },
        })
    );
    await Promise.all(createPromises)
  });

  return updatedTestSuite;
};

export const getAllTestSuite = async () => {
  const testSuites = await prisma.testSuite.findMany({
      take: 10,
      select: {
        title: true,
        filename: true,
        type: true,
        check50Slug: true
      }
  })
  return testSuites
}