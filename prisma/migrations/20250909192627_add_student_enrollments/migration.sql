-- CreateTable
CREATE TABLE "public"."_StudentEnrollments" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_StudentEnrollments_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_StudentEnrollments_B_index" ON "public"."_StudentEnrollments"("B");

-- AddForeignKey
ALTER TABLE "public"."_StudentEnrollments" ADD CONSTRAINT "_StudentEnrollments_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_StudentEnrollments" ADD CONSTRAINT "_StudentEnrollments_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
