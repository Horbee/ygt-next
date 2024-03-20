console.log("Listener Loaded...");

self.addEventListener("push", (e) => {
  const data = e.data.json();
  console.log("Push Recieved...");
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: "https://ygt-next.vercel.app/logo192.png",
    data: { url: data.url },
  });
});

self.addEventListener("notificationclick", (e) => {
  const data = e.notification.data;

  const urlToOpen = new URL(data.url, self.location.origin).href;

  const promiseChain = clients
    .matchAll({
      type: "window",
      includeUncontrolled: true,
    })
    .then((windowClients) => {
      let matchingClient = null;

      for (let i = 0; i < windowClients.length; i++) {
        const windowClient = windowClients[i];
        const wUrl = new URL(windowClient.url);
        // Find already opened YGT window, focus and navigate
        if (wUrl.origin === self.location.origin) {
          matchingClient = windowClient;
          break;
        }
      }

      if (matchingClient && "navigate" in matchingClient) {
        matchingClient.focus().then(() => matchingClient.navigate(urlToOpen));
      } else {
        return clients.openWindow(urlToOpen);
      }
    });

  e.waitUntil(promiseChain);
});
