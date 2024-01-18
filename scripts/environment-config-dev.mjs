#!/usr/bin/env node

import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import webpush from "web-push";

const vapidKeys = webpush.generateVAPIDKeys();

const EnvVariables = {
  DATABASE_URL:
    "mongodb://root:example@localhost:27017/ygt-db?authSource=admin&directConnection=true",
  NEXTAUTH_URL: "http://localhost:3000",
  GOOGLE_CLIENT_ID: "<GOOGLE_CLIENT_ID>",
  GOOGLE_CLIENT_SECRET: "<GOOGLE_CLIENT_SECRET>",
  AWS__ACCESS_KEY_ID: "",
  AWS__ACCESS_KEY_SECRET: "",
  AWS__BUCKET_NAME: "ygt-dev-media-bucket",
  AWS__BUCKET_REGION: "eu-central-1",
  NEXT_PUBLIC_VAPID_KEY: vapidKeys.publicKey,
  PRIVATE_VAPID_KEY: vapidKeys.privateKey,
  EMAIL_SERVER: "smtp://localhost:1025",
  EMAIL_FROM: "noreply@example.com",
};

function createEnvFileForYGTApp(googleClientId = "", googleClientSecret = "") {
  const envContent = Object.entries(EnvVariables)
    .map(([key, value]) => `${key}="${value}"`)
    .join("\n")
    .replace("<GOOGLE_CLIENT_ID>", googleClientId)
    .replace("<GOOGLE_CLIENT_SECRET>", googleClientSecret);

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  try {
    const destinationPath = path.join(__dirname, "../", ".env");
    fs.writeFileSync(destinationPath, envContent);

    console.log(".env file for YGT created successfully.");
  } catch (error) {
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
  .help()
  .parseSync();

createEnvFileForYGTApp(argv.GOOGLE_CLIENT_ID, argv.GOOGLE_CLIENT_SECRET);
