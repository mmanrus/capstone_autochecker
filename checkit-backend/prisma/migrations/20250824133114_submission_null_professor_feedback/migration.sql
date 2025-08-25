-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Submission" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "status" TEXT NOT NULL,
    "fileData" BLOB NOT NULL,
    "fileName" TEXT NOT NULL,
    "grade" REAL NOT NULL,
    "feedback" TEXT NOT NULL,
    "professorFeedback" TEXT,
    "isSubmitted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "subjectId" INTEGER NOT NULL,
    "activityId" INTEGER NOT NULL,
    CONSTRAINT "Submission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Submission_subjectId_activityId_fkey" FOREIGN KEY ("subjectId", "activityId") REFERENCES "SubjectActivity" ("subjectId", "activityId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Submission" ("activityId", "createdAt", "feedback", "fileData", "fileName", "grade", "id", "isSubmitted", "professorFeedback", "status", "subjectId", "userId") SELECT "activityId", "createdAt", "feedback", "fileData", "fileName", "grade", "id", "isSubmitted", "professorFeedback", "status", "subjectId", "userId" FROM "Submission";
DROP TABLE "Submission";
ALTER TABLE "new_Submission" RENAME TO "Submission";
CREATE UNIQUE INDEX "Submission_userId_subjectId_activityId_key" ON "Submission"("userId", "subjectId", "activityId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
