"use client"
import React, { ChangeEvent, useState } from "react"
import Image from "next/image"
import { useMutation, useQuery } from "@apollo/client"
import Button from "@/ui/Button"
import Input from "@/ui/Input"
import Tag from "@/ui/Tag"
import { toastCustom } from "@/ui/toasts"
import SelectCustom from "@/ui/SelectCustom"
import RowFile from "@/components/create/RowFile"
import { PlusIcon } from "@/icons"
import { existTech } from "@/app/lib/logic"
import { GET_TECHNOLOGIES } from "@/app/lib/graphql/technology"
import { GET_POSTS, GET_POSTS_USER, POST_POST } from "@/app/lib/graphql/posts"
import {
	GetTechnology,
	NewTechnology,
	PostPostVariables,
	ResponsePostPost,
	Technologies
} from "@/app/lib/types/typesGraphql"
import { fetchFiles, fetchPreview } from "@/app/api/uploads"
import { useRouter } from "next/navigation"
import { useUserStore } from "@/app/store/user"


function Page() {
	const idUser = useUserStore(state => state.user.id)
	const { data: technologies } = useQuery<Technologies>(GET_TECHNOLOGIES)
	const [postPost, { data, loading, error, reset }] = useMutation<
		ResponsePostPost,
		PostPostVariables
	>(POST_POST)

	const { refetch: refetchPosts } = useQuery(GET_POSTS, {
		skip: true
	});
	const { refetch: refetchPostsUser } = useQuery(GET_POSTS_USER, {
		variables: { idUser },
		skip: true
	});

	const [dataForm, setDataForm] = useState({
		title: "",
		description: "",
	})
	const [preview, setPreview] = useState<null | string>(null)
	const [dataImg, setDataImg] = useState<null | File>(null)
	const [stack, setStack] = useState<GetTechnology[]>([])
	const [newStack, setNewStack] = useState<NewTechnology[]>([])
	const [files, setFiles] = useState<File[]>([])
	// continuar con el estado de una nueva tecnologia
	const [otherTech, setOtherTech] = useState('')
	const router = useRouter()

	const previewSrc = preview || '/Image.png'
	const limitClasses = {
		textArea:
			dataForm.description.length > 500
				? "ring-2 ring-maroon-800"
				: "ring-seagreen-950",
		span:
			dataForm.description.length > 500
				? "text-maroon-900 font-normal"
				: "font-light"
	}

	const handleChange = (
		e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const name = e.target.name
		const value = e.target.value

		setDataForm({
			...dataForm,
			[name]: value
		})
	}

	const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value, id: selectedId, checked } = e.target
		const tech: GetTechnology = {
			id: selectedId,
			name: value
		}
		if (checked) {
			setStack(prevSelected => [...prevSelected, tech])
		} else {
			setStack(prevSelected =>
				prevSelected.filter(tech => tech.id !== selectedId)
			)
		}
	}

	const handleOtherTech = () => {
		const formatedOtherTech = { name: otherTech }
		setNewStack(prevStack => [...prevStack, formatedOtherTech])
		setOtherTech('')
	}

	const onRemoveTech = (id: string) => {
		const newStack = stack.filter(tech => tech.id != id)
		setStack(newStack)
	}

	const onRemoveOtherTech = (name: string) => {
		const otherStack = newStack.filter(tech => tech.name != name)
		setNewStack(otherStack)
	}

	const handleImage = async (e: ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files
		if (!files || files.length === 0) return

		const selectFile = files[0]
		setDataImg(selectFile)
		setPreview(URL.createObjectURL(selectFile))
	}

	const submitImage = async (idPost: string) => {
		if (!dataImg)
			return toastCustom({ text: "La imagen es necesaria", variant: "error" })

		const formData = new FormData()
		formData.append("preview", dataImg)
		formData.append("id", idPost)

		const res = await fetchPreview(formData)
		// console.log(res)

		if (res) {
			// await refetchPosts()
			// toastCustom({ text: "Preview cargado correctamente", variant: "success" })
		}
	}

	const handleAddFile = () => {
		const fileInput = document.getElementById("files") as HTMLInputElement
		if (fileInput) {
			fileInput.click()
		}
	}

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFiles = event.target.files
		if (selectedFiles) {
			setFiles(prevFiles => [...prevFiles, ...Array.from(selectedFiles)])
		}
	}

	const handleRemoveFile = (index: number) => {
		setFiles(prevFiles => prevFiles.filter((_, i) => i !== index))
	}

	const submitFiles = async (idPost: string) => {
		if (files.length <= 0)
			return toastCustom({ text: "La imagen es necesaria", variant: "error" })
		
		files.forEach(async file => {
			const formData = new FormData()
			formData.append("file", file)
			formData.append("idPost", idPost)

			const res = await fetchFiles(formData)
		})
	}

	const handleSubmit = async () => {
		if (dataForm.title === '') {
			return toastCustom({text: 'Debe ingresar un titulo', variant: "error", duration: 2000 })
		}

		if (dataForm.description === '') {
			return toastCustom({text: 'Debe ingresar una descripcion', variant: "error", duration: 2000 })
		}

		if (!dataImg) {
			return toastCustom({text: 'Debe subir una imagen de preview', variant: "error", duration: 2000 })
		}

		if (stack.length < 1 && newStack.length < 1) {
			return toastCustom({text: 'Debe seleccionar al menos 1 tecnologia', variant: "error", duration: 2000 })
		}

		if (files.length <= 0) {
			return toastCustom({ text: "Debe subir al menos 1 archivo", variant: "error", duration: 2000 })
		}

		const res = await postPost({
			variables: {
				title: dataForm.title,
				description: dataForm.description,
				technologies: stack,
				newTechnologies: newStack
			}
		})

		if (res.data?.postPost) {
			const idPost = res.data.postPost.id
			await submitImage(idPost)
			await submitFiles(idPost)

			await refetchPosts();
			await refetchPostsUser();

			toastCustom({text: "Tu componente ha sido publicado", variant: "success", duration: 2000})
			router.push(`/home`)
		}
	}
	
	if (error) {
		console.log(error)
		toastCustom({text: error.message, variant: "error", duration: 2000})
		reset()
	} 

	return (
		<div className='flex flex-col h-full max-w-xl md:max-w-2xl w-full gap-2 pb-5 md:pb-0'>
			<h3 className='text-xl md:text-3xl font-semibold text-center'>
				Comparte tu componente
			</h3>
			<section className='flex flex-col gap-1 px-5'>
				<label
					htmlFor='title'
					className='text-base md:text-lg font-semibold'
				>
					Titulo
				</label>
				<Input
					type='text'
					id='title'
					name='title'
					placeholder='Titulo'
					value={dataForm.title}
					onChange={e => handleChange(e)}
					className='ring-0 bg-white max-w-sm'
				/>
			</section>
			<div className='border-b border-seagreen-900/20 dark:border-white/20'></div>
			<section className='flex flex-col gap-1 px-5'>
				<label
					htmlFor='description'
					className='text-base md:text-lg font-semibold'
				>
					Descripcion
				</label>
				<textarea
					name='description'
					id='description'
					placeholder='Descripcion'
					value={dataForm.description}
					onChange={e => handleChange(e)}
					className={`${limitClasses.textArea} bg-white dark:bg-storm-900 rounded-lg px-2 py-1 outline-none`}
				></textarea>
				<span className={`${limitClasses.span} text-sm`}>
					{`${dataForm.description.length}/500`}
				</span>
			</section>
			<div className='border-b border-seagreen-900/20 dark:border-white/20'></div>
			<section className='flex flex-col md:flex-row gap-5 md:gap-10 px-5 items-center justify-start'>
				<div className='relative w-32'>
					<input
						type='file'
						id='avatar'
						name='avatar'
						className='hidden'
						onChange={handleImage}
					/>
					<Image
						src={typeof previewSrc === "string" ? previewSrc : ""}
						width={112}
						height={112}
						alt='Imagen del Evento'
						className='size-28 object-cover ring-2 ring-slate-500/30 rounded-full'
					/>
					<label
						htmlFor='avatar'
						className='absolute right-0 md:-right-3 top-11 cursor-pointer bg-seagreen-900 rounded-full p-1'
					>
						<PlusIcon className='text-white size-5' />
					</label>
				</div>
				<div className='flex flex-col gap-2'>
					<div className='flex flex-col md:flex-row gap-3 items-center'>
						<div className='flex gap-3 items-center'>
							<label
								htmlFor='deduction'
								className='font-semibold'
							>
								Stack:
							</label>
							<SelectCustom
								data={technologies?.getTechnologies}
								handleCheckboxChange={handleCheckboxChange}
								stack={stack}
							/>
						</div>
						{existTech(stack, "Other") && (
							<div className="flex gap-3">
								<Input
									type='text'
									id='otherTech'
									name='otherTech'
									value={otherTech}
									onChange={e =>
										setOtherTech(e.target.value)
									}
									placeholder='Nombre de la tecnologia'
									className='ring-0 bg-white max-w-36'
								/>
								<Button
									size='sm'
									shape='sm'
									className='py-1'
									onClick={handleOtherTech}
								>
									Añadir
								</Button>
							</div>
						)}
					</div>
					<div className='flex flex-wrap gap-2 min-h-7'>
						{stack.length > 0 &&
							stack.map(
								tech =>
									tech.id !== "Other" && (
										<Tag
											key={tech.id}
											onRemove={() => onRemoveTech(tech.id)}
										>
											{tech.name}
										</Tag>
									)
							)
						}
						{newStack.length > 0 &&
							newStack.map(
								tech => (
										<Tag
											key={tech.name}
											onRemove={() => onRemoveOtherTech(tech.name)}
										>
											{tech.name}
										</Tag>
									)
							)
						}
					</div>
				</div>
			</section>
			<div className='border-b border-seagreen-900/20 dark:border-white/20'></div>
			<section className='flex flex-col gap-2 px-5'>
				<label
					htmlFor='files'
					className='text-base md:text-lg font-semibold'
				>
					Archivos
				</label>
				<input
					type='file'
					name='files'
					id='files'
					className='hidden'
					multiple
					onChange={handleFileChange}
				/>
				<div className='flex flex-col gap-2'>
					{files.length > 0 ? (
						files.map((file, index) => (
							<RowFile
								key={index}
								onRemove={() => handleRemoveFile(index)}
							>
								{file.name}
							</RowFile>
						))
					) : (
						<p className='text-sm opacity-50'>No hay archivos subidos</p>
					)}
				</div>
				<Button
					startContent={<PlusIcon className='size-5' />}
					marginX='none'
					variant='flat'
					className='justify-center text-sm md:text-base py-1 md:py-2'
					onClick={handleAddFile}
				>
					Subir archivo
				</Button>
			</section>
			<div className='border-b border-seagreen-900/20 dark:border-white/20'></div>
			<section className='flex justify-center gap-5 px-5'>
				<Button
					variant='solid'
					color='primary'
					className='px-10 text-sm md:text-base py-1 md:py-2'
					onClick={handleSubmit}
				>
					Publicar
				</Button>
			</section>
		</div>
	)
}

export default Page
