import React, { ChangeEvent, useState } from "react"
import { PlusIcon, XIcon } from "@/icons/icons"
import Input from "@/ui/Input"
import Button from "@/ui/Button"
import Image from "next/image"
import Logo from  '../../lib/LogoUVM.jpg';
import { useMutation } from "@apollo/client"
import { PUT_USER } from "@/app/lib/graphql/users"

interface Props {
	onClose: (state: boolean) => void
	user: {
		id: string
		username: string
		description: string
		avatar: string
	}
}

function EditProfile({ onClose, user }: Props) {
	const [dataEdit, setDataEdit] = useState(user)
  const [preview, setPreview] = useState<null | string>(null)
  const [dataImg, setDataImg] = useState<null | File>(null)
  const avatarSrc = preview || user?.avatar || Logo?.src;
	const [putUser, {data, loading, error, reset}] = useMutation(PUT_USER)

	let limitClasses = {
    textArea: dataEdit?.description.length > 250 ? "ring-2 ring-maroon-800" : "ring-seagreen-950",
    span: dataEdit?.description.length > 250 ? "text-maroon-900 font-normal" : "font-light"
  }

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const selectFile = files[0];
    setDataImg(selectFile);
    setPreview(URL.createObjectURL(selectFile));
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

  const handleSubmit = () => {
    
    // const body = new FormData()
    // imgPerfil !== null && (body.append('imgPerfil', imgPerfil))
    putUser({
      variables: {
        avatar: dataEdit?.avatar,
        username: dataEdit?.username,
        description: dataEdit?.description
      }
    })
  }

	return (
		<section className='flex flex-col bg-storm-50 rounded-xl max-w-4xl w-full'>
			<header className='flex justify-between items-center p-5 border-b border-seagreen-950/40'>
				<h3 className='text-2xl font-semibold'>Editar perfil</h3>
				<button onClick={() => onClose(false)}>
					<XIcon />
				</button>
			</header>
			<div className='flex flex-col px-5'>
				<div className='flex justify-between py-5'>     
          <label
            htmlFor='avatar'
            className='w-full max-w-[160px] mb-auto text-lg font-semibold'
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
                src={typeof avatarSrc === 'string' ? avatarSrc : ''}
                width={128}
                height={128}
                alt='Imagen del Evento'
                className='size-32 object-cover ring-2 ring-slate-500/30 m-auto rounded-full'
              />
              <label htmlFor="avatar" className="absolute right-2 top-24 cursor-pointer bg-seagreen-900 rounded-full p-1">
					      <PlusIcon className="text-white size-5"/>
              </label>
          </section>
					<div className='w-full max-w-[150px]'></div>
				</div>
				<div className='flex justify-between py-5'>
					<label
						htmlFor='username'
						className='w-full max-w-[160px] text-lg font-semibold'
					>
						Nombre de usuario
					</label>
					<Input
						type='text'
						id='username'
						placeholder='Username'
						className='max-w-64 w-full'
						value={dataEdit?.username}
						onChange={e => handleChange(e)}
					/>
					<div className='w-full max-w-[150px]'></div>
				</div>
				<div className='flex justify-between py-5'>
					<label
						htmlFor='description'
						className='w-full max-w-[160px] text-lg font-semibold'
					>
						Descripcion corta
					</label>
					<div className='flex flex-col gap-2 max-w-64 w-full'>
						<textarea
							name='description'
							id='description'
							placeholder='Descripcion'
							className={`${limitClasses.textArea} ring-1 rounded-lg px-3 py-1 outline-none`}
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
			<footer className='flex justify-end gap-5 p-5 border-t border-seagreen-950/40'>
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
