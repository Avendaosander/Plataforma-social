"use client"
import Link from "next/link"
import { ChangeEvent, FormEvent, useState } from "react"
import Input from "@/ui/Input"
import Button from "@/ui/Button"
import { POST_USER } from "@/app/lib/graphql/users"
import { useMutation } from "@apollo/client"
import { useRouter } from "next/navigation"
import { toastCustom } from "../ui/toasts"
import { Toaster } from "react-hot-toast"
import { PostUserVariables, ResponseRegister } from "@/app/lib/types/typesGraphql"

function FormRegister() {
  const router = useRouter()
	const [postUser, {data, loading, error, reset}] = useMutation<ResponseRegister, PostUserVariables>(POST_USER)
	const [register, setRegister] = useState({
		username: "",
		email: "",
		password: ""
	})
  const [confirmPassword, setConfirmPassword] = useState('')
	// console.log(data)
	// console.log(loading)

	if (error) {
		console.log(error.message)
		toastCustom({text: error.message, variant: "error", duration: 2000})
		reset()
	}

	if (data?.postUser) {
		toastCustom({text: "Usuario registrado correctamente", variant: "success", duration: 2000})
		router.push('/login')
	}

	const handleRegister = (e: ChangeEvent<HTMLInputElement>) => {
		const name = e.target.name
		const value = e.target.value
		
		setRegister({
			...register,
			[name]: value
		})
	}

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
		
		if (register.username === '') {
			return toastCustom({text: 'Debe ingresar un nombre de usuario', variant: "error"})
		}

		if (register.email === '') {
			return toastCustom({text: 'Debe ingresar un correo electronico', variant: "error"})
		}

		if (register.password === '') {
			return toastCustom({text: 'Debe ingresar una contraseña', variant: "error"})
			}

    if (register.password !== confirmPassword) {
			return toastCustom({text: 'Las contraseñas no coinciden ', variant: "error"})
		} 

		postUser({
			variables: register
		})
  }
  
	return (
		<div className='flex flex-col gap-5 items-center'>
			<h2 className='text-4xl font-semibold'>Registrate</h2>
			<form
				className='text-lg font-medium p-5 rounded-2xl ring-1 ring-seagreen-950 dark:ring-white flex flex-col gap-5 w-[300px] bg-white dark:bg-transparent shadow-small shadow-white/25'
        onSubmit={e => handleSubmit(e)}
			>
				<div className='flex flex-col gap-1'>
					<label htmlFor='username'>Nombre de Usuario</label>
					<Input
						type='text'
						placeholder='Username'
						id='username'
            name="username"
						value={register.username}
						onChange={e => handleRegister(e)}
					/>
				</div>
				<div className='flex flex-col gap-1'>
					<label htmlFor='email'>Correo Electronico</label>
					<Input
						type='email'
						placeholder='correo@gmail.com'
						id='email'
            name="email"
						value={register.email}
						onChange={e => handleRegister(e)}
					/>
				</div>
				<div className='flex flex-col gap-1'>
					<label htmlFor='password'>Contraseña</label>
					<Input
						type='password'
						placeholder='Ingresa tu contraseña'
						id='password'
            name="password"
						value={register.password}
						onChange={e => handleRegister(e)}
					/>
				</div>
				<div className='flex flex-col gap-1'>
					<label htmlFor='repassword'>Repite la Contraseña</label>
					<Input
						type='password'
						placeholder='Repite tu contraseña'
						id='repassword'
            name="confirmPassword"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
					/>
				</div>
        <Button
          type='submit'
          color='primary'
          variant='solid'
          size='lg'
          marginX='auto'
          shape='md'
					disabled={loading}
        >
          Registrar
        </Button>
			</form>
			<Link href={`/login`}>
				¿Tienes una cuenta? <span className='font-semibold'>Inicia sesion</span>
			</Link>
			<Toaster/>
		</div>
	)
}

export default FormRegister
