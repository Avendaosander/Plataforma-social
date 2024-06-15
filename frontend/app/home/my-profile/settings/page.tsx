"use client"

import { ArrowLeft, RightArrowIcon, SearchIcon } from "@/icons"
import InputWithIcon from "@/app/components/ui/InputWithIcon"
import React, { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import Button from "@/app/components/ui/Button"
import SwitchButton from "@/app/components/ui/SwitchButton"
import Link from "next/link"

const paths = {
  default: '/home/my-profile/settings',
  administrar: '/home/my-profile/settings#administrar-cuenta',
  privacidad: '/home/my-profile/settings#privacidad',
  notificaciones: '/home/my-profile/settings#notificaciones',
}

function Settings() {
	const [searchText, setSearchText] = useState("")
	const router = useRouter()
  const pathname = usePathname()
  console.log(pathname)

  const activeClasses = 'text-biscay-700 font-bold'
	const goToHome = () => {
		router.push(`/home/my-profile`)
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
					type='text'
					placeholder='Buscar'
					value={searchText}
					onChange={e => setSearchText(e.target.value)}
					endContent={<SearchIcon className='size-5' />}
					onSubmit={handleSubmit}
				/>
			</section>
			<div className='flex gap-5 w-full h-full px-2'>
				<section className='flex flex-col w-64 p-5 bg-white rounded-t-2xl'>
					<Link
						href='#administrar-cuenta'
						className={`${pathname === paths.administrar || pathname === paths.default ? activeClasses : 'font-medium'} text-lg`}
					>
						Administrar cuenta
					</Link>
					<Link
						href='#privacidad'
						className={`${pathname === paths.privacidad ? activeClasses : 'font-medium text-lg'}`}
					>
						Privacidad
					</Link>
					<Link
						href='#notificaciones'
						className={`${pathname === paths.notificaciones ? activeClasses : 'font-medium text-lg'}`}
					>
						Notificaciones
					</Link>
				</section>
				<section className='flex flex-col gap-3 w-full p-5 bg-white rounded-t-2xl text-lg'>
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
							>
								Eliminar
							</Button>
						</div>
          </div>
          <div className="border-b border-seagreen-900/20"></div>
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
          <div className="border-b border-seagreen-900/20"></div>
					<h4
						className='text-xl font-bold'
						id='privacidad'
					>
						Privacidad
					</h4>
					<div className='flex flex-col gap-3 w-full px-3'>
						<p className='font-semibold'>Visibilidad</p>
						<div className='flex justify-between items-center w-full'>
							<p>Cuenta privada</p>
							<SwitchButton />
						</div>
					</div>
          <div className="border-b border-seagreen-900/20"></div>
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
							<SwitchButton />
						</div>
						<div className='flex justify-between items-center w-full'>
							<p>Comentarios</p>
							<SwitchButton />
						</div>
						<div className='flex justify-between items-center w-full'>
							<p>Nuevos seguidores</p>
							<SwitchButton />
						</div>
						<p className='font-medium'>Del sistema</p>
						<div className='flex justify-between items-center w-full'>
							<p>Componentes populares</p>
							<SwitchButton />
						</div>
          </div>
          <div className="border-b border-seagreen-900/20"></div>
					<div className='flex flex-col gap-3 w-full px-3'>
						<p className='font-semibold'>Notificaciones al correo</p>
						<p className='font-medium'>Interacciones</p>
						<div className='flex justify-between items-center w-full'>
							<p>Calificaciones</p>
							<SwitchButton />
						</div>
						<div className='flex justify-between items-center w-full'>
							<p>Comentarios</p>
							<SwitchButton />
						</div>
						<div className='flex justify-between items-center w-full'>
							<p>Nuevos seguidores</p>
							<SwitchButton />
						</div>
					</div>
				</section>
			</div>
		</div>
	)
}

export default Settings
