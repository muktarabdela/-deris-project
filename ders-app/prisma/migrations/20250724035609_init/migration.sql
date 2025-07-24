/*
  Warnings:

  - You are about to drop the `audio_parts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ders` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `progress` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `quiz_questions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `quizzes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "DersStatus" AS ENUM ('IN_PROGRESS', 'COMPLETED');

-- DropForeignKey
ALTER TABLE "audio_parts" DROP CONSTRAINT "audio_parts_dersId_fkey";

-- DropForeignKey
ALTER TABLE "progress" DROP CONSTRAINT "progress_audioPartId_fkey";

-- DropForeignKey
ALTER TABLE "progress" DROP CONSTRAINT "progress_dersId_fkey";

-- DropForeignKey
ALTER TABLE "progress" DROP CONSTRAINT "progress_userId_fkey";

-- DropForeignKey
ALTER TABLE "quiz_questions" DROP CONSTRAINT "quiz_questions_quizId_fkey";

-- DropForeignKey
ALTER TABLE "quizzes" DROP CONSTRAINT "quizzes_audioPartId_fkey";

-- DropTable
DROP TABLE "audio_parts";

-- DropTable
DROP TABLE "ders";

-- DropTable
DROP TABLE "progress";

-- DropTable
DROP TABLE "quiz_questions";

-- DropTable
DROP TABLE "quizzes";

-- DropTable
DROP TABLE "users";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "telegram_user_id" BIGINT NOT NULL,
    "first_name" TEXT NOT NULL,
    "username" TEXT,
    "profile_picture_url" TEXT,
    "role" "Role" NOT NULL DEFAULT 'STUDENT',
    "points" INTEGER NOT NULL DEFAULT 0,
    "current_ders_id" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ustadh" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "bio" TEXT,
    "photo_url" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ustadh_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ders" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "thumbnail_url" TEXT,
    "book_pdf_url" TEXT,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "ustadh_id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AudioPart" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "telegram_message_link" TEXT NOT NULL,
    "telegram_file_id" TEXT,
    "duration_in_seconds" INTEGER,
    "order" INTEGER NOT NULL,
    "ders_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AudioPart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quiz" (
    "id" TEXT NOT NULL,
    "audio_part_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Quiz_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuizQuestion" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "options" TEXT[],
    "correct_answer" TEXT NOT NULL,
    "explanation" TEXT,
    "quiz_id" TEXT NOT NULL,

    CONSTRAINT "QuizQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserDersProgress" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "ders_id" TEXT NOT NULL,
    "status" "DersStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),

    CONSTRAINT "UserDersProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAudioPartProgress" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "audio_part_id" TEXT NOT NULL,
    "quiz_score" INTEGER,
    "quiz_attempts" INTEGER NOT NULL DEFAULT 0,
    "is_completed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "UserAudioPartProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bookmark" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "audio_part_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Bookmark_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_telegram_user_id_key" ON "User"("telegram_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Ustadh_name_key" ON "Ustadh"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Quiz_audio_part_id_key" ON "Quiz"("audio_part_id");

-- CreateIndex
CREATE UNIQUE INDEX "UserDersProgress_user_id_ders_id_key" ON "UserDersProgress"("user_id", "ders_id");

-- CreateIndex
CREATE UNIQUE INDEX "UserAudioPartProgress_user_id_audio_part_id_key" ON "UserAudioPartProgress"("user_id", "audio_part_id");

-- CreateIndex
CREATE UNIQUE INDEX "Bookmark_user_id_audio_part_id_key" ON "Bookmark"("user_id", "audio_part_id");

-- AddForeignKey
ALTER TABLE "Ders" ADD CONSTRAINT "Ders_ustadh_id_fkey" FOREIGN KEY ("ustadh_id") REFERENCES "Ustadh"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ders" ADD CONSTRAINT "Ders_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AudioPart" ADD CONSTRAINT "AudioPart_ders_id_fkey" FOREIGN KEY ("ders_id") REFERENCES "Ders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_audio_part_id_fkey" FOREIGN KEY ("audio_part_id") REFERENCES "AudioPart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizQuestion" ADD CONSTRAINT "QuizQuestion_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "Quiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDersProgress" ADD CONSTRAINT "UserDersProgress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDersProgress" ADD CONSTRAINT "UserDersProgress_ders_id_fkey" FOREIGN KEY ("ders_id") REFERENCES "Ders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAudioPartProgress" ADD CONSTRAINT "UserAudioPartProgress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAudioPartProgress" ADD CONSTRAINT "UserAudioPartProgress_audio_part_id_fkey" FOREIGN KEY ("audio_part_id") REFERENCES "AudioPart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bookmark" ADD CONSTRAINT "Bookmark_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bookmark" ADD CONSTRAINT "Bookmark_audio_part_id_fkey" FOREIGN KEY ("audio_part_id") REFERENCES "AudioPart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
