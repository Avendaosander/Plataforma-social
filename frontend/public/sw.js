self.addEventListener("push", event => {
	const data = event.data.json()

	self.registration.showNotification(data.title, {
		body: data.message,
		icon: "/Logo/main-logo.png",
    data: { url: data.url },
	})

	setTimeout(() => {
    self.registration.getNotifications().then(notifications => {
      notifications.forEach(notification => {
        notification.close()
      });
    });
  }, 20000)

  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({
        type: 'NEW_NOTIFICATION',
        notification: data
      });
    });
  });
})

self.addEventListener("notificationclick", event => {
	event.notification.close()
  const urlToOpen = event.notification.data.url
  event.waitUntil(clients.openWindow(urlToOpen))
})
