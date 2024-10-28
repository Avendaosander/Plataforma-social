"use client"

import { ArrowLeft, RightArrowIcon, SearchIcon } from "@/icons"
import InputWithIcon from "@/app/components/ui/InputWithIcon"
import React, { useEffect, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import Button from "@/app/components/ui/Button"
import SwitchButton from "@/app/components/ui/SwitchButton"
import Link from "next/link"
import { useModalStore } from "@/app/store/modalDelete"
import { toastCustom } from "@/app/components/ui/toasts"
import { useMutation, useQuery } from "@apollo/client"
import { DELETE_USER } from "@/app/lib/graphql/users"
import { useUserStore } from "@/app/store/user"
import { signOut } from "next-auth/react"
import { GetSetting, Setting } from "@/app/lib/types/typesGraphql"
import { GET_SETTING } from "@/app/lib/graphql/settings"

const paths = {
	default: "/home/my-profile/settings",
	administrar: "/home/my-profile/settings#administrar-cuenta",
	privacidad: "/home/my-profile/settings#privacidad",
	notificaciones: "/home/my-profile/settings#notificaciones"
}

function Settings() {
	const [searchText, setSearchText] = useState("")
	const router = useRouter()
	const pathname = usePathname()
	const idUser = useUserStore(state => state.user.id)
	const searchParams = useSearchParams()
	const { openModal } = useModalStore(state => state)
	const [settings, setSettings] = useState<Setting | null>(null)
	const { data: dataSetting } = useQuery<GetSetting>(GET_SETTING, {
		variables: { idUser },
		fetchPolicy: "network-only"
	})
	const [userDelete, { data, loading, error }] = useMutation(DELETE_USER)

	useEffect(() => {
		if (dataSetting?.getSettings) {
			setSettings(dataSetting.getSettings)
		}
	}, [dataSetting])

	const logout = async () => {
		const data = await signOut({ redirect: false, callbackUrl: "/login" })
		router.push(data.url)
	}

	const handleSearch = (term: string) => {
		setSearchText(term)
		const params = new URLSearchParams(searchParams)

		if (term) {
			params.set("query", term)
		} else {
			params.delete("query")
		}

		router.replace(`${pathname}?${params.toString()}`)
	}

	const handleDelete = () => {
		openModal("Esta seguro de eliminar esta cuenta?", () => {
			userDelete({
				variables: {
					deleteUserId: idUser
				}
			})
		})
	}

	if (!loading && data) {
		toastCustom({
			text: "Cuenta eliminada",
			variant: "success",
			duration: 2000
		})
		logout()
	}

	if (error) {
		toastCustom({
			text: `Hubo un error: ${error}`,
			variant: "error",
			duration: 2000
		})
	}

	const activeClasses = "text-biscay-700 font-bold"
	const goToHome = () => {
		router.push("/home")
	}

	const handleSubmit = () => {
		router.push(`/home/search?query=${encodeURIComponent(searchText)}`)
	}
	return (
		<div className='relative min-h-full w-full flex flex-col gap-5'>
			<Button
				color='primary'
				variant='flat'
				size='sm'
				shape='sm'
				startContent={<ArrowLeft />}
				className='px-2 py-1 absolute right-full top-[74px] mr-10'
				onClick={goToHome}
			></Button>
			<section className='flex flex-col items-center w-full gap-5'>
				<InputWithIcon
					text={searchText}
					setText={setSearchText}
					type='text'
					placeholder='Buscar'
					name='Search'
					value={searchText}
					handleChange={handleSearch}
					onSubmit={handleSubmit}
					endContent={<SearchIcon className='size-5' />}
				/>
			</section>
			{settings && (
				<div className='flex gap-5 w-full h-full px-2'>
					<section className='flex flex-col w-64 p-5 bg-white dark:bg-storm-900 rounded-t-2xl'>
						<Link
							href='#administrar-cuenta'
							className={`${
								pathname === paths.administrar || pathname === paths.default
									? activeClasses
									: "font-medium"
							} text-lg`}
						>
							Administrar cuenta
						</Link>
						<Link
							href='#notificaciones'
							className={`${
								pathname === paths.notificaciones
									? activeClasses
									: "font-medium text-lg"
							}`}
						>
							Notificaciones
						</Link>
					</section>
					<section className='flex flex-col gap-3 w-full p-5 bg-white dark:bg-storm-900 rounded-t-2xl text-lg'>
						<h4
							className='text-xl font-bold'
							id='administrar-cuenta'
						>
							Administrar cuenta
						</h4>
						<div className='flex flex-col gap-3 w-full px-3'>
							<p className='font-semibold'>Control de cuenta</p>
							<div className='flex justify-between items-center w-full'>
								<p>Eliminar cuenta</p>
								<Button
									color='destructive'
									variant='ghost'
									size='sm'
									shape='sm'
									className='px-3 py-1'
									onClick={() => handleDelete()}
								>
									Eliminar
								</Button>
							</div>
						</div>
						<div className='border-b border-seagreen-900/20'></div>
						<div className='flex flex-col gap-3 w-full px-3'>
							<p className='font-semibold'>Datos de la cuenta</p>
							<div className='flex justify-between items-center w-full'>
								<p>Cambiar la contraseña</p>
								<Button
									color='primary'
									variant='flat'
									size='sm'
									shape='sm'
									startContent={<RightArrowIcon />}
									className='px-2 py-1'
								></Button>
							</div>
						</div>
						<div className='border-b border-seagreen-900/20'></div>
						<h4
							className='text-xl font-bold'
							id='notificaciones'
						>
							Notificaciones
						</h4>
						<div className='flex flex-col gap-3 w-full px-3'>
							<p className='font-semibold'>Notificaciones de escritorio</p>
							<p className='font-medium'>Interacciones</p>
							<div className='flex justify-between items-center w-full'>
								<p>Calificaciones</p>
								<SwitchButton
									idSetting={settings.idSetting}
									name='n_ratings'
									value={settings.n_ratings}
								/>
							</div>
							<div className='flex justify-between items-center w-full'>
								<p>Comentarios</p>
								<SwitchButton
									idSetting={settings.idSetting}
									name='n_comments'
									value={settings.n_comments}
								/>
							</div>
							<div className='flex justify-between items-center w-full'>
								<p>Nuevos seguidores</p>
								<SwitchButton
									idSetting={settings.idSetting}
									name='n_followers'
									value={settings.n_followers}
								/>
							</div>
							<div className='flex justify-between items-center w-full'>
								<p>Componentes nuevos</p>
								<SwitchButton
									idSetting={settings.idSetting}
									name='n_new_post'
									value={settings.n_new_post}
								/>
							</div>
							<div className='flex justify-between items-center w-full'>
								<p>Componentes guardados modificados</p>
								<SwitchButton
									idSetting={settings.idSetting}
									name='n_edit_post'
									value={settings.n_edit_post}
								/>
							</div>
							<div className='flex justify-between items-center w-full'>
								<p>Componentes guardados eliminados</p>
								<SwitchButton
									idSetting={settings.idSetting}
									name='n_delete_post'
									value={settings.n_delete_post}
								/>
							</div>
							<p className='font-medium'>Del sistema</p>
							<div className='flex justify-between items-center w-full'>
								<p>Componentes populares</p>
								<SwitchButton
									idSetting={settings.idSetting}
									name='n_populates'
									value={settings.n_populates}
								/>
							</div>
						</div>
						<div className='border-b border-seagreen-900/20'></div>
						<div className='flex flex-col gap-3 w-full px-3'>
							<p className='font-semibold'>Notificaciones al correo</p>
							<p className='font-medium'>Interacciones</p>
							<div className='flex justify-between items-center w-full'>
								<p>Calificaciones</p>
								<SwitchButton
									idSetting={settings.idSetting}
									name='n_email_ratings'
									value={settings.n_email_ratings}
								/>
							</div>
							<div className='flex justify-between items-center w-full'>
								<p>Comentarios</p>
								<SwitchButton
									idSetting={settings.idSetting}
									name='n_email_comments'
									value={settings.n_email_comments}
								/>
							</div>
							<div className='flex justify-between items-center w-full'>
								<p>Nuevos seguidores</p>
								<SwitchButton
									idSetting={settings.idSetting}
									name='n_email_followers'
									value={settings.n_email_followers}
								/>
							</div>
							<div className='flex justify-between items-center w-full'>
								<p>Componentes nuevos</p>
								<SwitchButton
									idSetting={settings.idSetting}
									name='n_email_new_post'
									value={settings.n_email_new_post}
								/>
							</div>
							<div className='flex justify-between items-center w-full'>
								<p>Componentes guardados modificados</p>
								<SwitchButton
									idSetting={settings.idSetting}
									name='n_email_edit_post'
									value={settings.n_email_edit_post}
								/>
							</div>
							<div className='flex justify-between items-center w-full'>
								<p>Componentes guardados eliminados</p>
								<SwitchButton
									idSetting={settings.idSetting}
									name='n_email_delete_post'
									value={settings.n_email_delete_post}
								/>
							</div>
						</div>
					</section>
				</div>
			)}
		</div>
	)
}

export default Settings
