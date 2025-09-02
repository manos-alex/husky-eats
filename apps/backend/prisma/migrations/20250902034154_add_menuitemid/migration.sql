/*
  Warnings:

  - The primary key for the `MenuItem` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `id` to the `MenuItem` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MenuItem" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "meal" TEXT NOT NULL,
    "hallid" INTEGER NOT NULL,
    "date" DATETIME NOT NULL,
    "station" TEXT NOT NULL,

    PRIMARY KEY ("id", "name", "meal", "hallid", "date")
);
INSERT INTO "new_MenuItem" ("date", "hallid", "meal", "name", "station") SELECT "date", "hallid", "meal", "name", "station" FROM "MenuItem";
DROP TABLE "MenuItem";
ALTER TABLE "new_MenuItem" RENAME TO "MenuItem";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
