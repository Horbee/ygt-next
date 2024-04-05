#!/usr/bin/env -S pnpx ts-node

import { PrismaClient } from "@ygt/db";

// Script must be executed before applying new DB Schema
const main = async () => {
  try {
    const prisma = new PrismaClient({
      log: ["query", "error", "warn"],
    });

    const { count } = await prisma.availability.updateMany({
      where: { available: "good" as any },
      data: {
        available: "GOOD",
      },
    });

    const { count: count2 } = await prisma.availability.updateMany({
      where: { available: "maybe" as any },
      data: {
        available: "MAYBE",
      },
    });

    const { count: count3 } = await prisma.availability.updateMany({
      where: { available: "notgood" as any },
      data: {
        available: "NOT_GOOD",
      },
    });

    console.log(
      `Availabilities sucessfully updated, count: ${count + count2 + count3}`
    );
    process.exit(0);
  } catch (error) {
    console.error("Error while updating availabilities.", error);
    process.exit(1);
  }
};

main();
