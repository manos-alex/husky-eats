-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MenuItemInfo" (
    "name" TEXT NOT NULL PRIMARY KEY,
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
