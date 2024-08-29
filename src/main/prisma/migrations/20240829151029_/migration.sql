-- CreateTable
CREATE TABLE "Scraper" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "cookie" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Scraper_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Scraper_userId_key" ON "Scraper"("userId");

-- AddForeignKey
ALTER TABLE "Scraper" ADD CONSTRAINT "Scraper_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
