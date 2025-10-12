/*
  Warnings:

  - You are about to drop the column `addedsugars` on the `MenuItemInfo` table. All the data in the column will be lost.
  - You are about to drop the column `calcium` on the `MenuItemInfo` table. All the data in the column will be lost.
  - You are about to drop the column `cholesterol` on the `MenuItemInfo` table. All the data in the column will be lost.
  - You are about to drop the column `dietaryfiber` on the `MenuItemInfo` table. All the data in the column will be lost.
  - You are about to drop the column `iron` on the `MenuItemInfo` table. All the data in the column will be lost.
  - You are about to drop the column `potassium` on the `MenuItemInfo` table. All the data in the column will be lost.
  - You are about to drop the column `protein` on the `MenuItemInfo` table. All the data in the column will be lost.
  - You are about to drop the column `saturatedfat` on the `MenuItemInfo` table. All the data in the column will be lost.
  - You are about to drop the column `sodium` on the `MenuItemInfo` table. All the data in the column will be lost.
  - You are about to drop the column `totalcarbohydrate` on the `MenuItemInfo` table. All the data in the column will be lost.
  - You are about to drop the column `totalfat` on the `MenuItemInfo` table. All the data in the column will be lost.
  - You are about to drop the column `totalsugars` on the `MenuItemInfo` table. All the data in the column will be lost.
  - You are about to drop the column `transfat` on the `MenuItemInfo` table. All the data in the column will be lost.
  - You are about to drop the column `vitamind` on the `MenuItemInfo` table. All the data in the column will be lost.

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
    "totalfat_g" REAL,
    "saturatedfat_g" REAL,
    "transfat_g" REAL,
    "cholesterol_mg" REAL,
    "sodium_mg" REAL,
    "calcium_mg" REAL,
    "iron_mg" REAL,
    "totalcarbohydrate_g" REAL,
    "dietaryfiber_g" REAL,
    "totalsugars_g" REAL,
    "addedsugars_g" REAL,
    "protein_g" REAL,
    "vitamind_mcg" REAL,
    "potassium_mg" REAL,
    "allergens" TEXT
);
INSERT INTO "new_MenuItemInfo" ("allergens", "calories", "containsnuts", "glutenfriendly", "id", "lesssodium", "name", "nogarliconion", "servingsize", "smartcheck", "vegan", "vegetarian") SELECT "allergens", "calories", "containsnuts", "glutenfriendly", "id", "lesssodium", "name", "nogarliconion", "servingsize", "smartcheck", "vegan", "vegetarian" FROM "MenuItemInfo";
DROP TABLE "MenuItemInfo";
ALTER TABLE "new_MenuItemInfo" RENAME TO "MenuItemInfo";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
