-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "totpSecret" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user'
);

-- CreateTable
CREATE TABLE "Api" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "host" TEXT NOT NULL,
    "key" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Api_host_key" ON "Api"("host");

-- CreateIndex
CREATE UNIQUE INDEX "Api_key_key" ON "Api"("key");
