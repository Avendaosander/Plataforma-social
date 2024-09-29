self.addEventListener("push", event => {
	const data = event.data.json()

	self.registration.showNotification(data.title, {
		body: data.message,
		icon: "/Logo/main-logo.png",
    data: { data: data.url },
	})
})

self.addEventListener("notificationclick", event => {
	event.notification.close()
	event.waitUntil(clients.openWindow(event.notification.data.url))
})
