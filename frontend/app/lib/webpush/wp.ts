const publicVapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY as string

const urlBase64ToUint8Array = (base64String: string) => {
	const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
	const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/")

	const rawData = window.atob(base64)
	const outputArray = new Uint8Array(rawData.length)

	for (let i = 0; i < rawData.length; ++i) {
		outputArray[i] = rawData.charCodeAt(i)
	}
	return outputArray
}

export const subscription = async (userId: string) => {
	const registration = await navigator.serviceWorker.register("/sw.js", {
		scope: '/'
	})
	const subscription = await registration.pushManager.subscribe({
		userVisibleOnly: true,
		applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
	})

	const body = {
		pushSubscription: subscription,
		userId
	} 

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_ROUTE_SUBSCRIPTION}`, {
		method: "POST",
		body: JSON.stringify(body),
		headers: {
			"Content-Type": "application/json",
		}
	})
}
