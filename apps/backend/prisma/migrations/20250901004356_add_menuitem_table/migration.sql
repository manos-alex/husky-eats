/*
  Warnings:

  - You are about to drop the `dininghall` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "dininghall";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "DiningHall" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "breakfaststart" TEXT NOT NULL,
    "breakfastend" TEXT NOT NULL,
    "lunchstart" TEXT NOT NULL,
    "lunchend" TEXT NOT NULL,
    "dinnerstart" TEXT NOT NULL,
    "dinnerend" TEXT NOT NULL,
    "haslatenight" BOOLEAN NOT NULL,
    "hasgrabngo" BOOLEAN NOT NULL
);

-- CreateTable
CREATE TABLE "MenuItem" (
    "name" TEXT NOT NULL,
    "meal" TEXT NOT NULL,
    "hallid" INTEGER NOT NULL,
    "date" DATETIME NOT NULL,
    "station" TEXT NOT NULL,

    PRIMARY KEY ("name", "meal", "hallid", "date"),
    CONSTRAINT "MenuItem_hallid_fkey" FOREIGN KEY ("hallid") REFERENCES "DiningHall" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
