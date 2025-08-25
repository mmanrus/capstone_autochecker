// Add this import at the top of your file
const util = require("util");
// Promisify 'exec' to allow for modern async/await syntax
const exec = util.promisify(require("child_process").exec);
import fs from "fs";
import * as path from "path";
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
  // 3. Get the directory name from the file path.
  // The exec function's 'cwd' option requires a directory path.
  const workingDirectory = path.dirname(filePath);
  let jsonOutput;

  try {
    // 3. Use async/await with the promisified exec function.

    console.log("Check50 running in background");
    console.log(`Command: ${command}`);
    console.log(`Working Directory: ${workingDirectory}`);
    exec(
      command,
      { cwd: workingDirectory },
      (error: any, stdout: any, stderr: any) => {
        if (error) {
          // This handles errors like command not found or a non-zero exit code.
          console.error(`exec error: ${error}`);
          throw new Error(`Failed to run check50 or parse output: ${error}`);
        }

        // Combine stdout and stderr for the raw output, just like in your Python code.
        const rawOutput = stdout + stderr;
        console.log(`Command raw output: ${rawOutput}`);
        // 4. Correctly parse the JSON string into an object.
        try {
          // 5. Correctly parse the JSON string into an object.
          jsonOutput = JSON.parse(rawOutput);
        } catch (parseError: any) {
          // Handle JSON parsing errors.
          const errorMessage = `Failed to parse check50 JSON output. Error: ${parseError.message}. Raw Output: ${rawOutput}`;
          console.error(errorMessage);
          throw new Error("Faliled to parse raw output")
        }
      }
    );
  } catch (error: any) {
    // 6. Handle errors and return a consistent failure object.
    console.error("Failed to run check50 or parse output:", error);
    console.error("Command was:", command);
    throw new Error(`Failed to run check50 or parse output: ${error}`);
  }

  // 7. Access the correct property for the test results.
  const testResults = jsonOutput?.results;

  // 8. Check if the results exist before proceeding.
  if (!testResults || testResults.length === 0) {
    throw new Error(`No results found: `);
  }

  // 9. Process the test results to calculate the grade and build feedback.
  let score = 0;
  const maxScore = testResults.length;

  testResults.forEach((test: any) => {
    if (test.passed === true) {
      score += 1;
    } else if (test.passed === false) {
      score += 0.3;
    }
  });

  // 10. Calculate the final grade AFTER the loop has completed.
  const finalGrade = (score / maxScore) * 100;

  // 11. Build the feedback message.
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

  // 12. Return the final structured object.
  return {
    grade: parseFloat(finalGrade.toFixed(2)),
    status: finalGrade >= 75 ? "passed" : "failed",
    feedback: feedbackMessage,
  };
};
