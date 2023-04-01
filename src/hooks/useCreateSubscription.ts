import { useSession } from "next-auth/react"
import { useEffect } from "react"

import { env } from "../env/client.mjs"
import { api } from "../utils/api"

async function createNotificationSubscription() {
  const existingSub = await getExistingSubscription();

  if (existingSub) {
    return existingSub;
  }

  const serviceWorker = await navigator.serviceWorker.ready;

  return await serviceWorker.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: env.NEXT_PUBLIC_VAPID_KEY,
  });
}

async function getExistingSubscription(): Promise<PushSubscription | null> {
  const serviceWorker = await navigator.serviceWorker.ready;
  return serviceWorker.pushManager.getSubscription();
}

const isSupported = () =>
  "Notification" in window && "serviceWorker" in navigator && "PushManager" in window;

export const useCreateSubscription = (
  options: { autoSub?: boolean } = { autoSub: true }
) => {
  const { status } = useSession();
  const subscribe = api.notification.subscribe.useMutation();

  useEffect(() => {
    if (options.autoSub) {
      triggerSubscription();
    }
  }, [options.autoSub]);

  const triggerSubscription = () => {
    if (status !== "authenticated") {
      console.log("triggerSubscription: Not authenticated");
      return;
    }

    if (window && isSupported()) {
      Notification.requestPermission().then(() => {
        createNotificationSubscription()
          .then((s) => {
            subscribe.mutateAsync(s as any);
          })
          .catch((err) => console.error(err));
      });
    } else {
      console.log("triggerSubscription: Web Push API not supported.");
    }
  };

  return { triggerSubscription };
};
