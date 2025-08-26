/*
  Warnings:

  - You are about to drop the `TestCase` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `check50Slug` to the `TestSuite` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "TestCase";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "TestCases" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "input" TEXT NOT NULL,
    "output" TEXT NOT NULL,
    "description" TEXT,
    "helper" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "testSuiteId" INTEGER NOT NULL,
    CONSTRAINT "TestCases_testSuiteId_fkey" FOREIGN KEY ("testSuiteId") REFERENCES "TestSuite" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Subject" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "schedule" TEXT NOT NULL,
    "professorId" INTEGER NOT NULL,
    CONSTRAINT "Subject_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Subject" ("code", "createdAt", "id", "name", "professorId", "schedule") SELECT "code", "createdAt", "id", "name", "professorId", "schedule" FROM "Subject";
DROP TABLE "Subject";
ALTER TABLE "new_Subject" RENAME TO "Subject";
CREATE UNIQUE INDEX "Subject_code_key" ON "Subject"("code");
CREATE TABLE "new_TestSuite" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'c',
    "filename" TEXT NOT NULL,
    "check50Slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "TestSuite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_TestSuite" ("createdAt", "description", "filename", "id", "title", "type", "userId") SELECT "createdAt", "description", "filename", "id", "title", "type", "userId" FROM "TestSuite";
DROP TABLE "TestSuite";
ALTER TABLE "new_TestSuite" RENAME TO "TestSuite";
CREATE UNIQUE INDEX "TestSuite_title_key" ON "TestSuite"("title");
CREATE UNIQUE INDEX "TestSuite_filename_key" ON "TestSuite"("filename");
CREATE UNIQUE INDEX "TestSuite_check50Slug_key" ON "TestSuite"("check50Slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
