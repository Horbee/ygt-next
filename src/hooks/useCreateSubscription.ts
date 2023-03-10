import { useEffect } from "react";

import { env } from "../env/client.mjs";
import { api } from "../utils/api";

async function createNotificationSubscription() {
  //wait for service worker installation to be ready
  const serviceWorker = await navigator.serviceWorker.ready;
  // subscribe and return the subscription
  const existingSub = await serviceWorker.pushManager.getSubscription();

  if (existingSub) {
    return existingSub;
  }

  return await serviceWorker.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: env.NEXT_PUBLIC_VAPID_KEY,
  });
}

const isSupported = () =>
  "Notification" in window && "serviceWorker" in navigator && "PushManager" in window;

export const useCreateSubscription = () => {
  const subscribe = api.notification.subscribe.useMutation();

  useEffect(() => {
    if (window && isSupported()) {
      Notification.requestPermission().then(() => {
        createNotificationSubscription().then((s) => {
          subscribe.mutateAsync(s as any);
        });
      });
    }
  }, []);
};
