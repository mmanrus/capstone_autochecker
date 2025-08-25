import cron from "node-cron";
import { PrismaClient } from "@prisma/client"; // adjust path to your Prisma client

const prisma = new PrismaClient();
export function startCronJobs() {
  // Runs every minute
  cron.schedule("* * * * *", async () => {
    console.log("⏰ Checking for expired activities...");
    await prisma.subjectActivity.updateMany({
      where: {
        timeClose: { lte: new Date() },
        isClosed: false,
      },
      data: { isClosed: true },
    });
  });
}
