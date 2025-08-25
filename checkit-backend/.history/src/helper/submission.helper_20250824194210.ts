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
