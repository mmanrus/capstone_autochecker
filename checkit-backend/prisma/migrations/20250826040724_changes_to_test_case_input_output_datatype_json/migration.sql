/*
  Warnings:

  - You are about to alter the column `input` on the `TestCases` table. The data in that column could be lost. The data in that column will be cast from `String` to `Json`.
  - You are about to alter the column `output` on the `TestCases` table. The data in that column could be lost. The data in that column will be cast from `String` to `Json`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TestCases" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "input" JSONB NOT NULL,
    "output" JSONB NOT NULL,
    "description" TEXT,
    "helper" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "order" INTEGER NOT NULL,
    "testSuiteId" INTEGER NOT NULL,
    CONSTRAINT "TestCases_testSuiteId_fkey" FOREIGN KEY ("testSuiteId") REFERENCES "TestSuite" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_TestCases" ("createdAt", "description", "helper", "id", "input", "order", "output", "testSuiteId") SELECT "createdAt", "description", "helper", "id", "input", "order", "output", "testSuiteId" FROM "TestCases";
DROP TABLE "TestCases";
ALTER TABLE "new_TestCases" RENAME TO "TestCases";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
