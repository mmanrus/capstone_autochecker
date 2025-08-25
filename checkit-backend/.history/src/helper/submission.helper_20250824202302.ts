// Add this import at the top of your file
const util = require("util");
const exec = util.promisify(require("child_process").exec);

export const runCheck50 = async (activity: any, filePath: string) => {
  if (!activity.check50Slug) {
    throw new Error("No Slug Detected.");
  }
  if (!filePath) {
    throw new Error("No File path.");
  }
  try {
    // Example: spawn a child process to run check50
    // e.g., check50 cs50/problems/2023/x/fibonacci submissionFile.c
    const { exec } = require("child_process");
    const command = `check50 ${activity.check50Slug} --local -o json`;
    const output = await new Promise<string>((resolve, reject) => {
      exec(command, (error: any, stdout: any, stderr: any) => {
        if (error) return reject(stderr);
        resolve(stdout);
      });
    });

    console.log("Check50 Output:", output);
    const testResults = JSON.parse(output);
    let feedbackMessage = "";
    let finalGrade;
    const passedTests = testResults.filter((test: any) => test.passed === true);
    const failedTests = testResults.filter(
      (test: any) => test.passed === false
    );

    // Build the feedback message.
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
    // If there are test results, process them.
    if (testResults && testResults.length > 0) {
      let score = 0;
      const maxScore = testResults.length;

      // Use your custom grading logic to calculate the score.
      testResults.forEach((test: any) => {
        if (test.passed === true) {
          score += 1;
        } else if (test.passed === false) {
          score += 0.3;
        }
        finalGrade = (score / maxScore) * 100;
      });
    }

    // Calculate the final percentage and round to 2 decimal places.

    //const score = calculate(testResults);
  } catch (error: any) {
    console.error("Failed to run check50 or parse output:", error);

    // Create a structured error message to be returned.
    return {
      grade: 0,
      status: "pending",
      feedback:
        "Failed to run check50. Check for errors in the command or output format.",
      results: null,
    };
  }
};
