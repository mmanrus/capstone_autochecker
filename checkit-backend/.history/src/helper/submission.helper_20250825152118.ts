import { exec } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Runs the check50 command for a given activity and file path.
 *
 * @param {string} activity The check50 slug for the activity (e.g., "mmanrus/newchecker/main/test/addition_subtraction").
 * @param {string} filePath The full path to the submission file.
 * @returns {Promise<any>} A promise that resolves with the parsed JSON output from check50.
 */
export const runCheck50 = async (activity: any, filePath: string) => {
  // 1. Input validation check
  if (!activity) {
    throw new Error("No Slug Detected.");
  }
  if (!fs.existsSync(filePath)) {
    throw new Error(`Submission file not found: ${filePath}`);
  }

  // 2. Build the command string.
  const command = `check50 ${activity} --local -o json`;
  // 3. Get the directory name from the file path.
  const workingDirectory = path.dirname(filePath);

  console.log("Check50 running in background");
  console.log(`Command: ${command}`);
  console.log(`Working Directory: ${workingDirectory}`);

  let stdout, stderr;
  try {
    // We use the promise-based version of exec here.
    // This allows us to use `await` and wait for the command to finish.
    const { stdout: out, stderr: err } = await new Promise<{ stdout: string, stderr: string }>((resolve, reject) => {
      exec(command, { cwd: workingDirectory }, (error, stdout, stderr) => {
        if (error) {
          return reject(error);
        }
        resolve({ stdout, stderr });
      });
    });
    stdout = out;
    stderr = err;
    console.log("Output :", stdout);
    console.log("Stderr :", stderr);

  } catch (error: any) {
    // The `catch` block will handle errors thrown by `exec`
    const errorMessage = `Failed to run check50 or parse output: ${error.message}`;
    console.error(errorMessage);
    throw new Error(errorMessage);
  }

  // 4. Combine stdout and stderr for the raw output.
  const rawOutput = stdout;
  console.log(`Command raw output: ${rawOutput}`);
  
  let jsonOutput;
  try {
    // 5. Correctly parse the JSON string into an object.
    jsonOutput = JSON.parse(rawOutput);
  } catch (parseError: any) {
    const errorMessage = `Failed to parse check50 JSON output. Error: ${parseError.message}. Raw Output: ${rawOutput}`;
    console.error(errorMessage);
    throw new Error(errorMessage);
  }
  
  // 6. Access the correct property for the test results.
  const testResults = jsonOutput?.results;
  
  // 7. Check if the results exist before proceeding.
  if (!testResults) {
    throw new Error(`No results found.`);
  }

  // 8. Process the test results to calculate the grade and build feedback.
  let score = 0;
  const maxScore = testResults.length;

  testResults.forEach((test: any) => {
    if (test.passed === true) {
      score += 1;
    } else if (test.passed === false) {
      // It's generally better to give 0 for failed tests
      // unless partial credit is a specific requirement.
      score += 0;
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
