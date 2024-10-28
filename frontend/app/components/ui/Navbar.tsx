"use client"
import React, { useEffect, useState } from "react"
import Button from "./Button"
import {
	BellIcon,
	BookmarksIcon,
	HomeIcon,
	LogoutIcon,
	MenuIcon,
	SearchIcon,
	SettingsIcon,
	TrendingIcon,
	UserCheck,
	UserIcon
} from "@/icons/icons"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import ButtonDarkMode from "./ButtonDarkMode"
import { signOut } from "next-auth/react"
import LogoIcon from "../icons/LogoIcon"
import { useUserStore } from "@/app/store/user"
import { useQuery } from "@apollo/client"
import { GET_NOTIFICATIONS } from "@/app/lib/graphql/notifications"
import { GetNotifications, Notification as NotificationType, Notifications} from "@/app/lib/types/typesGraphql"
import Notification from "./Notification"

function Navbar() {
	const [mainActive, setMainActive] = useState(false)
	const [notifyOpen, setNotifyOpen] = useState(false)
	const idUser = useUserStore(state => state.user.id)
	const pathname = usePathname()
	const router = useRouter()

	const [notifications, setNotifications] = useState<NotificationType[]>([])
	const [unread, setUnread] = useState(0)
	const [cursor, setCursor] = useState('')
	const [hasMore, setHasMore] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)

	const { data, loading, error, fetchMore} = useQuery<GetNotifications>(GET_NOTIFICATIONS, {
		variables: { idUser },
		fetchPolicy: "network-only"
	})

	const handleState = (state: NotificationType[], unread: number) => {
		setNotifications(state)
		setUnread(unread)
	}

	useEffect(() => {
		if (data) {
      setNotifications(data.getNotifications.notifications)
      setUnread(data.getNotifications.unread)
			setCursor(data.getNotifications.cursor)
			setHasMore(data.getNotifications.hasMore)
		}
	}, [data])

	const moreData = async () => {
		setLoadingMore(true)
		const res = await fetchMore({
			variables: {
				cursor,
				take: 5
			}
		})
		
		if (res.data.getNotifications) {
			setNotifications(prev => prev.concat(res.data.getNotifications.notifications))
			setCursor(res.data.getNotifications.cursor)
			setHasMore(res.data.getNotifications.hasMore)
		}
		setLoadingMore(false)
	}
	

	const widthCondition = notifyOpen ? "w-auto h-11" : "w-full"
	const notifyClasses = `mx-0 px-3 ${
		notifyOpen
			? "w-auto h-11 bg-lima-400/30 dark:bg-biscay-950 hover:bg-lima-400/50 dark:hover:bg-biscay-900"
			: "w-full hover:bg-lima-400/30 dark:hover:bg-biscay-900"
	}`
	const mainHandle = () => {
		setMainActive(!mainActive)
	}
	const notifyHandle = () => {
		setNotifyOpen(!notifyOpen)
	}
	const handleClickOutsideMain: EventListener = event => {
		const menu = document.getElementById("main")
		if (mainActive && menu && !menu.contains(event.target as Node)) {
			setMainActive(false)
		}
	}
	const handleClickOutsideNotify: EventListener = event => {
		const notify = document.getElementById("notify")
		if (notifyOpen && notify && !notify.contains(event.target as Node)) {
			setNotifyOpen(false)
		}
	}

	const logout = async () => {
		const data = await signOut({redirect: false, callbackUrl: '/login'})
		router.push(data.url)
	}

	useEffect(() => {
		document.addEventListener("click", handleClickOutsideMain)
		document.addEventListener("click", handleClickOutsideNotify)

		return () => {
			document.removeEventListener("click", handleClickOutsideMain)
			document.removeEventListener("click", handleClickOutsideNotify)
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [mainActive, notifyOpen, notifications, hasMore, loadingMore])

	return (
		<section className={`fixed flex gap-5 bg-seagreen-900 dark:border-r dark:border-white/40 dark:bg-transparent ${pathname === `/home/profile/${idUser}/settings` ? 'hidden' : ''}`}>
			<div
				className={`h-screen ${
					notifyOpen ? "border-r border-white/40 mr-5" : "min-w-52"
				} flex-grow flex flex-col items-start size justify-between px-3 py-2`}
			>
				<Link href={"/home"}>
					<Button
						size='lg'
						className={`mx-0 px-3 ${widthCondition}`}
						startContent={<LogoIcon className="size-6"/>}
					>
						{!notifyOpen && "UVM Dev House"}
					</Button>
				</Link>
				<nav className={`w-full`}>
					<ul className='flex flex-col gap-4 relative'>
						<li>
							<Link href={"/home"}>
								<Button
									size='lg'
									className={`mx-0 px-3 ${widthCondition} hover:bg-lima-400/30 dark:hover:bg-biscay-900 ${
										pathname == "/home"
											? "bg-lima-400/30 dark:bg-biscay-950 hover:bg-lima-400/50 dark:hover:bg-biscay-900"
											: ""
									}`}
									startContent={<HomeIcon />}
								>
									{!notifyOpen && "Para ti"}
								</Button>
							</Link>
						</li>
						<li>
							<Link href={"/home/followers"}>
								<Button
									size='lg'
									className={`mx-0 px-3 ${widthCondition} hover:bg-lima-400/30 dark:hover:bg-biscay-900 ${
										pathname == "/home/followers"
											? "bg-lima-400/30 dark:bg-biscay-950 hover:bg-lima-400/50 dark:hover:bg-biscay-900"
											: ""
									}`}
									startContent={<UserCheck />}
								>
									{!notifyOpen && "Siguiendo"}
								</Button>
							</Link>
						</li>
						<li>
							<Link href={"/home/populates"}>
								<Button
									size='lg'
									className={`mx-0 px-3 ${widthCondition} hover:bg-lima-400/30 dark:hover:bg-biscay-900 ${
										pathname == "/home?page=trending"
											? "bg-lima-400/30 hover:bg-lima-400/50 dark:hover:bg-biscay-900"
											: ""
									}`}
									startContent={<TrendingIcon />}
								>
									{!notifyOpen && "Populares"}
								</Button>
							</Link>
						</li>
						<li>
							<Link href={"/home/search"}>
								<Button
									size='lg'
									className={`mx-0 px-3 ${widthCondition} hover:bg-lima-400/30 dark:hover:bg-biscay-900 ${
										pathname == "/home/search"
											? "bg-lima-400/30 dark:bg-biscay-950 hover:bg-lima-400/50 dark:hover:bg-biscay-900"
											: ""
									}`}
									startContent={<SearchIcon />}
								>
										{!notifyOpen && "Buscar"}
								</Button>
							</Link>
						</li>
						<li className="relative">
							<Button
								size='lg'
								onClick={notifyHandle}
								className={notifyClasses}
								startContent={<BellIcon />}
							>
								{!notifyOpen && "Notificaciones"}
							</Button>
							{notifications && unread >= 1 && (
								<p className="absolute top-0 right-0 px-2 py-1 rounded-full bg-lima-500 text-xs">{unread}</p>
							)}
						</li>
						<li>
							<Link href={`/home/profile/${idUser}`}>
								<Button
									size='lg'
									className={`mx-0 px-3 ${widthCondition} hover:bg-lima-400/30 dark:hover:bg-biscay-900 ${
										pathname == `/home/profile/${idUser}`
											? "bg-lima-400/30 dark:bg-biscay-950 hover:bg-lima-400/50 dark:hover:bg-biscay-900"
											: ""
									}`}
									startContent={<UserIcon />}
								>
									{!notifyOpen && "Perfil"}
								</Button>
							</Link>
						</li>
					</ul>
				</nav>
				<div className={`w-full`}>
					{mainActive && (
						<div
							className='absolute bottom-16 z-30 w-[12rem] py-3 bg-seagreen-900 dark:bg-storm-900 shadow-medium dark:shadow-none rounded-xl'
							id='main'
						>
							<ul className='flex flex-col gap-3'>
								<li>
									<Link href={`/home/profile/${idUser}/settings`}>
										<Button
											size='lg'
											className='mx-0 px-3 w-full hover:bg-lima-400/30 dark:hover:bg-biscay-900'
											shape='none'
											startContent={<SettingsIcon />}
											onClick={mainHandle}
											>
											Configuraciones
										</Button>
									</Link>
								</li>
								<li>
									<Link
										href={`/home/profile/${idUser}?filter=postsSaved`}
										className='w-full text-start'
									>
										<Button
											size='lg'
											className='mx-0 px-3 w-full hover:bg-lima-400/30 dark:hover:bg-biscay-900'
											shape='none'
											startContent={<BookmarksIcon />}
											onClick={mainHandle}
										>
											Guardados
										</Button>
									</Link>
								</li>
								<li>
									<ButtonDarkMode />
								</li>
								<li>
									<Button
										size='lg'
										className='mx-0 px-3 w-full hover:bg-lima-400/30 dark:hover:bg-biscay-900'
										shape='none'
										startContent={<LogoutIcon />}
										onClick={logout}
									>
										Salir
									</Button>
								</li>
							</ul>
						</div>
					)}
					<Button
						size='lg'
						onClick={mainHandle}
						className={`mx-0 px-3 ${widthCondition} hover:bg-lima-400/30 dark:hover:bg-biscay-900 ${
							mainActive
								? "bg-lima-400/30 dark:bg-biscay-950 hover:bg-lima-400/50 dark:hover:bg-biscay-900"
								: ""
						}`}
						startContent={<MenuIcon />}
					>
						{!notifyOpen && (mainActive ? "Menos" : "Mas")}
					</Button>
				</div>
			</div>
			{notifyOpen && (
				<div
					className='absolute left-full w-[300px] h-screen bg-seagreen-900 dark:bg-storm-950  text-storm-100 py-2 pr-4 flex flex-col gap-3 border-r border-white/40 overflow-auto scrollbar-thin'
					id='notify'
				>
					<h3 className='text-lg font-semibold border-b-[1px]'>Notificaciones</h3>
					{notifications.map(notification => (
						<Notification key={notification.id} notification={notification} state={notifications} handleState={handleState} unread={unread}/>
					))}
					{loadingMore && <p className="py-2">Cargando más...</p>}
					{(!loadingMore && notifications.length >= 1 && hasMore) && (
						<Button
							className='px-3 justify-center'
							variant="flat"
							onClick={() => moreData()}
						>
							Cargar mas notificaciones
						</Button>
					)}
				</div>
			)}
		</section>
	)
}

export default Navbar
