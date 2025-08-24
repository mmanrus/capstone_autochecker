/*
  Warnings:

  - You are about to drop the column `subjectId` on the `Activity` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "SubjectActivity" (
    "subjectId" INTEGER NOT NULL,
    "activityId" INTEGER NOT NULL,

    PRIMARY KEY ("subjectId", "activityId"),
    CONSTRAINT "SubjectActivity_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SubjectActivity_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Activity" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "check50Slug" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "timeOpen" DATETIME NOT NULL,
    "timeClose" DATETIME NOT NULL,
    "isClosed" BOOLEAN NOT NULL DEFAULT false,
    "professorId" INTEGER NOT NULL,
    CONSTRAINT "Activity_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Activity" ("check50Slug", "createdAt", "id", "isClosed", "professorId", "timeClose", "timeOpen", "title") SELECT "check50Slug", "createdAt", "id", "isClosed", "professorId", "timeClose", "timeOpen", "title" FROM "Activity";
DROP TABLE "Activity";
ALTER TABLE "new_Activity" RENAME TO "Activity";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
