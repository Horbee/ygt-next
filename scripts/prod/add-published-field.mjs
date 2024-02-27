import { PrismaClient } from "@prisma/client";

const main = async () => {
  try {
    const prisma = new PrismaClient({
      log: ["query", "error", "warn"],
    });

    const { count } = await prisma.event.updateMany({
      data: {
        published: true,
      },
    });

    console.log(`Published fields sucessfully added to ${count} events`);
    process.exit(0);
  } catch (error) {
    console.error("Error while creating published fields for events.", error);
    process.exit(1);
  }
};

main();
