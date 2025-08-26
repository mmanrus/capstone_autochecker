/*
  Warnings:

  - Added the required column `order` to the `TestCases` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TestCases" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "input" TEXT NOT NULL,
    "output" TEXT NOT NULL,
    "description" TEXT,
    "helper" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "order" INTEGER NOT NULL,
    "testSuiteId" INTEGER NOT NULL,
    CONSTRAINT "TestCases_testSuiteId_fkey" FOREIGN KEY ("testSuiteId") REFERENCES "TestSuite" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_TestCases" ("createdAt", "description", "helper", "id", "input", "output", "testSuiteId") SELECT "createdAt", "description", "helper", "id", "input", "output", "testSuiteId" FROM "TestCases";
DROP TABLE "TestCases";
ALTER TABLE "new_TestCases" RENAME TO "TestCases";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
