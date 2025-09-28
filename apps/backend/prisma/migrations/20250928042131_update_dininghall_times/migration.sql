/*
  Warnings:

  - You are about to drop the column `breakfastend` on the `DiningHall` table. All the data in the column will be lost.
  - You are about to drop the column `breakfaststart` on the `DiningHall` table. All the data in the column will be lost.
  - You are about to drop the column `dinnerend` on the `DiningHall` table. All the data in the column will be lost.
  - You are about to drop the column `dinnerstart` on the `DiningHall` table. All the data in the column will be lost.
  - You are about to drop the column `lunchend` on the `DiningHall` table. All the data in the column will be lost.
  - You are about to drop the column `lunchstart` on the `DiningHall` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DiningHall" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "wdbreakfast" TEXT,
    "wdlunch" TEXT,
    "wddinner" TEXT,
    "wesatbreakfast" TEXT,
    "wesunbreakfast" TEXT,
    "webrunch" TEXT,
    "wedinner" TEXT,
    "latenight" TEXT,
    "haslatenight" BOOLEAN NOT NULL,
    "hasgrabngo" BOOLEAN NOT NULL
);
INSERT INTO "new_DiningHall" ("hasgrabngo", "haslatenight", "id", "name") SELECT "hasgrabngo", "haslatenight", "id", "name" FROM "DiningHall";
DROP TABLE "DiningHall";
ALTER TABLE "new_DiningHall" RENAME TO "DiningHall";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
