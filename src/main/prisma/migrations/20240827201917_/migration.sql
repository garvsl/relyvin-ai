-- CreateTable
CREATE TABLE "Username" (
    "id" TEXT NOT NULL,
    "handle" TEXT NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Username_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Username_handle_key" ON "Username"("handle");
