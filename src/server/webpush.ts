import webpush from "web-push"

import { env as clientEnv } from "../env/client.mjs"
import { env as serverEnv } from "../env/server.mjs"

webpush.setVapidDetails(
  "mailto:test@test.com",
  clientEnv.NEXT_PUBLIC_VAPID_KEY,
  serverEnv.PRIVATE_VAPID_KEY
);

export const webPush = webpush;
