-- CreateTable
CREATE TABLE "titles_double_chance" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dozens" TEXT[],
    "bar_code" TEXT,
    "qr_code" TEXT,
    "chances" INTEGER NOT NULL DEFAULT 1,
    "value" DOUBLE PRECISION NOT NULL,
    "user_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "buyed_title_id" TEXT,
    "edition_id" TEXT,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "titles_double_chance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "titles_double_chance_id_key" ON "titles_double_chance"("id");

-- CreateIndex
CREATE UNIQUE INDEX "titles_double_chance_name_key" ON "titles_double_chance"("name");

-- AddForeignKey
ALTER TABLE "titles_double_chance" ADD CONSTRAINT "titles_double_chance_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "titles_double_chance" ADD CONSTRAINT "titles_double_chance_buyed_title_id_fkey" FOREIGN KEY ("buyed_title_id") REFERENCES "buyed_titles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "titles_double_chance" ADD CONSTRAINT "titles_double_chance_edition_id_fkey" FOREIGN KEY ("edition_id") REFERENCES "editions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
