import * as testSuiteServices from "@/services/testSuite.service";
import { Request, Response } from "express";

export const createTestSuite = async (req: Request, res: Response) => {
  const userId = parseInt(req.user?.userId!);
  const { title, type, filename, description, testCases } = req.body;

  if (!title || !filename || !testCases) {
    return res.status(400).json({
      error:
        "Missing required fields: Test Suite title or filename or testCases",
    });
  }
  try {
    const newTestSuite = await testSuiteServices.createTestSuite(
      { title, type, filename, description, testCases },
      userId
    );
    res.status(201).json({
      message: "Test suite Successfully Created",
      newTestSuite,
    });
  } catch (error: any) {
    if (error.code === "P2002") {
      const target = error.meta?.target;
      // This check is specific to the branch model's unique constraints.
      if (target.includes("title")) {
        return res.status(409).json({
          error: "A Test Suite with this title exists",
        });
      }
      if (target.includes("filename")) {
        return res.status(409).json({
          error: "A Test Suite with this title exists",
        });
      }
      return res.status(409).json({
        error: "A unique field already exists.",
      });
    }
    console.error("Error creating Test Suite:", error); // It's a good practice to log the error.
    res.status(500).json({
      error: "An internal server error occurred.",
    });
  }
};

export const updateTestSuite = async (req: Request, res: Response) => {
  const testId = parseInt(req.params.id);
  const testData = req.body;
  if (!testData.testCases) {
    return res.status(400).json({
      error: "Missing required fields: Test Suite need testCases upon",
    });
  }
  try {
    const updated = await testSuiteServices.updateTestSuite(testData, testId);
    if (updated === null) {
      return res.status(404).json({
        error: "Updated data not found",
      });
    }
    res.status(200).json({
      message: `Test Successfully Updated`,
      updated,
    });
  } catch (error) {
    console.error("Error updating Test Suite:", error); // It's a good practice to log the error.
    res.status(500).json({
      error: "An internal server error occurred.",
    });
  }
};

export const getAllTestSuites = async (req: Request, res: Response) => {
  try {
    const testSuites = await testSuiteServices.getAllTestSuite();

    res.status(200).json(testSuites);
  } catch (error) {
    console.error("Error getting all Test Suite:", error); // It's a good practice to log the error.
    res.status(500).json({
      error: "An internal server error occurred.",
    });
  }
};
