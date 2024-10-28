import { PrismaClient } from "@prisma/client"
import webpush from "../helpers/webPush.js"
import { sendEmailService } from "../helpers/sendMail.js"

const prisma = new PrismaClient()

export const messageFormated = (
	username: string,
	message: string,
	message2?: string
) => {
	return message2
		? `${username} ${message} ${message2}`
		: `${username} ${message}`
}

interface pushNotificationProps {
	idUser: string
	idUserSend: string
	username: string
	email: string
	message: string
	title: string
	link: string
	subscription: string
	message2?: string
	sendPush: boolean
	sendEmail: boolean
}
export const pushNotification = async ({
	idUser,
	idUserSend,
	title,
	username,
	email,
	message,
	link,
	subscription,
	message2,
	sendPush,
	sendEmail,
}: pushNotificationProps) => {
	const text = messageFormated(username, message, message2)

	const notification = await prisma.notification.create({
		data: {
			idUser,
			idUserSend,
			message: text,
			link
		}
	})

	if (subscription === "") return

	const pushSubscription = JSON.parse(subscription)
	const payload = JSON.stringify({
		title,
		message: notification.message,
		url: `${process.env.FRONTEND_URL}${notification.link}`
	})

	try {
		if (sendPush) {
			await webpush.sendNotification(pushSubscription, payload)
		}
		if (sendEmail) {
			await sendEmailService({
				to: email,
				subject: title,
				text: notification.message,
				link: `${process.env.FRONTEND_URL}${notification.link}`
			})
		}
		return
	} catch (error) {
		if (error.statusCode === 410 || error.statusCode === 404) {
			console.error(
				"Suscripción caducada o inválida, eliminando de la base de datos..."
			)

			await prisma.user.update({
				where: { id: idUser },
				data: { subscriptionWP: "" }
			})
		} else {
			console.error("Error al enviar la notificación:", error)
		}
	}
}

export const generateRandomCode = (longitud: number = 8): string => {
	const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let codigo = '';

	for (let i = 0; i < longitud; i++) {
			const indiceAleatorio = Math.floor(Math.random() * caracteres.length);
			codigo += caracteres.charAt(indiceAleatorio);
	}

	return codigo;
}