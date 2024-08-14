/*
  Warnings:

  - You are about to drop the column `inStock` on the `Plant` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Plant` table. All the data in the column will be lost.
  - Added the required column `commonName` to the `Plant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `count` to the `Plant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `discountPrice` to the `Plant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `genus` to the `Plant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scientificName` to the `Plant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `species` to the `Plant` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Image" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "url" TEXT NOT NULL,
    "plantId" INTEGER NOT NULL,
    CONSTRAINT "Image_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "Plant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

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
    "count" INTEGER NOT NULL
);
INSERT INTO "new_Plant" ("description", "id", "price") SELECT "description", "id", "price" FROM "Plant";
DROP TABLE "Plant";
ALTER TABLE "new_Plant" RENAME TO "Plant";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
