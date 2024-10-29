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

	const { data, loading, error, fetchMore, refetch} = useQuery<GetNotifications>(GET_NOTIFICATIONS, {
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
	

	const widthCondition = notifyOpen ? "w-auto lg:h-11" : "w-auto md:w-full"
	const notifyClasses = `mx-0 p-1.5 md:p-2 lg:px-3 ${
		notifyOpen
			? "w-auto lg:h-11 bg-lima-400/30 dark:bg-biscay-950 hover:bg-lima-400/50 dark:hover:bg-biscay-900"
			: "w-auto md:w-full hover:bg-lima-400/30 dark:hover:bg-biscay-900"
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

	useEffect(() => {
		if ('serviceWorker' in navigator) {
			navigator.serviceWorker.addEventListener('message', (event) => {
				if (event.data && event.data.type === 'NEW_NOTIFICATION') {
					refetch()
				}
			});
		}
	}, []);

	return (
		<section className={`fixed bottom-0 w-full md:w-auto flex gap-5 bg-seagreen-900 dark:border-t lg:dark:border-r  dark:border-white/40 dark:bg-storm-950 ${pathname === `/home/profile/${idUser}/settings` ? 'hidden' : ''} z-10`}>
			<div
				className={`h-11 md:h-screen w-full lg:w-auto ${
					notifyOpen ? "border-t md:border-t-0 md:border-r border-white/40 md:mr-5" : "lg:min-w-52"
				} flex-grow flex flex-row md:flex-col items-start size justify-center md:justify-between px-3 py-2 gap-1`}
			>
				<Link href={"/home"} className="hidden md:block">
					<Button
						size='lg'
						className={`mx-0 p-1.5 md:p-2 lg:px-3 ${widthCondition}`}
						startContent={<LogoIcon className="size-6"/>}
					>
						{!notifyOpen && (
							<p className="hidden lg:block">
								UVM Dev House
							</p>
						)}
					</Button>
				</Link>
				<nav className={`lg:w-full`}>
					<ul className='flex flex-row md:flex-col gap-1 md:gap-4 relative w-full'>
						<li>
							<Link href={"/home"}>
								<Button
									size='lg'
									className={`mx-0 p-1.5 md:p-2 lg:px-3 ${widthCondition} hover:bg-lima-400/30 dark:hover:bg-biscay-900 ${
										pathname == "/home"
											? "bg-lima-400/30 dark:bg-biscay-950 hover:bg-lima-400/50 dark:hover:bg-biscay-900"
											: ""
									}`}
									startContent={<HomeIcon className="size-4 md:size-5" />}
								>
									{!notifyOpen && (
										<p className="hidden lg:block">
											Para ti
										</p>
									)}
								</Button>
							</Link>
						</li>
						<li className="hidden md:block">
							<Link href={"/home/followers"}>
								<Button
									size='lg'
									className={`mx-0 p-1.5 md:p-2 lg:px-3 ${widthCondition} hover:bg-lima-400/30 dark:hover:bg-biscay-900 ${
										pathname == "/home/followers"
											? "bg-lima-400/30 dark:bg-biscay-950 hover:bg-lima-400/50 dark:hover:bg-biscay-900"
											: ""
									}`}
									startContent={<UserCheck className="size-4 md:size-5" />}
								>
									{!notifyOpen && (
										<p className="hidden lg:block">
											Siguiendo
										</p>
									)}
								</Button>
							</Link>
						</li>
						<li className="hidden md:block">
							<Link href={"/home/populates"}>
								<Button
									size='lg'
									className={`mx-0 p-1.5 md:p-2 lg:px-3 ${widthCondition} hover:bg-lima-400/30 dark:hover:bg-biscay-900 ${
										pathname == "/home?page=trending"
											? "bg-lima-400/30 hover:bg-lima-400/50 dark:hover:bg-biscay-900"
											: ""
									}`}
									startContent={<TrendingIcon className="size-4 md:size-5" />}
								>
									{!notifyOpen && (
										<p className="hidden lg:block">
											Populares
										</p>
									)}
								</Button>
							</Link>
						</li>
						<li>
							<Link href={"/home/search"}>
								<Button
									size='lg'
									className={`mx-0 p-1.5 md:p-2 lg:px-3 ${widthCondition} hover:bg-lima-400/30 dark:hover:bg-biscay-900 ${
										pathname == "/home/search"
											? "bg-lima-400/30 dark:bg-biscay-950 hover:bg-lima-400/50 dark:hover:bg-biscay-900"
											: ""
									}`}
									startContent={<SearchIcon className="size-4 md:size-5" />}
								>
									{!notifyOpen && (
										<p className="hidden lg:block">
											Buscar
										</p>
									)}
								</Button>
							</Link>
						</li>
						<li>
							<Button
								size='lg'
								onClick={notifyHandle}
								className={notifyClasses}
								startContent={
									<div className="relative inline-block">
										<BellIcon className={`size-4 md:size-5 ${unread >= 1 && 'text-lima-500'}`}/>
										{unread >= 1 && (
											<span className="absolute top-0 right-0 w-1 h-1 md:w-2 md:h-2 bg-lima-500 rounded-full ring-1 ring-white"></span>
										)}
									</div>
								}
							>
								{!notifyOpen && (
									<p className={`hidden lg:block ${unread >= 1 && 'text-lima-500'}`}>
										Notificaciones
									</p>
								)}
							</Button>
						</li>
						<li>
							<Link href={`/home/profile/${idUser}`}>
								<Button
									size='lg'
									className={`mx-0 p-1.5 md:p-2 lg:px-3 ${widthCondition} hover:bg-lima-400/30 dark:hover:bg-biscay-900 ${
										pathname == `/home/profile/${idUser}`
											? "bg-lima-400/30 dark:bg-biscay-950 hover:bg-lima-400/50 dark:hover:bg-biscay-900"
											: ""
									}`}
									startContent={<UserIcon className="size-4 md:size-5" />}
								>
									{!notifyOpen && (
										<p className="hidden lg:block">
											Perfil
										</p>
									)}
								</Button>
							</Link>
						</li>
					</ul>
				</nav>
				<div className={`relative w-auto lg:w-full`}>
					{mainActive && (
						<div
							className='absolute bottom-10 right-0 md:left-0 md:bottom-16 z-30 w-[12rem] py-3 bg-seagreen-900 dark:bg-storm-900 shadow-medium dark:shadow-none rounded-xl'
							id='main'
						>
							<ul className='flex flex-col gap-3'>
								<li>
									<Link href={`/home/profile/${idUser}/settings`}>
										<Button
											className='mx-0 px-3 text-sm md:text-lg w-full hover:bg-lima-400/30 dark:hover:bg-biscay-900'
											shape='none'
											startContent={<SettingsIcon className="size-4 md:size-5" />}
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
											className='mx-0 px-3 text-sm md:text-lg w-full hover:bg-lima-400/30 dark:hover:bg-biscay-900'
											shape='none'
											startContent={<BookmarksIcon className="size-4 md:size-5" />}
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
										className='mx-0 px-3 text-sm md:text-lg w-full hover:bg-lima-400/30 dark:hover:bg-biscay-900'
										shape='none'
										startContent={<LogoutIcon className="size-4 md:size-5" />}
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
						className={`mx-0 p-1.5 md:p-2 lg:px-3 ${widthCondition} hover:bg-lima-400/30 dark:hover:bg-biscay-900 ${
							mainActive
								? "bg-lima-400/30 dark:bg-biscay-950 hover:bg-lima-400/50 dark:hover:bg-biscay-900"
								: ""
						}`}
						startContent={<MenuIcon className="size-4 md:size-5" />}
					>
						{!notifyOpen && (
							<p className="hidden lg:block">
								{mainActive ? "Menos" : "Mas"}
							</p>
						)}
					</Button>
				</div>
			</div>
			{notifyOpen && (
				<div
					className='absolute bottom-full md:bottom-0 md:left-full w-full md:w-[300px] h-screen bg-seagreen-900 dark:bg-storm-950  text-storm-100 py-2 px-2 md:pl-0 md:pr-4 flex flex-col gap-3 md:border-r border-white/40 overflow-auto scrollbar-thin'
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
