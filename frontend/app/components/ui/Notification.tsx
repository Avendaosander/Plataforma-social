import { getTimeElapsed } from "@/app/lib/logic"
import { DeleteNotification, DeleteNotificationVariables, Notifications, PutNotification, PutNotificationVariables, type Notification } from "@/app/lib/types/typesGraphql"
import Image from "next/image"
import Link from "next/link"
import React, { MouseEvent, useState } from "react"
import {DotsIcon} from "../icons/icons"
import { useMutation } from "@apollo/client"
import { DELETE_NOTIFICATION, PUT_NOTIFICATION } from "@/app/lib/graphql/notifications"
import Button from "./Button"
import { toastCustom } from "./toasts"

interface NotificationsProps {
  notification: Notification
	state: Notification[]
	unread: number
	handleState: (state: Notification[], unread: number) => void
}

function Notification({notification, state, unread, handleState}: NotificationsProps) {
	const [more, setMore] = useState(false)
	const [putNotification, {error:errorPut , reset: resetPut}] = useMutation<PutNotification,PutNotificationVariables>(PUT_NOTIFICATION)
	const [deleteNotification, {error:errorDelete , reset: resetDelete}] = useMutation<DeleteNotification, DeleteNotificationVariables>(DELETE_NOTIFICATION)

	const changeRead = async (read: boolean) => {
		const newNotifications = state.map(item =>
			item.id === notification.id
				? {...item, read}
				: item
		)
		const newCount = read ? unread - 1 : unread + 1

		handleState(newNotifications, newCount)

		resetPut()
		const res = await putNotification({
			variables: {
				putNotificationId: notification.id,
				read
			}
		})
	}

	if (errorPut) {
		toastCustom({text: 'Hubo un error al modificar la notificacion', variant:"error", duration:2000})
	}

	const deleteOne = async () => {
		const newNotifications = state.filter(item => item.id != notification.id)
		const newCount = notification.read ? unread : unread - 1
		
		handleState(newNotifications, newCount)

		resetDelete()
		const res = await deleteNotification({
			variables: {
				deleteNotificationId: notification.id,
			}
		})
	}

	if (errorDelete) {
		toastCustom({text: 'Hubo un error al eliminar la notificacion', variant:"error", duration:2000})
	}

	const changeMore = (e:MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		e.stopPropagation()
		setMore(!more)
	} 

	return (
		<Link href={`${process.env.NEXT_PUBLIC_URL}${notification.link}`} onClick={() => {
			if (!notification.read) {
				changeRead(!notification.read)
			}
		}}>
			<div
				className={`relative flex gap-2 items-center hover:bg-storm-100/20 px-3 py-1 rounded-lg leading-5  ${
					!notification.read && "bg-storm-100/10"
				}`}
			>
				<Image
					src={notification.userSend.avatar ?
						`${process.env.NEXT_PUBLIC_API_ROUTE_AVATAR}${notification.userSend.avatar}` :
						"/User.png"
					}
					alt={notification.userSend.username}
					width={36}
					height={36}
					className='rounded-full aspect-square size-9'
				/>
				<div>
					<p className='font-light pr-2'>
						<span className='font-semibold'>
							{notification.message.split(" ")[0]}{" "}
						</span>
						{notification.message
							.split(" ")
							.filter((msg, i) => i != 0)
							.join(" ")}
					</p>
					<span className='text-xs font-light'>
						{getTimeElapsed(notification.createdAt)}
					</span>
				</div>
				<div className="absolute top-1 right-1">
					{more && (
						<div className="absolute top-full right-0 rounded-lg bg-seagreen-900 dark:bg-storm-900 p-1 z-10">
							<Button color="primary" size="sm" className="py-1 px-2 w-full" onClick={e => {
								e.preventDefault()
								e.stopPropagation()
								deleteOne()
							}}>Eliminar</Button>
							<Button color="primary" size="sm" className="py-1 px-2 text-nowrap" onClick={e => {
								e.preventDefault()
								e.stopPropagation()
								changeRead(!notification.read)
							}}>
								{notification.read ? 'Marcar no leido' : 'Marcar leido'}
							</Button>
						</div>
					)}
					<button onClick={changeMore} className={`text-storm-100 size-4 ${more && 'bg-storm-100/20 block'} rounded-full`}>
						<DotsIcon className={`size-4`}/>
					</button>
				</div>
			</div>
		</Link>
	)
}

export default Notification
