/*
  Warnings:

  - Added the required column `rating` to the `Plant` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Plant" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "scientificName" TEXT NOT NULL,
    "commonName" TEXT NOT NULL,
    "genus" TEXT NOT NULL,
    "species" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "discountPrice" REAL NOT NULL,
    "count" INTEGER NOT NULL,
    "rating" REAL NOT NULL
);
INSERT INTO "new_Plant" ("commonName", "count", "description", "discountPrice", "genus", "id", "price", "scientificName", "species") SELECT "commonName", "count", "description", "discountPrice", "genus", "id", "price", "scientificName", "species" FROM "Plant";
DROP TABLE "Plant";
ALTER TABLE "new_Plant" RENAME TO "Plant";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
