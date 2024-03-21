import { toast } from "react-toastify";
import { env } from "../env/client.mjs";
import { api } from "../utils/api";
import { useEffect, useState } from "react";

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

export const useCreateSubscription = () => {
  const [subscriptionFound, setSubscriptionFound] = useState(false);
  const subscribe = api.notification.subscribe.useMutation();

  const triggerSubscription = async ({
    showFeedback,
  }: { showFeedback?: boolean } = {}) => {
    if (!window || !isSupported()) {
      console.log("triggerSubscription: Web Push API not supported.");
      return;
    }

    if (Notification.permission === "denied") {
      if (showFeedback)
        toast.warning("Enable notification permissions at the browser level");
      return;
    }

    try {
      await Notification.requestPermission();
      const pushSubscription = await createNotificationSubscription();
      await subscribe.mutateAsync(pushSubscription as any);
      setSubscriptionFound(true);

      if (showFeedback) toast.success("Push subscription saved!");
    } catch (error) {
      console.error("Subscription failed.", error);
      setSubscriptionFound(false);
      if (showFeedback) toast.error("Push subscription failed!");
    }
  };

  useEffect(() => {
    getExistingSubscription().then((sub) => setSubscriptionFound(Boolean(sub)));
  }, []);

  return { triggerSubscription, subscriptionFound };
};
