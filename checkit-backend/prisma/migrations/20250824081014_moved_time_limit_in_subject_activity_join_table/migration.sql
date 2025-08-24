/*
  Warnings:

  - You are about to drop the column `isClosed` on the `Activity` table. All the data in the column will be lost.
  - You are about to drop the column `timeClose` on the `Activity` table. All the data in the column will be lost.
  - You are about to drop the column `timeOpen` on the `Activity` table. All the data in the column will be lost.
  - Added the required column `timeClose` to the `SubjectActivity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timeOpen` to the `SubjectActivity` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Activity" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "check50Slug" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "professorId" INTEGER NOT NULL,
    CONSTRAINT "Activity_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Activity" ("check50Slug", "createdAt", "id", "professorId", "title") SELECT "check50Slug", "createdAt", "id", "professorId", "title" FROM "Activity";
DROP TABLE "Activity";
ALTER TABLE "new_Activity" RENAME TO "Activity";
CREATE TABLE "new_SubjectActivity" (
    "subjectId" INTEGER NOT NULL,
    "activityId" INTEGER NOT NULL,
    "timeOpen" DATETIME NOT NULL,
    "timeClose" DATETIME NOT NULL,
    "isClosed" BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY ("subjectId", "activityId"),
    CONSTRAINT "SubjectActivity_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SubjectActivity_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_SubjectActivity" ("activityId", "subjectId") SELECT "activityId", "subjectId" FROM "SubjectActivity";
DROP TABLE "SubjectActivity";
ALTER TABLE "new_SubjectActivity" RENAME TO "SubjectActivity";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
