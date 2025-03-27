/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "OrganicRelationType" AS ENUM ('REACTANT', 'PRODUCT');

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- DropTable
DROP TABLE "Post";

-- CreateTable
CREATE TABLE "Reaction" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FunctionalGroup" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FunctionalGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FunctionalGroupRelation" (
    "id" TEXT NOT NULL,
    "reactionId" TEXT NOT NULL,
    "functionalGroupId" TEXT NOT NULL,
    "relationType" "OrganicRelationType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FunctionalGroupRelation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FunctionalGroupRelation" ADD CONSTRAINT "FunctionalGroupRelation_reactionId_fkey" FOREIGN KEY ("reactionId") REFERENCES "Reaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FunctionalGroupRelation" ADD CONSTRAINT "FunctionalGroupRelation_functionalGroupId_fkey" FOREIGN KEY ("functionalGroupId") REFERENCES "FunctionalGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
