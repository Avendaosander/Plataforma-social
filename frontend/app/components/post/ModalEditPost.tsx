import React, { ChangeEvent, useState } from 'react'
import XIcon from '../icons/XIcon'
import Button from '../ui/Button'
import Input from '../ui/Input'
import { toastCustom } from '../ui/toasts'
import { fetchFiles, fetchPreview } from '@/app/api/uploads'
import { useUserStore } from '@/app/store/user'
import { useMutation, useQuery } from '@apollo/client'
import { type File as FileType, GetTechnology, NewTechnology, Post, PutPost, PutPostVariables, Technologies } from '@/app/lib/types/typesGraphql'
import { GET_TECHNOLOGIES } from '@/app/lib/graphql/technology'
import { GET_POST, PUT_POST } from '@/app/lib/graphql/posts'
import Image from 'next/image'
import PlusIcon from '../icons/PlusIcon'
import SelectCustom from '../ui/SelectCustom'
import { existTech } from '@/app/lib/logic'
import Tag from '../ui/Tag'
import RowFile from '../create/RowFile'

interface ModalProps {
  post: Post
  onClose: () => void
  onConfirm: () => void
};

function ModalEditPost({ post, onClose, onConfirm }: ModalProps) {
	const idUser = useUserStore(state => state.user.id)
  const stackFormated = post.Stack.map(tech => ({
    id: tech.idTechnology,
    name: tech.tech.name
  }))
	const { data: technologies } = useQuery<Technologies>(GET_TECHNOLOGIES)
	const [putPost, { data, loading, error, reset }] = useMutation<
		PutPost,
		PutPostVariables
	>(PUT_POST)

  const { refetch } = useQuery(GET_POST,{ 
    variables: {
      getPostId: post.id
    }
  })

	const [dataForm, setDataForm] = useState({
		title: post.title,
		description: post.description,
	})
	const [preview, setPreview] = useState<null | string>(null)
	const [dataImg, setDataImg] = useState<null | File>(null)
	const [stack, setStack] = useState<GetTechnology[]>(stackFormated)
	const [newStack, setNewStack] = useState<NewTechnology[]>([])
	const [files, setFiles] = useState<File[] | FileType[]>(post.File)
	// continuar con el estado de una nueva tecnologia
	const [otherTech, setOtherTech] = useState('')

	const previewSrc = preview || `${process.env.NEXT_PUBLIC_API_ROUTE_PREVIEW}${post.preview}`
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
    const isOld = technologies?.getTechnologies.some(tech => tech.name === otherTech)
    if (isOld) {
      toastCustom({text: 'Esta tecnologia ya existe', variant: 'info', duration: 2000})
      return setOtherTech('')
    }
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
			return toastCustom({ text: "Es necesario al menos un archivo", variant: "error" })
		
    const validFiles = files.filter((file): file is File => file instanceof File)
  
    if (validFiles.length >= 1) {
      validFiles.forEach(async (file) => {
        const formData = new FormData()
        formData.append("file", file)
        formData.append("idPost", idPost)
    
        const res = await fetchFiles(formData)
      })
    }

    return await refetch()
	}

  const compareDeletedFiles = () => {
    const typeFiles = files.filter((file): file is FileType => 'id' in file)
  
    const deletedFiles = post.File.filter(
      postFile => !typeFiles.some(typeFile => typeFile.id === postFile.id)
    )
  
    return deletedFiles.map(file => ({
      id: file.id,
      idPost: file.idPost,
      file: file.file
    }))
  }

	const handleSubmit = async () => {
    let body: PutPostVariables = {
      putPostId: post.id
    }
		if (dataForm.title === '') {
			return toastCustom({text: 'Debe ingresar un titulo', variant: "error", duration: 2000 })
		}
    if (dataForm.title != post.title) body.title = dataForm.title
    
		if (dataForm.description === '') {
      return toastCustom({text: 'Debe ingresar una descripcion', variant: "error", duration: 2000 })
		}
    if (dataForm.description != post.description) body.description = dataForm.description
 
    
		if (stack.length < 1 && newStack.length < 1) {
      return toastCustom({text: 'Debe seleccionar al menos 1 tecnologia', variant: "error", duration: 2000 })
		}

    body.technologies = stack
    body.newTechnologies = newStack

		if (files.length <= 0) {
			return toastCustom({ text: "Debe subir al menos 1 archivo", variant: "error", duration: 2000 })
		}

    const filesDeleted = compareDeletedFiles()

    if (filesDeleted.length >= 1) {
      body.filesDelete = filesDeleted
    }

		const res = await putPost({
      variables: body
		})

		if (res.data?.putPost) {
			const idPost = post.id

      if (dataImg && preview) {
        await submitImage(idPost)
      }

			await submitFiles(idPost)
      
      await refetch()
      onClose()
			toastCustom({text: "Tu componente ha sido modificado", variant: "success", duration: 2000})
		}
	}
	
	if (error) {
		// console.log(error)
		toastCustom({text: error.message, variant: "error", duration: 2000})
		reset()
	} 

  return (
    <div className='fixed top-0 bottom-0 left-0 right-0 bg-black/50 max-h-screen flex justify-center items-center'>
		  <section className='flex flex-col bg-storm-50 dark:bg-storm-950 rounded-xl max-h-[95vh] max-w-3xl w-full overflow-y-auto scrollbar-thin'>
        <header className='flex justify-between items-center p-5 gap-5 border-b border-seagreen-950/40 dark:border-white/20'>
          <h3 className='text-2xl font-semibold'>Edita tu componente</h3>
          <button onClick={() => onClose()}>
            <XIcon />
          </button>
        </header>
        <div className='flex flex-col gap-2 justify-center py-2'>
          <section className='flex flex-col gap-1 px-5'>
            <label
              htmlFor='title'
              className='text-lg font-semibold'
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
              className='text-lg font-semibold'
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
          <section className='flex gap-10 px-5 items-center justify-start'>
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
                width={128}
                height={128}
                alt='Imagen del Evento'
                className='size-32 aspect-square object-cover ring-2 ring-slate-500/30 rounded-full'
              />
              <label
                htmlFor='avatar'
                className='absolute -right-4 top-[3.3rem] cursor-pointer bg-seagreen-900 rounded-full p-1'
              >
                <PlusIcon className='text-white size-5' />
              </label>
              {(preview && dataImg) != null && (
                <Button 
                  color='destructive'
                  variant='solid'
                  shape='full'
                  className='py-1 px-1 absolute -left-0.5 top-2 '
                  startContent={<XIcon className='size-5'/>}
                  onClick={() => {
                    setPreview(null)
                    setDataImg(null)
                  }}
                />
              )}
            </div>
            <div className='flex flex-col gap-2'>
              <div className='flex gap-5 items-center'>
                <div className='flex gap-5 items-center'>
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
                  <>
                    <Input
                      type='text'
                      id='otherTech'
                      name='otherTech'
                      value={otherTech}
                      onChange={e =>
                        setOtherTech(e.target.value)
                      }
                      placeholder='Nombre de la tecnologia'
                      className='ring-0 bg-white max-w-sm'
                    />
                    <Button
                      size='sm'
                      shape='sm'
                      className='py-1'
                      onClick={handleOtherTech}
                    >
                      Añadir
                    </Button>
                  </>
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
              className='text-lg font-semibold'
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
                    {'name' in file ? file.name : file.file}
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
              className='justify-center'
              onClick={handleAddFile}
            >
              Subir archivo
            </Button>
          </section>
        </div>
        <footer className='flex justify-center gap-5 p-5 border-t border-seagreen-950/40 dark:border-white/20'>
          <Button
            color='destructive'
            variant='solid'
            className='px-5'
            onClick={() => onClose()}
          >
            Cancelar
          </Button>
          <Button
            color='primary'
            variant='solid'
            className='px-5'
            onClick={() => handleSubmit()}
          >
            Modificar
          </Button>
        </footer>
      </section>
    </div>
  )
}

export default ModalEditPost