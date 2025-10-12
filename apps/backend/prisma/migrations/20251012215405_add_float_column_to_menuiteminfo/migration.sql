/*
  Warnings:

  - The primary key for the `MenuItemInfo` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `addedsugars` on the `MenuItemInfo` table. The data in that column could be lost. The data in that column will be cast from `String` to `Float`.
  - You are about to alter the column `allergens` on the `MenuItemInfo` table. The data in that column could be lost. The data in that column will be cast from `String` to `Float`.
  - You are about to alter the column `calcium` on the `MenuItemInfo` table. The data in that column could be lost. The data in that column will be cast from `String` to `Float`.
  - You are about to alter the column `cholesterol` on the `MenuItemInfo` table. The data in that column could be lost. The data in that column will be cast from `String` to `Float`.
  - You are about to alter the column `dietaryfiber` on the `MenuItemInfo` table. The data in that column could be lost. The data in that column will be cast from `String` to `Float`.
  - You are about to alter the column `iron` on the `MenuItemInfo` table. The data in that column could be lost. The data in that column will be cast from `String` to `Float`.
  - You are about to alter the column `potassium` on the `MenuItemInfo` table. The data in that column could be lost. The data in that column will be cast from `String` to `Float`.
  - You are about to alter the column `protein` on the `MenuItemInfo` table. The data in that column could be lost. The data in that column will be cast from `String` to `Float`.
  - You are about to alter the column `saturatedfat` on the `MenuItemInfo` table. The data in that column could be lost. The data in that column will be cast from `String` to `Float`.
  - You are about to alter the column `sodium` on the `MenuItemInfo` table. The data in that column could be lost. The data in that column will be cast from `String` to `Float`.
  - You are about to alter the column `totalcarbohydrate` on the `MenuItemInfo` table. The data in that column could be lost. The data in that column will be cast from `String` to `Float`.
  - You are about to alter the column `totalfat` on the `MenuItemInfo` table. The data in that column could be lost. The data in that column will be cast from `String` to `Float`.
  - You are about to alter the column `totalsugars` on the `MenuItemInfo` table. The data in that column could be lost. The data in that column will be cast from `String` to `Float`.
  - You are about to alter the column `transfat` on the `MenuItemInfo` table. The data in that column could be lost. The data in that column will be cast from `String` to `Float`.
  - You are about to alter the column `vitamind` on the `MenuItemInfo` table. The data in that column could be lost. The data in that column will be cast from `String` to `Float`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MenuItemInfo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "vegan" BOOLEAN,
    "vegetarian" BOOLEAN,
    "glutenfriendly" BOOLEAN,
    "smartcheck" BOOLEAN,
    "lesssodium" BOOLEAN,
    "nogarliconion" BOOLEAN,
    "containsnuts" BOOLEAN,
    "servingsize" TEXT,
    "calories" INTEGER,
    "totalfat" REAL,
    "saturatedfat" REAL,
    "transfat" REAL,
    "cholesterol" REAL,
    "sodium" REAL,
    "calcium" REAL,
    "iron" REAL,
    "totalcarbohydrate" REAL,
    "dietaryfiber" REAL,
    "totalsugars" REAL,
    "addedsugars" REAL,
    "protein" REAL,
    "vitamind" REAL,
    "potassium" REAL,
    "allergens" REAL
);
INSERT INTO "new_MenuItemInfo" ("addedsugars", "allergens", "calcium", "calories", "cholesterol", "containsnuts", "dietaryfiber", "glutenfriendly", "id", "iron", "lesssodium", "name", "nogarliconion", "potassium", "protein", "saturatedfat", "servingsize", "smartcheck", "sodium", "totalcarbohydrate", "totalfat", "totalsugars", "transfat", "vegan", "vegetarian", "vitamind") SELECT "addedsugars", "allergens", "calcium", "calories", "cholesterol", "containsnuts", "dietaryfiber", "glutenfriendly", "id", "iron", "lesssodium", "name", "nogarliconion", "potassium", "protein", "saturatedfat", "servingsize", "smartcheck", "sodium", "totalcarbohydrate", "totalfat", "totalsugars", "transfat", "vegan", "vegetarian", "vitamind" FROM "MenuItemInfo";
DROP TABLE "MenuItemInfo";
ALTER TABLE "new_MenuItemInfo" RENAME TO "MenuItemInfo";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
