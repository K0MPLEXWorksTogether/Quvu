-- CreateEnum
CREATE TYPE "User" AS ENUM ('teacher', 'student');

-- CreateTable
CREATE TABLE "Mail" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "for" "User" NOT NULL,

    CONSTRAINT "Mail_pkey" PRIMARY KEY ("id")
);
