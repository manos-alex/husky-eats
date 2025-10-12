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
    "allergens" TEXT
);
INSERT INTO "new_MenuItemInfo" ("addedsugars", "allergens", "calcium", "calories", "cholesterol", "containsnuts", "dietaryfiber", "glutenfriendly", "id", "iron", "lesssodium", "name", "nogarliconion", "potassium", "protein", "saturatedfat", "servingsize", "smartcheck", "sodium", "totalcarbohydrate", "totalfat", "totalsugars", "transfat", "vegan", "vegetarian", "vitamind") SELECT "addedsugars", "allergens", "calcium", "calories", "cholesterol", "containsnuts", "dietaryfiber", "glutenfriendly", "id", "iron", "lesssodium", "name", "nogarliconion", "potassium", "protein", "saturatedfat", "servingsize", "smartcheck", "sodium", "totalcarbohydrate", "totalfat", "totalsugars", "transfat", "vegan", "vegetarian", "vitamind" FROM "MenuItemInfo";
DROP TABLE "MenuItemInfo";
ALTER TABLE "new_MenuItemInfo" RENAME TO "MenuItemInfo";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
