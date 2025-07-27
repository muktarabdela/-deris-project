-- CreateEnum
CREATE TYPE "Role" AS ENUM ('STUDENT', 'ADMIN');

-- CreateEnum
CREATE TYPE "DersStatus" AS ENUM ('IN_PROGRESS', 'COMPLETED');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "telegram_user_id" BIGINT NOT NULL,
    "first_name" TEXT NOT NULL,
    "username" TEXT,
    "profile_picture_url" TEXT,
    "role" "Role" NOT NULL DEFAULT 'STUDENT',
    "points" INTEGER NOT NULL DEFAULT 0,
    "current_ders_id" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ustadhs" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "bio" TEXT,
    "photo_url" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ustadhs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "derses" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "thumbnail_url" TEXT,
    "book_pdf_url" TEXT,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "ustadh_id" UUID NOT NULL,
    "category_id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "derses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audio_parts" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "telegram_message_link" TEXT NOT NULL,
    "telegram_file_id" TEXT,
    "duration_in_seconds" INTEGER,
    "order" INTEGER NOT NULL,
    "ders_id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "audio_parts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quizzes" (
    "id" UUID NOT NULL,
    "audio_part_id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quizzes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz_questions" (
    "id" UUID NOT NULL,
    "question" TEXT NOT NULL,
    "options" TEXT[],
    "correct_answer" TEXT NOT NULL,
    "explanation" TEXT,
    "quiz_id" UUID NOT NULL,

    CONSTRAINT "quiz_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_ders_progress" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "ders_id" UUID NOT NULL,
    "status" "DersStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),

    CONSTRAINT "user_ders_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_audio_part_progress" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "audio_part_id" UUID NOT NULL,
    "quiz_score" INTEGER,
    "quiz_attempts" INTEGER NOT NULL DEFAULT 0,
    "is_completed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "user_audio_part_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bookmarks" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "audio_part_id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bookmarks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_telegram_user_id_key" ON "users"("telegram_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "ustadhs_name_key" ON "ustadhs"("name");

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "quizzes_audio_part_id_key" ON "quizzes"("audio_part_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_ders_progress_user_id_ders_id_key" ON "user_ders_progress"("user_id", "ders_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_audio_part_progress_user_id_audio_part_id_key" ON "user_audio_part_progress"("user_id", "audio_part_id");

-- CreateIndex
CREATE UNIQUE INDEX "bookmarks_user_id_audio_part_id_key" ON "bookmarks"("user_id", "audio_part_id");

-- AddForeignKey
ALTER TABLE "derses" ADD CONSTRAINT "derses_ustadh_id_fkey" FOREIGN KEY ("ustadh_id") REFERENCES "ustadhs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "derses" ADD CONSTRAINT "derses_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audio_parts" ADD CONSTRAINT "audio_parts_ders_id_fkey" FOREIGN KEY ("ders_id") REFERENCES "derses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quizzes" ADD CONSTRAINT "quizzes_audio_part_id_fkey" FOREIGN KEY ("audio_part_id") REFERENCES "audio_parts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_questions" ADD CONSTRAINT "quiz_questions_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "quizzes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_ders_progress" ADD CONSTRAINT "user_ders_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_ders_progress" ADD CONSTRAINT "user_ders_progress_ders_id_fkey" FOREIGN KEY ("ders_id") REFERENCES "derses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_audio_part_progress" ADD CONSTRAINT "user_audio_part_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_audio_part_progress" ADD CONSTRAINT "user_audio_part_progress_audio_part_id_fkey" FOREIGN KEY ("audio_part_id") REFERENCES "audio_parts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_audio_part_id_fkey" FOREIGN KEY ("audio_part_id") REFERENCES "audio_parts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
