-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TestSuite" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'c',
    "filename" TEXT NOT NULL,
    "check50Slug" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "TestSuite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_TestSuite" ("check50Slug", "createdAt", "description", "filename", "id", "title", "type", "userId") SELECT "check50Slug", "createdAt", "description", "filename", "id", "title", "type", "userId" FROM "TestSuite";
DROP TABLE "TestSuite";
ALTER TABLE "new_TestSuite" RENAME TO "TestSuite";
CREATE UNIQUE INDEX "TestSuite_title_key" ON "TestSuite"("title");
CREATE UNIQUE INDEX "TestSuite_filename_key" ON "TestSuite"("filename");
CREATE UNIQUE INDEX "TestSuite_check50Slug_key" ON "TestSuite"("check50Slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
