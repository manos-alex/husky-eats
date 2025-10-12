/*
  Warnings:

  - The primary key for the `MenuItemInfo` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `id` to the `MenuItemInfo` table without a default value. This is not possible if the table is not empty.

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
    "totalfat" TEXT,
    "saturatedfat" TEXT,
    "transfat" TEXT,
    "cholesterol" TEXT,
    "sodium" TEXT,
    "calcium" TEXT,
    "iron" TEXT,
    "totalcarbohydrate" TEXT,
    "dietaryfiber" TEXT,
    "totalsugars" TEXT,
    "addedsugars" TEXT,
    "protein" TEXT,
    "vitamind" TEXT,
    "potassium" TEXT,
    "allergens" TEXT
);
INSERT INTO "new_MenuItemInfo" ("addedsugars", "allergens", "calcium", "calories", "cholesterol", "containsnuts", "dietaryfiber", "glutenfriendly", "iron", "lesssodium", "name", "nogarliconion", "potassium", "protein", "saturatedfat", "servingsize", "smartcheck", "sodium", "totalcarbohydrate", "totalfat", "totalsugars", "transfat", "vegan", "vegetarian", "vitamind") SELECT "addedsugars", "allergens", "calcium", "calories", "cholesterol", "containsnuts", "dietaryfiber", "glutenfriendly", "iron", "lesssodium", "name", "nogarliconion", "potassium", "protein", "saturatedfat", "servingsize", "smartcheck", "sodium", "totalcarbohydrate", "totalfat", "totalsugars", "transfat", "vegan", "vegetarian", "vitamind" FROM "MenuItemInfo";
DROP TABLE "MenuItemInfo";
ALTER TABLE "new_MenuItemInfo" RENAME TO "MenuItemInfo";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
