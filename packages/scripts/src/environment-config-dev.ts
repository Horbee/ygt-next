#!/usr/bin/env -S pnpx ts-node

import * as fs from "fs";
import * as path from "path";

import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import webpush from "web-push";

const vapidKeys = webpush.generateVAPIDKeys();

function createEnvFileForNextApp(
  googleClientId = "",
  googleClientSecret = "",
  cloudinaryCloudName = "",
  cloudinaryApiKey = "",
  cloudinaryApiSecret = ""
) {
  const EnvVariables = {
    DATABASE_URL:
      "mongodb://root:example@localhost:27017/ygt-db?authSource=admin&directConnection=true",
    NEXTAUTH_URL: "http://localhost:3000",
    GOOGLE_CLIENT_ID: googleClientId,
    GOOGLE_CLIENT_SECRET: googleClientSecret,
    CLOUDINARY_CLOUD_NAME: cloudinaryCloudName,
    NEXT_PUBLIC_CLOUDINARY_API_KEY: cloudinaryApiKey,
    CLOUDINARY_API_SECRET: cloudinaryApiSecret,
    NEXT_PUBLIC_VAPID_KEY: vapidKeys.publicKey,
    PRIVATE_VAPID_KEY: vapidKeys.privateKey,
    EMAIL_SERVER: "smtp://localhost:1025",
    EMAIL_FROM: "noreply@example.com",
  };

  const envContent = Object.entries(EnvVariables)
    .map(([key, value]) => `${key}="${value}"`)
    .join("\n");

  try {
    const destinationPath = path.join(__dirname, "../../../apps/next", ".env");
    fs.writeFileSync(destinationPath, envContent);

    console.log(".env file for @ygt/next created successfully.");
  } catch (error: any) {
    console.error("Error:", error.message);
  }
}

function createEnvFileForDb() {
  const EnvVariables = {
    DATABASE_URL:
      "mongodb://root:example@localhost:27017/ygt-db?authSource=admin&directConnection=true",
  };

  const envContent = Object.entries(EnvVariables)
    .map(([key, value]) => `${key}="${value}"`)
    .join("\n");

  try {
    const destinationPath = path.join(__dirname, "../../db", ".env");
    fs.writeFileSync(destinationPath, envContent);

    console.log(".env file for @ygt/db created successfully.");
  } catch (error: any) {
    console.error("Error:", error.message);
  }
}

const argv = yargs(hideBin(process.argv))
  .scriptName("environment-config-dev.js")
  .option("GOOGLE_CLIENT_ID", {
    describe: "ClientId for Google OAuth",
    demandOption: false,
    type: "string",
  })
  .option("GOOGLE_CLIENT_SECRET", {
    describe: "Client Secret for Google OAuth",
    demandOption: false,
    type: "string",
  })
  .option("CLOUDINARY_CLOUD_NAME", {
    describe: "Cloudinary Cloud name",
    demandOption: false,
    type: "string",
  })
  .option("CLOUDINARY_API_KEY", {
    describe: "Cloudinary public API key",
    demandOption: false,
    type: "string",
  })
  .option("CLOUDINARY_API_SECRET", {
    describe: "Cloudinary API Secret",
    demandOption: false,
    type: "string",
  })
  .help()
  .parseSync();

createEnvFileForNextApp(argv.GOOGLE_CLIENT_ID, argv.GOOGLE_CLIENT_SECRET);
createEnvFileForDb();
