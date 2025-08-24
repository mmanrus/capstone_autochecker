/*
  Warnings:

  - You are about to drop the column `classCode` on the `Subject` table. All the data in the column will be lost.
  - You are about to drop the column `className` on the `Subject` table. All the data in the column will be lost.
  - Added the required column `code` to the `Subject` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Subject` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Subject" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "schedule" TEXT NOT NULL,
    "professorId" INTEGER NOT NULL,
    CONSTRAINT "Subject_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Subject" ("createdAt", "id", "professorId", "schedule") SELECT "createdAt", "id", "professorId", "schedule" FROM "Subject";
DROP TABLE "Subject";
ALTER TABLE "new_Subject" RENAME TO "Subject";
CREATE UNIQUE INDEX "Subject_code_key" ON "Subject"("code");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
