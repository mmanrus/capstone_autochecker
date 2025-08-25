

export const runCheck50 = async (activity: any, filePath: string) => {
     if (!activity.check50Slug) {
          throw new Error("No Slug Detected.")
     }
     if (!filePath) {
          throw new Error("No File path.")
     }
     try {
          // Example: spawn a child process to run check50
        // e.g., check50 cs50/problems/2023/x/fibonacci submissionFile.c
        const { exec } = require("child_process");
        const command = `check50 ${activity.check50Slug}`
     } catch (error) {
          
     }
}