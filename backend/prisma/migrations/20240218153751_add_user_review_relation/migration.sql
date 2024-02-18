/*
  Warnings:

  - Added the required column `userId` to the `ProductReview` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ProductReview" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    CONSTRAINT "ProductReview_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ProductReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ProductReview" ("comment", "createdAt", "id", "productId", "rating", "updatedAt") SELECT "comment", "createdAt", "id", "productId", "rating", "updatedAt" FROM "ProductReview";
DROP TABLE "ProductReview";
ALTER TABLE "new_ProductReview" RENAME TO "ProductReview";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
