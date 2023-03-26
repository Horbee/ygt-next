import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();
async function main() {
  const testUser = await prisma.user.upsert({
    where: { email: "testuser@gmail.com" },
    update: {},
    create: {
      email: "testuser@gmail.com",
      name: "Test User",
      accounts: {
        create: {
          type: "oauth",
          provider: "google",
          providerAccountId: "1234",
          access_token: "",
          expires_at: 1679784092,
          token_type: "Bearer",
          scope:
            "https://www.googleapis.com/auth/userinfo.email openid https://www.googleapis.com/auth/userinfo.profile",
          id_token: "",
        },
      },
      sessions: {
        create: {
          sessionToken: "d13d1580-51c4-428b-b800-dfb6ef8edc3c",
          expires: new Date("2023-04-24T21:41:33.982Z"),
        },
      },
    },
  });

  console.log({ testUser });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
