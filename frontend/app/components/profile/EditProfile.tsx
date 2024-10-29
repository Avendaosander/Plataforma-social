import React, { ChangeEvent, useState } from "react"
import { PlusIcon, XIcon } from "@/icons/icons"
import Input from "@/ui/Input"
import Button from "@/ui/Button"
import Image from "next/image"
import { useMutation } from "@apollo/client"
import { GET_USER, PUT_USER } from "@/graphql/users"
import { GetUser, PutUserVariables, ResponsePutUser } from "@/typesGraphql"
import { toastCustom } from "@/ui/toasts"
import { pathsUploads } from "@/app/lib/types/types"
import { useSession } from "next-auth/react"
import { GET_POSTS } from "@/app/lib/graphql/posts"

interface Props {
	onClose: (state: boolean) => void
	user: GetUser
}

function EditProfile({ onClose, user }: Props) {
	const [dataEdit, setDataEdit] = useState(user)
	const [preview, setPreview] = useState<null | string>(null)
	const [dataImg, setDataImg] = useState<null | File>(null)
	const { update } = useSession()

	const avatarSrc =
		preview ||
		(user?.avatar 
			&& `${process.env.NEXT_PUBLIC_API_ROUTE_AVATAR}${user.avatar}`)
			|| '/User.png'

	const [putUser, { data, loading, error, reset }] = useMutation<
		ResponsePutUser,
		PutUserVariables
	>(PUT_USER, {
		refetchQueries: [
			{ query: GET_POSTS, variables: { idUser: user.id } },
			{ query: GET_USER, variables: { id: user.id } }
		]
	})

	let limitClasses = {
		textArea:
			dataEdit?.description.length > 250
				? "ring-2 ring-maroon-800"
				: "ring-seagreen-950",
		span:
			dataEdit?.description.length > 250
				? "text-maroon-900 font-normal"
				: "font-light"
	}

	const handleFile = async (e: ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files
		if (!files || files.length === 0) return

		const selectFile = files[0]
		setDataImg(selectFile)
		setPreview(URL.createObjectURL(selectFile))
	}

	const handleChange = (
		e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const name = e.target.name
		const value = e.target.value

		setDataEdit({
			...dataEdit,
			[name]: value
		})
	}

	const handleSubmit = async () => {
		let body: {
			avatar?: string
			username?: string
			description?: string
		} = {}

		if (dataImg && dataImg.name !== user.avatar) {
			const type: pathsUploads = "avatar"

			const formData = new FormData()
			formData.append("avatar", dataImg as File)
			formData.append("id", user.id)

			const res = await fetch(
				`${process.env.NEXT_PUBLIC_API_ROUTE_AVATAR}${type}`,
				{
					method: "POST",
					body: formData
				}
			)
				.then(res => res.json())
				.then(res => res)

			if (res) {
				toastCustom({
					text: "Avatar modificado correctamente",
					variant: "success"
				})
			}
		}

		if (dataEdit.username !== user.username) {
			body.username = dataEdit.username
		}
		if (dataEdit.description !== user.description) {
			body.description = dataEdit.description
		}
		putUser({
			variables: {
				id: user.id,
				...body
			}
		})
	}

	if (data?.putUser) {
		toastCustom({ text: "Usuario editado correctamente", variant: "success", duration: 2000 })
		update({
			username: data.putUser.username,
			description: data.putUser.description,
			avatar: data.putUser.avatar
		})
		onClose(false)
	}

	if (error) {
		toastCustom({ text: error.message, variant: "error", duration: 2000 })
		reset()
	}

	return (
		<section className='flex flex-col bg-storm-50 dark:bg-storm-950 rounded-xl max-w-[90%] sm:max-w-[80%] lg:max-w-[60%] w-full'>
			<header className='flex justify-between items-center p-5 border-b border-seagreen-950/40 dark:border-white/20'>
				<h3 className='text-2xl font-semibold'>Editar perfil</h3>
				<button onClick={() => onClose(false)}>
					<XIcon />
				</button>
			</header>
			<div className='flex flex-col px-5'>
				<div className='flex flex-col md:flex-row justify-between items-center py-2 md:py-5 gap-3'>
					<label
						htmlFor='avatar'
						className='md:w-full md:max-w-[160px] mb-auto text-lg font-semibold'
					>
						Foto de perfil
					</label>
					<section className='m-auto relative mt-2'>
						<input
							type='file'
							id='avatar'
							name='avatar'
							className='hidden'
							onChange={handleFile}
						/>
						<Image
							src={typeof avatarSrc === "string" ? avatarSrc : ""}
							width={128}
							height={128}
							alt='Imagen del Evento'
							className='size-32 object-cover ring-1 dark:ring-white m-auto rounded-full'
						/>
						<label
							htmlFor='avatar'
							className='absolute right-2 top-24 cursor-pointer bg-seagreen-900 rounded-full p-1'
						>
							<PlusIcon className='text-white size-5' />
						</label>
					</section>
					<div className='w-full max-w-[150px]'></div>
				</div>
				<div className='flex flex-col md:flex-row justify-between items-center py-2 md:py-5 gap-3'>
					<label
						htmlFor='username'
						className='md:w-full md:max-w-[160px] text-lg font-semibold'
					>
						Nombre de usuario
					</label>
					<Input
						type='text'
						name='username'
						id='username'
						placeholder='Username'
						className='max-w-64 w-full'
						value={dataEdit?.username}
						onChange={e => handleChange(e)}
					/>
					<div className='w-full max-w-[150px]'></div>
				</div>
				<div className='flex flex-col md:flex-row justify-between items-center py-2 md:py-5 gap-3'>
					<label
						htmlFor='description'
						className='md:w-full md:max-w-[160px] text-lg font-semibold'
					>
						Descripcion corta
					</label>
					<div className='flex flex-col gap-2 max-w-64 w-full'>
						<textarea
							name='description'
							id='description'
							placeholder='Descripcion'
							className={`${limitClasses.textArea} ring-1 dark:ring-white rounded-lg px-3 py-1 outline-none dark:bg-storm-900`}
							value={dataEdit?.description}
							onChange={e => handleChange(e)}
						></textarea>
						<span className={`${limitClasses.span} text-sm`}>
							{`${dataEdit?.description.length}/250`}
						</span>
					</div>
					<div className='w-full max-w-[150px]'></div>
				</div>
			</div>
			<footer className='flex justify-center md:justify-end gap-5 p-5 border-t border-seagreen-950/40 dark:border-white/20'>
				<Button
					color='destructive'
					variant='solid'
					className='px-5'
					onClick={() => onClose(false)}
				>
					Cancelar
				</Button>
				<Button
					color='primary'
					variant='solid'
					className='px-5'
					onClick={handleSubmit}
				>
					Guardar
				</Button>
			</footer>
		</section>
	)
}

export default EditProfile
