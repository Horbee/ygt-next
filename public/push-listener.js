console.log("Listener Loaded...");

self.addEventListener("push", (e) => {
  const data = e.data.json();
  console.log("Push Recieved...");
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: "https://ygt-next.vercel.app/logo192.png",
  });
});

self.addEventListener("notificationclick", (e) => {
  const data = e.data.json();
  console.log("Noti Click", data, e);
});
