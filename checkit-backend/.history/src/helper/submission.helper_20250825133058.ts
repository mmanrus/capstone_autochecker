// Add this import at the top of your file
const util = require("util");
// Promisify 'exec' to allow for modern async/await syntax
const exec = util.promisify(require("child_process").exec);
import fs from "fs";
/**
 * @description
 * Runs check50 on a given activity slug and file path, then parses the JSON output.
 * @param {object} activity - The activity object containing the check50 slug.
 * @param {string} filePath - The path to the file to be checked.
 * @returns {Promise<object>} A promise that resolves to an object with the test results.
 */

export const runCheck50 = async (activity: any, filePath: string) => {
  // 1. Input validation check
  if (!activity) {
    console.log({ activity });
    throw new Error("No Slug Detected.");
  }
  if (!fs.existsSync(filePath)) {
    throw new Error(`Submission file not found: ${filePath}`);
  }

  // 2. Build the command string, including the filePath
  const command = `check50 ${activity} --local -o json`;

  let jsonOutput;

  try {
    // 3. Use async/await with the promisified exec function.

    console.log("Check50 running in background");
    const { stdout, stderr } = await exec(command);
    console.log("Check50 stdout:", stdout);
    console.log("Check50 stderr:", stderr);

    // 4. Correctly parse the JSON string into an object.
    jsonOutput = JSON.parse(stdout);
  } catch (error: any) {
    // 5. Handle errors and return a consistent failure object.
    console.error("Failed to run check50 or parse output:", error);
    console.error("Command was:", command);
    return {
      grade: 0,
      status: "pending",
      feedback: "Failed to run check50. Check the command and file path.",
    };
  }

  // 6. Access the correct property for the test results.
  const testResults = jsonOutput.results;

  // 7. Check if the results exist before proceeding.
  if (!testResults || testResults.length === 0) {
    return {
      grade: 0,
      status: "pending",
      feedback: "No test results were found. Check the output for errors.",
    };
  }

  // 8. Process the test results to calculate the grade and build feedback.
  let score = 0;
  const maxScore = testResults.length;

  testResults.forEach((test: any) => {
    if (test.passed === true) {
      score += 1;
    } else if (test.passed === false) {
      score += 0.3;
    }
  });

  // 9. Calculate the final grade AFTER the loop has completed.
  const finalGrade = (score / maxScore) * 100;

  // 10. Build the feedback message.
  let feedbackMessage = "";
  const passedTests = testResults.filter((test: any) => test.passed === true);
  const failedTests = testResults.filter((test: any) => test.passed === false);

  if (failedTests.length === 0) {
    feedbackMessage = "✅ All tests passed!\n";
  } else if (passedTests.length === 0) {
    feedbackMessage = "❌ Failed: None Passed\n";
  } else {
    feedbackMessage = "❌ Some tests failed:\n";
  }

  testResults.forEach((test: any) => {
    const status = test.passed ? "✅ Passed" : "❌ Failed";
    feedbackMessage += `- ${test.name}: ${status}\n`;
  });

  // 11. Return the final structured object.
  return {
    grade: parseFloat(finalGrade.toFixed(2)),
    status: finalGrade >= 75 ? "passed" : "failed",
    feedback: feedbackMessage,
  };
};
