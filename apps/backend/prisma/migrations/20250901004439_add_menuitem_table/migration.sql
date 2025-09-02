-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MenuItem" (
    "name" TEXT NOT NULL,
    "meal" TEXT NOT NULL,
    "hallid" INTEGER NOT NULL,
    "date" DATETIME NOT NULL,
    "station" TEXT NOT NULL,

    PRIMARY KEY ("name", "meal", "hallid", "date")
);
INSERT INTO "new_MenuItem" ("date", "hallid", "meal", "name", "station") SELECT "date", "hallid", "meal", "name", "station" FROM "MenuItem";
DROP TABLE "MenuItem";
ALTER TABLE "new_MenuItem" RENAME TO "MenuItem";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
