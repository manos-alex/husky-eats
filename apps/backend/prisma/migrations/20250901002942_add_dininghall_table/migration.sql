-- CreateTable
CREATE TABLE "dininghall" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "breakfaststart" TEXT NOT NULL,
    "breakfastend" TEXT NOT NULL,
    "lunchstart" TEXT NOT NULL,
    "lunchend" TEXT NOT NULL,
    "dinnerstart" TEXT NOT NULL,
    "dinnerend" TEXT NOT NULL,
    "haslatenight" BOOLEAN NOT NULL,
    "hasgrabngo" BOOLEAN NOT NULL,

    PRIMARY KEY ("id", "name")
);
