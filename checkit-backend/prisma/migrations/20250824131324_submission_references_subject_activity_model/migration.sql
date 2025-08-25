/*
  Warnings:

  - Added the required column `fileData` to the `Submission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fileName` to the `Submission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subjectId` to the `Submission` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Activity" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "check50Slug" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "professorId" INTEGER NOT NULL,
    CONSTRAINT "Activity_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Activity" ("check50Slug", "createdAt", "id", "professorId", "title") SELECT "check50Slug", "createdAt", "id", "professorId", "title" FROM "Activity";
DROP TABLE "Activity";
ALTER TABLE "new_Activity" RENAME TO "Activity";
CREATE TABLE "new_Submission" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "status" TEXT NOT NULL,
    "fileData" BLOB NOT NULL,
    "fileName" TEXT NOT NULL,
    "grade" REAL NOT NULL,
    "feedback" TEXT NOT NULL,
    "professorFeedback" TEXT NOT NULL,
    "isSubmitted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "subjectId" INTEGER NOT NULL,
    "activityId" INTEGER NOT NULL,
    CONSTRAINT "Submission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Submission_subjectId_activityId_fkey" FOREIGN KEY ("subjectId", "activityId") REFERENCES "SubjectActivity" ("subjectId", "activityId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Submission" ("activityId", "createdAt", "feedback", "grade", "id", "isSubmitted", "professorFeedback", "status", "userId") SELECT "activityId", "createdAt", "feedback", "grade", "id", "isSubmitted", "professorFeedback", "status", "userId" FROM "Submission";
DROP TABLE "Submission";
ALTER TABLE "new_Submission" RENAME TO "Submission";
CREATE UNIQUE INDEX "Submission_userId_subjectId_activityId_key" ON "Submission"("userId", "subjectId", "activityId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
