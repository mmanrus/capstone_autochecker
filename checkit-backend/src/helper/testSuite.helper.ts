import { PrismaClient } from "@prisma/client";
import { toWords } from 'number-to-words';

import { simpleGit, SimpleGitOptions } from "simple-git";
const fs = require("fs").promises; // Import the promises-based fs module

const githubToken = process.env.GITHUB_PAT;
const username = process.env.GITHUB_USERNAME;
const local_git_repoPath = process.env.LOCAL_REPO_PATH;
const repoName = process.env.REPO_NAME;

const options: Partial<SimpleGitOptions> = {
  baseDir: local_git_repoPath,
  binary: "git",
  maxConcurrentProcesses: 6,
};
const git = simpleGit(options);
const prisma = new PrismaClient();

interface TestSuiteType {
  title: string;
  filename: string;
  testCases: TestCases[];
}
interface TestCases {
  input: string[];
  output: string[];
  description?: string;
  helper?: string;
  reject?: Boolean;
}
interface ActionType {
  action?: "create" | "update" | "delete" | undefined;
}
export const createCheck50 = async (
  testData: TestSuiteType,
  action?: string
) => {
  try {
    let check50Slug = "";
    const title = testData.title.toLowerCase().split(" ");
    const camelCaseTitle = title
      .map((word: string, index: number) => {
        if (index === 0) {
          return word;
        }
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join("");
    if (action === "create") {
      console.log("Creating test suite...");
      const exists = await prisma.testSuite.findFirst({
        where: { title: testData.title },
      });

      if (exists) {
        throw new Error(`Title test ${testData.title} already exists.`);
      }

      console.log("Action: ", action);
      // Only perform the slug existence check during creation
      check50Slug = `check50 mmanrus/newchecker/main/test/${camelCaseTitle}`;

      const slugExists = await prisma.testSuite.findFirst({
        where: {
          check50Slug: check50Slug,
        },
      });

      if (slugExists) {
        // This error is correctly thrown during a create action
        throw new Error("Title already exists");
      }
    }

    const newDirectory = `${local_git_repoPath}/test/${camelCaseTitle}`;
    const filePath = `${newDirectory}/.cs50.yaml`;
    const yamlContent = "check50: true";
    await fs.mkdir(newDirectory, { recursive: true });
    console.log(
      `Directory ${
        action === "create"
          ? "created"
          : action === "update"
          ? "updated"
          : "deleted"
      }  successfully.`
    );

    await fs.writeFile(filePath, yamlContent);
    console.log(
      `File ${
        action === "create"
          ? "created"
          : action === "update"
          ? "updated"
          : "deleted"
      } successfully at ${filePath}`
    );
    const { testCases, filename } = testData;
    try {
      await createFileHelper({ testCases, filename }, newDirectory, action);
    } catch (error) {
      console.error("Error during making check50 test file:", error);
      throw new Error("Failed to create to check50 file.");
    }

    console.log("Check50File Successfully created");
    await pushToGitHub(testData.title, action);

    return check50Slug;
  } catch (error) {
    throw new Error(
      `Error ${
        action === "create"
          ? "Creating"
          : action === "update"
          ? "Updating"
          : "Deleting"
      } check50 file: ${error}`
    );
  }
};

const createFileHelper = async (
  testData: any,
  dirPath: string,
  action?: string
) => { 
  // C only
  // ${toWords(indx).replace(/[ -]/g,"_")}
  const cFile = testData.filename.endsWith(".c")
    ? testData.filename
    : `${testData.filename}.c`;
  const file = cFile.endsWith(".c") ? cFile.slice(0, -2) : cFile;
  const filePath = `${dirPath}/__init__.py`;
  const fileContent = `
import check50

@check50.check()
def exists():
    """Checks if ${cFile} exists"""
    check50.exists("${cFile}")
     
@check50.check(exists)
def compiles():
    """Checks if ${cFile} compiles successfully"""
    check50.run("gcc -o ${file} ${cFile}").exit(0)

${testData.testCases
  .map((testCase: TestCases, indx: number) => {
    // You must return the string from the map function
    if (testCase.reject) {
      return `
@check50.check(compiles)
def test_error_${indx}():
     ${
       testCase.description
         ? `"""Reject input ${testCase.input}: ${testCase.description}.${
             testCase.helper ? `\n${testCase.helper}` : ""
           }"""`
         : ""
     }
     check50.run("./${cFile}").stdin("${testCase.input}").reject()
  
`;
    }
    return `
@check50.check(compiles)
def test_${indx}():
     ${testCase.description ? `"""${testCase.description}"""` : ""}
     result = check50.run("./${cFile}")${testCase.input
      .map((input) => `.stdin("${input}")`)
      .join("")}.stdout()

     expected_output = "${testCase.output}"

     if expected_output not in result:
        raise check50.Mismatch(expected_output, result, ${
          testCase.helper ? `help="${testCase.helper}"` : ""
        })
`;
  })
  .join("")}
`;
  await fs.writeFile(filePath, fileContent);
};

const pushToGitHub = async (title: string, action?: string) => {
  try {
    const remoteUrlWithToken = `https://${username}:${githubToken}@github.com/${username}/${repoName}.git`;

    // Get the list of remotes as an array of objects
    const remotes = await git.getRemotes(true);

    // Check if a line contains 'origin'
    const originExists = remotes.some((remote) => remote.name === "origin");

    if (originExists) {
      // Remove the old remote if it exists
      await git.removeRemote("origin");
    }

    // Add the new remote with the token
    await git.addRemote("origin", remoteUrlWithToken);
    console.log("Successfully configured Git remote with token.");

    await git.add(".");
    console.log("Successfully added files.");

    await git.commit(`feat: Check50 test ${action} for ${title}`);
    console.log("Successfully committed files.");

    await git.push("origin", "main");
    console.log("Successfully pushed to GitHub.");
  } catch (err) {
    console.error("Error during Git operations:", err);
    throw new Error("Failed to push to GitHub.");
  }
};
