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

function Navbar() {
	const [mainActive, setMainActive] = useState(false)
	const [notifyOpen, setNotifyOpen] = useState(false)
	const pathname = usePathname()
	const router = useRouter()

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
	}, [mainActive, notifyOpen])

	return (
		<section className={`fixed flex gap-5 bg-seagreen-900 dark:bg-transparent ${pathname === '/home/my-profile/settings' ? 'hidden' : ''}`}>
			<div
				className={`h-screen ${
					notifyOpen ? "border-r border-white/40 mr-5" : "min-w-52"
				} flex-grow flex flex-col items-start size justify-between px-3 py-2`}
			>
				<Button
					size='lg'
					className={`mx-0 px-3 ${widthCondition}`}
					startContent={<HomeIcon />}
				>
					{!notifyOpen && "UVM Dev House"}
				</Button>
				<nav className={`w-full`}>
					<ul className='flex flex-col gap-4'>
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
							<Link href={"/home/trending"}>
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
											? "bg-lima-400/30 hover:bg-lima-400/50 dark:hover:bg-biscay-900"
											: ""
									}`}
									startContent={<SearchIcon />}
								>
										{!notifyOpen && "Buscar"}
								</Button>
							</Link>
						</li>
						<li>
							<Button
								size='lg'
								onClick={notifyHandle}
								className={notifyClasses}
								startContent={<BellIcon />}
							>
								{!notifyOpen && "Notificaciones"}
							</Button>
						</li>
						<li>
							<Link href={"/home/my-profile"}>
								<Button
									size='lg'
									className={`mx-0 px-3 ${widthCondition} hover:bg-lima-400/30 dark:hover:bg-biscay-900 ${
										pathname == "/home/my-profile"
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
									<Link href={'/home/my-profile/settings'}>
										<Button
											size='lg'
											className='mx-0 px-3 w-full hover:bg-lima-400/30 dark:hover:bg-biscay-900'
											shape='none'
											startContent={<SettingsIcon />}
											>
											Configuraciones
										</Button>
									</Link>
								</li>
								<li>
									<Link
										href={"/home/my-profile?bookmarks"}
										className='w-full text-start'
									>
										<Button
											size='lg'
											className='mx-0 px-3 w-full hover:bg-lima-400/30 dark:hover:bg-biscay-900'
											shape='none'
											startContent={<BookmarksIcon />}
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
						{!notifyOpen && "Mas"}
					</Button>
				</div>
			</div>
			{notifyOpen && (
				<div
					className='absolute left-full w-[300px] h-screen bg-seagreen-900 dark:bg-storm-950 text-storm-100 py-2 pr-4 flex flex-col gap-3'
					id='notify'
				>
					<h3 className='text-lg font-semibold'>Notificaciones</h3>
					<p className='border-t-[1px] border-white/40'>Esta semana</p>
				</div>
			)}
		</section>
	)
}

export default Navbar
