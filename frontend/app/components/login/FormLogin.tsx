'use client'
import Link from "next/link"
import React, { ChangeEvent, FormEvent, useState } from "react"
import Button from "@/ui/Button"
import Input from "@/ui/Input"
import { signIn, useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { toastCustom } from "@/app/components/ui/toasts"
import { Toaster } from "react-hot-toast"

function FormLogin() {
	const { status } = useSession()
	const [login, setLogin] = useState({
		email: "",
		password: ""
	})
	
	if (status === "authenticated") {
		redirect('/home')
	}

	const handleLogin = (e: ChangeEvent<HTMLInputElement>) => {
		const name = e.target.name
		const value = e.target.value
		setLogin({
			...login,
			[name]: value
		})
	}

	const handleSubmit = async(e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		if (login.email === '') {
			return toastCustom({text: 'Debe ingresar un correo electronico', variant: "error", duration: 2000})
		}

		if (login.password === '') {
			return toastCustom({text: 'Debe ingresar una contraseña', variant: "error", duration: 2000})
		}
			
    const res = await signIn('credentials', {
      email: login.email,
      password: login.password,
      redirect: false
    })

		// console.log('Respuesta: ', res)

    if (res?.error) {
			toastCustom({text: res.error, variant: "error", duration: 2000})
    } 
	}

	return (
		<div className='flex flex-col gap-5 items-center'>
			<h2 className='text-4xl font-semibold'>Iniciar sesion</h2>
			<form
				className='text-lg font-medium p-5 rounded-2xl ring-1 ring-seagreen-950 dark:ring-white flex flex-col gap-5 w-[300px] bg-white dark:bg-transparent shadow-small shadow-white/25'
        onSubmit={e => handleSubmit(e)}
			>
				<div className='flex flex-col gap-1'>
					<label htmlFor='email'>Correo Electronico</label>
					<Input
						type='email'
						placeholder='correo@gmail.com'
						id='email'
            name="email"
            value={login.email}
            onChange={e => handleLogin(e)}
					/>
				</div>
				<div className='flex flex-col gap-1'>
					<label htmlFor='password'>Contraseña</label>
					<Input
						type='password'
						placeholder='Ingresa tu contraseña'
						id='password'
            name="password"
            value={login.password}
            onChange={e => handleLogin(e)}
					/>
				</div>
        <Button
          type='submit'
          color='primary'
          variant='solid'
          size='lg'
          marginX='auto'
          shape='md'
        >
          Iniciar Sesion
        </Button>
				<p className='text-sm text-center'>¿Olvidaste tu contraseña?</p>
			</form>
			<Link href={`/register`}>
				¿No tienes una cuenta? <span className='font-semibold'>Regístrate</span>
			</Link>
			<Toaster/>
		</div>
	)
}

export default FormLogin
