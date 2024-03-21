import { PrismaClient } from "@ygt/db";

const prisma = new PrismaClient({
  log: ["query", "error", "warn"],
});

export function deleteTestUserByEmail(email: string) {
  return prisma.user.delete({ where: { email } });
}

export function createTestUserByName(name: string) {
  return prisma.user.create({ data: { email: `${name}@test.com`, name } });
}
